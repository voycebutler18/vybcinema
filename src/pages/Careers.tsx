import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Briefcase, Heart, TrendingUp } from "lucide-react";

const Careers = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-8">
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="text-cinema-gradient">Join VYB Cinema</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Help us build the future of free streaming and authentic storytelling
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="cinema-card p-8 text-center">
                <Briefcase className="h-16 w-16 mx-auto text-primary mb-6" />
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Building Our Team
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  VYB Cinema is currently a solo operation led by founder Peter Butler (Voyce Butler). 
                  As we grow our platform and content library, we'll be looking for passionate individuals 
                  who share our vision of making authentic entertainment accessible to everyone.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="cinema-card p-6 text-center space-y-4">
                  <Heart className="h-12 w-12 mx-auto text-primary" />
                  <h3 className="text-xl font-bold text-foreground">Our Values</h3>
                  <p className="text-muted-foreground">
                    Authentic storytelling, community connection, and accessibility for all
                  </p>
                </div>
                <div className="cinema-card p-6 text-center space-y-4">
                  <TrendingUp className="h-12 w-12 mx-auto text-primary" />
                  <h3 className="text-xl font-bold text-foreground">Growth Mindset</h3>
                  <p className="text-muted-foreground">
                    Always learning, always improving, always putting artists and audiences first
                  </p>
                </div>
                <div className="cinema-card p-6 text-center space-y-4">
                  <Briefcase className="h-12 w-12 mx-auto text-primary" />
                  <h3 className="text-xl font-bold text-foreground">Real Impact</h3>
                  <p className="text-muted-foreground">
                    Building something meaningful that connects creators with their communities
                  </p>
                </div>
              </div>

              <div className="cinema-card p-8 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Future Opportunities
                </h3>
                <p className="text-muted-foreground mb-6">
                  While we're not hiring right now, we're always interested in connecting with 
                  talented people who share our mission. Future roles may include:
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Content Curation Specialists</li>
                    <li>• Community Managers</li>
                    <li>• Video Editors</li>
                    <li>• Marketing Coordinators</li>
                  </ul>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Software Developers</li>
                    <li>• UX/UI Designers</li>
                    <li>• Partnership Managers</li>
                    <li>• Customer Support</li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-cinema-gradient mb-4">
                  Interested in Our Mission?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Send us your info and we'll keep you in mind as we grow
                </p>
                <a 
                  href="mailto:voycebutler@vybcinema.com"
                  className="inline-flex items-center px-6 py-3 bg-gradient-primary text-white rounded-lg hover:scale-105 transition-transform"
                >
                  voycebutler@vybcinema.com
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Careers;