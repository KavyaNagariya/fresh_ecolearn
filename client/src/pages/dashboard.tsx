import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useLocation } from 'wouter';
import { Zap, BookOpen, Trophy, Users, Target, Star, Lock, ChevronRight, TrendingUp, Award, Calendar } from 'lucide-react';

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
  const [moduleProgress, setModuleProgress] = useState<{ [key: string]: number }>({});
  const [unlockedModules, setUnlockedModules] = useState<string[]>(['module-1']);
  const [quizResults, setQuizResults] = useState<{ [key: string]: any }>({});

  // Check lesson completion for each module
  const checkModuleCompletion = () => {
    const progress: { [key: string]: number } = {};
    const quizData: { [key: string]: any } = {};
    
    // Check all modules completion
    ['module-1', 'module-2', 'module-3'].forEach(moduleId => {
      const moduleProgress = localStorage.getItem(`lesson_progress_${moduleId}`);
      if (moduleProgress) {
        const completedSections = JSON.parse(moduleProgress);
        progress[moduleId] = completedSections.length;
      } else {
        progress[moduleId] = 0;
      }
      
      // Check quiz results
      const quizResult = localStorage.getItem(`quiz_result_${moduleId}`);
      if (quizResult) {
        quizData[moduleId] = JSON.parse(quizResult);
      }
    });
    
    setModuleProgress(progress);
    setQuizResults(quizData);
    
    // Update unlocked modules
    const unlocked = JSON.parse(localStorage.getItem('unlocked_modules') || '["module-1"]');
    setUnlockedModules(unlocked);
  };

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation('/signin');
      return;
    }

    if (user) {
      loadProfile();
      checkModuleCompletion();
    }
  }, [user, authLoading, setLocation]);

  // Refresh module progress when component becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        checkModuleCompletion();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Interactive Header */}
      <header className="bg-white/90 backdrop-blur-xl shadow-sm border-b border-emerald-100">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">EcoLearn</h1>
          </div>
          
          {/* Animated Greeting & EcoPoints */}
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-lg font-semibold text-emerald-700 animate-fade-in">
                Welcome back, {profile.fullName.split(' ')[0]}! 👋
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-2xl font-bold text-emerald-600 animate-pulse leaf-sway">
                  {profile.ecoPoints + Object.values(quizResults).reduce((total: number, result: any) => total + (result.score || 0), 0)}
                </span>
                <span className="text-sm text-gray-600">EcoPoints</span>
              </div>
            </div>
            
            {/* Avatar & Actions */}
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 ring-2 ring-emerald-200 hover:ring-emerald-300 transition-all cursor-pointer">
                <AvatarImage src="" alt={profile.fullName} />
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-semibold">
                  {profile.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button 
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Progress & Motivation Section */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {/* Completion Progress Ring */}
          <Card className="bg-white/80 backdrop-blur-sm border-emerald-100 hover:shadow-lg transition-all duration-300 animate-slide-in-left">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg font-semibold text-emerald-700">Module Progress</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center relative">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#d1fae5"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#10b981"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${((moduleProgress['module-1'] || 0) + (moduleProgress['module-2'] || 0) + (moduleProgress['module-3'] || 0)) / 15 * 251.2} 251.2`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">{((moduleProgress['module-1'] || 0) + (moduleProgress['module-2'] || 0) + (moduleProgress['module-3'] || 0))}</div>
                      <div className="text-xs text-gray-500">/15</div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">Total Sections Completed</p>
              <Badge variant="secondary" className="mt-2 bg-emerald-100 text-emerald-700">
                {Math.floor(((moduleProgress['module-1'] || 0) + (moduleProgress['module-2'] || 0) + (moduleProgress['module-3'] || 0)) / 5)} of 3 Modules
              </Badge>
            </CardContent>
          </Card>

          {/* Quick Stats Cards */}
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300 animate-slide-in-up">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg font-semibold text-blue-700">Achievement Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">Quizzes Passed</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{Object.values(quizResults).filter((result: any) => result.passed).length}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Challenges</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">0</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium">Streak Days</span>
                  </div>
                  <span className="text-lg font-bold text-orange-600">3</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badges Gallery */}
          <Card className="bg-white/80 backdrop-blur-sm border-purple-100 hover:shadow-lg transition-all duration-300 animate-slide-in-right">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg font-semibold text-purple-700">Recent Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg animate-bounce">
                  <div className="text-2xl mb-1">🌱</div>
                  <div className="text-xs font-medium text-yellow-700">First Steps</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-lg">
                  <div className="text-2xl mb-1">📚</div>
                  <div className="text-xs font-medium text-green-700">Quick Learner</div>
                </div>
                <div className="text-center p-3 bg-gray-100 rounded-lg opacity-50">
                  <div className="text-2xl mb-1">🏆</div>
                  <div className="text-xs font-medium text-gray-500">Quiz Master</div>
                </div>
                <div className="text-center p-3 bg-gray-100 rounded-lg opacity-50">
                  <div className="text-2xl mb-1">🌍</div>
                  <div className="text-xs font-medium text-gray-500">Eco Warrior</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modules Navigation Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-emerald-100 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-emerald-700 flex items-center space-x-2">
              <BookOpen className="w-6 h-6" />
              <span>Learning Modules</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Module 1 - Unlocked */}
              <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-card-hover glow-effect">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-emerald-500 hover:bg-emerald-600">Available</Badge>
                    <div className="text-emerald-600">
                      <Zap className="w-5 h-5" />
                    </div>
                  </div>
                  <CardTitle className="text-lg text-emerald-700 leading-tight break-words">Module 1: Climate Fundamentals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">Learn about greenhouse gases, global warming, and climate vs weather patterns.</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className="text-xs font-semibold text-emerald-600">{moduleProgress['module-1'] === 5 ? '100%' : `${Math.round((moduleProgress['module-1'] || 0) / 5 * 100)}%`}</span>
                  </div>
                  <Progress value={moduleProgress['module-1'] === 5 ? 100 : (moduleProgress['module-1'] || 0) / 5 * 100} className="mb-4" />
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => setLocation('/lesson/module-1')}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      {moduleProgress['module-1'] === 5 ? 'Review Module' : 'Continue Learning'}
                    </Button>
                    {/* Quiz available after module completion */}
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
                      onClick={() => setLocation('/quiz/module-1')}
                      disabled={moduleProgress['module-1'] !== 5}
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      {moduleProgress['module-1'] === 5 ? 'Take Quiz' : 'Complete Module First'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Module 2 - Unlocked after Module 1 quiz */}
              <Card className={`border-2 hover:shadow-lg transition-all duration-300 ${
                unlockedModules.includes('module-2') 
                  ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 hover:scale-105 animate-card-hover' 
                  : 'border-gray-200 bg-gray-50 opacity-75'
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className={unlockedModules.includes('module-2') ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-200 text-gray-600'}>
                      {unlockedModules.includes('module-2') ? 'Available' : 'Locked'}
                    </Badge>
                    {unlockedModules.includes('module-2') ? (
                      <div className="text-blue-600">
                        <Zap className="w-5 h-5" />
                      </div>
                    ) : (
                      <Lock className="w-5 h-5 text-gray-400 animate-pulse" />
                    )}
                  </div>
                  <CardTitle className={`text-lg leading-tight break-words ${
                    unlockedModules.includes('module-2') ? 'text-blue-700' : 'text-gray-600'
                  }`}>Module 2: Water Conservation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-sm mb-4 leading-relaxed ${
                    unlockedModules.includes('module-2') ? 'text-gray-600' : 'text-gray-500'
                  }`}>Explore water cycle, conservation techniques, and ocean protection strategies.</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className={`text-xs font-semibold ${
                      unlockedModules.includes('module-2') ? 'text-blue-600' : 'text-gray-400'
                    }`}>{moduleProgress['module-2'] === 5 ? '100%' : `${Math.round((moduleProgress['module-2'] || 0) / 5 * 100)}%`}</span>
                  </div>
                  <Progress value={moduleProgress['module-2'] === 5 ? 100 : (moduleProgress['module-2'] || 0) / 5 * 100} className="mb-4" />
                  {unlockedModules.includes('module-2') ? (
                    <div className="space-y-2">
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => setLocation('/lesson/module-2')}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        {moduleProgress['module-2'] === 5 ? 'Review Module' : 'Start Learning'}
                      </Button>
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
                        onClick={() => setLocation('/quiz/module-2')}
                        disabled={moduleProgress['module-2'] !== 5}
                      >
                        <Trophy className="w-4 h-4 mr-2" />
                        {moduleProgress['module-2'] === 5 ? 'Take Quiz' : 'Complete Module First'}
                      </Button>
                    </div>
                  ) : (
                    <Button disabled className="w-full bg-gray-300 text-gray-500 cursor-not-allowed">
                      <Lock className="w-4 h-4 mr-2" />
                      Complete Module 1 Quiz
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Module 3 - Unlocked after Module 2 quiz */}
              <Card className={`border-2 hover:shadow-lg transition-all duration-300 ${
                unlockedModules.includes('module-3') 
                  ? 'border-green-200 bg-gradient-to-br from-green-50 to-lime-50 hover:scale-105 animate-card-hover' 
                  : 'border-gray-200 bg-gray-50 opacity-75'
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className={unlockedModules.includes('module-3') ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-200 text-gray-600'}>
                      {unlockedModules.includes('module-3') ? 'Available' : 'Locked'}
                    </Badge>
                    {unlockedModules.includes('module-3') ? (
                      <div className="text-green-600">
                        <Zap className="w-5 h-5" />
                      </div>
                    ) : (
                      <Lock className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <CardTitle className={`text-lg leading-tight break-words ${
                    unlockedModules.includes('module-3') ? 'text-green-700' : 'text-gray-600'
                  }`}>Module 3: Renewable Energy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-sm mb-4 leading-relaxed ${
                    unlockedModules.includes('module-3') ? 'text-gray-600' : 'text-gray-500'
                  }`}>Learn about solar, wind, hydroelectric power and energy efficiency practices.</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className={`text-xs font-semibold ${
                      unlockedModules.includes('module-3') ? 'text-green-600' : 'text-gray-400'
                    }`}>{moduleProgress['module-3'] === 5 ? '100%' : `${Math.round((moduleProgress['module-3'] || 0) / 5 * 100)}%`}</span>
                  </div>
                  <Progress value={moduleProgress['module-3'] === 5 ? 100 : (moduleProgress['module-3'] || 0) / 5 * 100} className="mb-4" />
                  {unlockedModules.includes('module-3') ? (
                    <div className="space-y-2">
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => setLocation('/lesson/module-3')}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        {moduleProgress['module-3'] === 5 ? 'Review Module' : 'Start Learning'}
                      </Button>
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
                        onClick={() => setLocation('/quiz/module-3')}
                        disabled={moduleProgress['module-3'] !== 5}
                      >
                        <Trophy className="w-4 h-4 mr-2" />
                        {moduleProgress['module-3'] === 5 ? 'Take Quiz' : 'Complete Module First'}
                      </Button>
                    </div>
                  ) : (
                    <Button disabled className="w-full bg-gray-300 text-gray-500 cursor-not-allowed">
                      <Lock className="w-4 h-4 mr-2" />
                      Complete Module 2 Quiz
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard & Community */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Leaderboard Preview */}
          <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-purple-700 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>School Leaderboard</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg">
                  <div className="text-xl">🥇</div>
                  <div className="flex-1">
                    <div className="font-semibold text-yellow-800">Alex Chen</div>
                    <div className="text-sm text-yellow-600">2,450 EcoPoints</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg">
                  <div className="text-xl">🥈</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">Maria Rodriguez</div>
                    <div className="text-sm text-gray-600">2,180 EcoPoints</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg">
                  <div className="text-xl">🥉</div>
                  <div className="flex-1">
                    <div className="font-semibold text-orange-800">Sam Johnson</div>
                    <div className="text-sm text-orange-600">1,960 EcoPoints</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg border-2 border-emerald-200">
                  <div className="text-xl">🌟</div>
                  <div className="flex-1">
                    <div className="font-semibold text-emerald-800">{profile.fullName} (You)</div>
                    <div className="text-sm text-emerald-600">
                      {profile.ecoPoints + Object.values(quizResults).reduce((total: number, result: any) => total + (result.score || 0), 0)} EcoPoints
                    </div>
                  </div>
                  <div className="text-sm font-medium text-emerald-600">#12</div>
                </div>
              </div>
              <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white">
                View Full Leaderboard
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-blue-700 flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <div className="text-green-600 mt-1">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-green-800">Quiz Completed!</div>
                    <div className="text-xs text-green-600">Scored 90% on Climate Fundamentals Quiz</div>
                    <div className="text-xs text-gray-500 mt-1">2 hours ago</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <div className="text-blue-600 mt-1">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-blue-800">Module Started</div>
                    <div className="text-xs text-blue-600">Began Climate Change Fundamentals</div>
                    <div className="text-xs text-gray-500 mt-1">1 day ago</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <div className="text-yellow-600 mt-1">
                    <Star className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-yellow-800">Badge Earned!</div>
                    <div className="text-xs text-yellow-600">First Steps - Welcome to EcoLearn</div>
                    <div className="text-xs text-gray-500 mt-1">3 days ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}