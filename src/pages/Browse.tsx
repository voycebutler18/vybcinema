import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const Browse = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-8">
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="text-cinema-gradient">Browse Content</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Discover amazing content curated just for you
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto text-center">
              <div className="cinema-card p-12">
                <h2 className="text-3xl font-bold text-foreground mb-6">Content Library Coming Soon</h2>
                <p className="text-muted-foreground mb-8">
                  We're curating an amazing collection of content for you. Stay tuned for the launch!
                </p>
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="cinema-card p-6">
                    <h3 className="text-xl font-bold text-foreground mb-3">Movies</h3>
                    <p className="text-muted-foreground">Independent films and cinematic experiences</p>
                  </div>
                  <div className="cinema-card p-6">
                    <h3 className="text-xl font-bold text-foreground mb-3">Music Videos</h3>
                    <p className="text-muted-foreground">R&B vocals and original music video content</p>
                  </div>
                  <div className="cinema-card p-6">
                    <h3 className="text-xl font-bold text-foreground mb-3">Stories</h3>
                    <p className="text-muted-foreground">Character-driven narratives and skits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Browse;