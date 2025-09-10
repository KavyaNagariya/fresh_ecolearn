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
  ArrowRight, 
  BookOpen, 
  CheckCircle, 
  ExternalLink, 
  Lightbulb, 
  Target,
  Timer,
  Trophy,
  Zap
} from 'lucide-react';

interface LessonSection {
  id: string;
  title: string;
  content: string;
  funFact?: string;
  example?: string;
  learnMore?: {
    text: string;
    url: string;
  };
  imageDescription?: string;
  completed?: boolean;
}

interface ModuleData {
  id: string;
  title: string;
  sections: LessonSection[];
  totalSections: number;
}

// Mock data for all modules - in a real app, this would come from an API
const moduleData: { [key: string]: ModuleData } = {
  'module-1': {
    id: 'module-1',
    title: 'Climate Change Fundamentals',
    totalSections: 5,
    sections: [
      {
        id: 'section-1',
        title: 'What Are Greenhouse Gases?',
        content: 'Greenhouse gases are invisible particles in our atmosphere like carbon dioxide (CO₂), methane (CH₄), and nitrous oxide (N₂O) that trap heat from the sun. This is natural—but human activities, like burning fossil fuels, have increased their levels.',
        funFact: 'CO₂ from car exhaust and methane from livestock add up to most of the greenhouse gas emissions!',
        learnMore: {
          text: 'Wikipedia: Greenhouse Gas',
          url: 'https://en.wikipedia.org/wiki/Greenhouse_gas'
        },
        imageDescription: 'Show a simplified diagram of atmosphere layers trapping heat',
        completed: false
      },
      {
        id: 'section-2',
        title: 'Causes and Effects of Global Warming',
        content: 'Global warming happens when more greenhouse gases trap extra heat. Main causes: burning coal, oil, and gas; deforestation; factory emissions; and even agriculture. Effects include rising sea levels, melting glaciers, and more extreme weather.',
        example: 'Earth\'s average temperature has already increased by more than 1°C since 1880!',
        learnMore: {
          text: 'Wikipedia: Global Warming',
          url: 'https://en.wikipedia.org/wiki/Global_warming'
        },
        imageDescription: 'Before/after map showing ice melt or ocean rise',
        completed: false
      },
      {
        id: 'section-3',
        title: 'Climate vs. Weather',
        content: 'Weather changes day-to-day—rain, sun, storms—while climate is the average weather pattern over decades. Example: Today\'s rain is weather. A region having rainy winters for 50 years is climate.',
        funFact: 'Climate tells you what clothes to pack for a trip; weather tells you what to wear today!',
        learnMore: {
          text: 'Wikipedia: Climate',
          url: 'https://en.wikipedia.org/wiki/Climate'
        },
        imageDescription: 'Compare sunny/rainy clouds for weather; world map colors for climate zones',
        completed: false
      },
      {
        id: 'section-4',
        title: 'Real-Life Data—How Scientists Study Change',
        content: 'Scientists use satellites, weather stations, and ocean buoys to collect data. They compare temperature, rainfall, and ice levels over time to predict changes and advise action.',
        example: 'NASA studies Arctic ice loss with satellites every year!',
        learnMore: {
          text: 'Wikipedia: Climate Monitoring',
          url: 'https://en.wikipedia.org/wiki/Climate_monitoring'
        },
        imageDescription: 'Satellite or chart of rising temperatures',
        completed: false
      },
      {
        id: 'section-5',
        title: 'Simple Actions to Help',
        content: 'Use less energy: turn off lights, unplug devices. Plant trees: absorb CO₂. Reduce, reuse, recycle: less landfill. Eat local food. Every student\'s effort adds up—small actions can help slow climate change!',
        learnMore: {
          text: 'Wikipedia: Individual Action on Climate Change',
          url: 'https://en.wikipedia.org/wiki/Individual_action_on_climate_change'
        },
        imageDescription: 'Kids planting saplings, recycling, or switching off light',
        completed: false
      }
    ]
  },
  'module-2': {
    id: 'module-2',
    title: 'Water Conservation & Management',
    totalSections: 5,
    sections: [
      {
        id: 'section-1',
        title: 'The Water Cycle and Pollution Sources',
        content: 'The water cycle describes how water moves through evaporation (from oceans, lakes), condensation (clouds), and precipitation (rain, snow). Pollution can enter water from factories, farms (chemical runoff), and untreated sewage, making clean water scarce.',
        funFact: 'Only about 1% of Earth\'s water is accessible for human use!',
        learnMore: {
          text: 'Wikipedia: Water Cycle',
          url: 'https://en.wikipedia.org/wiki/Water_cycle'
        },
        imageDescription: 'Diagram showing evaporation, condensation, precipitation',
        completed: false
      },
      {
        id: 'section-2',
        title: 'Conservation Techniques at Home and School',
        content: 'Simple conservation habits include fixing leaks, turning off the tap while brushing teeth, using buckets for washing, and watering plants in the early morning. Schools can install rainwater harvesting systems, reuse water for gardens, and educate students on saving water.',
        example: 'A running tap can waste nearly 6 liters of water per minute!',
        learnMore: {
          text: 'Wikipedia: Water Conservation',
          url: 'https://en.wikipedia.org/wiki/Water_conservation'
        },
        imageDescription: 'Children fixing leaks, watering plants, installing rain harvesting',
        completed: false
      },
      {
        id: 'section-3',
        title: 'Ocean Protection Strategies',
        content: 'Oceans are essential for life. Reducing plastic waste, supporting clean-ups, and using fewer chemicals protect ocean life. Healthy oceans give us food, regulate climate, and produce oxygen.',
        funFact: 'Always use reusable bags and bottles—never litter near waterways!',
        learnMore: {
          text: 'Wikipedia: Ocean Conservation',
          url: 'https://en.wikipedia.org/wiki/Marine_conservation'
        },
        imageDescription: 'Beach clean-up event, reusable items, fish swimming near coral',
        completed: false
      },
      {
        id: 'section-4',
        title: 'Understanding Water Usage',
        content: 'Water is used in farming, industries, and homes. Understanding where water is used most helps us make better choices. Reducing water waste saves energy and money, too.',
        example: 'Producing one cotton shirt uses over 2,700 liters of water!',
        learnMore: {
          text: 'Wikipedia: Water Use',
          url: 'https://en.wikipedia.org/wiki/Water_use'
        },
        imageDescription: 'Pie chart showing water usage split by sector',
        completed: false
      },
      {
        id: 'section-5',
        title: 'Becoming a Water Hero',
        content: 'Teach others to save water. Participate in community clean-ups. Share tips on conserving water at home and school. Every drop counts—small actions from many people make a big difference!',
        learnMore: {
          text: 'Wikipedia: Water Activism',
          url: 'https://en.wikipedia.org/wiki/Water_activism'
        },
        imageDescription: 'Kids sharing water tips, group holding "Save Water" signs',
        completed: false
      }
    ]
  },
  'module-3': {
    id: 'module-3',
    title: 'Renewable Energy Systems',
    totalSections: 5,
    sections: [
      {
        id: 'section-1',
        title: 'Solar, Wind, and Hydroelectric Power',
        content: 'Renewable energy comes from sources that won\'t run out—like sunlight, wind, and water. Solar panels turn sunlight into electricity. Wind turbines use wind to generate power. Hydroelectric dams use flowing water to spin turbines and create energy.',
        funFact: 'The world\'s largest solar farm can power hundreds of thousands of homes!',
        learnMore: {
          text: 'Wikipedia: Renewable Energy',
          url: 'https://en.wikipedia.org/wiki/Renewable_energy'
        },
        imageDescription: 'Diagrams of solar panels, wind turbines, and hydroelectric dam',
        completed: false
      },
      {
        id: 'section-2',
        title: 'Energy Efficiency Practices',
        content: 'Using less energy is as important as producing clean energy! Switch off appliances when not in use, use LED bulbs, insulate homes, and choose energy-star appliances. Small steps add up to big savings!',
        example: 'LED bulbs use up to 75% less energy than traditional bulbs.',
        learnMore: {
          text: 'Wikipedia: Energy Efficiency',
          url: 'https://en.wikipedia.org/wiki/Energy_efficiency'
        },
        imageDescription: 'Comparison chart of energy-efficient vs. regular appliances',
        completed: false
      },
      {
        id: 'section-3',
        title: 'Future Energy Technologies',
        content: 'New advances include solar paint, ocean wave generators, and homes powered by rooftop wind turbines. Battery technology is rapidly improving, allowing us to store wind and solar energy even when the sun isn\'t shining or the wind isn\'t blowing.',
        funFact: 'Some buses in Europe run on hydrogen fuel cells, which only produce water as waste!',
        learnMore: {
          text: 'Wikipedia: Emerging Energy Technologies',
          url: 'https://en.wikipedia.org/wiki/Energy_conversion'
        },
        imageDescription: 'Photos or graphics showing futuristic clean energy systems',
        completed: false
      },
      {
        id: 'section-4',
        title: 'Why Renewable Energy Matters',
        content: 'Traditional energy sources like coal and oil pollute the air and contribute to climate change. Renewables are clean, safe, and never run out! More countries are investing in clean energy to protect our planet.',
        example: 'India is now among the leading countries in installing solar panels.',
        learnMore: {
          text: 'Wikipedia: Clean Energy',
          url: 'https://en.wikipedia.org/wiki/Clean_energy'
        },
        imageDescription: 'Infographic comparing emissions of coal, gas, solar, and wind',
        completed: false
      },
      {
        id: 'section-5',
        title: 'How You Can Help',
        content: 'Save energy at home by turning off lights and unplugging chargers. Support clean energy efforts in your community. Talk to others about the benefits of renewables. Every student\'s effort matters in creating a cleaner, greener future!',
        learnMore: {
          text: 'Wikipedia: Individual Action on Clean Energy',
          url: 'https://en.wikipedia.org/wiki/Sustainable_energy'
        },
        imageDescription: 'Kids switching off lights, community solar installations',
        completed: false
      }
    ]
  }
};

