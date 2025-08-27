import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Tv, Play, Upload } from "lucide-react";

const TVShows = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-8">
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="text-cinema-gradient">TV Shows</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Episodic content and serialized storytelling
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              
              {/* Upload Section */}
              <div className="cinema-card p-8 text-center">
                <Upload className="h-16 w-16 mx-auto text-primary mb-6" />
                <h2 className="text-3xl font-bold text-foreground mb-4">Upload Your TV Show</h2>
                <p className="text-muted-foreground mb-6">
                  Share your episodic content, web series, and serialized stories
                </p>
                <button className="btn-hero">
                  Upload TV Show
                </button>
              </div>

              {/* Featured TV Shows */}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Featured TV Shows</h2>
                <div className="cinema-card p-12 text-center">
                  <Tv className="h-24 w-24 mx-auto text-primary/50 mb-6" />
                  <h3 className="text-2xl font-bold text-foreground mb-4">Coming Soon</h3>
                  <p className="text-muted-foreground mb-8">
                    Original TV shows and episodic content will be featured here. Upload your series today!
                  </p>
                  <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="cinema-card p-6 opacity-50">
                      <div className="aspect-video bg-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                        <Play className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <h4 className="font-semibold text-foreground">TV Show 1</h4>
                      <p className="text-sm text-muted-foreground">Coming Soon</p>
                    </div>
                    <div className="cinema-card p-6 opacity-50">
                      <div className="aspect-video bg-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                        <Play className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <h4 className="font-semibold text-foreground">TV Show 2</h4>
                      <p className="text-sm text-muted-foreground">Coming Soon</p>
                    </div>
                    <div className="cinema-card p-6 opacity-50">
                      <div className="aspect-video bg-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                        <Play className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <h4 className="font-semibold text-foreground">TV Show 3</h4>
                      <p className="text-sm text-muted-foreground">Coming Soon</p>
                    </div>
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

export default TVShows;