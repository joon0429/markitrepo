import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@contexts/AuthContext';
import {
  subscribeToMessages,
  sendMessage as sendMessageService,
  markConversationRead,
} from '@services/firebase/messageService';
import { Message } from '@types';

export function useChat(conversationId: string) {
  const { user, userProfile } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // subscribe to real-time messages
  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = subscribeToMessages(conversationId, (msgs) => {
      setMessages(msgs);
      setLoading(false);
    });

    // mark conversation as read when opening
    if (user?.uid) {
      markConversationRead(conversationId, user.uid);
    }

    return unsubscribe;
  }, [conversationId, user?.uid]);

  const sendMessage = useCallback(async (text: string) => {
    if (!user?.uid || !userProfile?.username || !text.trim()) return;

    try {
      await sendMessageService(
        conversationId,
        user.uid,
        userProfile.username,
        text.trim()
      );
    } catch (err: any) {
      setError(err.message || 'failed to send message');
    }
  }, [conversationId, user?.uid, userProfile?.username]);

  return {
    messages,
    loading,
    error,
    sendMessage,
  };
}