export default function LessonPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const params = useParams<{ moduleId: string; sectionId?: string }>();
  const [currentModule, setCurrentModule] = useState<ModuleData | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    if (!user) {
      setLocation('/signin');
      return;
    }

    // Load module data
    const module = moduleData[params.moduleId];
    if (!module) {
      setLocation('/dashboard');
      return;
    }

    setCurrentModule(module);

    // Set current section
    if (params.sectionId) {
      const sectionIndex = module.sections.findIndex(s => s.id === params.sectionId);
      if (sectionIndex !== -1) {
        setCurrentSectionIndex(sectionIndex);
      }
    }

    // Load completed sections from localStorage
    const completed = localStorage.getItem(`lesson_progress_${params.moduleId}`);
    if (completed) {
      setCompletedSections(new Set(JSON.parse(completed)));
    }
  }, [user, params.moduleId, params.sectionId, setLocation]);

  // Reading timer
  useEffect(() => {
    const timer = setInterval(() => {
      setReadingTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSectionIndex]);

  const handleSectionComplete = (sectionId: string) => {
    const newCompleted = new Set(completedSections);
    newCompleted.add(sectionId);
    setCompletedSections(newCompleted);
    
    // Save to localStorage
    localStorage.setItem(`lesson_progress_${params.moduleId}`, JSON.stringify(Array.from(newCompleted)));
    
    // Auto-advance to next section after a short delay
    setTimeout(() => {
      if (currentSectionIndex < currentModule!.sections.length - 1) {
        setCurrentSectionIndex(currentSectionIndex + 1);
        setLocation(`/lesson/${params.moduleId}/section/${currentModule!.sections[currentSectionIndex + 1].id}`);
        setReadingTime(0);
      }
    }, 1500);
  };

  const navigateToSection = (index: number) => {
    setCurrentSectionIndex(index);
    setLocation(`/lesson/${params.moduleId}/section/${currentModule!.sections[index].id}`);
    setReadingTime(0);
  };

  const goToQuiz = () => {
    setLocation(`/quiz/${params.moduleId}`);
  };

  if (!currentModule) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  const currentSection = currentModule.sections[currentSectionIndex];
  const isCompleted = completedSections.has(currentSection.id);
  const progress = ((currentSectionIndex + 1) / currentModule.totalSections) * 100;
  const completedCount = completedSections.size;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl shadow-sm border-b border-emerald-100 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/dashboard')}
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-emerald-200" />
            <div>
              <h1 className="text-xl font-bold text-emerald-700">{currentModule.title}</h1>
              <p className="text-sm text-gray-600">
                Section {currentSectionIndex + 1} of {currentModule.totalSections}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Timer className="w-4 h-4" />
              <span>{formatTime(readingTime)}</span>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-emerald-500 text-white text-xs">
                {user?.displayName?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-emerald-700">Overall Progress</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar - Section Navigation */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm border-emerald-100 sticky top-32">
              <CardHeader>
                <CardTitle className="text-lg text-emerald-700 flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Sections</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentModule.sections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => navigateToSection(index)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        index === currentSectionIndex
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                          : completedSections.has(section.id)
                          ? 'bg-green-50 border-green-200 text-green-700'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate pr-2">{section.title}</div>
                          <div className="text-xs mt-1">Section {index + 1}</div>
                        </div>
                        {completedSections.has(section.id) && (
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Quiz Button */}
                {completedCount === currentModule.totalSections && (
                  <Button
                    onClick={goToQuiz}
                    className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white animate-pulse"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Take Quiz
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Card className="bg-white/90 backdrop-blur-sm border-emerald-100">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-emerald-700 flex items-center space-x-2">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                      {currentSectionIndex + 1}
                    </div>
                    <span>{currentSection.title}</span>
                  </CardTitle>
                  {isCompleted && (
                    <Badge className="bg-green-500 hover:bg-green-600 text-white">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Main Content */}
                <div className="prose prose-emerald max-w-none">
                  <div className="text-lg leading-relaxed text-gray-700">
                    {currentSection.content}
                  </div>
                </div>

                {/* Image Placeholder */}
                {currentSection.imageDescription && (
                  <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl p-8 text-center border-2 border-dashed border-emerald-300">
                    <div className="text-4xl mb-3">🌍</div>
                    <p className="text-sm text-emerald-700 font-medium">
                      Image: {currentSection.imageDescription}
                    </p>
                  </div>
                )}

                {/* Fun Fact */}
                {currentSection.funFact && (
                  <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Lightbulb className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-yellow-800 mb-1">Fun Fact!</h4>
                          <p className="text-yellow-700">{currentSection.funFact}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Example */}
                {currentSection.example && (
                  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Target className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-blue-800 mb-1">Example</h4>
                          <p className="text-blue-700">{currentSection.example}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Learn More */}
                {currentSection.learnMore && (
                  <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                    <CardContent className="p-4">
                      <a
                        href={currentSection.learnMore.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 text-purple-700 hover:text-purple-800 transition-colors"
                      >
                        <ExternalLink className="w-5 h-5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold mb-1">Learn More</h4>
                          <p className="text-sm">{currentSection.learnMore.text}</p>
                        </div>
                      </a>
                    </CardContent>
                  </Card>
                )}

                {/* Section Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (currentSectionIndex > 0) {
                        navigateToSection(currentSectionIndex - 1);
                      }
                    }}
                    disabled={currentSectionIndex === 0}
                    className="border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex items-center space-x-3">
                    {!isCompleted && (
                      <Button
                        onClick={() => handleSectionComplete(currentSection.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Complete
                      </Button>
                    )}

                    <Button
                      onClick={() => {
                        if (currentSectionIndex < currentModule.sections.length - 1) {
                          navigateToSection(currentSectionIndex + 1);
                        } else if (completedCount === currentModule.totalSections) {
                          goToQuiz();
                        }
                      }}
                      disabled={currentSectionIndex === currentModule.sections.length - 1 && completedCount < currentModule.totalSections}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {currentSectionIndex === currentModule.sections.length - 1 ? (
                        <>
                          <Trophy className="w-4 h-4 mr-2" />
                          Take Quiz
                        </>
                      ) : (
                        <>
                          Next
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}