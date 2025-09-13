import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Camera, Upload, Eye, Clock, CheckCircle, XCircle, Zap, Calendar, Star } from "lucide-react";
import { useLocation } from "wouter";

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  week: number;
  isActive: boolean;
  createdAt: string;
}

interface ChallengeSubmission {
  id: string;
  challengeId: string;
  userId: string;
  photoUrl: string | null;
  caption: string | null;
  status: 'pending' | 'approved' | 'rejected';
  pointsAwarded: number;
  submittedAt: string;
  reviewedAt: string | null;
  feedback: string | null;
}

export default function ChallengesPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterWeek, setFilterWeek] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'submitted' | 'completed'>('all');

  const loadData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Load all challenges
      const challengesResponse = await fetch('/api/challenges');
      if (challengesResponse.ok) {
        const challengesData = await challengesResponse.json();
        setChallenges(challengesData.challenges || []);
      }
      
      // Load user submissions
      const submissionsResponse = await fetch(`/api/submissions/user/${user.uid}`);
      if (submissionsResponse.ok) {
        const submissionsData = await submissionsResponse.json();
        setSubmissions(submissionsData.submissions || []);
      }
      
    } catch (error) {
      console.error('Failed to load challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const getUniqueWeeks = () => {
    return [...new Set(challenges.map(c => c.week))].sort((a, b) => a - b);
  };

  const getUniqueCategories = () => {
    return [...new Set(challenges.map(c => c.category))];
  };

  const getSubmissionForChallenge = (challengeId: string) => {
    return submissions.find(s => s.challengeId === challengeId);
  };

  const filteredChallenges = challenges.filter(challenge => {
    // Week filter
    if (filterWeek !== null && challenge.week !== filterWeek) return false;
    
    // Category filter
    if (filterCategory && challenge.category !== filterCategory) return false;
    
    // Status filter
    if (filterStatus !== 'all') {
      const submission = getSubmissionForChallenge(challenge.id);
      
      if (filterStatus === 'available' && submission) return false;
      if (filterStatus === 'submitted' && (!submission || submission.status === 'approved')) return false;
      if (filterStatus === 'completed' && (!submission || submission.status !== 'approved')) return false;
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl shadow-sm border-b border-orange-100">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/dashboard')}
            className="text-orange-600 hover:bg-orange-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-xl font-bold text-orange-700 flex items-center space-x-2">
            <Camera className="w-6 h-6" />
            <span>Photo Challenges</span>
          </h1>
          <div className="w-32"></div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
            <CardContent className="p-6 text-center">
              <Camera className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">{challenges.length}</p>
              <p className="text-sm text-gray-600">Total Challenges</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{submissions.filter(s => s.status === 'approved').length}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-yellow-200">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-600">{submissions.filter(s => s.status === 'pending').length}</p>
              <p className="text-sm text-gray-600">Under Review</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{submissions.reduce((total, s) => total + s.pointsAwarded, 0)}</p>
              <p className="text-sm text-gray-600">Points Earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 mb-8 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Challenges</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Week Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Week</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterWeek === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterWeek(null)}
                  className={filterWeek === null ? "bg-orange-600 text-white" : "border-orange-200 text-orange-600"}
                >
                  All Weeks
                </Button>
                {getUniqueWeeks().map(week => (
                  <Button
                    key={week}
                    variant={filterWeek === week ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterWeek(week)}
                    className={filterWeek === week ? "bg-orange-600 text-white" : "border-orange-200 text-orange-600"}
                  >
                    Week {week}
                  </Button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterCategory(null)}
                  className={filterCategory === null ? "bg-blue-600 text-white" : "border-blue-200 text-blue-600"}
                >
                  All Categories
                </Button>
                {getUniqueCategories().map(category => (
                  <Button
                    key={category}
                    variant={filterCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterCategory(category)}
                    className={filterCategory === category ? "bg-blue-600 text-white" : "border-blue-200 text-blue-600"}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'available', label: 'Available' },
                  { key: 'submitted', label: 'Submitted' },
                  { key: 'completed', label: 'Completed' }
                ].map(({ key, label }) => (
                  <Button
                    key={key}
                    variant={filterStatus === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus(key as any)}
                    className={filterStatus === key ? "bg-green-600 text-white" : "border-green-200 text-green-600"}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid gap-6">
          {filteredChallenges.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No challenges found</h3>
                <p className="text-gray-500">
                  Try adjusting your filters to see more challenges.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredChallenges.map(challenge => {
              const submission = getSubmissionForChallenge(challenge.id);
              const isSubmitted = !!submission;
              const isApproved = submission?.status === 'approved';
              const isPending = submission?.status === 'pending';
              const isRejected = submission?.status === 'rejected';
              
              return (
                <Card key={challenge.id} className={`border-2 transition-all duration-300 hover:shadow-lg ${
                  isApproved ? 'border-green-200 bg-green-50' :
                  isPending ? 'border-yellow-200 bg-yellow-50' :
                  isRejected ? 'border-red-200 bg-red-50' :
                  'border-orange-200 bg-orange-50 hover:border-orange-300'
                }`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl text-gray-800">
                            {challenge.title}
                          </CardTitle>
                          <Badge className={`text-xs ${
                            isApproved ? 'bg-green-500' :
                            isPending ? 'bg-yellow-500' :
                            isRejected ? 'bg-red-500' :
                            'bg-orange-500'
                          } text-white`}>
                            {isApproved ? 'Completed' :
                             isPending ? 'Under Review' :
                             isRejected ? 'Rejected' :
                             'Available'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Week {challenge.week}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4" />
                            <span>{challenge.category}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Zap className="w-4 h-4 text-orange-500" />
                            <span className="font-medium">{challenge.points} points</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Challenge Description */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 leading-relaxed">{challenge.description}</p>
                    </div>

                    {/* Submission Status */}
                    {isSubmitted && submission && (
                      <div className={`p-4 rounded-lg border ${
                        isApproved ? 'bg-green-50 border-green-200' :
                        isPending ? 'bg-yellow-50 border-yellow-200' :
                        'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-800">
                            {isApproved ? '✅ Completed' :
                             isPending ? '⏳ Under Review' :
                             '❌ Rejected'}
                          </span>
                          <span className="text-sm text-gray-600">
                            {new Date(submission.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                        {submission.caption && (
                          <p className="text-sm text-gray-600 italic mb-2">"{submission.caption}"</p>
                        )}
                        {submission.feedback && isRejected && (
                          <p className="text-sm text-red-700">Feedback: {submission.feedback}</p>
                        )}
                        {isApproved && (
                          <p className="text-sm text-green-700 font-medium">+{submission.pointsAwarded} EcoPoints earned!</p>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                      {!isSubmitted ? (
                        <Button 
                          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                          onClick={() => setLocation(`/challenges/${challenge.id}`)}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Submit Photo
                        </Button>
                      ) : (
                        <>
                          {submission?.photoUrl && (
                            <Button 
                              variant="outline"
                              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                              onClick={() => window.open(submission.photoUrl!, '_blank')}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Submission
                            </Button>
                          )}
                          {isRejected && (
                            <Button 
                              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                              onClick={() => setLocation(`/challenges/${challenge.id}`)}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Submit New Photo
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Summary */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Showing {filteredChallenges.length} of {challenges.length} challenges
          </p>
        </div>
      </main>
    </div>
  );
}