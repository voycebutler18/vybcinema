import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Mail, MessageCircle, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (error) throw error;

      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        placeholder="Your first name" 
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Your last name" 
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <select 
                      id="subject" 
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={formData.subject}
                      onChange={handleInputChange}
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
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="btn-hero w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div className="cinema-card p-8">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Contact Information</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-primary/10 p-6 rounded-lg text-center">
                      <h3 className="font-semibold text-foreground mb-3">For All Inquiries</h3>
                      <p className="text-muted-foreground mb-4">
                        For legal questions, general inquiries, business matters, and press requests, 
                        please use our contact form for fastest response.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Direct email contact is available in the footer of every page for urgent matters.
                      </p>
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