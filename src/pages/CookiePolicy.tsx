import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Cookie, Settings, Eye, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";

const CookiePolicy = () => {
  const cookieTypes = [
    {
      icon: Settings,
      title: "Essential Cookies",
      description: "Required for basic website functionality and security",
      examples: ["Login sessions", "Security tokens", "Site preferences", "Load balancing"],
      canDisable: false
    },
    {
      icon: BarChart,
      title: "Performance Cookies",
      description: "Help us understand how visitors use our website",
      examples: ["Page analytics", "Error tracking", "Loading times", "Popular content"],
      canDisable: true
    },
    {
      icon: Eye,
      title: "Functional Cookies",
      description: "Remember your choices and personalize your experience",
      examples: ["Language preferences", "Volume settings", "Watchlist data", "Content recommendations"],
      canDisable: true
    },
    {
      icon: Cookie,
      title: "Advertising Cookies",
      description: "Deliver relevant ads and measure advertising effectiveness",
      examples: ["Ad targeting", "Campaign measurement", "Frequency capping", "Cross-site tracking"],
      canDisable: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-8">
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="text-cinema-gradient">Cookie Policy</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                How we use cookies and similar technologies on VYB Cinema
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
                <Cookie className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-6">What Are Cookies?</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Cookies are small text files that are stored on your device when you visit a website. They help 
                    websites remember information about your visit, which can both make it easier to visit the site 
                    again and make the site more useful to you.
                  </p>
                  <p>
                    VYB Cinema uses cookies and similar technologies to provide, protect, and improve our service. 
                    This policy explains how and why we use these technologies and the choices you have.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Types of Cookies We Use</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {cookieTypes.map((type) => (
                    <div key={type.title} className="cinema-card p-6 space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <type.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{type.title}</h3>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Examples:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                          {type.examples.map((example) => (
                            <li key={example}>{example}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="pt-2">
                        {type.canDisable ? (
                          <span className="inline-flex items-center px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs">
                            Can be disabled
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 bg-orange-500/10 text-orange-400 rounded-full text-xs">
                            Always active
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cinema-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Third-Party Cookies</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We may also use third-party cookies from trusted partners to help us:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong className="text-foreground">Analytics providers:</strong> Google Analytics to understand how visitors use our site</li>
                    <li><strong className="text-foreground">Advertising partners:</strong> To deliver relevant ads and measure their effectiveness</li>
                    <li><strong className="text-foreground">Social media platforms:</strong> For social sharing and login functionality</li>
                    <li><strong className="text-foreground">Content delivery networks:</strong> To improve site performance and speed</li>
                  </ul>
                  <p>
                    These third parties may collect information about your online activities across different websites.
                  </p>
                </div>
              </div>

              <div className="cinema-card p-8">
                <Settings className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-6">Managing Cookie Preferences</h2>
                <div className="space-y-6">
                  <div className="text-muted-foreground space-y-4">
                    <p>
                      You have several options for managing cookies:
                    </p>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Browser Settings</h3>
                      <p className="mb-2">Most browsers allow you to:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>View and delete cookies</li>
                        <li>Block third-party cookies</li>
                        <li>Block cookies from specific sites</li>
                        <li>Block all cookies (may affect functionality)</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Our Cookie Banner</h3>
                      <p>
                        When you first visit VYB Cinema, you'll see a cookie banner allowing you to accept or 
                        customize your cookie preferences. You can change these preferences at any time.
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Button className="btn-hero">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Cookie Preferences
                    </Button>
                  </div>
                </div>
              </div>

              <div className="cinema-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Impact of Disabling Cookies</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    While you can disable cookies, doing so may affect your experience on VYB Cinema:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong className="text-foreground">Essential cookies:</strong> Disabling these may prevent the site from working properly</li>
                    <li><strong className="text-foreground">Performance cookies:</strong> We won't be able to improve the site based on usage data</li>
                    <li><strong className="text-foreground">Functional cookies:</strong> Your preferences and settings won't be remembered</li>
                    <li><strong className="text-foreground">Advertising cookies:</strong> You may see less relevant ads, but still see ads</li>
                  </ul>
                </div>
              </div>

              <div className="cinema-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Updates to This Policy</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We may update this Cookie Policy from time to time to reflect changes in our practices or 
                    for other operational, legal, or regulatory reasons.
                  </p>
                  <p>
                    We will notify you of any material changes by posting the updated policy on this page and 
                    updating the "Last updated" date.
                  </p>
                </div>
              </div>

              <div className="cinema-card p-8 bg-primary/5 border-primary/20 text-center">
                <h2 className="text-2xl font-bold text-foreground mb-4">Questions About Cookies?</h2>
                <p className="text-muted-foreground mb-6">
                  If you have questions about our use of cookies or this policy
                </p>
                <div className="space-y-2">
                  <p className="text-foreground">
                    <strong>Privacy Questions:</strong> voycebutler@vybcinema.com
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

export default CookiePolicy;