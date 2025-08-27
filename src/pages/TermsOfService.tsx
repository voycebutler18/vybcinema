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
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Version 2.0 | Last updated: December 2024</div>
                <div>Effective Date: December 15, 2024</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              
              {/* Table of Contents */}
              <div className="cinema-card p-6 bg-secondary/20">
                <h2 className="text-xl font-bold text-foreground mb-4">Quick Navigation</h2>
                <div className="grid md:grid-cols-2 gap-2 text-sm">
                  <a href="#acceptance" className="text-primary hover:underline">1. Acceptance of Terms</a>
                  <a href="#accounts" className="text-primary hover:underline">2. User Accounts & Eligibility</a>
                  <a href="#use" className="text-primary hover:underline">3. Use of Service</a>
                  <a href="#content" className="text-primary hover:underline">4. Content & IP</a>
                  <a href="#advertising" className="text-primary hover:underline">5. Advertising</a>
                  <a href="#liability" className="text-primary hover:underline">6. Limitation of Liability</a>
                  <a href="#disclaimers" className="text-primary hover:underline">7. Disclaimers</a>
                  <a href="#termination" className="text-primary hover:underline">8. Termination</a>
                  <a href="#privacy" className="text-primary hover:underline">9. Privacy & Data</a>
                  <a href="#changes" className="text-primary hover:underline">10. Changes to Terms</a>
                  <a href="#disputes" className="text-primary hover:underline">11. Governing Law & Disputes</a>
                  <a href="#international" className="text-primary hover:underline">12. International Users</a>
                </div>
              </div>

              <div id="acceptance" className="cinema-card p-8">
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

              <div id="accounts" className="cinema-card p-8">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-6">User Accounts and Eligibility</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Age Requirements:</strong> You must be at least 13 years old to use VYB Cinema. 
                    Users between 13-18 must have parental consent.
                  </p>
                  <p>
                    <strong className="text-foreground">Parental Consent:</strong> For users under 18, parental consent must be 
                    obtained through our designated verification process, which may include email confirmation from a parent/guardian 
                    and agreement to our parental consent terms.
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

              <div id="use" className="cinema-card p-8">
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

              <div id="content" className="cinema-card p-8">
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

              <div id="advertising" className="cinema-card p-8">
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

              <div id="liability" className="cinema-card p-8">
                <AlertCircle className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-6">Limitation of Liability</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Liability Cap:</strong> To the fullest extent permitted by law, VYB Cinema's 
                    total liability to you for any claim related to these Terms or the service shall not exceed $100 or the amount 
                    you paid us in the twelve months preceding the claim, whichever is greater.
                  </p>
                  <p>
                    <strong className="text-foreground">Excluded Damages:</strong> VYB Cinema shall not be liable for any indirect, 
                    incidental, special, consequential, or punitive damages, including but not limited to loss of profits, revenue, 
                    data, or business opportunities, even if we have been advised of the possibility of such damages.
                  </p>
                  <p>
                    <strong className="text-foreground">Exceptions:</strong> Some jurisdictions do not allow the exclusion or 
                    limitation of liability for consequential or incidental damages, so the above limitations may not apply to you.
                  </p>
                </div>
              </div>

              <div id="disclaimers" className="cinema-card p-8">
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

              <div id="termination" className="cinema-card p-8">
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

              <div id="privacy" className="cinema-card p-8">
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

              <div id="changes" className="cinema-card p-8">
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

              <div id="disputes" className="cinema-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Governing Law and Disputes</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Governing Law:</strong> These Terms are governed by the laws of the 
                    United States and the State of Illinois, without regard to conflict of law principles.
                  </p>
                  <p>
                    <strong className="text-foreground">Mandatory Arbitration:</strong> Any disputes arising from these Terms 
                    or your use of VYB Cinema will be resolved through binding arbitration in accordance with the rules of the 
                    American Arbitration Association, except as noted below.
                  </p>
                  <p>
                    <strong className="text-foreground">Small Claims Exception:</strong> You may pursue claims in small claims 
                    court if the claim qualifies, is brought only in your individual capacity, and remains in small claims court.
                  </p>
                  <p>
                    <strong className="text-foreground">Class Action Waiver:</strong> You agree that disputes will be resolved 
                    on an individual basis and you waive any right to participate in class action lawsuits or class-wide arbitration.
                  </p>
                </div>
              </div>

              <div id="international" className="cinema-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">International Users</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Global Access:</strong> VYB Cinema may be accessed from countries around 
                    the world. If you access our service from outside the United States, you are responsible for compliance with 
                    local laws.
                  </p>
                  <p>
                    <strong className="text-foreground">Content Availability:</strong> Content availability may vary by geographic 
                    location due to licensing restrictions. Some content may not be available in all regions.
                  </p>
                  <p>
                    <strong className="text-foreground">Data Processing:</strong> Personal information may be processed and stored 
                    in the United States, regardless of your location. By using our service, you consent to this transfer and processing.
                  </p>
                  <p>
                    <strong className="text-foreground">Local Laws:</strong> If any provision of these Terms conflicts with local 
                    mandatory laws in your jurisdiction, the local law will prevail to the extent of the conflict for users in that jurisdiction.
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
                    <strong>Legal Questions:</strong> voycebutler@vybcinema.com
                  </p>
                  <p className="text-foreground">
                    <strong>General Contact:</strong> voycebutler@vybcinema.com
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