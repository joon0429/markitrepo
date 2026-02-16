import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  arrayUnion,
  arrayRemove,
  writeBatch,
} from 'firebase/firestore';
import { db } from './config';
import { User, FriendRequest, Friend, FriendRequestWithMutuals } from '@types';
import { batchInQuery } from '@utils/firestore';

// get friend profiles from a user's friendIds array
export async function getFriends(userId: string): Promise<Friend[]> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return [];

  const user = userSnap.data() as User;
  const friendIds = user.friendIds || [];
  if (friendIds.length === 0) return [];

  const friendUsers = await batchInQuery<User>('users', 'uid', friendIds);

  return friendUsers.map(friendData => {
    const mutualCount = friendData.friendIds.filter(
      fid => user.friendIds.includes(fid) && fid !== userId
    ).length;

    return {
      uid: friendData.uid,
      username: friendData.username,
      displayName: friendData.displayName,
      photoURL: friendData.photoURL,
      mutualFriendsCount: mutualCount,
      friendsSince: new Date(),
    };
  });
}

// get pending friend requests for a user
export async function getFriendRequests(
  userId: string
): Promise<FriendRequestWithMutuals[]> {
  const q = query(
    collection(db, 'friendRequests'),
    where('toUserId', '==', userId),
    where('status', '==', 'pending')
  );
  const snap = await getDocs(q);

  // get current user's friends for mutual count
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  const currentUser = userSnap.exists() ? userSnap.data() as User : null;
  const myFriendIds = currentUser?.friendIds || [];

  const requests: FriendRequestWithMutuals[] = [];

  for (const reqDoc of snap.docs) {
    const req = reqDoc.data() as FriendRequest;

    // get sender's profile for photo and mutual count
    const senderRef = doc(db, 'users', req.fromUserId);
    const senderSnap = await getDoc(senderRef);
    const sender = senderSnap.exists() ? senderSnap.data() as User : null;

    const mutualCount = sender
      ? sender.friendIds.filter(fid => myFriendIds.includes(fid)).length
      : 0;

    requests.push({
      id: req.id,
      fromUserId: req.fromUserId,
      fromUsername: req.fromUsername,
      fromPhotoURL: sender?.photoURL,
      toUserId: req.toUserId,
      toUsername: req.toUsername,
      status: req.status,
      mutualFriendsCount: mutualCount,
      createdAt: req.createdAt.toDate(),
      updatedAt: req.updatedAt.toDate(),
    });
  }

  return requests;
}

// send a friend request by username
export async function sendFriendRequest(
  fromUserId: string,
  fromUsername: string,
  toUsername: string
): Promise<void> {
  // find user by username
  const q = query(
    collection(db, 'users'),
    where('username', '==', toUsername.toLowerCase())
  );
  const snap = await getDocs(q);

  if (snap.empty) {
    throw new Error('user not found');
  }

  const toUser = snap.docs[0].data() as User;

  if (toUser.uid === fromUserId) {
    throw new Error('cannot send friend request to yourself');
  }

  // check if already friends
  if (toUser.friendIds.includes(fromUserId)) {
    throw new Error('already friends');
  }

  // check for existing pending request
  const existingQ = query(
    collection(db, 'friendRequests'),
    where('fromUserId', '==', fromUserId),
    where('toUserId', '==', toUser.uid),
    where('status', '==', 'pending')
  );
  const existingSnap = await getDocs(existingQ);
  if (!existingSnap.empty) {
    throw new Error('friend request already sent');
  }

  const now = Timestamp.now();
  const requestRef = doc(collection(db, 'friendRequests'));

  const request: FriendRequest = {
    id: requestRef.id,
    fromUserId,
    fromUsername,
    toUserId: toUser.uid,
    toUsername: toUser.username,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  const batch = writeBatch(db);

  // create the friend request document
  batch.set(requestRef, request);

  // add to sender's sentFriendRequests
  batch.update(doc(db, 'users', fromUserId), {
    sentFriendRequests: arrayUnion(toUser.uid),
    updatedAt: now,
  });

  // add to receiver's pendingFriendRequests
  batch.update(doc(db, 'users', toUser.uid), {
    pendingFriendRequests: arrayUnion(fromUserId),
    updatedAt: now,
  });

  await batch.commit();
}

// accept a friend request
export async function acceptFriendRequest(
  requestId: string
): Promise<void> {
  const requestRef = doc(db, 'friendRequests', requestId);
  const requestSnap = await getDoc(requestRef);

  if (!requestSnap.exists()) {
    throw new Error('friend request not found');
  }

  const request = requestSnap.data() as FriendRequest;
  const now = Timestamp.now();
  const batch = writeBatch(db);

  // update request status
  batch.update(requestRef, { status: 'accepted', updatedAt: now });

  // add each user to the other's friendIds
  batch.update(doc(db, 'users', request.fromUserId), {
    friendIds: arrayUnion(request.toUserId),
    sentFriendRequests: arrayRemove(request.toUserId),
    updatedAt: now,
  });

  batch.update(doc(db, 'users', request.toUserId), {
    friendIds: arrayUnion(request.fromUserId),
    pendingFriendRequests: arrayRemove(request.fromUserId),
    updatedAt: now,
  });

  await batch.commit();
}

// decline a friend request
export async function declineFriendRequest(
  requestId: string
): Promise<void> {
  const requestRef = doc(db, 'friendRequests', requestId);
  const requestSnap = await getDoc(requestRef);

  if (!requestSnap.exists()) {
    throw new Error('friend request not found');
  }

  const request = requestSnap.data() as FriendRequest;
  const now = Timestamp.now();
  const batch = writeBatch(db);

  // update request status
  batch.update(requestRef, { status: 'rejected', updatedAt: now });

  // remove from pending arrays
  batch.update(doc(db, 'users', request.fromUserId), {
    sentFriendRequests: arrayRemove(request.toUserId),
    updatedAt: now,
  });

  batch.update(doc(db, 'users', request.toUserId), {
    pendingFriendRequests: arrayRemove(request.fromUserId),
    updatedAt: now,
  });

  await batch.commit();
}

// search users by username prefix (for adding friends)
export async function searchUsers(queryStr: string): Promise<User[]> {
  if (!queryStr.trim()) return [];

  const lower = queryStr.toLowerCase();
  // firestore doesn't support LIKE queries, so we use range query on username
  const q = query(
    collection(db, 'users'),
    where('username', '>=', lower),
    where('username', '<=', lower + '\uf8ff')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as User);
}
