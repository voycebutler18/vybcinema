export const StatsSection = () => {
  const stats = [
    {
      number: "4K",
      label: "Ultra HD Quality",
      description: "Crystal clear streaming"
    },
    {
      number: "100%",
      label: "Free Forever",
      description: "No subscriptions ever"
    },
    {
      number: "∞",
      label: "Unlimited Streaming",
      description: "Watch as much as you want"
    },
    {
      number: "24/7",
      label: "Customer Support",
      description: "Always here to help"
    }
  ];

  return (
    <section className="py-16 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center space-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl md:text-5xl font-bold text-cinema-gradient">
                {stat.number}
              </div>
              <div className="font-semibold text-foreground">
                {stat.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};