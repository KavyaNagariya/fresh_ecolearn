import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useLocation } from 'wouter';

// Safe localStorage setter with JSON stringification
const safeSetLocalStorage = (key: string, value: any) => {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringValue);
  } catch (error) {
    console.warn('Failed to set localStorage item:', key, error);
  }
};

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
      // For Google sign-ins, we can use UID as password since we don't have the actual password
      // For email/password sign-ins, we should not store passwords in our database
      const isGoogleSignIn = user.providerData.some(provider => provider.providerId === 'google.com');
      
      const response = await fetch('/api/auth/ensure-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          username: user.email || user.uid,
          password: isGoogleSignIn ? user.uid : 'firebase_auth', // Use UID only for Google sign-ins
          authProvider: isGoogleSignIn ? 'google' : 'email'
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
      // Clear ALL user-specific data from localStorage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('ecolearn_') || 
                   key.startsWith('lesson_progress_') || 
                   key.startsWith('quiz_result_') ||
                   key.startsWith('unlocked_modules_'))) {
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
        // Check current route to avoid unnecessary redirects
        const currentPath = window.location.pathname;
        
        // Only redirect if not already on dashboard or profile-setup
        if (currentPath !== '/dashboard' && currentPath !== '/profile-setup') {
          // User is signed in, check if they have a profile
          const { hasProfile, profile } = await checkUserProfile(user);
          
          if (hasProfile && profile) {
            // User has a profile, redirect to dashboard
            console.log('User has profile, redirecting to dashboard');
            // Store profile data in localStorage with user-specific key safely
            safeSetLocalStorage(`ecolearn_profile_${user.uid}`, profile);
            setLocation('/dashboard');
          } else {
            // User doesn't have a profile, redirect to profile setup
            console.log('User needs to complete profile setup');
            setLocation('/profile-setup');
          }
        } else if (currentPath === '/dashboard') {
          // If already on dashboard, just ensure profile is cached
          const { hasProfile, profile } = await checkUserProfile(user);
          if (hasProfile && profile) {
            safeSetLocalStorage(`ecolearn_profile_${user.uid}`, profile);
          }
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