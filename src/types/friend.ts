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
