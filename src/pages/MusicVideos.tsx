import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Music, Video, Play } from "lucide-react";

const MusicVideos = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-8">
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="text-cinema-gradient">Music Videos</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Where R&B vocals meet cinematic visuals
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              
              {/* Upload Section */}
              <div className="cinema-card p-8 text-center">
                <Music className="h-16 w-16 mx-auto text-primary mb-6" />
                <h2 className="text-3xl font-bold text-foreground mb-4">Share Your Music Videos</h2>
                <p className="text-muted-foreground mb-6">
                  Upload your music videos and reach a wider audience on VYB Cinema
                </p>
                <button className="btn-hero">
                  Upload Music Video
                </button>
              </div>

              {/* Featured Music Videos */}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Featured Music Videos</h2>
                <div className="cinema-card p-12 text-center">
                  <Video className="h-24 w-24 mx-auto text-primary/50 mb-6" />
                  <h3 className="text-2xl font-bold text-foreground mb-4">Coming Soon</h3>
                  <p className="text-muted-foreground mb-8">
                    Music videos from talented artists will be featured here. Be the first to upload yours!
                  </p>
                  <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="cinema-card p-6 opacity-50">
                      <div className="aspect-video bg-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                        <Play className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <h4 className="font-semibold text-foreground">Music Video 1</h4>
                      <p className="text-sm text-muted-foreground">Coming Soon</p>
                    </div>
                    <div className="cinema-card p-6 opacity-50">
                      <div className="aspect-video bg-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                        <Play className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <h4 className="font-semibold text-foreground">Music Video 2</h4>
                      <p className="text-sm text-muted-foreground">Coming Soon</p>
                    </div>
                    <div className="cinema-card p-6 opacity-50">
                      <div className="aspect-video bg-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                        <Play className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <h4 className="font-semibold text-foreground">Music Video 3</h4>
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

export default MusicVideos;