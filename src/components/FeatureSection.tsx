import { Play, Download, Monitor, Zap, Shield, Crown, Sparkles, Video } from "lucide-react";

export const FeatureSection = () => {
  const features = [
    {
      icon: Crown,
      title: "Ultra Premium Quality",
      description: "Experience content in stunning 4K HDR with Dolby Atmos sound for an immersive cinematic experience.",
      gradient: "from-cinema-gold to-cinema-platinum"
    },
    {
      icon: Zap,
      title: "Lightning Fast Streaming",
      description: "Advanced CDN technology ensures instant loading and buffer-free streaming across all devices.",
      gradient: "from-accent to-accent-glow"
    },
    {
      icon: Monitor,
      title: "Universal Access",
      description: "Seamlessly sync across all your devices with cloud-based profiles and intelligent recommendations.",
      gradient: "from-primary to-primary-glow"
    },
    {
      icon: Download,
      title: "Smart Downloads",
      description: "AI-powered offline downloads with automatic quality optimization for your storage and network.",
      gradient: "from-cinema-emerald to-accent"
    },
    {
      icon: Shield,
      title: "Premium Security",
      description: "Bank-level encryption and privacy protection with zero data tracking or advertising interruptions.",
      gradient: "from-cinema-ruby to-primary"
    },
    {
      icon: Sparkles,
      title: "Exclusive Content",
      description: "Access premium originals, early releases, and exclusive behind-the-scenes content unavailable elsewhere.",
      gradient: "from-primary-glow to-cinema-gold"
    }
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background-elevated to-background"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 animate-reveal">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-glass backdrop-blur-xl border border-border/30 rounded-full shadow-glass mb-6">
            <Video className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm tracking-wide">PREMIUM FEATURES</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-display font-bold mb-6">
            <span className="text-cinema-gradient">Beyond</span> Streaming
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover why VYB Cinema delivers the most advanced entertainment platform, 
            engineered for the ultimate viewing experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.title}
                className="group cinema-card p-8 hover:scale-[1.02] transition-all duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon with Gradient Background */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-cinema-gradient transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Hover Effect Line */}
                <div className="w-0 h-1 bg-gradient-primary group-hover:w-full transition-all duration-500 mt-6 rounded-full"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20 animate-reveal">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-glass backdrop-blur-xl border border-border/30 rounded-full shadow-ultra hover:shadow-glow transition-all duration-300 group cursor-pointer">
            <Play className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
            <span className="font-semibold text-lg">Experience the difference today</span>
          </div>
        </div>
      </div>
    </section>
  );
};