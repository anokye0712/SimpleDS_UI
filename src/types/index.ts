export type User = {
  id: string;
  name: string;
};

export type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  isLoading?: boolean;
  error?: string;
  conversationId?: string; // Added to store Dify conversation ID
};

export type Conversation = {
  id: string;
  title: string;
  createdAt: string;
  messages: Message[];
};

export type Context = {
  id: string;
  content: string;
  source?: string;
  metadata?: Record<string, any>;
};

export type DifyFile = {
  type: 'image';
  transfer_method: 'remote_url';
  url: string;
};

export type DifyRequest = {
  inputs: Record<string, any>;
  query: string;
  response_mode: 'streaming' | 'blocking';
  conversation_id?: string;
  user: string;
  files?: DifyFile[];
};

export type RetrieverResource = {
  content: string;
  document_id: string;
  document_name: string;
  document_url?: string;
  document_weight?: number;
  segment_id: string;
  source: string;
};

export type DifyResponse = {
  id: string;
  answer: string;
  conversation_id: string;
  created_at: number;
  metadata: {
    retriever_resources?: RetrieverResource[];
  };
};

export type Theme = 'light' | 'dark';

export type Settings = {
  theme: Theme;
  showContext: boolean;
  responseMode: 'streaming' | 'blocking';
};