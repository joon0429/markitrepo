import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@contexts/AuthContext';
import {
  getFriends,
  getFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  sendFriendRequest,
} from '@services/firebase/friendService';
import { Friend, FriendRequestWithMutuals } from '@types';

export function useFriends() {
  const { user, userProfile } = useAuth();

  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequestWithMutuals[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const [friendsList, requestsList] = await Promise.all([
        getFriends(user.uid),
        getFriendRequests(user.uid),
      ]);
      setFriends(friendsList);
      setRequests(requestsList);
    } catch (err: any) {
      setError(err.message || 'failed to load friends');
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const accept = async (requestId: string) => {
    try {
      await acceptFriendRequest(requestId);
      // remove from local state
      setRequests(prev => prev.filter(r => r.id !== requestId));
      // refresh friends list
      if (user?.uid) {
        const updatedFriends = await getFriends(user.uid);
        setFriends(updatedFriends);
      }
    } catch (err: any) {
      setError(err.message || 'failed to accept request');
    }
  };

  const decline = async (requestId: string) => {
    try {
      await declineFriendRequest(requestId);
      setRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (err: any) {
      setError(err.message || 'failed to decline request');
    }
  };

  const sendRequest = async (toUsername: string) => {
    if (!user?.uid || !userProfile?.username) return;
    try {
      await sendFriendRequest(user.uid, userProfile.username, toUsername);
    } catch (err: any) {
      throw err; // let the screen handle the error display
    }
  };

  // client-side search filter
  const searchFriends = (query: string): Friend[] => {
    if (!query.trim()) return friends;
    const lower = query.toLowerCase();
    return friends.filter(
      f =>
        f.username.toLowerCase().includes(lower) ||
        f.displayName.toLowerCase().includes(lower)
    );
  };

  return {
    friends,
    requests,
    loading,
    error,
    refresh: fetchData,
    acceptRequest: accept,
    declineRequest: decline,
    sendRequest,
    searchFriends,
  };
}
