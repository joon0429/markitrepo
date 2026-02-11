import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  WriteBatch,
} from 'firebase/firestore';
import { db } from './config';
import { Transaction, Listing } from '@types/index';
import { getUserProfile } from './userService';

/**
 * Build transaction data object (for use in batch writes)
 * Fetches buyer/seller data and creates snapshot of listing
 */
export async function buildTransactionData(
  listing: Listing,
  buyerId: string
): Promise<Omit<Transaction, 'id'>> {
  // Fetch buyer and seller profiles for denormalization
  const [buyer, seller] = await Promise.all([
    getUserProfile(buyerId),
    getUserProfile(listing.sellerId),
  ]);

  if (!buyer) {
    throw new Error('Buyer not found');
  }
  if (!seller) {
    throw new Error('Seller not found');
  }

  return {
    buyerId,
    buyerUsername: buyer.username,
    buyerPhotoURL: buyer.photoURL,
    sellerId: listing.sellerId,
    sellerUsername: seller.username,
    sellerPhotoURL: seller.photoURL,
    listingId: listing.id,
    listingSnapshot: {
      title: listing.title,
      description: listing.description,
      price: listing.price,
      photos: listing.photos,
      closet: listing.closet,
    },
    price: listing.price,
    createdAt: Timestamp.now(),
  };
}

/**
 * Add transaction to a batch write
 * Returns the transaction ID for reference
 */
export function addTransactionToBatch(
  batch: WriteBatch,
  transactionData: Omit<Transaction, 'id'>
): string {
  const transactionRef = doc(collection(db, 'transactions'));
  batch.set(transactionRef, transactionData);
  return transactionRef.id;
}

/**
 * Get user's purchase history (where user is buyer)
 * Sorted by createdAt DESC
 */
export async function getUserPurchases(userId: string): Promise<Transaction[]> {
  const q = query(
    collection(db, 'transactions'),
    where('buyerId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Transaction[];
}

/**
 * Get user's sales history (where user is seller)
 * Sorted by createdAt DESC
 */
export async function getUserSales(userId: string): Promise<Transaction[]> {
  const q = query(
    collection(db, 'transactions'),
    where('sellerId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Transaction[];
}

/**
 * Get single transaction by ID
 */
export async function getTransaction(
  transactionId: string
): Promise<Transaction | null> {
  const transactionRef = doc(db, 'transactions', transactionId);
  const transactionSnap = await getDoc(transactionRef);

  if (!transactionSnap.exists()) {
    return null;
  }

  return {
    id: transactionSnap.id,
    ...transactionSnap.data(),
  } as Transaction;
}
