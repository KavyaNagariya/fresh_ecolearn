import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { useLocation } from 'wouter';

interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  schoolName: string;
  grade: string;
  studentId?: string;
  ecoPoints: number;
  currentLevel: number;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation('/signin');
      return;
    }

    if (user) {
      loadProfile();
    }
  }, [user, authLoading, setLocation]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      // First try to get profile from localStorage
      const cachedProfile = localStorage.getItem(`ecolearn_profile_${user.uid}`);
      if (cachedProfile) {
        setProfile(JSON.parse(cachedProfile));
      }

      // Then fetch fresh data from server
      const response = await fetch(`/api/profile/${user.uid}`);
      const data = await response.json();

      if (data.success) {
        setProfile(data.profile);
        // Update localStorage with fresh data
        localStorage.setItem(`ecolearn_profile_${user.uid}`, JSON.stringify(data.profile));
      } else if (response.status === 404) {
        // Profile not found, redirect to setup
        setLocation('/profile-setup');
      } else {
        setError(data.error || 'Failed to load profile');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-green-600 hover:bg-green-700"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Profile Not Found</h2>
          <p className="mt-2 text-gray-600">Your profile could not be loaded.</p>
          <Button 
            onClick={() => setLocation('/profile-setup')}
            className="mt-4 bg-green-600 hover:bg-green-700"
          >
            Complete Profile Setup
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-green-700">EcoLearn</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {profile.fullName}</span>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Profile</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {profile.fullName}</p>
              <p><span className="font-medium">Email:</span> {profile.email}</p>
              <p><span className="font-medium">School:</span> {profile.schoolName}</p>
              <p><span className="font-medium">Grade:</span> {profile.grade}</p>
              {profile.studentId && (
                <p><span className="font-medium">Student ID:</span> {profile.studentId}</p>
              )}
            </div>
          </div>

          {/* Stats Card */}
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Progress</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Eco Points:</span>
                <span className="text-2xl font-bold text-green-600">{profile.ecoPoints}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Current Level:</span>
                <span className="text-2xl font-bold text-blue-600">{profile.currentLevel}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Start Learning
              </Button>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                View Challenges
              </Button>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Leaderboard
              </Button>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="text-center text-gray-500 py-8">
            <p>No recent activity yet. Start learning to see your progress here!</p>
          </div>
        </div>
      </main>
    </div>
  );
}