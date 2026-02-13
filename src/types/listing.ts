import { Timestamp } from 'firebase/firestore';

export type ListingVisibility = 'friends' | 'friends_plus';
export type ListingStatus = 'available' | 'sold' | 'archived';

export interface Listing {
  id: string;
  sellerId: string;
  sellerUsername: string;        // Denormalized
  sellerPhotoURL: string | null; // Denormalized (null if no photo)

  title: string;
  description: string;
  price: number;
  photos: string[];              // 1-4 Storage URLs
  closet: string;                // User-defined category/board name
  category: string | null;       // Optional category tag (null if none)

  visibility: ListingVisibility;
  markedBy: string[];            // Array of user IDs who marked
  status: ListingStatus;

  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Transaction-related fields (set when applicable)
  soldAt: Timestamp | null;      // When marked as sold (null if not sold)
  archivedAt: Timestamp | null;  // When archived by seller (null if not archived)
  buyerId: string | null;        // User ID of buyer (null if not sold)
}

export interface CreateListingInput {
  title: string;
  description: string;
  price: number;
  photoURIs: string[];           // Local URIs before upload
  closet: string;
  category?: string | null;      // Optional category (null if none)
  visibility: ListingVisibility;
}

export interface UpdateListingInput {
  title?: string;
  description?: string;
  price?: number;
  closet?: string;
  visibility?: ListingVisibility;
}

// serializable version for navigation params
export interface SerializableListing extends Omit<Listing, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

// helper functions to convert between types
export function serializeListing(listing: Listing): SerializableListing {
  return {
    ...listing,
    createdAt: listing.createdAt instanceof Date
      ? listing.createdAt.toISOString()
      : listing.createdAt.toDate().toISOString(),
    updatedAt: listing.updatedAt instanceof Date
      ? listing.updatedAt.toISOString()
      : listing.updatedAt.toDate().toISOString(),
  };
}

export function deserializeListing(listing: SerializableListing): Listing {
  return {
    ...listing,
    createdAt: new Date(listing.createdAt) as never as Timestamp,
    updatedAt: new Date(listing.updatedAt) as never as Timestamp,
  };
}
