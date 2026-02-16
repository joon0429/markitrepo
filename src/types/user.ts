import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  username: string;              // Unique, lowercase, searchable
  displayName: string;
  email: string;
  bio: string | null;
  photoURL: string | null;       // Firebase Storage URL
  city: string | null;           // City-level location only
  createdAt: Timestamp;
  updatedAt: Timestamp;

  friendIds: string[];           // Array of friend UIDs
  pendingFriendRequests: string[];
  sentFriendRequests: string[];

  notificationsEnabled: boolean;
  pushToken: string | null;      // FCM token
}

export interface UserProfile {
  uid: string;
  username: string;
  displayName: string;
  photoURL: string | null;
  city: string | null;
  bio: string | null;
}

export interface CreateUserInput {
  username: string;
  displayName: string;
  email: string;
  city?: string;
}

export interface UpdateUserInput {
  username?: string;
  displayName?: string;
  bio?: string;
  city?: string;
  photoURL?: string;
}
