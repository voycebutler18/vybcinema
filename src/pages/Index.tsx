// src/pages/Index.tsx
import React from "react";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import HeroSection from "@/components/HeroSection";

// ---- Minimal, safe console filtering (won't hide real errors) ----
if (typeof window !== "undefined") {
  const originalError = console.error.bind(console);
  console.error = (...args: any[]) => {
    const text = args
      .map((a) => (typeof a === "string" ? a : a?.message ?? ""))
      .join(" ");

    // Only ignore obvious extension noise; let everything else through
    if (text.includes("ws://localhost:8098")) return;
    originalError(...args);
  };
}

// ---- Error Boundary so render errors show a screen instead of a blank page ----
class PageErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any) {
    // still log to console – we didn't hide real errors
    // eslint-disable-next-line no-console
    console.error(error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-muted-foreground mb-4">
              The home page failed to render. Check the console for details.
            </p>
            <button
              onClick={() => location.reload()}
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-16">
        {/* If HeroSection renders fine, you’ll see your main hero.
            If not, the error boundary will show the message above instead of a blank page. */}
        <HeroSection />
      </main>

      <Footer />
    </div>
  );
};

export default function IndexPage() {
  return (
    <PageErrorBoundary>
      <Index />
    </PageErrorBoundary>
  );
}
