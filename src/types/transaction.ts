import { Timestamp } from 'firebase/firestore';

export interface Transaction {
  id: string;
  buyerId: string;
  buyerUsername: string;         // Denormalized for display
  buyerPhotoURL?: string;        // Denormalized for display
  sellerId: string;
  sellerUsername: string;        // Denormalized for display
  sellerPhotoURL?: string;       // Denormalized for display
  listingId: string;             // Reference to original listing

  // Snapshot data at time of sale (immutable record)
  listingSnapshot: {
    title: string;
    description: string;
    price: number;
    photos: string[];
    closet: string;
  };

  price: number;                 // Price at time of sale
  createdAt: Timestamp;          // When transaction was created
}

// Serializable version for navigation params
export interface SerializableTransaction extends Omit<Transaction, 'createdAt'> {
  createdAt: string;
}

// Helper functions to convert between types
export function serializeTransaction(transaction: Transaction): SerializableTransaction {
  return {
    ...transaction,
    createdAt: transaction.createdAt instanceof Date
      ? transaction.createdAt.toISOString()
      : transaction.createdAt.toDate().toISOString(),
  };
}

export function deserializeTransaction(transaction: SerializableTransaction): Transaction {
  return {
    ...transaction,
    createdAt: new Date(transaction.createdAt) as never as Timestamp,
  };
}
