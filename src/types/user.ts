import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  username: string;              // Unique, lowercase, searchable
  displayName: string;
  email: string;
  bio?: string;
  photoURL?: string;             // Firebase Storage URL
  city?: string;                 // City-level location only
  createdAt: Timestamp;
  updatedAt: Timestamp;

  friendIds: string[];           // Array of friend UIDs
  pendingFriendRequests: string[];
  sentFriendRequests: string[];

  notificationsEnabled: boolean;
  pushToken?: string;            // FCM token
}

export interface UserProfile {
  uid: string;
  username: string;
  displayName: string;
  photoURL?: string;
  city?: string;
  bio?: string;
}

export interface CreateUserInput {
  username: string;
  displayName: string;
  email: string;
  city?: string;
}

export interface UpdateUserInput {
  displayName?: string;
  bio?: string;
  city?: string;
  photoURL?: string;
}
