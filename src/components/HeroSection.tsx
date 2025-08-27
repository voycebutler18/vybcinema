import { Button } from "@/components/ui/button";
import { Play, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary-glow">
            🎬 Premium Streaming Experience
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="text-cinema-gradient text-cinema-glow">
              VYB Cinema
            </span>
            <br />
            <span className="text-foreground">
              Unlimited Entertainment
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Completely free streaming with ads. Watch anywhere, anytime.
            <br />
            <span className="text-lg text-primary-glow">Premium content library coming soon</span>
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              className="btn-hero flex items-center gap-2 text-lg px-8 py-4"
              onClick={() => navigate('/movies')}
            >
              <Play className="h-5 w-5" />
              Start watching free
            </Button>
            <Button 
              className="btn-secondary flex items-center gap-2 text-lg px-8 py-4"
              onClick={() => navigate('/about')}
            >
              <Info className="h-5 w-5" />
              Learn more
            </Button>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 max-w-3xl mx-auto">
            <div className="text-center space-y-2">
              <div className="text-2xl">📱</div>
              <div className="font-semibold">Any Device</div>
              <div className="text-sm text-muted-foreground">
                Stream on your phone, tablet, laptop, and TV
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl">📺</div>
              <div className="font-semibold">Completely Free</div>
              <div className="text-sm text-muted-foreground">
                Watch unlimited content with short ad breaks
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl">🌍</div>
              <div className="font-semibold">Global Content</div>
              <div className="text-sm text-muted-foreground">
                Discover films from around the world
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};