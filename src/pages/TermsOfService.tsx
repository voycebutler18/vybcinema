import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Scale, Users, Shield, AlertCircle } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-8">
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="text-cinema-gradient">Terms of Service</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Your rights and responsibilities when using VYB Cinema
              </p>
              <div className="text-sm text-muted-foreground">
                Last updated: December 2024
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              
              <div className="cinema-card p-8">
                <Scale className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-6">Acceptance of Terms</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Welcome to VYB Cinema! By accessing or using our streaming platform, you agree to be bound by these 
                    Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our service.
                  </p>
                  <p>
                    These Terms constitute a legally binding agreement between you and VYB Cinema, operated by Peter Butler.
                  </p>
                </div>
              </div>

              <div className="cinema-card p-8">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-6">User Accounts and Eligibility</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Age Requirements:</strong> You must be at least 13 years old to use VYB Cinema. 
                    Users between 13-18 must have parental consent.
                  </p>
                  <p>
                    <strong className="text-foreground">Account Creation:</strong> When account features become available, you will be 
                    responsible for maintaining the confidentiality of your login information and for all activities under your account.
                  </p>
                  <p>
                    <strong className="text-foreground">Accurate Information:</strong> You agree to provide accurate, current, and 
                    complete information and to update it as necessary.
                  </p>
                </div>
              </div>

              <div className="cinema-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Use of the Service</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Permitted Use</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Stream content for personal, non-commercial use</li>
                      <li>Create watchlists and personalize your experience</li>
                      <li>Share feedback and engage with our community</li>
                      <li>Access content on supported devices</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Prohibited Use</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Downloading, copying, or redistributing content</li>
                      <li>Using automated systems to access the service</li>
                      <li>Attempting to circumvent security measures</li>
                      <li>Sharing account credentials with others</li>
                      <li>Using the service for illegal activities</li>
                      <li>Harassing other users or posting inappropriate content</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="cinema-card p-8">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-6">Content and Intellectual Property</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Our Content:</strong> All content on VYB Cinema, including videos, 
                    text, graphics, logos, and software, is owned by VYB Cinema or our content partners and protected by 
                    copyright and other intellectual property laws.
                  </p>
                  <p>
                    <strong className="text-foreground">Your Content:</strong> When you submit content (comments, reviews, etc.), 
                    you grant us a non-exclusive, royalty-free license to use, display, and distribute that content in 
                    connection with our service.
                  </p>
                  <p>
                    <strong className="text-foreground">Respect Rights:</strong> You agree not to infringe on the intellectual 
                    property rights of others and to respect all copyright notices and restrictions.
                  </p>
                </div>
              </div>

              <div className="cinema-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Advertising and Sponsors</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    VYB Cinema is a free, ad-supported service. By using our platform, you agree to view advertisements 
                    that make our free service possible.
                  </p>
                  <p>
                    <strong className="text-foreground">Ad Interaction:</strong> You may not circumvent, disable, or interfere 
                    with advertising features. Ads help support content creators and keep the service free.
                  </p>
                  <p>
                    <strong className="text-foreground">Third-Party Ads:</strong> We are not responsible for the content of 
                    third-party advertisements or the practices of advertisers.
                  </p>
                </div>
              </div>

              <div className="cinema-card p-8">
                <AlertCircle className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-6">Disclaimers and Limitations</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Service Availability:</strong> We strive to maintain continuous service 
                    but cannot guarantee uninterrupted access. We may temporarily suspend the service for maintenance or updates.
                  </p>
                  <p>
                    <strong className="text-foreground">Content Accuracy:</strong> While we curate our content carefully, we do not 
                    warrant the accuracy, completeness, or reliability of any content on our platform.
                  </p>
                  <p>
                    <strong className="text-foreground">No Warranties:</strong> The service is provided "as is" without warranties 
                    of any kind, either express or implied.
                  </p>
                </div>
              </div>

              <div className="cinema-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Termination</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Your Rights:</strong> You may stop using our service at any time.
                  </p>
                  <p>
                    <strong className="text-foreground">Our Rights:</strong> We may suspend or terminate your access if you 
                    violate these Terms, engage in prohibited activities, or for any reason at our discretion.
                  </p>
                  <p>
                    <strong className="text-foreground">Effect of Termination:</strong> Upon termination, your right to access 
                    the service will cease immediately.
                  </p>
                </div>
              </div>

              <div className="cinema-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Privacy and Data</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Your privacy is important to us. Our collection and use of personal information is governed by our 
                    Privacy Policy, which is incorporated into these Terms by reference.
                  </p>
                  <p>
                    By using VYB Cinema, you consent to the collection and use of your information as described in our Privacy Policy.
                  </p>
                </div>
              </div>

              <div className="cinema-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Changes to Terms</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We may modify these Terms from time to time. We will notify users of significant changes by posting 
                    the updated Terms on our platform and updating the "Last updated" date.
                  </p>
                  <p>
                    Your continued use of VYB Cinema after changes become effective constitutes acceptance of the new Terms.
                  </p>
                </div>
              </div>

              <div className="cinema-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Governing Law and Disputes</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    These Terms are governed by the laws of the United States and the State of Illinois, without regard to 
                    conflict of law principles.
                  </p>
                  <p>
                    Any disputes arising from these Terms or your use of VYB Cinema will be resolved through binding arbitration 
                    in accordance with the rules of the American Arbitration Association.
                  </p>
                </div>
              </div>

              <div className="cinema-card p-8 bg-primary/5 border-primary/20 text-center">
                <h2 className="text-2xl font-bold text-foreground mb-4">Questions About These Terms?</h2>
                <p className="text-muted-foreground mb-6">
                  If you have any questions about these Terms of Service
                </p>
                <div className="space-y-2">
                  <p className="text-foreground">
                    <strong>Legal Questions:</strong> legal@vybcinema.com
                  </p>
                  <p className="text-foreground">
                    <strong>General Contact:</strong> hello@vybcinema.com
                  </p>
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

export default TermsOfService;