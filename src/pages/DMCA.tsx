import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Shield, Mail, AlertTriangle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const DMCA = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-8">
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="text-cinema-gradient">DMCA Policy</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Digital Millennium Copyright Act compliance and takedown procedures
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              
              <div className="cinema-card p-8">
                <Shield className="h-16 w-16 text-primary mb-6" />
                <h2 className="text-3xl font-bold text-foreground mb-6">Our Commitment to Copyright</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    VYB Cinema respects the intellectual property rights of others and expects our users to do the same. 
                    We comply with the Digital Millennium Copyright Act (DMCA) and will respond promptly to valid 
                    takedown notices.
                  </p>
                  <p>
                    All content on our platform is either owned by us, properly licensed, or submitted by creators 
                    who warrant they have the rights to share their material.
                  </p>
                </div>
              </div>

              <div className="cinema-card p-8">
                <AlertTriangle className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-6">Filing a DMCA Takedown Notice</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    If you believe your copyrighted work has been used on VYB Cinema without authorization, 
                    you may submit a takedown notice. Your notice must include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>A physical or electronic signature of the copyright owner or authorized agent</li>
                    <li>Identification of the copyrighted work claimed to have been infringed</li>
                    <li>Identification of the material that is claimed to be infringing and its location on our site</li>
                    <li>Your contact information (address, telephone number, email address)</li>
                    <li>A statement that you have a good faith belief that use of the material is not authorized</li>
                    <li>A statement that the information is accurate and you are authorized to act on behalf of the copyright owner</li>
                  </ul>
                </div>
              </div>

              <div className="cinema-card p-8">
                <Mail className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-6">Submit a Takedown Notice</h2>
                <div className="space-y-6">
                  <div className="text-muted-foreground">
                    <p className="mb-4">
                      Send your DMCA takedown notice to our designated copyright agent:
                    </p>
                    <div className="bg-secondary/20 p-4 rounded-lg space-y-2">
                      <p><strong className="text-foreground">Contact:</strong> <Link to="/contact" className="text-primary hover:underline">Visit our contact page</Link></p>
                      <p><strong className="text-foreground">Subject Line:</strong> DMCA Takedown Notice</p>
                      <p><strong className="text-foreground">Response Time:</strong> Within 24-48 hours</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Button className="btn-hero">
                      <Mail className="h-4 w-4 mr-2" />
                      Send DMCA Notice
                    </Button>
                  </div>
                </div>
              </div>

              <div className="cinema-card p-8">
                <FileText className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-6">Counter-Notification Process</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    If you believe your content was removed in error, you may submit a counter-notification. 
                    This must include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Your physical or electronic signature</li>
                    <li>Identification of the material that was removed and its previous location</li>
                    <li>A statement under penalty of perjury that you have a good faith belief the material was removed in error</li>
                    <li>Your name, address, telephone number, and consent to federal court jurisdiction</li>
                  </ul>
                  <p>
                    Send counter-notifications through our <Link to="/contact" className="text-primary hover:underline">contact form</Link> with "DMCA Counter-Notice" as the subject.
                  </p>
                </div>
              </div>

              <div className="cinema-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Repeat Infringer Policy</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    VYB Cinema will terminate user accounts and access for repeat copyright infringers 
                    when appropriate and in accordance with the DMCA.
                  </p>
                  <p>
                    We track takedown notices and will take appropriate action against users who 
                    repeatedly infringe on copyrights.
                  </p>
                </div>
              </div>

              <div className="cinema-card p-8 bg-primary/5 border-primary/20">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-foreground mb-4">Questions About DMCA?</h3>
                  <p className="text-muted-foreground mb-6">
                    If you have questions about our DMCA policy or need assistance with a claim
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/contact">
                      <Button variant="secondary">
                        Submit DMCA Notice
                      </Button>
                    </Link>
                    <Link to="/contact">
                      <Button variant="secondary">
                        General Questions
                      </Button>
                    </Link>
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

export default DMCA;