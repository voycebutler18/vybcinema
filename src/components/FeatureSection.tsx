import { ShieldCheck, Zap, Gamepad2, UsersRound } from "lucide-react";

export const FeatureSection = () => {
  const items = [
    {
      icon: Zap,
      title: "Fast AF",
      text: "Instant plays, low buffering, chill vibes.",
    },
    {
      icon: ShieldCheck,
      title: "Safe Space",
      text: "Community rules & reporting that actually work.",
    },
    {
      icon: Gamepad2,
      title: "Creator Tools",
      text: "Easy uploads, thumbnails, and spotlight picks.",
    },
    {
      icon: UsersRound,
      title: "For Teens",
      text: "Built for 13–19 with modern design + accessibility.",
    },
  ];

  return (
    <section className="py-14 md:py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          What makes VYB hit different
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-black/40 p-5 hover:bg-black/50 transition-colors"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-white/70">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
