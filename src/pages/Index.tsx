// src/pages/Index.tsx
import Navigation from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* soft neon backdrop */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-gradient-mesh opacity-60" />

      {/* floaty orbs */}
      <span className="pointer-events-none absolute -top-6 left-6 h-5 w-5 rounded-full bg-primary/30 animate-float" />
      <span
        className="pointer-events-none absolute top-24 right-16 h-7 w-7 rounded-full bg-accent/25 animate-float"
        style={{ animationDelay: "1.4s" }}
      />
      <span
        className="pointer-events-none absolute bottom-28 left-1/5 h-4 w-4 rounded-full bg-cinema-gold/40 animate-float"
        style={{ animationDelay: "2.8s" }}
      />

      <Navigation />

      <main className="relative z-10 pt-20">
        <HeroSection />
        {/* Add more sections later only when their files exist */}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
