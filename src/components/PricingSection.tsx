import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const PricingSection = () => {
  const plans = [
    {
      name: "Monthly",
      price: "$9.99",
      billing: "per month",
      trial: "30-day free trial",
      features: [
        "Unlimited streaming",
        "4K Ultra HD",
        "Stream on any device",
        "No ads",
        "Download for offline viewing",
        "Cancel anytime"
      ],
      popular: false
    },
    {
      name: "Annual", 
      price: "$99.99",
      billing: "per year",
      trial: "30-day free trial",
      originalPrice: "$119.88",
      savings: "Save $20",
      features: [
        "Everything in Monthly",
        "2 months free",
        "Priority customer support", 
        "Early access to new releases",
        "Exclusive behind-the-scenes content",
        "Director's commentary tracks"
      ],
      popular: true
    }
  ];

  return (
    <section className="py-16 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-cinema-gradient">
            Choose Your Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start with a 30-day free trial. No commitment, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`cinema-card p-8 relative ${
                plan.popular ? "ring-2 ring-primary shadow-cinema" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-primary px-4 py-2 rounded-full text-sm font-bold text-white">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <div className="space-y-1">
                    {plan.originalPrice && (
                      <div className="text-sm text-muted-foreground line-through">
                        {plan.originalPrice}
                      </div>
                    )}
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-bold text-cinema-gradient">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground">
                        {plan.billing}
                      </span>
                    </div>
                    {plan.savings && (
                      <div className="text-sm text-cinema-gold font-medium">
                        {plan.savings}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary-glow">
                    {plan.trial}
                  </div>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${plan.popular ? "btn-hero" : "btn-secondary"}`}
                >
                  Start Free Trial
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  No charges for 30 days. Cancel before trial ends to avoid billing.
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 space-y-4">
          <p className="text-sm text-muted-foreground">
            Questions? Contact our support team anytime.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span>✓ No hidden fees</span>
            <span>✓ Cancel anytime</span>
            <span>✓ HD & 4K quality</span>
            <span>✓ Multi-device streaming</span>
          </div>
        </div>
      </div>
    </section>
  );
};