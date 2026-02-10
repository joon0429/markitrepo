/**
 * seed script for mark.it firestore database
 *
 * populates firestore with test users, friend relationships, listings,
 * conversations, and messages so the app has data to display during development.
 *
 * usage (from WSL terminal, in project root):
 *   npx ts-node --esm scripts/seed.ts
 *
 * prerequisites:
 *   - firebase project must be set up with authentication and firestore enabled
 *   - .env file must exist with firebase credentials
 *   - test user accounts must be created in firebase auth first (see below)
 *
 * IMPORTANT: this script writes directly to firestore using the client SDK.
 * it does NOT create firebase auth accounts -- you must create those manually
 * in the firebase console or via the app's signup flow, then paste their UIDs below.
 *
 * steps:
 *   1. create 4 test accounts via the app's signup flow (or firebase console)
 *   2. copy each account's UID from firebase console > authentication
 *   3. paste the UIDs into the USER_UIDS object below
 *   4. run this script from WSL: npx ts-node scripts/seed.ts
 */

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';

// ============================================================
// PASTE YOUR TEST USER UIDs HERE (from firebase console > authentication)
// ============================================================
const USER_UIDS = {
  user1: 'PASTE_USER_1_UID_HERE', // will be: alex_kim
  user2: 'PASTE_USER_2_UID_HERE', // will be: jordan_lee
  user3: 'PASTE_USER_3_UID_HERE', // will be: taylor_wong
  user4: 'PASTE_USER_4_UID_HERE', // will be: maya_chen
};

// firebase config (same as app)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================================
// test user profiles
// ============================================================
const users = [
  {
    uid: USER_UIDS.user1,
    username: 'alex_kim',
    displayName: 'alex',
    email: 'alex@test.com',
    bio: 'streetwear collector',
    city: 'los angeles',
    friendIds: [USER_UIDS.user2, USER_UIDS.user3],
    pendingFriendRequests: [] as string[],
    sentFriendRequests: [] as string[],
    notificationsEnabled: true,
  },
  {
    uid: USER_UIDS.user2,
    username: 'jordan_lee',
    displayName: 'jordan',
    email: 'jordan@test.com',
    bio: 'tech & gadgets',
    city: 'seattle',
    friendIds: [USER_UIDS.user1, USER_UIDS.user3, USER_UIDS.user4],
    pendingFriendRequests: [] as string[],
    sentFriendRequests: [] as string[],
    notificationsEnabled: true,
  },
  {
    uid: USER_UIDS.user3,
    username: 'taylor_wong',
    displayName: 'taylor',
    email: 'taylor@test.com',
    bio: 'plants & home decor',
    city: 'austin',
    friendIds: [USER_UIDS.user1, USER_UIDS.user2],
    pendingFriendRequests: [] as string[],
    sentFriendRequests: [] as string[],
    notificationsEnabled: true,
  },
  {
    uid: USER_UIDS.user4,
    username: 'maya_chen',
    displayName: 'maya',
    email: 'maya@test.com',
    bio: 'vintage finds & thrifted treasures',
    city: 'brooklyn',
    friendIds: [USER_UIDS.user2],
    pendingFriendRequests: [] as string[],
    sentFriendRequests: [USER_UIDS.user1],
    notificationsEnabled: true,
  },
];

