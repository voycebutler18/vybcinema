import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Film, Play } from "lucide-react";

const Movies = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-8">
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="text-cinema-gradient">Movies</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Independent films and cinematic experiences
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto text-center">
              <div className="cinema-card p-12">
                <Film className="h-24 w-24 mx-auto text-primary/50 mb-6" />
                <h2 className="text-3xl font-bold text-foreground mb-6">Movie Library Coming Soon</h2>
                <p className="text-muted-foreground mb-8">
                  Independent films and cinematic experiences will be featured here. Upload yours today!
                </p>
                <div className="text-center mb-8">
                  <button className="btn-hero">
                    Upload Movie
                  </button>
                </div>
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="cinema-card p-6 opacity-50">
                    <div className="aspect-video bg-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                      <Play className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h4 className="font-semibold text-foreground">Movie 1</h4>
                    <p className="text-sm text-muted-foreground">Coming Soon</p>
                  </div>
                  <div className="cinema-card p-6 opacity-50">
                    <div className="aspect-video bg-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                      <Play className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h4 className="font-semibold text-foreground">Movie 2</h4>
                    <p className="text-sm text-muted-foreground">Coming Soon</p>
                  </div>
                  <div className="cinema-card p-6 opacity-50">
                    <div className="aspect-video bg-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                      <Play className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h4 className="font-semibold text-foreground">Movie 3</h4>
                    <p className="text-sm text-muted-foreground">Coming Soon</p>
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

export default Movies;