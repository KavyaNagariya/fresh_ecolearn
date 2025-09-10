import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useParams } from 'wouter';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Trophy, 
  Target, 
  Timer, 
  RotateCcw,
  ArrowRight,
  Star,
  Zap
} from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  points: number;
}

interface QuizData {
  id: string;
  title: string;
  instructions: string;
  passingScore: number;
  totalPoints: number;
  questions: QuizQuestion[];
}

interface QuizAttempt {
  questionId: string;
  selectedAnswer?: number;
  isCorrect?: boolean;
  points: number;
  timeTaken: number;
}

// Mock data for all quizzes - in a real app, this would come from an API
const quizData: { [key: string]: QuizData } = {
  'module-1': {
    id: 'module-1',
    title: 'Climate Change Fundamentals Quiz',
    instructions: 'Answer all 10 MCQs. Each correct answer awards 10 points; incorrect or skipped answers get 0. You need 30 points to unlock the next module.',
    passingScore: 30,
    totalPoints: 100,
    questions: [
      {
        id: 'q1',
        question: 'Which is NOT a greenhouse gas?',
        options: ['CO₂', 'Oxygen', 'Methane', 'Nitrous oxide'],
        correctAnswer: 1,
        explanation: 'Oxygen is not a greenhouse gas. The main greenhouse gases are CO₂, methane, and nitrous oxide.',
        points: 10
      },
      {
        id: 'q2',
        question: 'Main human activity that increases atmospheric CO₂?',
        options: ['Transportation', 'Watching TV', 'Planting trees', 'Using solar panels'],
        correctAnswer: 0,
        explanation: 'Transportation, especially burning fossil fuels in cars, is a major source of CO₂ emissions.',
        points: 10
      },
      {
        id: 'q3',
        question: 'What is the main difference between climate and weather?',
        options: ['Length of time measured', 'Types of gases involved', 'Animals affected', 'Use of satellites'],
        correctAnswer: 0,
        explanation: 'Climate refers to long-term patterns (decades), while weather changes day-to-day.',
        points: 10
      },
      {
        id: 'q4',
        question: 'Which effect is linked to global warming?',
        options: ['Rising sea levels', 'Better phone signals', 'More internet traffic', 'Increased tree planting'],
        correctAnswer: 0,
        explanation: 'Rising sea levels are a direct result of global warming due to melting ice and thermal expansion.',
        points: 10
      },
      {
        id: 'q5',
        question: 'What can reduce greenhouse gases at home?',
        options: ['Using LED bulbs', 'Leaving lights on', 'Burning trash', 'Breathing faster'],
        correctAnswer: 0,
        explanation: 'LED bulbs use less energy than traditional bulbs, reducing electricity demand and emissions.',
        points: 10
      },
      {
        id: 'q6',
        question: 'What do scientists use to study climate change?',
        options: ['Satellites', 'Shopping malls', 'Televisions', 'Movie theaters'],
        correctAnswer: 0,
        explanation: 'Scientists use satellites along with weather stations and ocean buoys to collect climate data.',
        points: 10
      },
      {
        id: 'q7',
        question: 'Which action helps absorb CO₂ from the atmosphere?',
        options: ['Planting trees', 'Driving more cars', 'Building roads', 'Burning coal'],
        correctAnswer: 0,
        explanation: 'Trees absorb CO₂ during photosynthesis, helping to remove it from the atmosphere.',
        points: 10
      },
      {
        id: 'q8',
        question: 'What\'s a sign of global warming in the oceans?',
        options: ['Coral bleaching', 'More fish parties', 'More sandcastles', 'Less swimming'],
        correctAnswer: 0,
        explanation: 'Coral bleaching occurs when ocean temperatures rise due to global warming.',
        points: 10
      },
      {
        id: 'q9',
        question: 'Who can help fight climate change?',
        options: ['Everyone', 'Only scientists', 'Only teachers', 'Only adults'],
        correctAnswer: 0,
        explanation: 'Everyone can contribute to fighting climate change through their daily actions and choices.',
        points: 10
      },
      {
        id: 'q10',
        question: 'Why is recycling important for climate action?',
        options: ['It reduces landfill emissions', 'It takes more energy', 'It increases air pollution', 'It makes food tastier'],
        correctAnswer: 0,
        explanation: 'Recycling reduces waste going to landfills, which decreases methane emissions.',
        points: 10
      }
    ]
  },
  'module-2': {
    id: 'module-2',
    title: 'Water Conservation & Management Quiz',
    instructions: 'Answer all 10 MCQs. Each correct answer awards 10 points; incorrect or skipped answers get 0. You need 30 points to unlock the next module.',
    passingScore: 30,
    totalPoints: 100,
    questions: [
      {
        id: 'q1',
        question: 'What process turns water vapor back into liquid?',
        options: ['Evaporation', 'Condensation', 'Freezing', 'Melting'],
        correctAnswer: 1,
        explanation: 'Condensation is the process where water vapor cools and turns back into liquid water, forming clouds.',
        points: 10
      },
      {
        id: 'q2',
        question: 'Which of these wastes the most water at home?',
        options: ['Fixing leaks', 'Letting tap run while brushing', 'Reusing water', 'Using a bucket for washing'],
        correctAnswer: 1,
        explanation: 'Letting the tap run while brushing teeth can waste 6 liters of water per minute.',
        points: 10
      },
      {
        id: 'q3',
        question: 'How does pollution reach rivers?',
        options: ['Rainwater runoff', 'Radio waves', 'Singing fish', 'TV commercials'],
        correctAnswer: 0,
        explanation: 'Pollution reaches rivers through rainwater runoff from farms, factories, and urban areas.',
        points: 10
      },
      {
        id: 'q4',
        question: 'Why are oceans important for our planet?',
        options: ['They regulate climate', 'Make food tastier', 'Let us surf', 'Are fun for swimming'],
        correctAnswer: 0,
        explanation: 'Oceans regulate Earth\'s climate, produce oxygen, and provide food for billions of people.',
        points: 10
      },
      {
        id: 'q5',
        question: 'Which habit helps conserve water at school?',
        options: ['Rainwater harvesting', 'Leaving taps on', 'Painting walls', 'Using plastic bottles'],
        correctAnswer: 0,
        explanation: 'Rainwater harvesting systems collect and store rainwater for later use, reducing water waste.',
        points: 10
      },
      {
        id: 'q6',
        question: 'Plastic waste harms oceans by:',
        options: ['Trapping animals', 'Cleaning the water', 'Growing trees', 'Creating music'],
        correctAnswer: 0,
        explanation: 'Plastic waste can trap marine animals and pollute ocean ecosystems.',
        points: 10
      },
      {
        id: 'q7',
        question: 'Which product uses a large amount of water to produce?',
        options: ['Cotton t-shirt', 'Pencil', 'Kite', 'Eraser'],
        correctAnswer: 0,
        explanation: 'Producing one cotton t-shirt requires over 2,700 liters of water for growing and processing cotton.',
        points: 10
      },
      {
        id: 'q8',
        question: 'Clean water is:',
        options: ['Limited and valuable', 'Everywhere forever', 'Not important', 'Only in oceans'],
        correctAnswer: 0,
        explanation: 'Only about 1% of Earth\'s water is accessible for human use, making clean water limited and precious.',
        points: 10
      },
      {
        id: 'q9',
        question: 'What can students do for water conservation?',
        options: ['Teach others', 'Litter near lakes', 'Waste water', 'Ignore leaks'],
        correctAnswer: 0,
        explanation: 'Students can make a big impact by teaching others about water conservation and leading by example.',
        points: 10
      },
      {
        id: 'q10',
        question: 'A simple way to help oceans is:',
        options: ['Using reusable bottles', 'Throwing trash in rivers', 'Drawing on walls', 'Over-watering plants'],
        correctAnswer: 0,
        explanation: 'Using reusable bottles reduces plastic waste that could end up in oceans.',
        points: 10
      }
    ]
  },
  'module-3': {
    id: 'module-3',
    title: 'Renewable Energy Systems Quiz',
    instructions: 'Answer all 10 MCQs. Each correct answer gives 10 points; you need 30 points to unlock the next module.',
    passingScore: 30,
    totalPoints: 100,
    questions: [
      {
        id: 'q1',
        question: 'Which of these is a renewable energy source?',
        options: ['Coal', 'Solar', 'Oil', 'Gas'],
        correctAnswer: 1,
        explanation: 'Solar energy is renewable because sunlight is an unlimited natural resource.',
        points: 10
      },
      {
        id: 'q2',
        question: 'What does a wind turbine use to create electricity?',
        options: ['Sunlight', 'Water', 'Wind', 'Heat'],
        correctAnswer: 2,
        explanation: 'Wind turbines use moving air (wind) to spin their blades and generate electricity.',
        points: 10
      },
      {
        id: 'q3',
        question: 'Which appliance uses less energy?',
        options: ['LED bulb', 'Incandescent bulb', 'Tube light', 'Candle'],
        correctAnswer: 0,
        explanation: 'LED bulbs use up to 75% less energy than traditional incandescent bulbs.',
        points: 10
      },
      {
        id: 'q4',
        question: 'Hydroelectric power is generated by:',
        options: ['Burning wood', 'Flowing water', 'Natural gas', 'Planting trees'],
        correctAnswer: 1,
        explanation: 'Hydroelectric power uses flowing water to spin turbines and generate electricity.',
        points: 10
      },
      {
        id: 'q5',
        question: 'Which is a future energy technology?',
        options: ['Solar paint', 'Burning oil', 'Gas stove', 'Charcoal fire'],
        correctAnswer: 0,
        explanation: 'Solar paint is an emerging technology that could turn any surface into a solar panel.',
        points: 10
      },
      {
        id: 'q6',
        question: 'Why is renewable energy better for the planet?',
        options: ['It pollutes less', 'It uses more water', 'It breaks appliances', 'It creates carbon monoxide'],
        correctAnswer: 0,
        explanation: 'Renewable energy sources produce little to no pollution compared to fossil fuels.',
        points: 10
      },
      {
        id: 'q7',
        question: 'Hydrogen fuel cells produce:',
        options: ['Water', 'Smoke', 'Oil', 'Ash'],
        correctAnswer: 0,
        explanation: 'Hydrogen fuel cells only produce water vapor as a byproduct, making them very clean.',
        points: 10
      },
      {
        id: 'q8',
        question: 'Which country leads in solar panel installation?',
        options: ['India', 'Iceland', 'North Pole', 'Brazil'],
        correctAnswer: 0,
        explanation: 'India is among the leading countries in solar panel installations and clean energy investment.',
        points: 10
      },
      {
        id: 'q9',
        question: 'What can you do to support clean energy?',
        options: ['Switch off lights when not needed', 'Burn more coal', 'Litter in parks', 'Use old appliances'],
        correctAnswer: 0,
        explanation: 'Switching off lights saves energy and reduces the demand for electricity production.',
        points: 10
      },
      {
        id: 'q10',
        question: 'Which traditional energy source causes pollution?',
        options: ['Coal', 'Solar', 'Wind', 'Water'],
        correctAnswer: 0,
        explanation: 'Coal burning releases harmful pollutants and greenhouse gases into the atmosphere.',
        points: 10
      }
    ]
  }
};