// ============================================================
// test listings
// ============================================================
const listings = [
  {
    id: 'seed-listing-1',
    sellerId: USER_UIDS.user1,
    sellerUsername: 'alex_kim',
    title: 'supreme box logo hoodie',
    description: 'fw18 black on black. size large. never worn, still in bag.',
    price: 650,
    photos: ['placeholder', 'placeholder', 'placeholder', 'placeholder'],
    closet: 'clothes',
    category: 'streetwear',
    visibility: 'friends_plus',
    markedBy: [] as string[],
    status: 'active',
  },
  {
    id: 'seed-listing-2',
    sellerId: USER_UIDS.user1,
    sellerUsername: 'alex_kim',
    title: 'nike air max 97',
    description: 'silver bullet colorway. size 10. worn 3x, basically new. comes with og box.',
    price: 120,
    photos: ['placeholder'],
    closet: 'shoes',
    category: 'sneakers',
    visibility: 'friends',
    markedBy: [USER_UIDS.user2],
    status: 'active',
  },
  {
    id: 'seed-listing-3',
    sellerId: USER_UIDS.user1,
    sellerUsername: 'alex_kim',
    title: 'carhartt work jacket',
    description: 'tan colorway. size medium. barely worn. perfect for fall.',
    price: 55,
    photos: ['placeholder', 'placeholder'],
    closet: 'clothes',
    category: 'outerwear',
    visibility: 'friends',
    markedBy: [] as string[],
    status: 'active',
  },
  {
    id: 'seed-listing-4',
    sellerId: USER_UIDS.user2,
    sellerUsername: 'jordan_lee',
    title: 'airpods pro 2nd gen',
    description: 'bought 2 months ago. selling because i upgraded. includes charging case and all tips.',
    price: 180,
    photos: ['placeholder', 'placeholder', 'placeholder'],
    closet: 'unnamed',
    category: 'tech',
    visibility: 'friends',
    markedBy: [USER_UIDS.user1],
    status: 'active',
  },
  {
    id: 'seed-listing-5',
    sellerId: USER_UIDS.user2,
    sellerUsername: 'jordan_lee',
    title: 'nintendo switch oled',
    description: 'white model. includes dock, controllers, all cables. 6 months old.',
    price: 280,
    photos: ['placeholder'],
    closet: 'unnamed',
    category: 'gaming',
    visibility: 'friends',
    markedBy: [] as string[],
    status: 'active',
  },
  {
    id: 'seed-listing-6',
    sellerId: USER_UIDS.user2,
    sellerUsername: 'jordan_lee',
    title: 'mechanical keyboard custom build',
    description: 'cherry mx blue switches. rgb backlit. custom keycaps.',
    price: 130,
    photos: ['placeholder', 'placeholder'],
    closet: 'unnamed',
    category: 'pc gear',
    visibility: 'friends_plus',
    markedBy: [USER_UIDS.user3],
    status: 'active',
  },
  {
    id: 'seed-listing-7',
    sellerId: USER_UIDS.user3,
    sellerUsername: 'taylor_wong',
    title: 'monstera deliciosa plant',
    description: 'healthy 2-year-old monstera. moving and can\'t take it with me. includes ceramic pot.',
    price: 35,
    photos: ['placeholder'],
    closet: 'unnamed',
    category: 'plants',
    visibility: 'friends',
    markedBy: [USER_UIDS.user1, USER_UIDS.user2],
    status: 'active',
  },
  {
    id: 'seed-listing-8',
    sellerId: USER_UIDS.user3,
    sellerUsername: 'taylor_wong',
    title: 'mid century modern side table',
    description: 'solid walnut. some scratches but adds character. 20" h x 18" w.',
    price: 95,
    photos: ['placeholder', 'placeholder'],
    closet: 'furniture',
    category: 'home decor',
    visibility: 'friends_plus',
    markedBy: [] as string[],
    status: 'active',
  },
  {
    id: 'seed-listing-9',
    sellerId: USER_UIDS.user3,
    sellerUsername: 'taylor_wong',
    title: 'handmade ceramic mug set',
    description: 'set of 4 mugs. earthtone glazes. microwave and dishwasher safe.',
    price: 40,
    photos: ['placeholder', 'placeholder'],
    closet: 'furniture',
    category: 'home & kitchen',
    visibility: 'friends',
    markedBy: [USER_UIDS.user1],
    status: 'active',
  },
  {
    id: 'seed-listing-10',
    sellerId: USER_UIDS.user4,
    sellerUsername: 'maya_chen',
    title: 'vintage levi\'s denim jacket',
    description: 'authentic 90s levi\'s trucker jacket. size medium. great condition.',
    price: 45,
    photos: ['placeholder', 'placeholder'],
    closet: 'clothes',
    category: 'outerwear',
    visibility: 'friends',
    markedBy: [USER_UIDS.user2],
    status: 'active',
  },
  {
    id: 'seed-listing-11',
    sellerId: USER_UIDS.user4,
    sellerUsername: 'maya_chen',
    title: 'ray-ban wayfarer sunglasses',
    description: 'classic black. polarized lenses. no scratches. comes with case.',
    price: 70,
    photos: ['placeholder'],
    closet: 'unnamed',
    category: 'accessories',
    visibility: 'friends_plus',
    markedBy: [] as string[],
    status: 'active',
  },
  {
    id: 'seed-listing-12',
    sellerId: USER_UIDS.user4,
    sellerUsername: 'maya_chen',
    title: 'doc martens 1460 boots',
    description: 'black leather. women\'s size 7. worn but well maintained.',
    price: 90,
    photos: ['placeholder'],
    closet: 'shoes',
    category: 'boots',
    visibility: 'friends',
    markedBy: [USER_UIDS.user3],
    status: 'active',
  },
];

