import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { EmptyState } from '@/components/chat/EmptyState';
import { sendMessage, handleStreamingResponse, handleBlockingResponse } from '@/services/api';
import { useChatStore } from '@/store/chatStore';
import { useSettingsStore } from '@/store/settingsStore';
import { DifyRequest, DifyResponse } from '@/types';

interface ChatInterfaceProps {
  userId: string;
}

export function ChatInterface({ userId }: ChatInterfaceProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { responseMode } = useSettingsStore();
  
  const {
    currentConversationId,
    conversations,
    createConversation,
    addMessage,
    updateMessage,
    setMessageLoading,
    handleDifyResponse,
    contexts,
  } = useChatStore();

  const currentConversation = currentConversationId 
    ? conversations.find((c) => c.id === currentConversationId) 
    : null;

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [currentConversation?.messages]);

  const handleSendMessage = async (content: string) => {
    let conversationId = currentConversationId;
    
    if (!conversationId) {
      conversationId = createConversation();
    }
    
    addMessage(conversationId, {
      content,
      role: 'user',
    });
    
    const assistantMessageId = addMessage(conversationId, {
      content: '',
      role: 'assistant',
      isLoading: true,
    });
    
    try {
      const request: DifyRequest = {
        inputs: {},
        query: content,
        response_mode: responseMode,
        user: userId,
      };
      
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation?.messages.length > 1) {
        const lastAssistantMessage = conversation.messages
          .filter(m => m.role === 'assistant' && !m.error)
          .pop();
        if (lastAssistantMessage?.conversationId) {
          request.conversation_id = lastAssistantMessage.conversationId;
        }
      }
      
      const response = await sendMessage(request);
      
      if (responseMode === 'streaming') {
        await handleStreamingResponse(
          response,
          (chunk) => {
            updateMessage(conversationId, assistantMessageId, {
              content: chunk,
              isLoading: true,
            });
          },
          (finalResponse: DifyResponse) => {
            handleDifyResponse(assistantMessageId, finalResponse);
          },
          (error: string) => {
            updateMessage(conversationId, assistantMessageId, {
              content: '',
              error,
              isLoading: false,
            });
          }
        );
      } else {
        await handleBlockingResponse(
          response,
          (data: DifyResponse) => {
            handleDifyResponse(assistantMessageId, data);
          },
          (error: string) => {
            updateMessage(conversationId, assistantMessageId, {
              content: '',
              error,
              isLoading: false,
            });
          }
        );
      }
    } catch (error) {
      let errorMessage = 'Failed to send message';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      updateMessage(conversationId, assistantMessageId, {
        content: '',
        error: errorMessage,
        isLoading: false,
      });
    }
  };

  const handleStartNewChat = (initialMessage?: string) => {
    createConversation();
    if (initialMessage) {
      handleSendMessage(initialMessage);
    }
  };

  if (!currentConversationId || !currentConversation) {
    return <EmptyState onStartNewChat={handleStartNewChat} />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <ScrollArea ref={scrollAreaRef} className="flex-1">
        <div className="py-4">
          {currentConversation.messages.length === 0 ? (
            <EmptyState onStartNewChat={handleStartNewChat} />
          ) : (
            <div>
              {currentConversation.messages.map((message) => (
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                  contexts={contexts[message.id]} 
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="glass sticky bottom-0 p-4 mx-4 mb-4 rounded-xl">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          disabled={currentConversation.messages.some((m) => m.isLoading)}
        />
      </div>
    </div>
  );
}