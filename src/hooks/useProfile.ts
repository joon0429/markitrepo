import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { getUserListings } from '@services/firebase/listingService';
import { getUserProfile, updateUserProfile } from '@services/firebase/userService';
import { User, Listing, UpdateUserInput, Board, UserStats } from '@types';

export function useProfile(userId?: string) {
  const { user, userProfile: authProfile } = useAuth();
  const targetUserId = userId || user?.uid;

  const [profile, setProfile] = useState<User | null>(
    !userId ? authProfile : null
  );
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }

    try {
      setError(null);

      // if viewing own profile, use auth profile; otherwise fetch
      if (!userId && authProfile) {
        setProfile(authProfile);
      } else {
        const p = await getUserProfile(targetUserId);
        setProfile(p);
      }

      // fetch user's listings
      const userListings = await getUserListings(targetUserId);
      setListings(userListings);
    } catch (err: any) {
      setError(err.message || 'failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [targetUserId, userId, authProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // compute boards from listings
  const boards: Board[] = computeBoards(listings, targetUserId || '');

  // compute stats
  const stats: UserStats = {
    listingCount: listings.length,
    friendCount: profile?.friendIds?.length || 0,
    salesCount: listings.filter(l => l.status === 'sold').length,
  };

  const update = async (data: UpdateUserInput) => {
    if (!targetUserId) return;
    await updateUserProfile(targetUserId, data);
    // refresh profile
    const updated = await getUserProfile(targetUserId);
    setProfile(updated);
  };

  return {
    profile,
    listings,
    boards,
    stats,
    loading,
    error,
    refresh: fetchProfile,
    updateProfile: update,
  };
}

// compute boards from a user's listings (grouped by closet)
function computeBoards(listings: Listing[], userId: string): Board[] {
  const closetMap = new Map<string, Listing[]>();

  for (const listing of listings) {
    const closet = listing.closet || 'unnamed';
    if (!closetMap.has(closet)) {
      closetMap.set(closet, []);
    }
    closetMap.get(closet)!.push(listing);
  }

  const boards: Board[] = [];

  for (const [name, items] of closetMap.entries()) {
    boards.push({
      id: `${userId}-${name}`,
      userId,
      name,
      itemCount: items.length,
      previewPhotos: items
        .slice(0, 4)
        .map(item => item.photos[0] || 'placeholder'),
      createdAt: new Date(),
    });
  }

  return boards;
}