// ============================================================
// friend requests (maya_chen sent request to user1's account -- the real user)
// the real user will need to accept this to test friend request flow
// ============================================================
const friendRequests = [
  {
    id: 'seed-req-1',
    fromUserId: USER_UIDS.user4,
    fromUsername: 'maya_chen',
    toUserId: USER_UIDS.user1, // this should be YOUR uid once you update it
    toUsername: 'alex_kim',
    status: 'pending',
  },
];

// ============================================================
// conversations (between seed users)
// ============================================================
const conversations = [
  {
    id: 'seed-conv-1',
    listingId: 'seed-listing-2',
    listingTitle: 'nike air max 97',
    listingPhotoURL: 'placeholder',
    participantIds: [USER_UIDS.user2, USER_UIDS.user1],
    participants: {
      [USER_UIDS.user2]: { username: 'jordan_lee' },
      [USER_UIDS.user1]: { username: 'alex_kim' },
    },
    lastMessage: {
      text: 'sounds good!',
      senderId: USER_UIDS.user1,
      timestamp: Timestamp.fromDate(new Date(Date.now() - 2 * 60 * 1000)),
    },
    unreadCount: {
      [USER_UIDS.user2]: 1,
      [USER_UIDS.user1]: 0,
    },
  },
  {
    id: 'seed-conv-2',
    listingId: 'seed-listing-7',
    listingTitle: 'monstera deliciosa plant',
    listingPhotoURL: 'placeholder',
    participantIds: [USER_UIDS.user1, USER_UIDS.user3],
    participants: {
      [USER_UIDS.user1]: { username: 'alex_kim' },
      [USER_UIDS.user3]: { username: 'taylor_wong' },
    },
    lastMessage: {
      text: 'perfect, see you then!',
      senderId: USER_UIDS.user1,
      timestamp: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
    },
    unreadCount: {
      [USER_UIDS.user1]: 0,
      [USER_UIDS.user3]: 0,
    },
  },
];

