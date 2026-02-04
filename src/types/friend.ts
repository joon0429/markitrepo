import { Timestamp } from 'firebase/firestore';

export type FriendRequestStatus = 'pending' | 'accepted' | 'rejected';

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUsername: string;
  toUserId: string;
  toUsername: string;
  status: FriendRequestStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Friend {
  uid: string;
  username: string;
  displayName: string;
  photoURL?: string;
  mutualFriendsCount: number;
  friendsSince: Date;
}

export interface FriendRequestWithMutuals extends Omit<FriendRequest, 'createdAt' | 'updatedAt'> {
  fromPhotoURL?: string;
  mutualFriendsCount: number;
  createdAt: Date;
  updatedAt: Date;
}
