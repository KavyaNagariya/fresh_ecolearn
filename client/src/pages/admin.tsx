import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Calendar,
  Eye,
  MessageSquare,
  Zap,
  Camera,
  ArrowLeft,
  RefreshCw,
  LogOut,
  Upload
} from "lucide-react";
import { useLocation } from "wouter";

// Check admin authentication
const checkAdminAuth = () => {
  const token = localStorage.getItem('admin_token');
  const adminUser = localStorage.getItem('admin_user');
  
  if (!token || !adminUser) {
    return { isAuthenticated: false, admin: null };
  }
  
  try {
    const admin = JSON.parse(adminUser);
    return { isAuthenticated: true, admin };
  } catch {
    return { isAuthenticated: false, admin: null };
  }
};

// Admin logout function
const adminLogout = async (setLocation: Function) => {
  try {
    await fetch('/api/admin/logout', { method: 'POST' });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setLocation('/admin/login');
  }
};

interface ChallengeSubmission {
  id: string;
  userId: string;
  challengeId: string;
  photoUrl: string | null;
  caption: string | null;
  status: 'pending' | 'approved' | 'rejected';
  pointsAwarded: number;
  submittedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  feedback: string | null;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  week: number;
}

interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  schoolName: string;
  grade: string;
  ecoPoints: number;
}

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const [admin, setAdmin] = useState<any>(null);
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userProfiles, setUserProfiles] = useState<Map<string, UserProfile>>(new Map());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedSubmission, setSelectedSubmission] = useState<ChallengeSubmission | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const { isAuthenticated, admin: adminUser } = checkAdminAuth();
    
    if (!isAuthenticated) {
      setLocation('/admin/login');
      return;
    }
    
    setAdmin(adminUser);
  }, [setLocation]);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      
      // Fetch pending submissions first
      const submissionsResponse = await fetch('/api/submissions/pending');
      let submissionsData = null;
      if (submissionsResponse.ok) {
        submissionsData = await submissionsResponse.json();
        setSubmissions(submissionsData.submissions || []);
      } else {
        console.error('Failed to fetch submissions:', submissionsResponse.statusText);
        setSubmissions([]);
      }

      // Fetch all challenges for reference
      const challengesResponse = await fetch('/api/challenges');
      if (challengesResponse.ok) {
        const challengesData = await challengesResponse.json();
        setChallenges(challengesData.challenges || []);
      } else {
        console.error('Failed to fetch challenges:', challengesResponse.statusText);
        setChallenges([]);
      }

      // Fetch user profiles for each submission
      const userIds = Array.from(new Set(submissionsData?.submissions?.map((s: ChallengeSubmission) => s.userId) || []));
      const profilesMap = new Map();
      
      for (const userId of userIds) {
        try {
          const profileResponse = await fetch(`/api/profile/${userId}`);
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            profilesMap.set(userId, profileData.profile);
          }
        } catch (error) {
          console.error(`Failed to fetch profile for user ${userId}:`, error);
        }
      }
      
      setUserProfiles(profilesMap);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReview = async (submissionId: string, status: 'approved' | 'rejected') => {
    if (!selectedSubmission) return;
    
    setIsReviewing(true);
    try {
      const response = await fetch(`/api/submissions/${submissionId}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          feedback: reviewFeedback || null,
          reviewedBy: admin?.username || 'admin'
        }),
      });

      if (response.ok) {
        // Refresh the submissions list
        await fetchData();
        setSelectedSubmission(null);
        setReviewFeedback('');
      } else {
        const errorData = await response.json();
        alert(`Failed to ${status} submission: ${errorData.error}`);
      }
    } catch (error) {
      console.error(`Failed to ${status} submission:`, error);
      alert(`Failed to ${status} submission. Please try again.`);
    } finally {
      setIsReviewing(false);
    }
  };

  const getChallengeInfo = (challengeId: string) => {
    return challenges.find(c => c.id === challengeId);
  };

  const getUserProfile = (userId: string) => {
    return userProfiles.get(userId);
  };

  const filteredSubmissions = submissions.filter(submission => {
    if (filter === 'all') return true;
    return submission.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl shadow-sm border-b border-blue-100">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/')}
            className="text-blue-600 hover:bg-blue-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to EcoLearn
          </Button>
          <h1 className="text-xl font-bold text-blue-700 flex items-center space-x-2">
            <Shield className="w-6 h-6" />
            <span>Admin Panel</span>
            {admin && <span className="text-sm font-normal">- {admin.fullName}</span>}
          </h1>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline"
              onClick={fetchData}
              disabled={refreshing}
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              {refreshing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
            <Button 
              variant="outline"
              onClick={() => adminLogout(setLocation)}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6">
          {[
            { key: 'all', label: 'All Submissions', count: submissions.length },
            { key: 'pending', label: 'Pending Review', count: submissions.filter(s => s.status === 'pending').length },
            { key: 'approved', label: 'Approved', count: submissions.filter(s => s.status === 'approved').length },
            { key: 'rejected', label: 'Rejected', count: submissions.filter(s => s.status === 'rejected').length }
          ].map(({ key, label, count }) => (
            <Button
              key={key}
              variant={filter === key ? "default" : "outline"}
              onClick={() => setFilter(key as any)}
              className={filter === key ? "bg-blue-600 text-white" : "border-blue-200 text-blue-600 hover:bg-blue-50"}
            >
              {label} ({count})
            </Button>
          ))}
        </div>

        {/* Submissions Grid */}
        <div className="grid gap-6">
          {filteredSubmissions.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No submissions found</h3>
                <p className="text-gray-500">
                  {filter === 'pending' ? 'No submissions pending review.' : `No ${filter} submissions.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredSubmissions.map(submission => {
              const challenge = getChallengeInfo(submission.challengeId);
              const userProfile = getUserProfile(submission.userId);
              
              return (
                <Card 
                  key={submission.id}
                  className={`border-2 transition-all duration-300 hover:shadow-lg ${
                    submission.status === 'pending' ? 'border-yellow-200 bg-yellow-50' :
                    submission.status === 'approved' ? 'border-green-200 bg-green-50' :
                    'border-red-200 bg-red-50'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-lg text-gray-800">
                            {challenge?.title || 'Unknown Challenge'}
                          </CardTitle>
                          <Badge className={`text-xs ${
                            submission.status === 'pending' ? 'bg-yellow-500' :
                            submission.status === 'approved' ? 'bg-green-500' :
                            'bg-red-500'
                          } text-white`}>
                            {submission.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{userProfile?.fullName || 'Unknown User'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          {userProfile && (
                            <div className="flex items-center space-x-4 text-xs">
                              <span>{userProfile.schoolName}</span>
                              <span>Grade {userProfile.grade}</span>
                              <span>{userProfile.ecoPoints} EcoPoints</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Challenge Description */}
                    {challenge && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">{challenge.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>Week {challenge.week}</span>
                          <span>{challenge.category}</span>
                          <span>{challenge.points} points</span>
                        </div>
                      </div>
                    )}

                    {/* User's Caption */}
                    {submission.caption && (
                      <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                        <div className="flex items-start space-x-2">
                          <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-blue-800 italic">"{submission.caption}"</p>
                        </div>
                      </div>
                    )}

                    {/* Photo */}
                    {submission.photoUrl && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <img 
                          src={submission.photoUrl} 
                          alt="Challenge submission"
                          className="w-full max-w-md mx-auto rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => window.open(submission.photoUrl!, '_blank')}
                        />
                      </div>
                    )}

                    {/* Review Section */}
                    {submission.status === 'pending' && (
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-800 mb-3">Review Submission</h4>
                        <Textarea
                          placeholder="Add feedback (optional)..."
                          value={selectedSubmission?.id === submission.id ? reviewFeedback : ''}
                          onChange={(e) => {
                            setSelectedSubmission(submission);
                            setReviewFeedback(e.target.value);
                          }}
                          className="mb-3"
                          rows={3}
                        />
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleReview(submission.id, 'approved')}
                            disabled={isReviewing}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleReview(submission.id, 'rejected')}
                            disabled={isReviewing}
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Previous Review */}
                    {submission.status !== 'pending' && (
                      <div className={`p-3 rounded-lg border ${
                        submission.status === 'approved' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-medium ${
                            submission.status === 'approved' ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {submission.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                          </span>
                          {submission.reviewedAt && (
                            <span className="text-xs text-gray-500">
                              {new Date(submission.reviewedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {submission.feedback && (
                          <p className={`text-sm ${
                            submission.status === 'approved' ? 'text-green-700' : 'text-red-700'
                          }`}>
                            Feedback: {submission.feedback}
                          </p>
                        )}
                        {submission.status === 'approved' && (
                          <p className="text-sm text-green-700 font-medium mt-1">
                            +{submission.pointsAwarded} EcoPoints awarded
                          </p>
                        )}
                        {submission.status === 'rejected' && (
                          <Button 
                            onClick={() => window.open(`/challenges/${submission.challengeId}`, '_blank')}
                            className="mt-2 w-full bg-orange-600 hover:bg-orange-700 text-white"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Again
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                      {submission.photoUrl && (
                        <Button 
                          variant="outline"
                          className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                          onClick={() => window.open(submission.photoUrl!, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Full Image
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}