// ============================================================
// messages for each conversation
// ============================================================
const messages: { [convId: string]: Array<{ id: string; senderId: string; senderUsername: string; text: string; minutesAgo: number }> } = {
  'seed-conv-1': [
    { id: 'seed-msg-1-1', senderId: USER_UIDS.user2, senderUsername: 'jordan_lee', text: 'hey! are these still available?', minutesAgo: 15 },
    { id: 'seed-msg-1-2', senderId: USER_UIDS.user1, senderUsername: 'alex_kim', text: 'yes! still got them', minutesAgo: 14 },
    { id: 'seed-msg-1-3', senderId: USER_UIDS.user2, senderUsername: 'jordan_lee', text: 'awesome. can i pick them up tomorrow?', minutesAgo: 10 },
    { id: 'seed-msg-1-4', senderId: USER_UIDS.user1, senderUsername: 'alex_kim', text: 'sounds good!', minutesAgo: 2 },
  ],
  'seed-conv-2': [
    { id: 'seed-msg-2-1', senderId: USER_UIDS.user1, senderUsername: 'alex_kim', text: 'love this plant! still available?', minutesAgo: 5760 },
    { id: 'seed-msg-2-2', senderId: USER_UIDS.user3, senderUsername: 'taylor_wong', text: 'yes! when can you pick it up?', minutesAgo: 5700 },
    { id: 'seed-msg-2-3', senderId: USER_UIDS.user1, senderUsername: 'alex_kim', text: 'how about saturday afternoon?', minutesAgo: 5040 },
    { id: 'seed-msg-2-4', senderId: USER_UIDS.user3, senderUsername: 'taylor_wong', text: 'works for me! 2pm?', minutesAgo: 4608 },
    { id: 'seed-msg-2-5', senderId: USER_UIDS.user1, senderUsername: 'alex_kim', text: 'perfect, see you then!', minutesAgo: 4320 },
  ],
};

// ============================================================
// seed function
// ============================================================
async function seed() {
  console.log('starting seed...\n');

  // validate UIDs
  const hasPlaceholders = Object.values(USER_UIDS).some(uid => uid.includes('PASTE'));
  if (hasPlaceholders) {
    console.error('ERROR: you must replace the placeholder UIDs in USER_UIDS with real firebase auth UIDs.');
    console.error('create 4 test accounts first, then paste their UIDs.\n');
    process.exit(1);
  }

  const now = Timestamp.now();

  // seed users
  console.log('seeding users...');
  for (const user of users) {
    await setDoc(doc(db, 'users', user.uid), {
      ...user,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`  created user: ${user.username} (${user.uid})`);
  }

  // seed listings
  console.log('\nseeding listings...');
  const batch1 = writeBatch(db);
  for (const listing of listings) {
    const listingRef = doc(db, 'listings', listing.id);
    batch1.set(listingRef, {
      ...listing,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`  queued listing: ${listing.title}`);
  }
  await batch1.commit();
  console.log('  committed listings batch');

  // seed friend requests
  console.log('\nseeding friend requests...');
  for (const req of friendRequests) {
    await setDoc(doc(db, 'friendRequests', req.id), {
      ...req,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`  created request: ${req.fromUsername} -> ${req.toUsername}`);
  }

  // seed conversations
  console.log('\nseeding conversations...');
  for (const conv of conversations) {
    await setDoc(doc(db, 'conversations', conv.id), {
      ...conv,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`  created conversation: ${conv.id} (${conv.listingTitle})`);

    // seed messages for this conversation
    const convMessages = messages[conv.id] || [];
    const batch2 = writeBatch(db);
    for (const msg of convMessages) {
      const msgRef = doc(db, 'conversations', conv.id, 'messages', msg.id);
      batch2.set(msgRef, {
        id: msg.id,
        conversationId: conv.id,
        senderId: msg.senderId,
        senderUsername: msg.senderUsername,
        text: msg.text,
        timestamp: Timestamp.fromDate(new Date(Date.now() - msg.minutesAgo * 60 * 1000)),
        readBy: [msg.senderId],
      });
    }
    await batch2.commit();
    console.log(`    added ${convMessages.length} messages`);
  }

  console.log('\nseed complete!');
  console.log(`  ${users.length} users`);
  console.log(`  ${listings.length} listings`);
  console.log(`  ${friendRequests.length} friend requests`);
  console.log(`  ${conversations.length} conversations`);
  console.log(`  ${Object.values(messages).flat().length} messages`);

  process.exit(0);
}

seed().catch((error) => {
  console.error('seed failed:', error);
  process.exit(1);
});
