import { Button } from "@/components/ui/button";
import { Bell, Film, Star, Calendar } from "lucide-react";

export const ComingSoonSection = () => {
  const highlights = [
    {
      icon: Film,
      title: "Exclusive Premieres",
      description: "Be first to watch exclusive films and series before anyone else"
    },
    {
      icon: Star,
      title: "Award-Winning Content", 
      description: "Curated collection of critically acclaimed and award-winning productions"
    },
    {
      icon: Calendar,
      title: "Weekly Releases",
      description: "Fresh content added weekly with new movies, series, and documentaries"
    }
  ];

  return (
    <section className="py-16 bg-gradient-hero">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Announcement */}
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary-glow">
              🚀 Coming Soon
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold">
              <span className="text-cinema-gradient text-cinema-glow">
                Content Library
              </span>
              <br />
              <span className="text-foreground">
                Loading Soon
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We're curating an incredible collection of premium films, series, and documentaries. 
              Get notified when we launch with exclusive early access.
            </p>
          </div>

          {/* Notification Signup */}
          <div className="cinema-card p-8 max-w-2xl mx-auto animate-scale-in">
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Bell className="h-5 w-5" />
                <span className="font-semibold">Get Early Access</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email for early access"
                  className="flex-1 px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                />
                <Button className="btn-hero px-8 py-3">
                  Notify Me
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Be the first to know when our content library goes live. No spam, unsubscribe anytime.
              </p>
            </div>
          </div>

          {/* Content Highlights */}
          <div className="grid md:grid-cols-3 gap-6 pt-8">
            {highlights.map((item, index) => (
              <div
                key={item.title}
                className="space-y-4 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="pt-8">
            <div className="cinema-card p-6 max-w-md mx-auto">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Content Curation</span>
                  <span className="text-primary font-medium">75%</span>
                </div>
                <div className="w-full bg-secondary/50 rounded-full h-2">
                  <div className="bg-gradient-primary h-2 rounded-full w-3/4 animate-glow-pulse"></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Platform launching soon with premium content
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};