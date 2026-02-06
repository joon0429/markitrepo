import React, { createContext, useContext, useState, ReactNode } from 'react';

// mock user type for hollow frame
interface MockUser {
  uid: string;
  email: string;
  displayName: string;
}

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, _password: string) => {
    setLoading(true);
    // mock sign in - simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // create mock user
    setUser({
      uid: 'mock-user-' + Date.now(),
      email,
      displayName: email.split('@')[0],
    });
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
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
