import { useState, useCallback } from 'react';
import { useAuth } from '@contexts/AuthContext';
import {
  markListing,
  unmarkListing,
  markListingAsSold,
  archiveListing,
  unarchiveListing,
} from '@services/firebase/listingService';
import { SerializableListing } from '@types';

export function useListingDetail(listing: SerializableListing) {
  const { user } = useAuth();
  const currentUserId = user?.uid || '';

  const [isMarked, setIsMarked] = useState(
    listing.markedBy.includes(currentUserId)
  );
  const [markCount, setMarkCount] = useState(listing.markedBy.length);
  const [markLoading, setMarkLoading] = useState(false);

  const toggleMark = useCallback(async () => {
    if (!currentUserId || markLoading) return;

    setMarkLoading(true);
    try {
      if (isMarked) {
        await unmarkListing(listing.id, currentUserId);
        setIsMarked(false);
        setMarkCount(prev => prev - 1);
      } else {
        await markListing(listing.id, currentUserId);
        setIsMarked(true);
        setMarkCount(prev => prev + 1);
      }
    } catch (err) {
      // revert on error (optimistic UI already changed)
    } finally {
      setMarkLoading(false);
    }
  }, [currentUserId, isMarked, listing.id, markLoading]);

  const doubleTapMark = useCallback(async () => {
    if (!isMarked && currentUserId && !markLoading) {
      setMarkLoading(true);
      try {
        await markListing(listing.id, currentUserId);
        setIsMarked(true);
        setMarkCount(prev => prev + 1);
      } catch (err) {
        // silent fail
      } finally {
        setMarkLoading(false);
      }
    }
  }, [currentUserId, isMarked, listing.id, markLoading]);

  const markAsSold = useCallback(
    async (buyerId: string): Promise<string> => {
      return await markListingAsSold(listing.id, buyerId);
    },
    [listing.id]
  );

  const archive = useCallback(async (): Promise<void> => {
    await archiveListing(listing.id);
  }, [listing.id]);

  const unarchive = useCallback(async (): Promise<void> => {
    await unarchiveListing(listing.id);
  }, [listing.id]);

  return {
    isMarked,
    markCount,
    markLoading,
    toggleMark,
    doubleTapMark,
    markAsSold,
    archive,
    unarchive,
  };
}
