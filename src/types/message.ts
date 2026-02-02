import { Timestamp } from 'firebase/firestore';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderUsername: string;
  text: string;
  timestamp: Timestamp;
  readBy: string[];
}

export interface Conversation {
  id: string;
  listingId: string;
  listingTitle: string;          // Denormalized for preview
  listingPhotoURL?: string;      // Denormalized

  participantIds: string[];      // [buyerId, sellerId]
  participants: {
    [userId: string]: {
      username: string;
      photoURL?: string;
    };
  };

  lastMessage?: {                // Denormalized for preview
    text: string;
    senderId: string;
    timestamp: Timestamp;
  };

  unreadCount: {
    [userId: string]: number;
  };

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
