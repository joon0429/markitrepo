import { Timestamp } from 'firebase/firestore';

export type ListingVisibility = 'friends' | 'friends_plus';
export type ListingStatus = 'active' | 'sold' | 'deleted';

export interface Listing {
  id: string;
  sellerId: string;
  sellerUsername: string;        // Denormalized
  sellerPhotoURL?: string;       // Denormalized

  title: string;
  description: string;
  price: number;
  photos: string[];              // 1-4 Storage URLs
  closet: string;                // User-defined category

  visibility: ListingVisibility;
  markedBy: string[];            // Array of user IDs who marked
  status: ListingStatus;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateListingInput {
  title: string;
  description: string;
  price: number;
  photoURIs: string[];           // Local URIs before upload
  closet: string;
  visibility: ListingVisibility;
}

export interface UpdateListingInput {
  title?: string;
  description?: string;
  price?: number;
  closet?: string;
  visibility?: ListingVisibility;
}
