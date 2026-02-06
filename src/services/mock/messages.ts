import { Conversation, Message } from '@types';

const now = Date.now();

// mock conversations for current user (sarah_parker - user-1)
export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    listingId: 'listing-2',
    listingTitle: 'nike air max 97',
    listingPhotoURL: 'placeholder',
    participantIds: ['user-1', 'user-2'],
    participants: {
      'user-1': {
        username: 'sarah_parker',
        photoURL: undefined,
      },
      'user-2': {
        username: 'alex_kim',
        photoURL: undefined,
      },
    },
    lastMessage: {
      text: 'sounds good!',
      senderId: 'user-2',
      timestamp: { toDate: () => new Date(now - 2 * 60 * 1000) } as any, // 2 min ago
    },
    unreadCount: {
      'user-1': 1,
      'user-2': 0,
    },
    createdAt: { toDate: () => new Date('2024-02-25') } as any,
    updatedAt: { toDate: () => new Date(now - 2 * 60 * 1000) } as any,
  },
  {
    id: 'conv-2',
    listingId: 'listing-3',
    listingTitle: 'airpods pro 2nd gen',
    listingPhotoURL: 'placeholder',
    participantIds: ['user-1', 'user-3'],
    participants: {
      'user-1': {
        username: 'sarah_parker',
        photoURL: undefined,
      },
      'user-3': {
        username: 'jordan_lee',
        photoURL: undefined,
      },
    },
    lastMessage: {
      text: 'let me check and get back to you',
      senderId: 'user-3',
      timestamp: { toDate: () => new Date(now - 1 * 60 * 60 * 1000) } as any, // 1 hour ago
    },
    unreadCount: {
      'user-1': 0,
      'user-3': 0,
    },
    createdAt: { toDate: () => new Date('2024-02-24') } as any,
    updatedAt: { toDate: () => new Date(now - 1 * 60 * 60 * 1000) } as any,
  },
  {
    id: 'conv-3',
    listingId: 'listing-5',
    listingTitle: 'monstera deliciosa plant',
    listingPhotoURL: 'placeholder',
    participantIds: ['user-1', 'user-4'],
    participants: {
      'user-1': {
        username: 'sarah_parker',
        photoURL: undefined,
      },
      'user-4': {
        username: 'taylor_wong',
        photoURL: undefined,
      },
    },
    lastMessage: {
      text: 'perfect, see you then!',
      senderId: 'user-1',
      timestamp: { toDate: () => new Date(now - 3 * 24 * 60 * 60 * 1000) } as any, // 3 days ago
    },
    unreadCount: {
      'user-1': 0,
      'user-4': 0,
    },
    createdAt: { toDate: () => new Date('2024-02-21') } as any,
    updatedAt: { toDate: () => new Date(now - 3 * 24 * 60 * 60 * 1000) } as any,
  },
  {
    id: 'conv-4',
    listingId: 'listing-11',
    listingTitle: 'sony wh-1000xm5 headphones',
    listingPhotoURL: 'placeholder',
    participantIds: ['user-1', 'user-3'],
    participants: {
      'user-1': {
        username: 'sarah_parker',
        photoURL: undefined,
      },
      'user-3': {
        username: 'jordan_lee',
        photoURL: undefined,
      },
    },
    lastMessage: {
      text: 'still available if you want them',
      senderId: 'user-3',
      timestamp: { toDate: () => new Date(now - 5 * 24 * 60 * 60 * 1000) } as any, // 5 days ago
    },
    unreadCount: {
      'user-1': 2,
      'user-3': 0,
    },
    createdAt: { toDate: () => new Date('2024-02-15') } as any,
    updatedAt: { toDate: () => new Date(now - 5 * 24 * 60 * 60 * 1000) } as any,
  },
];

