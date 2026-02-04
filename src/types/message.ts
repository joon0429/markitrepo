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

// serializable versions for navigation (React Navigation doesn't support Timestamp objects)
export interface SerializableMessage extends Omit<Message, 'timestamp'> {
  timestamp: string; // ISO string
}

export interface SerializableConversation extends Omit<Conversation, 'createdAt' | 'updatedAt' | 'lastMessage'> {
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  lastMessage?: {
    text: string;
    senderId: string;
    timestamp: string; // ISO string
  };
}

// helper functions to convert between Timestamp and serializable
export function serializeMessage(message: Message): SerializableMessage {
  return {
    ...message,
    timestamp: message.timestamp.toDate().toISOString(),
  };
}

export function deserializeMessage(serialized: SerializableMessage): Message {
  return {
    ...serialized,
    timestamp: { toDate: () => new Date(serialized.timestamp) } as Timestamp,
  };
}

export function serializeConversation(conversation: Conversation): SerializableConversation {
  return {
    ...conversation,
    createdAt: conversation.createdAt.toDate().toISOString(),
    updatedAt: conversation.updatedAt.toDate().toISOString(),
    lastMessage: conversation.lastMessage
      ? {
          ...conversation.lastMessage,
          timestamp: conversation.lastMessage.timestamp.toDate().toISOString(),
        }
      : undefined,
  };
}

export function deserializeConversation(serialized: SerializableConversation): Conversation {
  return {
    ...serialized,
    createdAt: { toDate: () => new Date(serialized.createdAt) } as Timestamp,
    updatedAt: { toDate: () => new Date(serialized.updatedAt) } as Timestamp,
    lastMessage: serialized.lastMessage
      ? {
          ...serialized.lastMessage,
          timestamp: { toDate: () => new Date(serialized.lastMessage.timestamp) } as Timestamp,
        }
      : undefined,
  };
}
