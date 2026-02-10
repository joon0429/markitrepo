import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from './config';
import { Listing, CreateListingInput, UpdateListingInput } from '@types';

// create a new listing
export async function createListing(
  userId: string,
  username: string,
  input: CreateListingInput
): Promise<string> {
  const listingRef = doc(collection(db, 'listings'));
  const now = Timestamp.now();

  const listing: Listing = {
    id: listingRef.id,
    sellerId: userId,
    sellerUsername: username,
    sellerPhotoURL: undefined,
    title: input.title,
    description: input.description,
    price: input.price,
    photos: input.photoURIs.length > 0 ? input.photoURIs : ['placeholder'],
    closet: input.closet,
    category: input.category,
    visibility: input.visibility,
    markedBy: [],
    status: 'active',
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(listingRef, listing);
  return listingRef.id;
}

// get a single listing by id
export async function getListingById(id: string): Promise<Listing | null> {
  const listingRef = doc(db, 'listings', id);
  const snap = await getDoc(listingRef);
  if (!snap.exists()) return null;
  return snap.data() as Listing;
}

// get all listings for a specific user (for profile/boards)
export async function getUserListings(userId: string): Promise<Listing[]> {
  const q = query(
    collection(db, 'listings'),
    where('sellerId', '==', userId),
    where('status', '==', 'active'),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Listing);
}

// get feed listings for a list of friend IDs
// firestore 'in' queries are limited to 30 values, so we batch if needed
export async function getFeedListings(
  friendIds: string[],
  visibility: 'friends' | 'friends_plus'
): Promise<Listing[]> {
  if (friendIds.length === 0) return [];

  const results: Listing[] = [];

  // batch into groups of 30 (firestore 'in' query limit)
  for (let i = 0; i < friendIds.length; i += 30) {
    const batch = friendIds.slice(i, i + 30);

    if (visibility === 'friends') {
      // friends tab: only 'friends' visibility from direct friends
      const q = query(
        collection(db, 'listings'),
        where('sellerId', 'in', batch),
        where('visibility', '==', 'friends'),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      results.push(...snap.docs.map(d => d.data() as Listing));
    } else {
      // friends+ tab: 'friends_plus' visibility listings
      const q = query(
        collection(db, 'listings'),
        where('sellerId', 'in', batch),
        where('visibility', '==', 'friends_plus'),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      results.push(...snap.docs.map(d => d.data() as Listing));
    }
  }

  // sort by createdAt desc (batches may have interleaved results)
  results.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
  return results;
}

// get listings by closet name for a specific user (for board detail)
export async function getListingsByCloset(
  userId: string,
  closet: string
): Promise<Listing[]> {
  const q = query(
    collection(db, 'listings'),
    where('sellerId', '==', userId),
    where('closet', '==', closet),
    where('status', '==', 'active'),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Listing);
}

// update a listing
export async function updateListing(
  id: string,
  updates: UpdateListingInput
): Promise<void> {
  const listingRef = doc(db, 'listings', id);
  await updateDoc(listingRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}

// soft delete a listing (set status to 'deleted')
export async function deleteListing(id: string): Promise<void> {
  const listingRef = doc(db, 'listings', id);
  await updateDoc(listingRef, {
    status: 'deleted',
    updatedAt: Timestamp.now(),
  });
}

// mark a listing (add current user to markedBy array)
export async function markListing(
  listingId: string,
  userId: string
): Promise<void> {
  const listingRef = doc(db, 'listings', listingId);
  await updateDoc(listingRef, {
    markedBy: arrayUnion(userId),
    updatedAt: Timestamp.now(),
  });
}

// unmark a listing (remove current user from markedBy array)
export async function unmarkListing(
  listingId: string,
  userId: string
): Promise<void> {
  const listingRef = doc(db, 'listings', listingId);
  await updateDoc(listingRef, {
    markedBy: arrayRemove(userId),
    updatedAt: Timestamp.now(),
  });
}
