import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Download, Mail, Users, Calendar } from "lucide-react";

const Press = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-8">
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="text-cinema-gradient">Press Kit</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Media resources and information about VYB Cinema and founder Peter Butler
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              
              {/* Company Overview */}
              <div className="cinema-card p-8">
                <h2 className="text-3xl font-bold text-foreground mb-6">Company Overview</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">VYB Cinema</strong> is a free, ad-supported streaming platform 
                    founded by Chicago-born artist Peter Butler (known as Voyce Butler). The platform focuses on 
                    authentic storytelling and making premium entertainment accessible to everyone.
                  </p>
                  <p>
                    Founded with the mission to democratize entertainment, VYB Cinema represents a new model where 
                    great content doesn't require expensive subscriptions, supporting both creators and audiences 
                    through innovative advertising partnerships.
                  </p>
                </div>
              </div>

              {/* Founder Bio */}
              <div className="cinema-card p-8">
                <h2 className="text-3xl font-bold text-foreground mb-6">Founder Biography</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Peter Butler</strong>, professionally known as 
                    <strong className="text-foreground"> Voyce Butler</strong>, is a singer, actor, and writer 
                    who tells honest stories through R&B vocals, film-style content, and live performance.
                  </p>
                  <p>
                    Born in Chicago, Butler carries that city's grit and heart into everything he creates. 
                    His music catalog includes heartfelt records like "Done," "Touching You," "Loveless," 
                    "Lies," and "Gone," available on Apple Music and Spotify.
                  </p>
                  <p>
                    Through character-driven content shared daily across TikTok, YouTube, Instagram, and Facebook, 
                    Butler has built a dedicated community around authentic storytelling that blends real life 
                    with cinematic energy.
                  </p>
                </div>
              </div>

              {/* Key Facts */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="cinema-card p-6">
                  <Calendar className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-3">Key Facts</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>• <strong>Founded:</strong> 2024</li>
                    <li>• <strong>Founder:</strong> Peter Butler (Voyce Butler)</li>
                    <li>• <strong>Headquarters:</strong> Chicago-based</li>
                    <li>• <strong>Model:</strong> Free, ad-supported streaming</li>
                    <li>• <strong>Focus:</strong> Authentic storytelling</li>
                  </ul>
                </div>
                
                <div className="cinema-card p-6">
                  <Users className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-3">Platform Presence</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>• <strong>Music:</strong> Apple Music, Spotify</li>
                    <li>• <strong>Video:</strong> TikTok, YouTube</li>
                    <li>• <strong>Social:</strong> Instagram, Facebook</li>
                    <li>• <strong>Content:</strong> Daily uploads</li>
                    <li>• <strong>Community:</strong> Growing fanbase</li>
                  </ul>
                </div>
              </div>

              {/* Press Inquiries */}
              <div className="cinema-card p-8 text-center">
                <Mail className="h-16 w-16 mx-auto text-primary mb-6" />
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Press Inquiries
                </h2>
                <p className="text-muted-foreground mb-6">
                  For interviews, press releases, or media partnerships
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="text-foreground font-semibold">Media Contact:</p>
                    <a 
                      href="mailto:voycebutler@vybcinema.com"
                      className="text-primary hover:underline"
                    >
                      voycebutler@vybcinema.com
                    </a>
                  </div>
                  <div>
                    <p className="text-foreground font-semibold">General Inquiries:</p>
                    <a 
                      href="mailto:voycebutler@vybcinema.com"
                      className="text-primary hover:underline"
                    >
                      voycebutler@vybcinema.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Download Assets */}
              <div className="cinema-card p-8 text-center">
                <Download className="h-16 w-16 mx-auto text-primary mb-6" />
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Press Assets
                </h2>
                <p className="text-muted-foreground mb-6">
                  High-resolution logos, photos, and brand assets coming soon
                </p>
                <p className="text-sm text-muted-foreground">
                  For immediate asset needs, please contact our press team
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Press;