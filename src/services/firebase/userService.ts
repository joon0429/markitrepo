import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from './config';
import { User, UpdateUserInput } from '@types/user';

// create a new user profile document in firestore
export async function createUserProfile(
  uid: string,
  email: string,
  displayName: string
): Promise<void> {
  const userRef = doc(db, 'users', uid);
  const now = Timestamp.now();

  const userData: User = {
    uid,
    username: email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_'),
    displayName,
    email,
    createdAt: now,
    updatedAt: now,
    friendIds: [],
    pendingFriendRequests: [],
    sentFriendRequests: [],
    notificationsEnabled: true,
  };

  await setDoc(userRef, userData);
}

// get a user profile by uid
export async function getUserProfile(uid: string): Promise<User | null> {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  }

  return userSnap.data() as User;
}

// update a user profile
export async function updateUserProfile(
  uid: string,
  data: UpdateUserInput
): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}
