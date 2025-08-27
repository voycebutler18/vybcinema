import { Play, Download, Tv, Smartphone, Tablet, Monitor } from "lucide-react";

export const FeatureSection = () => {
  const features = [
    {
      icon: Play,
      title: "4K Ultra HD Streaming",
      description: "Experience cinema-quality visuals with crisp 4K resolution and HDR support for the ultimate viewing experience."
    },
    {
      icon: Download,
      title: "Download & Watch Offline",
      description: "Download your favorite content and watch anywhere, anytime - even without an internet connection."
    },
    {
      icon: Tv,
      title: "Multi-Device Streaming",
      description: "Stream seamlessly across all your devices - Smart TV, laptop, tablet, and smartphone."
    }
  ];

  const devices = [
    { icon: Tv, name: "Smart TV" },
    { icon: Monitor, name: "Computer" },
    { icon: Tablet, name: "Tablet" },
    { icon: Smartphone, name: "Mobile" }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Features Grid */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-cinema-gradient">
            Premium Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built for the ultimate streaming experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="cinema-card p-8 text-center space-y-4 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Devices Section */}
        <div className="cinema-card p-12 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-8">
            Stream on Any Device
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {devices.map((device, index) => (
              <div
                key={device.name}
                className="space-y-4 hover-scale animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-20 h-20 mx-auto bg-secondary/50 rounded-2xl flex items-center justify-center border border-border/50">
                  <device.icon className="h-10 w-10 text-primary" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {device.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};