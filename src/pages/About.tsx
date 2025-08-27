import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Play, Users, Globe, Heart } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Play,
      title: "Free Entertainment",
      description: "We believe great entertainment should be accessible to everyone, which is why VYB Cinema is completely free with ads."
    },
    {
      icon: Users,
      title: "Community First",
      description: "Built for viewers by viewers. Our platform prioritizes user experience and community feedback in every decision."
    },
    {
      icon: Globe,
      title: "Global Content",
      description: "Discover films and series from around the world, showcasing diverse stories and perspectives."
    },
    {
      icon: Heart,
      title: "Supporting Creators",
      description: "Our ad-supported model helps fund independent filmmakers and content creators worldwide."
    }
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Founder",
      bio: "Former Netflix executive passionate about making entertainment accessible worldwide."
    },
    {
      name: "Marcus Johnson",
      role: "CTO",
      bio: "Tech veteran focused on building scalable streaming infrastructure."
    },
    {
      name: "Elena Rodriguez",
      role: "Head of Content",
      bio: "Film industry expert curating diverse, high-quality entertainment."
    }
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
                <span className="text-cinema-gradient">About</span>
                <br />
                <span className="text-foreground">VYB Cinema</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                We're building the future of free streaming - where premium entertainment 
                meets accessibility through smart advertising.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                VYB Cinema exists to democratize entertainment. We believe that great movies, 
                series, and documentaries shouldn't be locked behind expensive subscription walls. 
                Through our innovative ad-supported model, we're making premium content accessible 
                to everyone while supporting creators and filmmakers worldwide.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Values
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do
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

        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Meet the Team
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The passionate people building VYB Cinema
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {team.map((member, index) => (
                <div
                  key={member.name}
                  className="cinema-card p-6 text-center space-y-4 animate-fade-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center text-2xl text-white font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium mb-2">
                      {member.role}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.bio}
                    </p>
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
                Get in Touch
              </h2>
              <p className="text-muted-foreground">
                Have questions or feedback? We'd love to hear from you.
              </p>
              <div className="space-y-4">
                <p className="text-foreground">
                  <strong>Email:</strong> hello@vybcinema.com
                </p>
                <p className="text-foreground">
                  <strong>Support:</strong> support@vybcinema.com
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