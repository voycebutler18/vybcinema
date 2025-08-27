import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Mail, MessageCircle, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-8">
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="text-cinema-gradient">Get in Touch</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Have questions, feedback, or want to collaborate? We'd love to hear from you.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
              
              {/* Contact Form */}
              <div className="cinema-card p-8">
                <h2 className="text-3xl font-bold text-foreground mb-6">Send Us a Message</h2>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Your first name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Your last name" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="your@email.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <select 
                      id="subject" 
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option>General Inquiry</option>
                      <option>Content Submission</option>
                      <option>Partnership Opportunity</option>
                      <option>Technical Support</option>
                      <option>Press & Media</option>
                      <option>Other</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us how we can help you..."
                      rows={5}
                    />
                  </div>
                  
                  <Button className="btn-hero w-full">
                    Send Message
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div className="cinema-card p-8">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Contact Information</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <Mail className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-foreground">General Inquiries</h3>
                        <a href="mailto:voycebutler@vybcinema.com" className="text-primary hover:underline">
                          voycebutler@vybcinema.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <MessageCircle className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-foreground">Business Inquiries</h3>
                        <a href="mailto:voycebutler@vybcinema.com" className="text-primary hover:underline">
                          voycebutler@vybcinema.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <Mail className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-foreground">Press & Media</h3>
                        <a href="mailto:voycebutler@vybcinema.com" className="text-primary hover:underline">
                          voycebutler@vybcinema.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-foreground">Location</h3>
                        <p className="text-muted-foreground">Chicago-based</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="cinema-card p-8">
                  <h3 className="text-xl font-bold text-foreground mb-4">Response Time</h3>
                  <div className="space-y-3 text-muted-foreground">
                    <p>• <strong className="text-foreground">General inquiries:</strong> 1-2 business days</p>
                    <p>• <strong className="text-foreground">Business matters:</strong> Same day</p>
                    <p>• <strong className="text-foreground">Press requests:</strong> Within 24 hours</p>
                    <p>• <strong className="text-foreground">Technical issues:</strong> 1-3 business days</p>
                  </div>
                </div>

                <div className="cinema-card p-8">
                  <h3 className="text-xl font-bold text-foreground mb-4">Follow VYB Cinema</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p>Stay updated with our latest content and announcements</p>
                    <div className="flex flex-wrap gap-4 pt-2">
                      <span className="px-3 py-1 bg-primary/10 rounded-full text-sm">TikTok</span>
                      <span className="px-3 py-1 bg-primary/10 rounded-full text-sm">YouTube</span>
                      <span className="px-3 py-1 bg-primary/10 rounded-full text-sm">Instagram</span>
                      <span className="px-3 py-1 bg-primary/10 rounded-full text-sm">Facebook</span>
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

export default Contact;