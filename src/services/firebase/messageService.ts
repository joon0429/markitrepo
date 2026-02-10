import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './config';
import { Message, Conversation } from '@types';

// get all conversations for a user, sorted by most recent
export async function getUserConversations(
  userId: string
): Promise<Conversation[]> {
  const q = query(
    collection(db, 'conversations'),
    where('participantIds', 'array-contains', userId),
    orderBy('updatedAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Conversation);
}

// get a single conversation by id
export async function getConversation(
  id: string
): Promise<Conversation | null> {
  const ref = doc(db, 'conversations', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as Conversation;
}

// find an existing conversation between two users about a specific listing
export async function findConversation(
  listingId: string,
  userId1: string,
  userId2: string
): Promise<Conversation | null> {
  const q = query(
    collection(db, 'conversations'),
    where('listingId', '==', listingId),
    where('participantIds', 'array-contains', userId1)
  );
  const snap = await getDocs(q);

  // filter for the specific pair (array-contains only checks one value)
  for (const convDoc of snap.docs) {
    const conv = convDoc.data() as Conversation;
    if (conv.participantIds.includes(userId2)) {
      return conv;
    }
  }

  return null;
}

// create a new conversation about a listing
export async function createConversation(
  listingId: string,
  listingTitle: string,
  buyerId: string,
  buyerUsername: string,
  sellerId: string,
  sellerUsername: string
): Promise<string> {
  // check if conversation already exists
  const existing = await findConversation(listingId, buyerId, sellerId);
  if (existing) return existing.id;

  const convRef = doc(collection(db, 'conversations'));
  const now = Timestamp.now();

  const conversation: Conversation = {
    id: convRef.id,
    listingId,
    listingTitle,
    listingPhotoURL: 'placeholder',
    participantIds: [buyerId, sellerId],
    participants: {
      [buyerId]: { username: buyerUsername },
      [sellerId]: { username: sellerUsername },
    },
    unreadCount: {
      [buyerId]: 0,
      [sellerId]: 0,
    },
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(convRef, conversation);
  return convRef.id;
}

// get messages for a conversation (one-time fetch)
export async function getMessages(
  conversationId: string
): Promise<Message[]> {
  const q = query(
    collection(db, 'conversations', conversationId, 'messages'),
    orderBy('timestamp', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Message);
}

// subscribe to messages in a conversation (real-time listener)
export function subscribeToMessages(
  conversationId: string,
  callback: (messages: Message[]) => void
): () => void {
  const q = query(
    collection(db, 'conversations', conversationId, 'messages'),
    orderBy('timestamp', 'asc')
  );

  const unsubscribe = onSnapshot(q, (snap) => {
    const msgs = snap.docs.map(d => d.data() as Message);
    callback(msgs);
  });

  return unsubscribe;
}

// send a message in a conversation
export async function sendMessage(
  conversationId: string,
  senderId: string,
  senderUsername: string,
  text: string
): Promise<void> {
  const now = Timestamp.now();
  const msgRef = doc(collection(db, 'conversations', conversationId, 'messages'));

  const message: Message = {
    id: msgRef.id,
    conversationId,
    senderId,
    senderUsername,
    text,
    timestamp: now,
    readBy: [senderId],
  };

  const batch = writeBatch(db);

  // write the message
  batch.set(msgRef, message);

  // update conversation's lastMessage and unreadCount
  const convRef = doc(db, 'conversations', conversationId);
  const convSnap = await getDoc(convRef);

  if (convSnap.exists()) {
    const conv = convSnap.data() as Conversation;
    const newUnreadCount = { ...conv.unreadCount };

    // increment unread for all participants except sender
    for (const pid of conv.participantIds) {
      if (pid !== senderId) {
        newUnreadCount[pid] = (newUnreadCount[pid] || 0) + 1;
      }
    }

    batch.update(convRef, {
      lastMessage: {
        text,
        senderId,
        timestamp: now,
      },
      unreadCount: newUnreadCount,
      updatedAt: now,
    });
  }

  await batch.commit();
}

// mark a conversation as read for a user
export async function markConversationRead(
  conversationId: string,
  userId: string
): Promise<void> {
  const convRef = doc(db, 'conversations', conversationId);
  const convSnap = await getDoc(convRef);

  if (!convSnap.exists()) return;

  const conv = convSnap.data() as Conversation;
  const newUnreadCount = { ...conv.unreadCount };
  newUnreadCount[userId] = 0;

  await updateDoc(convRef, {
    unreadCount: newUnreadCount,
  });
}
