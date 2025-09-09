import { Star, Sparkles } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Enhanced About Content */}
          <div className="fade-in-left">
            <div className="inline-block bg-gradient-to-r from-primary/10 to-accent/10 rounded-full px-6 py-2 mb-6 scale-in">
              <span className="text-primary font-semibold text-sm sparkle">Smart India Hackathon 2025</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 slide-up">
              Our Mission: <span className="text-shimmer">Sustainable Education</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed fade-in-left" style={{animationDelay: "0.3s"}}>
              Foster practical environmental literacy and sustainable habits through innovative game mechanics. We believe that when education meets gamification, students don't just learn—they transform into environmental champions.
            </p>
            
            {/* Enhanced Mission Stats */}
            <div className="grid grid-cols-2 gap-6 mb-8 slide-up" style={{animationDelay: "0.5s"}}>
              <div className="text-center p-4 bg-muted/30 rounded-xl eco-card glow-pulse">
                <div className="text-2xl font-bold text-primary mb-1 sparkle">50K+</div>
                <div className="text-sm text-muted-foreground">Students Engaged</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-xl eco-card glow-pulse" style={{animationDelay: "0.1s"}}>
                <div className="text-2xl font-bold text-accent mb-1 wiggle">200+</div>
                <div className="text-sm text-muted-foreground">Schools Partnered</div>
              </div>
            </div>

            <div className="gradient-border bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 fade-in-left" style={{animationDelay: "0.7s"}}>
              <h4 className="font-semibold text-foreground mb-3 flex items-center">
                <Star className="w-5 h-5 text-primary mr-2 sparkle" />
                Hackathon Innovation
              </h4>
              <p className="text-muted-foreground text-sm">
                Developed for Smart India Hackathon 2025, addressing the critical need for engaging environmental education that translates into real-world sustainable practices.
              </p>
            </div>
          </div>

          {/* Enhanced About Image */}
          <div className="relative fade-in-right">
            <img 
              src="/imagestobeused/sustain.jpg" 
              alt="Diverse group of students collaborating on environmental sustainability project" 
              className="rounded-2xl shadow-2xl w-full h-auto eco-card"
              onError={(e) => {
                // Fallback to a solid color background if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden rounded-2xl shadow-2xl w-full h-80 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="text-4xl mb-2">🌱</div>
                <div className="text-sm">Environmental Education Mission</div>
              </div>
            </div>
            
            {/* Overlay Elements */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-2xl"></div>
            
            {/* Floating Impact Metrics */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg floating-animation">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">Mission Impact</div>
                  <div className="text-xs text-muted-foreground">Real change, measurable results</div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg floating-animation" style={{animationDelay: "0.5s"}}>
              <div className="text-center">
                <div className="text-lg font-bold text-primary">98%</div>
                <div className="text-xs text-muted-foreground">Student Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
