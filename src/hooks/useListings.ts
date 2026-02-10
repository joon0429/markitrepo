import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { getFeedListings } from '@services/firebase/listingService';
import { Listing } from '@types';

export function useListings(visibility: 'friends' | 'friends_plus') {
  const { userProfile } = useAuth();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    if (!userProfile) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const friendIds = userProfile.friendIds || [];
      const results = await getFeedListings(friendIds, visibility);
      setListings(results);
    } catch (err: any) {
      setError(err.message || 'failed to load listings');
    } finally {
      setLoading(false);
    }
  }, [userProfile, visibility]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return {
    listings,
    loading,
    error,
    refresh: fetchListings,
  };
}
