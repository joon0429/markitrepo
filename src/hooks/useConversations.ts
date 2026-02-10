import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { getUserConversations } from '@services/firebase/messageService';
import { Conversation } from '@types';

export function useConversations() {
  const { user } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const convs = await getUserConversations(user.uid);
      setConversations(convs);
    } catch (err: any) {
      setError(err.message || 'failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    loading,
    error,
    refresh: fetchConversations,
  };
}
