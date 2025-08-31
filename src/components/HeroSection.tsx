import { Button } from "@/components/ui/button";
import {
  Play,
  Info,
  Star,
  Sparkles,
  Music,
  Tv,
  BookOpen,
  Trophy,
  Radio,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-gradient-mesh opacity-60" />

      {/* Floaties */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-primary/30 rounded-full animate-float" />
      <div
        className="absolute top-40 right-32 w-6 h-6 bg-accent/20 rounded-full animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-32 left-1/4 w-3 h-3 bg-cinema-gold/40 rounded-full animate-float"
        style={{ animationDelay: "4s" }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-5xl mx-auto space-y-8 animate-reveal">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-glass backdrop-blur-xl border border-border/30 rounded-full shadow-glass">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span className="font-semibold text-sm tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Built for Teens • Ages 13–19
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-[0.95] tracking-tight">
            <span className="text-cinema-gradient text-cinema-glow block">VYB</span>
            <span className="text-premium-gradient block">Cinema</span>
          </h1>

          {/* Subheadline (teen vibe) */}
          <p className="text-lg md:text-2xl text-foreground/85 font-medium leading-relaxed max-w-3xl mx-auto">
            Stream what <span className="font-semibold text-primary">teens create</span>:
            music videos, shows, stories & challenges. No boring stuff—just
            <span className="font-semibold text-accent"> vibes, creativity,</span> and a safe space to shine.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-2">
            <Button
              className="btn-hero text-lg md:text-xl px-10 md:px-12 py-5 md:py-6 font-bold tracking-wide group"
              onClick={() => navigate("/shows")}
            >
              <Play className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              Watch Something Fire
            </Button>

            <Button
              className="btn-glass text-base md:text-lg px-8 md:px-10 py-5 md:py-6 font-semibold group"
              onClick={() => navigate("/create")}
            >
              <Sparkles className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              Start Creating
            </Button>

            <Button
              variant="outline"
              className="text-base md:text-lg px-8 md:px-10 py-5 md:py-6 font-semibold group"
              onClick={() => navigate("/about")}
            >
              <Info className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              What is VYB?
            </Button>
          </div>

          {/* Quick categories */}
          <div className="pt-6">
            <div className="mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 max-w-4xl">
              <Button
                className="btn-glass w-full justify-center gap-2"
                onClick={() => navigate("/music")}
              >
                <Music className="h-4 w-4" />
                Music
              </Button>
              <Button
                className="btn-glass w-full justify-center gap-2"
                onClick={() => navigate("/shows")}
              >
                <Tv className="h-4 w-4" />
                Shows
              </Button>
              <Button
                className="btn-glass w-full justify-center gap-2"
                onClick={() => navigate("/stories")}
              >
                <BookOpen className="h-4 w-4" />
                Stories
              </Button>
              <Button
                className="btn-glass w-full justify-center gap-2"
                onClick={() => navigate("/talent")}
              >
                <Sparkles className="h-4 w-4" />
                Talent
              </Button>
              <Button
                className="btn-glass w-full justify-center gap-2"
                onClick={() => navigate("/challenges")}
              >
                <Trophy className="h-4 w-4" />
                Challenges
              </Button>
              <Button
                className="btn-glass w-full justify-center gap-2"
                onClick={() => navigate("/live")}
              >
                <Radio className="h-4 w-4" />
                Live
              </Button>
            </div>
          </div>

          {/* Stats / social proof */}
          <div className="flex flex-wrap justify-center gap-8 py-6">
            <div className="text-center group">
              <div className="text-3xl font-bold text-cinema-gradient group-hover:scale-110 transition-transform duration-300">
                10K+
              </div>
              <div className="text-sm text-muted-foreground font-medium">Teen-Made Videos</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-cinema-gradient group-hover:scale-110 transition-transform duration-300">
                4K
              </div>
              <div className="text-sm text-muted-foreground font-medium">Ultra HD Quality</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-cinema-gradient group-hover:scale-110 transition-transform duration-300">
                ∞
              </div>
              <div className="text-sm text-muted-foreground font-medium">Free. No Ads.</div>
            </div>
          </div>

          {/* Trust line */}
          <div className="pt-6 flex flex-wrap justify-center items-center gap-6 opacity-80">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-cinema-gold text-cinema-gold" />
              <span className="text-sm font-medium">Safe for Teens</span>
            </div>
            <div className="text-sm font-medium">Zero Toxicity • Positive Vibes • Be Kind</div>
            <div className="text-sm border border-border/30 px-4 py-2 rounded-full bg-card/30 backdrop-blur-sm">
              100% Free Forever
            </div>
          </div>
        </div>
      </div>

      {/* Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
