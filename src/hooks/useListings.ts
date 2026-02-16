import { useAuth } from '@contexts/AuthContext';
import { getFeedListings } from '@services/firebase/listingService';
import { Listing } from '@types';
import { useAsyncData } from './useAsyncData';

export function useListings(visibility: 'friends' | 'friends_plus') {
  const { userProfile } = useAuth();

  const fetcher = userProfile
    ? () => getFeedListings(userProfile.friendIds || [], visibility)
    : null;

  const { data: listings, loading, error, refresh } = useAsyncData<Listing[]>(
    fetcher,
    [],
    [userProfile, visibility],
    'failed to load listings'
  );

  return { listings, loading, error, refresh };
}