export default function QuizPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const params = useParams<{ moduleId: string }>();
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [canNavigate, setCanNavigate] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  useEffect(() => {
    if (!user) {
      setLocation('/signin');
      return;
    }

    // Load quiz data
    const quiz = quizData[params.moduleId];
    if (!quiz) {
      setLocation('/dashboard');
      return;
    }

    setCurrentQuiz(quiz);
    setStartTime(new Date());

    // Initialize attempts array
    setAttempts(quiz.questions.map(q => ({
      questionId: q.id,
      selectedAnswer: undefined,
      isCorrect: undefined,
      points: 0,
      timeTaken: 0
    })));
  }, [user, params.moduleId, setLocation]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (!reviewMode) {
      setSelectedAnswer(answerIndex);
    }
  };

  const submitAnswer = () => {
    if (selectedAnswer === null || !currentQuiz || reviewMode) return;

    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const timeTaken = Math.round((new Date().getTime() - startTime.getTime()) / 1000);

    const newAttempts = [...attempts];
    newAttempts[currentQuestionIndex] = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      points: isCorrect ? currentQuestion.points : 0,
      timeTaken
    };

    setAttempts(newAttempts);
    setShowResult(true);
    setCanNavigate(true);
  };

  const saveQuizResults = async (finalAttempts: QuizAttempt[]) => {
    const totalScore = finalAttempts.reduce((sum, attempt) => sum + attempt.points, 0);
    const passed = totalScore >= currentQuiz!.passingScore;
    
    // Save to localStorage
    const quizResult = {
      moduleId: params.moduleId,
      score: totalScore,
      totalPoints: currentQuiz!.totalPoints,
      passed,
      attempts: finalAttempts,
      completedAt: new Date().toISOString(),
      timeTaken: Math.round((new Date().getTime() - startTime.getTime()) / 1000)
    };

    localStorage.setItem(`quiz_result_${params.moduleId}`, JSON.stringify(quizResult));

    // If passed, unlock next module (this would typically update the database)
    if (passed) {
      const unlockedModules = JSON.parse(localStorage.getItem('unlocked_modules') || '["module-1"]');
      const currentModuleNum = parseInt(params.moduleId.split('-')[1]);
      const nextModule = `module-${currentModuleNum + 1}`;
      
      if (!unlockedModules.includes(nextModule) && currentModuleNum < 3) {
        unlockedModules.push(nextModule);
        localStorage.setItem('unlocked_modules', JSON.stringify(unlockedModules));
      }

      // Award points (this would typically be done via API)
      const currentProfile = JSON.parse(localStorage.getItem(`ecolearn_profile_${user!.uid}`) || '{}');
      if (currentProfile.ecoPoints !== undefined) {
        currentProfile.ecoPoints += totalScore;
        localStorage.setItem(`ecolearn_profile_${user!.uid}`, JSON.stringify(currentProfile));
      }
    }
  };

  const retakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizCompleted(false);
    setCanNavigate(false);
    setReviewMode(false);
    setStartTime(new Date());
    setAttempts(currentQuiz!.questions.map(q => ({
      questionId: q.id,
      selectedAnswer: undefined,
      isCorrect: undefined,
      points: 0,
      timeTaken: 0
    })));
  };

  const goToDashboard = () => {
    setLocation('/dashboard');
  };

  const goToNextModule = () => {
    const currentModuleNum = parseInt(params.moduleId.split('-')[1]);
    const nextModule = `module-${currentModuleNum + 1}`;
    if (currentModuleNum < 3) {
      setLocation(`/lesson/${nextModule}`);
    } else {
      setLocation('/dashboard');
    }
  };

  const navigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setSelectedAnswer(attempts[index]?.selectedAnswer ?? null);
    setShowResult(attempts[index]?.selectedAnswer !== undefined);
    setReviewMode(attempts[index]?.selectedAnswer !== undefined);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < currentQuiz!.questions.length - 1) {
      navigateToQuestion(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      navigateToQuestion(currentQuestionIndex - 1);
    }
  };

  const finishQuiz = () => {
    // Check if all questions are answered
    const unansweredQuestions = attempts.filter(a => a.selectedAnswer === undefined);
    if (unansweredQuestions.length > 0) {
      alert(`Please answer all questions before finishing the quiz. ${unansweredQuestions.length} questions remaining.`);
      return;
    }
    
    setQuizCompleted(true);
    saveQuizResults(attempts);
  };

  if (!currentQuiz) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
  const totalScore = attempts.reduce((sum, attempt) => sum + attempt.points, 0);
  const answeredQuestions = attempts.filter(a => a.selectedAnswer !== undefined).length;
  const averageTime = attempts.filter(a => a.timeTaken > 0).reduce((sum, a) => sum + a.timeTaken, 0) / Math.max(1, attempts.filter(a => a.timeTaken > 0).length);

  if (quizCompleted) {
    const passed = totalScore >= currentQuiz.passingScore;
    const correctAnswers = attempts.filter(a => a.isCorrect).length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-2xl mx-6 bg-white/90 backdrop-blur-sm border-purple-100">
          <CardHeader className="text-center">
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
              passed ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {passed ? (
                <Trophy className="w-10 h-10 text-white" />
              ) : (
                <XCircle className="w-10 h-10 text-white" />
              )}
            </div>
            <CardTitle className={`text-3xl font-bold ${passed ? 'text-green-700' : 'text-red-700'}`}>
              {passed ? 'Congratulations!' : 'Keep Trying!'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {passed && (
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-green-600 font-medium">You've passed the quiz and unlocked the next module!</p>
              </div>
            )}

            {/* Results Summary */}
            <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className={`text-3xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                  {totalScore}/{currentQuiz.totalPoints}
                </div>
                <div className="text-sm text-gray-600">Final Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {correctAnswers}/{currentQuiz.questions.length}
                </div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">{Math.round(averageTime)}s</div>
                <div className="text-xs text-gray-600">Avg. Time</div>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <div className="text-lg font-bold text-indigo-600">{Math.round((correctAnswers / currentQuiz.questions.length) * 100)}%</div>
                <div className="text-xs text-gray-600">Accuracy</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">+{totalScore}</div>
                <div className="text-xs text-gray-600">EcoPoints</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={goToDashboard}
                variant="outline"
                className="flex-1 border-gray-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              
              {!passed && (
                <Button
                  onClick={retakeQuiz}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake Quiz
                </Button>
              )}
              
              {passed && (
                <Button
                  onClick={goToNextModule}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white animate-pulse"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Next Module
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl shadow-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/dashboard')}
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-purple-200" />
            <div>
              <h1 className="text-xl font-bold text-purple-700">{currentQuiz.title}</h1>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Target className="w-4 h-4" />
              <span>{answeredQuestions}/{currentQuiz.questions.length} answered | {totalScore}/{currentQuiz.totalPoints} pts</span>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-purple-500 text-white text-xs">
                {user?.displayName?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-700">Quiz Progress</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Quiz Instructions */}
          {currentQuestionIndex === 0 && !showResult && (
            <Card className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-indigo-800 mb-2">Quiz Instructions</h3>
                <p className="text-indigo-700">{currentQuiz.instructions}</p>
                <p className="text-sm text-indigo-600 mt-2">💡 Take your time to read each question carefully. You can navigate between questions and review your answers before finishing.</p>
              </CardContent>
            </Card>
          )}

          {/* Question Navigation */}
          <Card className="mb-6 bg-white/90 backdrop-blur-sm border-purple-100">
            <CardHeader>
              <CardTitle className="text-lg text-purple-700">Question Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                {currentQuiz.questions.map((_, index) => {
                  const isAnswered = attempts[index]?.selectedAnswer !== undefined;
                  const isCurrent = index === currentQuestionIndex;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => navigateToQuestion(index)}
                      className={`w-10 h-10 rounded-lg border-2 text-sm font-semibold transition-all ${
                        isCurrent
                          ? 'bg-purple-500 border-purple-500 text-white'
                          : isAnswered
                          ? 'bg-green-100 border-green-400 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Current Question */}
          <Card className="bg-white/90 backdrop-blur-sm border-purple-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-purple-700 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    {currentQuestionIndex + 1}
                  </div>
                  <span>Question {currentQuestionIndex + 1}</span>
                </CardTitle>
                <Badge variant="outline" className="border-purple-300 text-purple-700">
                  {currentQuestion.points} points
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Question Text */}
              <div className="text-xl font-medium text-gray-800 leading-relaxed">
                {currentQuestion.question}
              </div>

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  let optionStyle = "border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50";
                  
                  if (showResult) {
                    if (index === currentQuestion.correctAnswer) {
                      optionStyle = "border-2 border-green-500 bg-green-50 text-green-800";
                    } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                      optionStyle = "border-2 border-red-500 bg-red-50 text-red-800";
                    } else {
                      optionStyle = "border-2 border-gray-200 bg-gray-50 text-gray-600";
                    }
                  } else if (selectedAnswer === index) {
                    optionStyle = "border-2 border-purple-500 bg-purple-100 text-purple-800";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => !showResult && handleAnswerSelect(index)}
                      disabled={showResult}
                      className={`w-full p-4 rounded-lg text-left transition-all ${optionStyle} ${
                        showResult ? 'cursor-default' : 'cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                          showResult && index === currentQuestion.correctAnswer
                            ? 'bg-green-500 border-green-500 text-white'
                            : showResult && index === selectedAnswer && index !== currentQuestion.correctAnswer
                            ? 'bg-red-500 border-red-500 text-white'
                            : selectedAnswer === index
                            ? 'bg-purple-500 border-purple-500 text-white'
                            : 'border-gray-400'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="flex-1">{option}</span>
                        {showResult && index === currentQuestion.correctAnswer && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        {showResult && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Result Explanation */}
              {showResult && currentQuestion.explanation && (
                <Card className={`${
                  selectedAnswer === currentQuestion.correctAnswer 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      {selectedAnswer === currentQuestion.correctAnswer ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                      )}
                      <div>
                        <h4 className={`font-semibold mb-1 ${
                          selectedAnswer === currentQuestion.correctAnswer 
                            ? 'text-green-800' 
                            : 'text-red-800'
                        }`}>
                          {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}
                        </h4>
                        <p className={`${
                          selectedAnswer === currentQuestion.correctAnswer 
                            ? 'text-green-700' 
                            : 'text-red-700'
                        }`}>
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Submit Button */}
              {!showResult && !reviewMode && (
                <div className="flex justify-center pt-6">
                  <Button
                    onClick={submitAnswer}
                    disabled={selectedAnswer === null}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
                  >
                    Submit Answer
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <Button
                  onClick={previousQuestion}
                  disabled={currentQuestionIndex === 0}
                  variant="outline"
                  className="border-purple-300 text-purple-600 hover:bg-purple-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex items-center space-x-2">
                  {answeredQuestions === currentQuiz.questions.length && (
                    <Button
                      onClick={finishQuiz}
                      className="bg-green-600 hover:bg-green-700 text-white px-6"
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      Finish Quiz
                    </Button>
                  )}
                  
                  <Button
                    onClick={nextQuestion}
                    disabled={currentQuestionIndex === currentQuiz.questions.length - 1}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}