import { Sparkles, Trash2, Users, Star } from "lucide-react";

export function StatsSection() {
  const stats = [
    {
      icon: Sparkles,
      value: "12,847",
      label: "Trees Planted",
      gradient: "from-green-400 to-emerald-500"
    },
    {
      icon: Trash2,
      value: "45,632",
      label: "lbs Waste Reduced",
      gradient: "from-blue-400 to-cyan-500"
    },
    {
      icon: Users,
      value: "89,245",
      label: "Active Students", 
      gradient: "from-purple-400 to-pink-500"
    },
    {
      icon: Star,
      value: "234,891",
      label: "Badges Earned",
      gradient: "from-yellow-400 to-orange-500"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Measuring Our <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Environmental Impact</span>
          </h2>
          <p className="text-muted-foreground text-lg">Real numbers, real change, real future</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center p-6 bg-card rounded-2xl shadow-lg border border-border eco-card">
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.gradient} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2" data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}>
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
