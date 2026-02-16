import { useAuth } from '@contexts/AuthContext';
import { getUserConversations } from '@services/firebase/messageService';
import { Conversation } from '@types';
import { useAsyncData } from './useAsyncData';

export function useConversations() {
  const { user } = useAuth();

  const fetcher = user?.uid
    ? () => getUserConversations(user.uid)
    : null;

  const { data: conversations, loading, error, refresh } = useAsyncData<Conversation[]>(
    fetcher,
    [],
    [user?.uid],
    'failed to load conversations'
  );

  return { conversations, loading, error, refresh };
}
