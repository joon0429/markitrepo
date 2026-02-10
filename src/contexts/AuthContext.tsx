import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@services/firebase/config';
import { createUserProfile, getUserProfile } from '@services/firebase/userService';
import { User } from '@types/user';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // fetch user profile from firestore
        const profile = await getUserProfile(firebaseUser.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      const message = getAuthErrorMessage(err.code);
      setError(message);
      setLoading(false);
      throw err;
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      // create user profile in firestore
      const displayName = email.split('@')[0];
      await createUserProfile(credential.user.uid, email, displayName);
      // fetch the profile we just created
      const profile = await getUserProfile(credential.user.uid);
      setUserProfile(profile);
    } catch (err: any) {
      const message = getAuthErrorMessage(err.code);
      setError(message);
      setLoading(false);
      throw err;
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await firebaseSignOut(auth);
      setUserProfile(null);
    } catch (err: any) {
      setError('failed to sign out');
      setLoading(false);
      throw err;
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{ user, userProfile, loading, error, signIn, signUp, signOut, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// map firebase error codes to user-friendly messages
function getAuthErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'invalid email address';
    case 'auth/user-disabled':
      return 'this account has been disabled';
    case 'auth/user-not-found':
      return 'no account found with this email';
    case 'auth/wrong-password':
      return 'incorrect password';
    case 'auth/invalid-credential':
      return 'incorrect email or password';
    case 'auth/email-already-in-use':
      return 'an account already exists with this email';
    case 'auth/weak-password':
      return 'password must be at least 6 characters';
    case 'auth/too-many-requests':
      return 'too many attempts. try again later';
    case 'auth/network-request-failed':
      return 'network error. check your connection';
    default:
      return 'something went wrong. try again';
  }
}
