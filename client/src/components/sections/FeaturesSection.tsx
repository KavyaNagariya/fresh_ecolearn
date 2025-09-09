import { Lightbulb, Star, Camera, BarChart3, Globe, Users } from "lucide-react";
import { Link } from "wouter";

export function FeaturesSection() {
  const features = [
    {
      icon: Lightbulb,
      title: "Interactive Lessons & Quizzes",
      description: "Engaging lesson modules with gamified quizzes, progress tracking, and instant feedback to make learning fun and effective.",
      gradient: "from-primary to-accent",
      action: "Start Learning"
    },
    {
      icon: Star,
      title: "Eco-Points & Digital Badges",
      description: "Earn points and unlock achievement badges for completing lessons, participating in challenges, and demonstrating eco-friendly behavior.",
      gradient: "from-yellow-400 to-orange-500",
      action: "+5 badges",
      badges: true
    },
    {
      icon: Camera,
      title: "Photo-Based Challenges",
      description: "Capture and share real environmental actions through photo challenges that connect classroom learning to real-world impact.",
      gradient: "from-accent to-secondary",
      challenge: "Weekly Challenge: Plant a Tree"
    },
    {
      icon: BarChart3,
      title: "Live School Leaderboard",
      description: "Foster healthy competition with real-time leaderboards showcasing top performers, eco-champions, and collaborative achievements.",
      gradient: "from-purple-500 to-indigo-500",
      leaderboard: true
    },
    {
      icon: Users,
      title: "Teacher Analytics Dashboard",
      description: "Comprehensive insights into student progress, engagement metrics, and environmental impact tracking for educators.",
      gradient: "from-indigo-500 to-purple-600",
      stats: true
    },
    {
      icon: Globe,
      title: "Global Impact Tracking",
      description: "Measure and visualize collective environmental impact across schools, creating a sense of global community and shared responsibility.",
      gradient: "from-green-500 to-teal-500",
      impact: true
    }
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-primary font-medium text-sm">Platform Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Revolutionary Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform environmental education through engaging gameplay, real-world challenges, and collaborative learning experiences.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <div key={index} className="eco-card bg-card rounded-xl p-6 shadow-sm border border-border">
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{feature.description}</p>
                
                {/* Feature-specific content */}
                {feature.action && !feature.badges && (
                  <Link href={feature.title === "Interactive Lessons & Quizzes" ? "/signup" : "#"}>
                    <div className="flex items-center text-sm text-primary font-medium cursor-pointer hover:text-primary/80 transition-colors">
                      <span>{feature.action}</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </div>
                  </Link>
                )}
                
                {feature.badges && (
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full border-2 border-white"></div>
                    </div>
                    <span className="text-sm text-primary font-medium">{feature.action}</span>
                  </div>
                )}
                
                {feature.challenge && (
                  <div className="bg-muted/50 rounded-lg p-3 flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{feature.challenge}</span>
                  </div>
                )}
                
                {feature.leaderboard && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white">1</div>
                        <span className="text-sm font-medium">Green Warriors</span>
                      </div>
                      <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">2,847 pts</span>
                    </div>
                    <div className="flex items-center justify-between bg-muted/30 rounded-lg p-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-xs font-bold text-white">2</div>
                        <span className="text-sm font-medium">Eco Rangers</span>
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">2,156 pts</span>
                    </div>
                  </div>
                )}
                
                {feature.stats && (
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">89%</div>
                        <div className="text-xs text-muted-foreground">Completion</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">24</div>
                        <div className="text-xs text-muted-foreground">Active Students</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">156</div>
                        <div className="text-xs text-muted-foreground">Actions Taken</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {feature.impact && (
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-green-600 dark:text-green-400">1,247</div>
                      <div className="text-xs text-muted-foreground">Trees Planted</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">892 lbs</div>
                      <div className="text-xs text-muted-foreground">Waste Reduced</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-purple-600 dark:text-purple-400">45</div>
                      <div className="text-xs text-muted-foreground">Schools</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Demo Screenshots Section */}
        <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">See EcoLearn in Action</h3>
            <p className="text-muted-foreground">Experience the platform through our interactive demo interface</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Lesson Module Demo */}
            <div className="bg-background rounded-xl shadow-sm overflow-hidden border border-border">
              <div className="p-3 bg-primary">
                <h4 className="font-medium text-white text-sm">Interactive Lesson Module</h4>
              </div>
              <img 
                src="/imagestobeused/tabletforlearningmodule.jpg" 
                alt="Interactive environmental education lesson interface on tablet" 
                className="w-full h-40 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden w-full h-40 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="text-2xl mb-1">📊</div>
                  <div className="text-xs">Interactive Lessons</div>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-muted-foreground">Engaging multimedia lessons with progress tracking and instant feedback</p>
              </div>
            </div>

            {/* Badge Collection Demo */}
            <div className="bg-background rounded-xl shadow-sm overflow-hidden border border-border">
              <div className="p-3 bg-accent">
                <h4 className="font-medium text-white text-sm">Achievement System</h4>
              </div>
              <img 
                src="/imagestobeused/achievementforsite.jpg" 
                alt="Digital achievement badges and rewards interface design" 
                className="w-full h-40 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden w-full h-40 bg-gradient-to-br from-accent/10 to-secondary/10 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="text-2xl mb-1">🏆</div>
                  <div className="text-xs">Digital Badges</div>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-muted-foreground">Digital badges, eco-points, and achievement celebrations</p>
              </div>
            </div>

            {/* Leaderboard Demo */}
            <div className="bg-background rounded-xl shadow-sm overflow-hidden border border-border">
              <div className="p-3 bg-secondary">
                <h4 className="font-medium text-white text-sm">Live Leaderboard</h4>
              </div>
              <img 
                src="/imagestobeused/leaderboardforsite.jpeg" 
                alt="Competitive leaderboard interface showing school rankings" 
                className="w-full h-40 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden w-full h-40 bg-gradient-to-br from-secondary/10 to-purple/10 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="text-2xl mb-1">🏅</div>
                  <div className="text-xs">Live Rankings</div>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-muted-foreground">Real-time school rankings and competitive challenges</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
