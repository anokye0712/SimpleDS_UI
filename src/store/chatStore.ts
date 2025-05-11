import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Conversation, DifyResponse, Message, Context, RetrieverResource } from '@/types';
import { generateRandomId } from '@/lib/utils';

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  contexts: Record<string, Context[]>;
  
  // Actions
  createConversation: () => string;
  setCurrentConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => string;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void;
  setMessageLoading: (conversationId: string, messageId: string, isLoading: boolean) => void;
  handleDifyResponse: (messageId: string, response: DifyResponse) => void;
  deleteConversation: (conversationId: string) => void;
  clearAllConversations: () => void;
  getConversation: (id: string) => Conversation | undefined;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,
      contexts: {},
      
      createConversation: () => {
        const id = generateRandomId();
        
        set((state) => ({
          conversations: [
            ...state.conversations,
            {
              id,
              title: 'New Conversation',
              createdAt: new Date().toISOString(),
              messages: [],
            },
          ],
          currentConversationId: id,
        }));
        
        return id;
      },
      
      setCurrentConversation: (id) => {
        set({ currentConversationId: id });
      },
      
      addMessage: (conversationId, messageData) => {
        const messageId = generateRandomId();
        const timestamp = new Date().toISOString();
        
        set((state) => {
          const updatedConversations = state.conversations.map((conversation) => {
            if (conversation.id === conversationId) {
              return {
                ...conversation,
                messages: [
                  ...conversation.messages,
                  {
                    id: messageId,
                    timestamp,
                    ...messageData,
                  },
                ],
              };
            }
            return conversation;
          });
          
          return { conversations: updatedConversations };
        });
        
        return messageId;
      },
      
      updateMessage: (conversationId, messageId, updates) => {
        set((state) => {
          const updatedConversations = state.conversations.map((conversation) => {
            if (conversation.id === conversationId) {
              return {
                ...conversation,
                messages: conversation.messages.map((message) => {
                  if (message.id === messageId) {
                    return { ...message, ...updates };
                  }
                  return message;
                }),
              };
            }
            return conversation;
          });
          
          return { conversations: updatedConversations };
        });
      },
      
      setMessageLoading: (conversationId, messageId, isLoading) => {
        set((state) => {
          const updatedConversations = state.conversations.map((conversation) => {
            if (conversation.id === conversationId) {
              return {
                ...conversation,
                messages: conversation.messages.map((message) => {
                  if (message.id === messageId) {
                    return { ...message, isLoading };
                  }
                  return message;
                }),
              };
            }
            return conversation;
          });
          
          return { conversations: updatedConversations };
        });
      },
      
      handleDifyResponse: (messageId, response) => {
        const state = get();
        let conversationId = '';
        
        // Find which conversation contains this message
        for (const conversation of state.conversations) {
          if (conversation.messages.some(msg => msg.id === messageId)) {
            conversationId = conversation.id;
            break;
          }
        }
        
        if (!conversationId) return;
        
        // Update the message with the response data and store the Dify conversation ID
        state.updateMessage(conversationId, messageId, {
          content: response.answer,
          isLoading: false,
          conversationId: response.conversation_id, // Store Dify's conversation ID
        });
        
        // Store context if available
        if (response.metadata?.retriever_resources?.length) {
          set((state) => ({
            contexts: {
              ...state.contexts,
              [messageId]: response.metadata.retriever_resources?.map((resource: RetrieverResource) => ({
                id: resource.segment_id,
                content: resource.content,
                source: resource.source,
                metadata: {
                  documentName: resource.document_name,
                  documentId: resource.document_id,
                  documentUrl: resource.document_url,
                }
              })) || [],
            },
          }));
        }
      },
      
      deleteConversation: (conversationId) => {
        set((state) => {
          const updatedConversations = state.conversations.filter(
            (conversation) => conversation.id !== conversationId
          );
          
          let currentId = state.currentConversationId;
          if (currentId === conversationId) {
            currentId = updatedConversations.length > 0 ? updatedConversations[0].id : null;
          }
          
          return {
            conversations: updatedConversations,
            currentConversationId: currentId,
          };
        });
      },
      
      clearAllConversations: () => {
        set({
          conversations: [],
          currentConversationId: null,
          contexts: {},
        });
      },
      
      getConversation: (id) => {
        const { conversations } = get();
        return conversations.find((conversation) => conversation.id === id);
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        conversations: state.conversations,
        currentConversationId: state.currentConversationId,
        contexts: state.contexts,
      }),
    }
  )
);