import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Play, Users, Globe, Heart, Music, Video, Mic } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Authentic Storytelling",
      description: "Every piece of content tells honest stories that connect with real experiences and emotions."
    },
    {
      icon: Music,
      title: "Multi-Platform Artist", 
      description: "From R&B vocals to cinematic content, creating across music, film, and live performance."
    },
    {
      icon: Globe,
      title: "Community Connection",
      description: "Building genuine relationships with audiences through daily content and live interaction."
    },
    {
      icon: Video,
      title: "Cinematic Vision",
      description: "Blending real life with cinematic energy to create character-driven stories and content."
    }
  ];

  const musicCatalog = [
    "Done", "Touching You", "Loveless", "Lies", "Gone"
  ];

  const platforms = [
    { name: "Apple Music", type: "Music" },
    { name: "Spotify", type: "Music" },
    { name: "TikTok", type: "Video Content" },
    { name: "YouTube", type: "Video Content" },
    { name: "Instagram", type: "Social" },
    { name: "Facebook", type: "Social" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-8">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="text-cinema-gradient">Peter Butler</span>
                <br />
                <span className="text-foreground text-2xl md:text-3xl">Known as Voyce Butler</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Singer, Actor, and Writer telling honest stories through R&B vocals, 
                film-style content, and live performance.
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary-glow">
                🎤 CEO & Founder of VYB Cinema
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                My Story
              </h2>
              <div className="cinema-card p-8 text-left space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  I was born in Chicago and I carry that city grit and heart into everything I make. 
                  As a singer, actor, and writer, I believe in telling honest stories that resonate 
                  with real experiences and authentic emotions.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  My music catalog spans heartfelt records like <strong>Done</strong>, <strong>Touching You</strong>, 
                  <strong> Loveless</strong>, <strong>Lies</strong>, and <strong>Gone</strong>. You can find my music 
                  on Apple Music and Spotify, making it accessible wherever you listen.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  On camera, I create character-driven stories and skits that blend real life with 
                  cinematic energy. I share this content daily with my community across TikTok, YouTube, 
                  Instagram, and Facebook.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Off camera, I'm focused on craft, family, and building platforms that give artists 
                  and audiences a real connection. VYB Cinema represents that vision—a place where 
                  authentic storytelling meets accessible entertainment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Music Catalog */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Music Catalog
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Heartfelt R&B records available on all streaming platforms
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="grid gap-4">
                {musicCatalog.map((song, index) => (
                  <div
                    key={song}
                    className="cinema-card p-6 flex items-center space-x-4 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <Music className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">
                        {song}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Available on Apple Music & Spotify
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                What Drives Me
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The principles behind my art and VYB Cinema
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className="cinema-card p-8 space-y-4 animate-fade-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <value.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platforms Section */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Find Me Everywhere
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Daily content and music across all major platforms
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {platforms.map((platform, index) => (
                <div
                  key={platform.name}
                  className="cinema-card p-6 text-center space-y-3 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 mx-auto bg-secondary/50 rounded-2xl flex items-center justify-center">
                    {platform.type === "Music" ? (
                      <Music className="h-8 w-8 text-primary" />
                    ) : platform.type === "Video Content" ? (
                      <Video className="h-8 w-8 text-primary" />
                    ) : (
                      <Globe className="h-8 w-8 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{platform.name}</h3>
                    <p className="text-sm text-muted-foreground">{platform.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-cinema-gradient">
                Connect With Me
              </h2>
              <p className="text-muted-foreground">
                Building real connections with artists and audiences through VYB Cinema
              </p>
              <div className="space-y-4">
                <p className="text-foreground">
                  <strong>Business Inquiries:</strong> <Link to="/contact" className="text-primary hover:underline">Use our contact form</Link>
                </p>
                <p className="text-foreground">
                  <strong>General Contact:</strong> <Link to="/contact" className="text-primary hover:underline">Use our contact form</Link>
                </p>
              </div>
              <div className="pt-4">
                <p className="text-sm text-muted-foreground italic">
                  "Focused on craft, family, and building platforms that give artists and audiences a real connection."
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

export default About;