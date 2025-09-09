import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useLocation } from 'wouter';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  checkUserProfile: (user: User) => Promise<{ hasProfile: boolean; profile?: any }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  const checkUserProfile = async (user: User): Promise<{ hasProfile: boolean; profile?: any }> => {
    try {
      // First, ensure user exists in PostgreSQL users table
      await ensureUserInDatabase(user);
      
      const response = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email,
          displayName: user.displayName,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        return {
          hasProfile: data.exists,
          profile: data.profile,
        };
      }
      
      return { hasProfile: false };
    } catch (error) {
      console.error('Error checking user profile:', error);
      return { hasProfile: false };
    }
  };

  const ensureUserInDatabase = async (user: User) => {
    try {
      // Create user in PostgreSQL with Firebase UID as password
      const response = await fetch('/api/auth/ensure-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          username: user.email || user.uid,
          password: user.uid, // Use Firebase UID as password
        }),
      });
      
      if (!response.ok) {
        console.log('User might already exist in database or other non-critical error');
      }
    } catch (error) {
      console.error('Error ensuring user in database:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // Clear any user-specific data from localStorage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('ecolearn_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      setLocation('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // User is signed in, check if they have a profile
        const { hasProfile, profile } = await checkUserProfile(user);
        
        if (hasProfile && profile) {
          // User has a profile, redirect to dashboard
          console.log('User has profile, redirecting to dashboard');
          // Store profile data in localStorage with user-specific key
          localStorage.setItem(`ecolearn_profile_${user.uid}`, JSON.stringify(profile));
          setLocation('/dashboard');
        } else {
          // User doesn't have a profile, redirect to profile setup
          console.log('User needs to complete profile setup');
          setLocation('/profile-setup');
        }
      } else {
        // User is signed out
        console.log('User signed out');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setLocation]);

  const value = {
    user,
    loading,
    logout,
    checkUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}