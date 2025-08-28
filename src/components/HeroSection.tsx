import { Button } from "@/components/ui/button";
import { Play, Info, Star, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Ultra Premium Background */}
      <div className="absolute inset-0 bg-gradient-hero"></div>
      <div className="absolute inset-0 bg-gradient-mesh opacity-60"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-primary/30 rounded-full animate-float"></div>
      <div className="absolute top-40 right-32 w-6 h-6 bg-accent/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-cinema-gold/40 rounded-full animate-float" style={{animationDelay: '4s'}}></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-reveal">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-glass backdrop-blur-xl border border-border/30 rounded-full shadow-glass">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span className="font-semibold text-sm tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ULTRA PREMIUM EXPERIENCE
            </span>
          </div>
           
          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl font-display font-bold leading-[0.9] tracking-tight">
            <span className="text-cinema-gradient text-cinema-glow">
              VYB
            </span>
            <br />
            <span className="text-premium-gradient">Cinema</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-foreground/80 font-medium leading-relaxed max-w-3xl mx-auto">
            Experience entertainment like never before. Premium streaming that goes beyond expectations with 
            <span className="text-primary font-semibold"> ultra-quality content</span> and 
            <span className="text-accent font-semibold"> immersive experiences</span>.
          </p>

          {/* Premium Stats */}
          <div className="flex flex-wrap justify-center gap-8 py-6">
            <div className="text-center group">
              <div className="text-3xl font-bold text-cinema-gradient group-hover:scale-110 transition-transform duration-300">10K+</div>
              <div className="text-sm text-muted-foreground font-medium">Premium Content</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-cinema-gradient group-hover:scale-110 transition-transform duration-300">4K</div>
              <div className="text-sm text-muted-foreground font-medium">Ultra HD Quality</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-cinema-gradient group-hover:scale-110 transition-transform duration-300">∞</div>
              <div className="text-sm text-muted-foreground font-medium">Unlimited Access</div>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-4">
            <Button 
              className="btn-hero text-xl px-12 py-6 font-bold tracking-wide group"
              onClick={() => navigate('/movies')}
            >
              <Play className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              Start Premium Experience
            </Button>
            
            <Button 
              className="btn-glass text-lg px-10 py-6 font-semibold group"
              onClick={() => navigate('/about')}
            >
              <Info className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              Discover More
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12 flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-cinema-gold text-cinema-gold" />
              <span className="text-sm font-medium">Premium Quality</span>
            </div>
            <div className="text-sm font-medium">No Ads • No Limits • No Commitment</div>
            <div className="text-sm border border-border/30 px-4 py-2 rounded-full bg-card/30 backdrop-blur-sm">
              30-Day Free Trial
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};