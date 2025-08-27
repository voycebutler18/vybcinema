import { Button } from "@/components/ui/button";
import { Check, Play, Zap } from "lucide-react";

export const FreePlatformSection = () => {
  const freeFeatures = [
    "Unlimited streaming",
    "HD quality (up to 1080p)",
    "Stream on any device", 
    "Short ad breaks",
    "No credit card required",
    "No hidden fees ever"
  ];

  const adInfo = [
    {
      title: "Short & Relevant",
      description: "Brief ad breaks that don't interrupt your viewing experience",
      icon: Zap
    },
    {
      title: "Support Creators", 
      description: "Ads help us bring you free content and support filmmakers",
      icon: Play
    }
  ];

  return (
    <section className="py-16 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-cinema-gradient">
            Always Free
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            No subscriptions, no credit cards, no catch. Just great entertainment with ads.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="cinema-card p-8 ring-2 ring-primary shadow-cinema">
            <div className="text-center mb-6">
              <div className="inline-flex items-center px-3 py-1 bg-gradient-primary rounded-full text-sm font-bold text-white mb-4">
                100% Free
              </div>
              <h3 className="text-3xl font-bold text-cinema-gradient mb-2">
                $0
              </h3>
              <p className="text-muted-foreground">Forever and always</p>
            </div>

            <ul className="space-y-3 mb-8">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button className="btn-hero w-full">
              Start Watching Free
            </Button>
          </div>

          {/* Ad Information */}
          <div className="space-y-6">
            <div className="cinema-card p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">
                How Ads Work
              </h3>
              <div className="space-y-4">
                {adInfo.map((info) => (
                  <div key={info.title} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {info.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {info.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="cinema-card p-6 bg-primary/5 border-primary/20">
              <div className="text-center space-y-3">
                <div className="text-2xl">🎯</div>
                <h4 className="font-bold text-foreground">Smart Advertising</h4>
                <p className="text-sm text-muted-foreground">
                  We show relevant ads that match your interests, making them less intrusive and more useful.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12 space-y-4">
          <p className="text-sm text-muted-foreground">
            Questions about our free model? Contact our support team.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span>✓ No credit card needed</span>
            <span>✓ No subscriptions</span>
            <span>✓ HD streaming quality</span>
            <span>✓ Multi-device support</span>
          </div>
        </div>
      </div>
    </section>
  );
};