// mock messages for each conversation
export const mockMessages: { [conversationId: string]: Message[] } = {
  'conv-1': [
    {
      id: 'msg-1-1',
      conversationId: 'conv-1',
      senderId: 'user-1',
      senderUsername: 'sarah_parker',
      text: 'hey! are these still available?',
      timestamp: { toDate: () => new Date(now - 15 * 60 * 1000) } as any, // 15 min ago
      readBy: ['user-1', 'user-2'],
    },
    {
      id: 'msg-1-2',
      conversationId: 'conv-1',
      senderId: 'user-2',
      senderUsername: 'alex_kim',
      text: 'yes! still got them',
      timestamp: { toDate: () => new Date(now - 14 * 60 * 1000) } as any,
      readBy: ['user-1', 'user-2'],
    },
    {
      id: 'msg-1-3',
      conversationId: 'conv-1',
      senderId: 'user-1',
      senderUsername: 'sarah_parker',
      text: 'awesome. can i pick them up tomorrow?',
      timestamp: { toDate: () => new Date(now - 10 * 60 * 1000) } as any,
      readBy: ['user-1', 'user-2'],
    },
    {
      id: 'msg-1-4',
      conversationId: 'conv-1',
      senderId: 'user-2',
      senderUsername: 'alex_kim',
      text: 'sounds good!',
      timestamp: { toDate: () => new Date(now - 2 * 60 * 1000) } as any, // 2 min ago
      readBy: ['user-2'],
    },
  ],
  'conv-2': [
    {
      id: 'msg-2-1',
      conversationId: 'conv-2',
      senderId: 'user-1',
      senderUsername: 'sarah_parker',
      text: 'hi! interested in the airpods. do they come with all the tips?',
      timestamp: { toDate: () => new Date(now - 2 * 60 * 60 * 1000) } as any, // 2 hours ago
      readBy: ['user-1', 'user-3'],
    },
    {
      id: 'msg-2-2',
      conversationId: 'conv-2',
      senderId: 'user-3',
      senderUsername: 'jordan_lee',
      text: 'yep! all 3 sizes',
      timestamp: { toDate: () => new Date(now - 1.9 * 60 * 60 * 1000) } as any,
      readBy: ['user-1', 'user-3'],
    },
    {
      id: 'msg-2-3',
      conversationId: 'conv-2',
      senderId: 'user-1',
      senderUsername: 'sarah_parker',
      text: 'cool. would you do $170?',
      timestamp: { toDate: () => new Date(now - 1.5 * 60 * 60 * 1000) } as any,
      readBy: ['user-1', 'user-3'],
    },
    {
      id: 'msg-2-4',
      conversationId: 'conv-2',
      senderId: 'user-3',
      senderUsername: 'jordan_lee',
      text: 'let me check and get back to you',
      timestamp: { toDate: () => new Date(now - 1 * 60 * 60 * 1000) } as any, // 1 hour ago
      readBy: ['user-1', 'user-3'],
    },
  ],
  'conv-3': [
    {
      id: 'msg-3-1',
      conversationId: 'conv-3',
      senderId: 'user-1',
      senderUsername: 'sarah_parker',
      text: 'love this plant! still available?',
      timestamp: { toDate: () => new Date(now - 4 * 24 * 60 * 60 * 1000) } as any, // 4 days ago
      readBy: ['user-1', 'user-4'],
    },
    {
      id: 'msg-3-2',
      conversationId: 'conv-3',
      senderId: 'user-4',
      senderUsername: 'taylor_wong',
      text: 'yes! when can you pick it up?',
      timestamp: { toDate: () => new Date(now - 3.9 * 24 * 60 * 60 * 1000) } as any,
      readBy: ['user-1', 'user-4'],
    },
    {
      id: 'msg-3-3',
      conversationId: 'conv-3',
      senderId: 'user-1',
      senderUsername: 'sarah_parker',
      text: 'how about saturday afternoon?',
      timestamp: { toDate: () => new Date(now - 3.5 * 24 * 60 * 60 * 1000) } as any,
      readBy: ['user-1', 'user-4'],
    },
    {
      id: 'msg-3-4',
      conversationId: 'conv-3',
      senderId: 'user-4',
      senderUsername: 'taylor_wong',
      text: 'works for me! 2pm?',
      timestamp: { toDate: () => new Date(now - 3.2 * 24 * 60 * 60 * 1000) } as any,
      readBy: ['user-1', 'user-4'],
    },
    {
      id: 'msg-3-5',
      conversationId: 'conv-3',
      senderId: 'user-1',
      senderUsername: 'sarah_parker',
      text: 'perfect, see you then!',
      timestamp: { toDate: () => new Date(now - 3 * 24 * 60 * 60 * 1000) } as any, // 3 days ago
      readBy: ['user-1', 'user-4'],
    },
  ],
  'conv-4': [
    {
      id: 'msg-4-1',
      conversationId: 'conv-4',
      senderId: 'user-1',
      senderUsername: 'sarah_parker',
      text: 'hi! are these the silver ones?',
      timestamp: { toDate: () => new Date(now - 6 * 24 * 60 * 60 * 1000) } as any, // 6 days ago
      readBy: ['user-1', 'user-3'],
    },
    {
      id: 'msg-4-2',
      conversationId: 'conv-4',
      senderId: 'user-3',
      senderUsername: 'jordan_lee',
      text: 'yep, silver color',
      timestamp: { toDate: () => new Date(now - 5.9 * 24 * 60 * 60 * 1000) } as any,
      readBy: ['user-1', 'user-3'],
    },
    {
      id: 'msg-4-3',
      conversationId: 'conv-4',
      senderId: 'user-1',
      senderUsername: 'sarah_parker',
      text: 'nice! i might be interested',
      timestamp: { toDate: () => new Date(now - 5.5 * 24 * 60 * 60 * 1000) } as any,
      readBy: ['user-1', 'user-3'],
    },
    {
      id: 'msg-4-4',
      conversationId: 'conv-4',
      senderId: 'user-3',
      senderUsername: 'jordan_lee',
      text: 'still available if you want them',
      timestamp: { toDate: () => new Date(now - 5 * 24 * 60 * 60 * 1000) } as any, // 5 days ago
      readBy: ['user-3'],
    },
  ],
};

// helper function to get conversations
export function getConversations(): Conversation[] {
  return mockConversations.sort((a, b) => {
    const aTime = a.lastMessage?.timestamp.toDate().getTime() || a.updatedAt.toDate().getTime();
    const bTime = b.lastMessage?.timestamp.toDate().getTime() || b.updatedAt.toDate().getTime();
    return bTime - aTime; // most recent first
  });
}

// helper function to get messages for a conversation
export function getMessages(conversationId: string): Message[] {
  return mockMessages[conversationId] || [];
}

// helper function to get conversation by id
export function getConversationById(conversationId: string): Conversation | undefined {
  return mockConversations.find(conv => conv.id === conversationId);
}
