import { Timestamp } from 'firebase/firestore';

export type NotificationType = 'mark' | 'message' | 'friend_request' | 'friend_accepted';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  data: {
    fromUserId?: string;
    fromUsername?: string;
    listingId?: string;
    listingTitle?: string;
    conversationId?: string;
    messageText?: string;
  };
  read: boolean;
  createdAt: Timestamp;
}
