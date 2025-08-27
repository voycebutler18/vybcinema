import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Shield, Eye, Lock, UserCheck } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-8">
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="text-cinema-gradient">Privacy Policy</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                How we collect, use, and protect your information
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
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-6">Our Commitment to Privacy</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    At VYB Cinema, we respect your privacy and are committed to protecting your personal information. 
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
                    you use our streaming platform.
                  </p>
                  <p>
                    We believe in transparency and want you to understand exactly what information we collect and why.
                  </p>
                </div>
              </div>

              <div className="cinema-card p-8">
                <Eye className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-6">Information We Collect</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Information You Provide</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Account registration information (name, email address)</li>
                      <li>Profile information and preferences</li>
                      <li>Communications with customer support</li>
                      <li>Feedback and survey responses</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Information We Collect Automatically</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Device information (browser type, operating system, device model)</li>
                      <li>Usage data (content viewed, time spent, interactions)</li>
                      <li>Log data (IP address, access times, pages visited)</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="cinema-card p-8">
                <UserCheck className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-6">How We Use Your Information</h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground">We use the information we collect to:</p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Provide and maintain our streaming service</li>
                    <li>Personalize your content recommendations</li>
                    <li>Process your requests and communications</li>
                    <li>Improve our platform and user experience</li>
                    <li>Send you important updates and notifications</li>
                    <li>Detect and prevent fraud or abuse</li>
                    <li>Comply with legal obligations</li>
                    <li>Deliver relevant advertisements (with your consent)</li>
                  </ul>
                </div>
              </div>

              <div className="cinema-card p-8">
                <Lock className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-6">Information Sharing and Disclosure</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">We do not sell your personal information.</strong> We may share 
                    your information only in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong className="text-foreground">With your consent:</strong> When you explicitly agree to sharing</li>
                    <li><strong className="text-foreground">Service providers:</strong> Trusted third parties who help us operate our platform</li>
                    <li><strong className="text-foreground">Legal requirements:</strong> When required by law or to protect rights and safety</li>
                    <li><strong className="text-foreground">Business transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                  </ul>
                </div>
              </div>

              <div className="cinema-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Cookies and Tracking Technologies</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We use cookies and similar technologies to enhance your experience on our platform:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong className="text-foreground">Essential cookies:</strong> Required for basic site functionality</li>
                    <li><strong className="text-foreground">Performance cookies:</strong> Help us understand how you use our site</li>
                    <li><strong className="text-foreground">Functional cookies:</strong> Remember your preferences and settings</li>
                    <li><strong className="text-foreground">Advertising cookies:</strong> Deliver relevant ads (with your consent)</li>
                  </ul>
                  <p>
                    You can control cookies through your browser settings, though some features may not work properly if disabled.
                  </p>
                </div>
              </div>

              <div className="cinema-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Your Rights and Choices</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>You have the following rights regarding your personal information:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong className="text-foreground">Access:</strong> Request a copy of your personal data</li>
                    <li><strong className="text-foreground">Correction:</strong> Update or correct inaccurate information</li>
                    <li><strong className="text-foreground">Deletion:</strong> Request deletion of your personal data</li>
                    <li><strong className="text-foreground">Portability:</strong> Request your data in a portable format</li>
                    <li><strong className="text-foreground">Opt-out:</strong> Unsubscribe from marketing communications</li>
                    <li><strong className="text-foreground">Restrict processing:</strong> Limit how we use your data</li>
                  </ul>
                  <p>
                    To exercise these rights, contact us at <strong className="text-foreground">privacy@vybcinema.com</strong>
                  </p>
                </div>
              </div>

              <div className="cinema-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Data Security</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We implement appropriate technical and organizational measures to protect your personal information against 
                    unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is 100% secure, 
                    and we cannot guarantee absolute security.
                  </p>
                  <p>
                    Our security measures include encryption, secure servers, regular security audits, and access controls.
                  </p>
                </div>
              </div>

              <div className="cinema-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Children's Privacy</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    VYB Cinema is not intended for children under 13 years of age. We do not knowingly collect personal 
                    information from children under 13. If we become aware that we have collected personal information 
                    from a child under 13, we will take steps to delete such information.
                  </p>
                </div>
              </div>

              <div className="cinema-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Changes to This Policy</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                    the new Privacy Policy on this page and updating the "Last updated" date.
                  </p>
                  <p>
                    We encourage you to review this Privacy Policy periodically for any changes.
                  </p>
                </div>
              </div>

              <div className="cinema-card p-8 bg-primary/5 border-primary/20 text-center">
                <h2 className="text-2xl font-bold text-foreground mb-4">Questions About Privacy?</h2>
                <p className="text-muted-foreground mb-6">
                  If you have any questions about this Privacy Policy or our data practices
                </p>
                <div className="space-y-2">
                  <p className="text-foreground">
                    <strong>Email:</strong> privacy@vybcinema.com
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

export default PrivacyPolicy;