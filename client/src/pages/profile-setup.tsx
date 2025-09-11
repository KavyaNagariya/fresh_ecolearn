import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
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

export default function ProfileSetupPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    email: user?.email || '',
    schoolName: '',
    grade: '',
    class: '',
    studentId: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('No user logged in');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/create-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          ...formData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store profile data in localStorage with user-specific key
        localStorage.setItem(`ecolearn_profile_${user.uid}`, JSON.stringify(data.profile));
        
        // Redirect to dashboard
        setLocation('/dashboard');
      } else {
        setError(data.error || 'Failed to create profile');
      }
    } catch (error) {
      console.error('Profile creation error:', error);
      setError('Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Authentication Required</h2>
          <p className="mt-2 text-gray-600">Please sign in to access this page.</p>
          <Button 
            onClick={() => setLocation('/signin')}
            className="mt-4 bg-green-600 hover:bg-green-700"
          >
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-green-700">Complete Your Profile</h1>
            <p className="mt-2 text-gray-600">
              Welcome to EcoLearn! Please complete your profile to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 shadow-sm"
                placeholder="Your email address"
              />
              <p className="mt-1 text-xs text-gray-500">Email cannot be changed (from your account)</p>
            </div>

            <div>
              <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700">
                School Name *
              </label>
              <input
                type="text"
                id="schoolName"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                placeholder="Enter your school name"
              />
            </div>

            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                Grade/Year *
              </label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
              >
                <option value="">Select your grade</option>
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>

            <div>
              <label htmlFor="class" className="block text-sm font-medium text-gray-700">
                Class/Section
              </label>
              <input
                type="text"
                id="class"
                name="class"
                value={formData.class}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                placeholder="Enter your class/section (e.g., A, B, Science, Commerce)"
              />
              <p className="mt-1 text-xs text-gray-500">Optional: Specify your class section or stream</p>
            </div>

            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                Student ID (Optional)
              </label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                placeholder="Enter your student ID (if applicable)"
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 py-3 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Creating Profile...' : 'Complete Profile'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}