import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { FeatureSection } from "@/components/FeatureSection";
import { ComingSoonSection } from "@/components/ComingSoonSection";
import { StatsSection } from "@/components/StatsSection";
import { FreePlatformSection } from "@/components/FreePlatformSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <HeroSection />
        <FeatureSection />
        <StatsSection />
        <ComingSoonSection />
        <FreePlatformSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;