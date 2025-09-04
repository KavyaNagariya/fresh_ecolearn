import { Lightbulb, Star, Camera, BarChart3, Globe, Users } from "lucide-react";

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
        {/* Enhanced Section Header */}
        <div className="text-center mb-16 slide-up">
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-6 scale-in">
            <div className="w-3 h-3 bg-primary rounded-full sparkle"></div>
            <span className="text-primary font-medium text-sm">Platform Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 slide-up-delayed">
            <span className="text-shimmer">
              Revolutionary Features
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto fade-in-left" style={{animationDelay: "0.4s"}}>
            Transform environmental education through engaging gameplay, real-world challenges, and collaborative learning experiences.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const animationClass = index % 3 === 0 ? 'fade-in-left' : index % 3 === 1 ? 'slide-up' : 'fade-in-right';
            const animationDelay = `${(index * 0.1)}s`;
            
            return (
              <div key={index} className={`eco-card bg-card rounded-2xl p-8 shadow-lg border border-border ${animationClass}`} style={{animationDelay}}>
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 glow-pulse`}>
                  <Icon className="w-8 h-8 text-white sparkle" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">{feature.title}</h3>
                <p className="text-muted-foreground mb-6">{feature.description}</p>
                
                {/* Feature-specific content */}
                {feature.action && !feature.badges && (
                  <div className="flex items-center text-sm text-primary font-medium">
                    <span>{feature.action}</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
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

        {/* Enhanced Demo Screenshots Section */}
        <div className="morphing-gradient rounded-3xl p-8 md:p-12 scale-in" style={{animationDelay: "0.8s"}}>
          <div className="text-center mb-12 slide-up">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">See EcoLearn in Action</h3>
            <p className="text-white/90">Experience the platform through our interactive demo interface</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Lesson Module Demo */}
            <div className="bg-card rounded-2xl shadow-xl overflow-hidden eco-card fade-in-left" style={{animationDelay: "1s"}}>
              <div className="p-4 morphing-gradient">
                <h4 className="font-semibold text-white text-sm sparkle">Interactive Lesson Module</h4>
              </div>
              <img 
                src="https://pixabay.com/get/g9433fe3833c77ba337928673e1feab47e04fe36ffd7d66b3b07848332446c06dc904edc36a7284365be38308303b56f6c0bcd5966de8f66b72eeeb179241f0bc_1280.jpg" 
                alt="Interactive environmental education lesson interface on tablet" 
                className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500" 
              />
              <div className="p-4">
                <p className="text-sm text-muted-foreground">Engaging multimedia lessons with progress tracking and instant feedback</p>
              </div>
            </div>

            {/* Badge Collection Demo */}
            <div className="bg-card rounded-2xl shadow-xl overflow-hidden eco-card slide-up" style={{animationDelay: "1.2s"}}>
              <div className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 glow-pulse">
                <h4 className="font-semibold text-white text-sm wiggle">Achievement System</h4>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
                alt="Digital achievement badges and rewards interface design" 
                className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500" 
              />
              <div className="p-4">
                <p className="text-sm text-muted-foreground">Digital badges, eco-points, and achievement celebrations</p>
              </div>
            </div>

            {/* Leaderboard Demo */}
            <div className="bg-card rounded-2xl shadow-xl overflow-hidden eco-card fade-in-right" style={{animationDelay: "1.4s"}}>
              <div className="p-4 bg-gradient-to-r from-purple-500 to-indigo-500 sparkle">
                <h4 className="font-semibold text-white text-sm rotate-in">Live Leaderboard</h4>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
                alt="Competitive leaderboard interface showing school rankings" 
                className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500" 
              />
              <div className="p-4">
                <p className="text-sm text-muted-foreground">Real-time school rankings and competitive challenges</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
