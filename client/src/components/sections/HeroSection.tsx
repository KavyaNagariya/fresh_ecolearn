import { Button } from "@/components/ui/button";
import { Zap, Lightbulb, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-accent/10">
      {/* Enhanced Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-animation absolute top-20 left-10 w-4 h-4 bg-primary/30 rounded-full glow-pulse"></div>
        <div className="floating-animation absolute top-40 right-20 w-6 h-6 bg-accent/30 rounded-full sparkle" style={{animationDelay: "0.5s"}}></div>
        <div className="floating-animation absolute bottom-40 left-20 w-3 h-3 bg-secondary/30 rounded-full wiggle" style={{animationDelay: "1s"}}></div>
        <div className="floating-animation absolute bottom-20 right-10 w-5 h-5 bg-primary/30 rounded-full pulse-grow" style={{animationDelay: "1.5s"}}></div>
        <div className="floating-animation absolute top-1/3 left-1/4 w-2 h-2 bg-yellow-400/40 rounded-full sparkle" style={{animationDelay: "2s"}}></div>
        <div className="floating-animation absolute top-3/4 right-1/3 w-3 h-3 bg-green-400/40 rounded-full glow-pulse" style={{animationDelay: "2.5s"}}></div>
      </div>
      
      {/* Enhanced Background 3D Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-gradient-to-r from-secondary/30 to-primary/30 rounded-full blur-3xl floating-animation" style={{animationDelay: "1s"}}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-r from-accent/20 to-secondary/20 rounded-full blur-3xl pulse-grow" style={{animationDelay: "0.5s"}}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="text-center lg:text-left fade-in-left">
            <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-6 slide-up">
              <Sparkles className="w-4 h-4 text-primary sparkle" />
              <span className="text-primary font-medium text-sm">Smart India Hackathon 2025</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight scale-in">
              <span className="text-shimmer">
                Gamifying Environmental Education
              </span>
              <br />
              <span className="text-foreground slide-up-delayed">for a Greener Future</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 fade-in-left" style={{animationDelay: "0.4s"}}>
              Motivate students to adopt eco-friendly habits through interactive lessons, real-world challenges, and school competitions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start fade-in-left" style={{animationDelay: "0.6s"}}>
              <Button 
                className="morphing-gradient text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:scale-110 transition-all duration-500 flex items-center justify-center space-x-2 glow-pulse"
                data-testid="button-get-started"
              >
                <Zap className="w-5 h-5 wiggle" />
                <span>Get Started</span>
              </Button>
              <Button 
                variant="outline"
                className="gradient-border border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-500 flex items-center justify-center space-x-2 hover:scale-105"
                data-testid="button-learn-more"
              >
                <Lightbulb className="w-5 h-5 sparkle" />
                <span>Learn More</span>
              </Button>
            </div>
          </div>

          {/* Enhanced Hero Image */}
          <div className="relative fade-in-right">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl eco-card">
              <img 
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Students engaging in environmental education with digital technology" 
                className="w-full h-auto rounded-2xl" 
              />
              
              {/* Enhanced Overlay Elements */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-accent/10 rounded-2xl"></div>
              
              {/* Enhanced Floating Gamification Elements */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl floating-animation glow-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center sparkle">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-lg font-bold text-foreground">+150 XP</span>
                    <div className="text-xs text-muted-foreground">Level Up!</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl floating-animation scale-in" style={{animationDelay: "1s"}}>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center wiggle">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-foreground">Challenge Complete!</span>
                    <div className="text-xs text-primary">🌱 Plant a Tree</div>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl floating-animation rotate-in" style={{animationDelay: "0.5s"}}>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center sparkle">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">Eco Badge</div>
                    <div className="text-xs text-green-600">Earned!</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced 3D Visual Effect */}
            <div className="absolute -top-10 -right-10 w-32 h-32 opacity-40 pointer-events-none">
              <div className="w-full h-full bg-gradient-to-br from-primary to-accent rounded-full blur-xl floating-animation glow-pulse">
                <div className="absolute inset-4 bg-gradient-to-tr from-accent to-secondary rounded-full blur-lg sparkle"></div>
                <div className="absolute inset-8 bg-gradient-to-bl from-secondary to-primary rounded-full blur-md wiggle"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="scroll-indicator w-6 h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
