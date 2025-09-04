import { BookOpen, User, Building, Globe } from "lucide-react";

export function StakeholdersSection() {
  const stakeholders = [
    {
      icon: BookOpen,
      title: "Students",
      description: "Gamified learning experiences with badges, challenges, and peer collaboration",
      gradient: "from-primary to-accent"
    },
    {
      icon: User,
      title: "Teachers", 
      description: "Comprehensive analytics, lesson planning tools, and student progress tracking",
      gradient: "from-secondary to-indigo-500"
    },
    {
      icon: Building,
      title: "Schools",
      description: "Institution-wide sustainability tracking and competitive inter-school programs",
      gradient: "from-accent to-teal-500"
    },
    {
      icon: Globe,
      title: "Community",
      description: "Local environmental initiatives, community challenges, and impact measurement",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 slide-up">
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-6 scale-in">
            <div className="w-3 h-3 bg-primary rounded-full sparkle"></div>
            <span className="text-primary font-medium text-sm">For Everyone</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-foreground slide-up-delayed">
            Built for <span className="text-shimmer">Everyone</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto fade-in-left" style={{animationDelay: "0.4s"}}>
            EcoLearn serves diverse stakeholders in the educational ecosystem with tailored experiences for each user group.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stakeholders.map((stakeholder, index) => {
            const Icon = stakeholder.icon;
            const animationClass = index % 2 === 0 ? 'fade-in-left' : 'fade-in-right';
            const animationDelay = `${(index * 0.2)}s`;
            
            return (
              <div key={index} className={`text-center group ${animationClass}`} style={{animationDelay}}>
                <div className={`w-24 h-24 bg-gradient-to-r ${stakeholder.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-125 transition-all duration-500 shadow-xl glow-pulse`}>
                  <Icon className="w-12 h-12 text-white sparkle" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 wiggle" style={{animationDelay: `${0.5 + index * 0.1}s`}}>{stakeholder.title}</h3>
                <p className="text-muted-foreground">{stakeholder.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
