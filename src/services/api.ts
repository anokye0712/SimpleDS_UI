import { DifyRequest, DifyResponse } from '@/types';

const API_URL = '/v1/chat-messages';

export async function sendMessage(request: DifyRequest): Promise<Response> {
  try {
    if (!request.conversation_id || request.conversation_id.trim() === '') {
      delete request.conversation_id;
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error: ${response.status} ${response.statusText}`
      );
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to send message: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function handleStreamingResponse(
  response: Response,
  onChunk: (chunk: string) => void,
  onComplete: (data: DifyResponse) => void,
  onError: (error: string) => void
): Promise<void> {
  try {
    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let lastResponse: DifyResponse | null = null;

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim() === '' || !line.startsWith('data: ')) continue;

        try {
          const jsonData = JSON.parse(line.slice(6));
          
          if (jsonData.event === 'message') {
            if (jsonData.answer !== undefined) {
              onChunk(jsonData.answer);
              lastResponse = jsonData;
            }
          } else if (jsonData.event === 'error') {
            onError(jsonData.message || 'An error occurred during streaming');
            return;
          }
        } catch (e) {
          console.warn('Error parsing SSE message:', e);
        }
      }
    }

    if (buffer.startsWith('data: ')) {
      try {
        const jsonData = JSON.parse(buffer.slice(6));
        if (jsonData.event === 'message' && jsonData.answer !== undefined) {
          onChunk(jsonData.answer);
          lastResponse = jsonData;
        }
      } catch (e) {
        console.warn('Error parsing final SSE message:', e);
      }
    }

    if (lastResponse) {
      onComplete(lastResponse);
    } else {
      onError('No valid response received');
    }
  } catch (error) {
    console.error('Error handling streaming response:', error);
    if (error instanceof Error) {
      onError(error.message);
    } else {
      onError('An unknown error occurred during streaming');
    }
  }
}

export async function handleBlockingResponse(
  response: Response,
  onComplete: (data: DifyResponse) => void,
  onError: (error: string) => void
): Promise<void> {
  try {
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('text/event-stream')) {
      await handleStreamingResponse(
        response,
        () => {}, // Ignore chunks for blocking mode
        onComplete,
        onError
      );
    } else {
      const data = await response.json();
      if (data.error) {
        onError(data.error.message || 'An error occurred');
      } else {
        onComplete(data);
      }
    }
  } catch (error) {
    console.error('Error handling blocking response:', error);
    if (error instanceof Error) {
      onError(error.message);
    } else {
      onError('An unknown error occurred');
    }
  }
}