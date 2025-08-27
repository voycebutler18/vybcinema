import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Search, HelpCircle, Book, MessageSquare, Video, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HelpCenter = () => {
  const topics = [
    {
      icon: Video,
      title: "Getting Started",
      description: "Learn how to use VYB Cinema",
      articles: ["How to create an account", "Navigating the platform", "Finding content", "Setting up your profile"]
    },
    {
      icon: Settings,
      title: "Account & Settings",
      description: "Manage your account preferences", 
      articles: ["Account settings", "Privacy controls", "Notification preferences", "Deleting your account"]
    },
    {
      icon: HelpCircle,
      title: "Troubleshooting",
      description: "Common issues and solutions",
      articles: ["Video won't play", "Login problems", "Site not loading", "Audio issues"]
    },
    {
      icon: Book,
      title: "Content & Features",
      description: "Understanding our platform",
      articles: ["How ads work", "Content recommendations", "Watchlist features", "Genre categories"]
    }
  ];

  const faqs = [
    {
      question: "Is VYB Cinema really free?",
      answer: "Yes! VYB Cinema is completely free with ads. No credit card required, no hidden fees, no subscriptions."
    },
    {
      question: "How do I create an account?",
      answer: "Currently, you can browse content without an account. Account creation will be available when our content library launches."
    },
    {
      question: "When will content be available?",
      answer: "We're actively curating our content library. Sign up for notifications to be the first to know when we launch."
    },
    {
      question: "What devices can I use?",
      answer: "VYB Cinema works on any device with a web browser - computers, tablets, smartphones, and smart TVs."
    },
    {
      question: "How can I contact support?",
      answer: "Email us at hello@vybcinema.com and we'll get back to you within 1-2 business days."
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
                <span className="text-cinema-gradient">Help Center</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Find answers to your questions and get the most out of VYB Cinema
              </p>
              
              {/* Search Bar */}
              <div className="max-w-xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search for help articles..."
                    className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              
              {/* Help Topics */}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Browse Help Topics</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {topics.map((topic) => (
                    <div key={topic.title} className="cinema-card p-6 space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <topic.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{topic.title}</h3>
                          <p className="text-sm text-muted-foreground">{topic.description}</p>
                        </div>
                      </div>
                      <ul className="space-y-2 ml-15">
                        {topic.articles.map((article) => (
                          <li key={article} className="text-muted-foreground hover:text-primary cursor-pointer text-sm">
                            • {article}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
                <div className="space-y-4 max-w-4xl mx-auto">
                  {faqs.map((faq, index) => (
                    <div key={index} className="cinema-card p-6">
                      <h3 className="text-lg font-bold text-foreground mb-3">{faq.question}</h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Support */}
              <div className="cinema-card p-8 text-center">
                <MessageSquare className="h-16 w-16 mx-auto text-primary mb-6" />
                <h2 className="text-3xl font-bold text-foreground mb-4">Still Need Help?</h2>
                <p className="text-muted-foreground mb-6">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="mailto:hello@vybcinema.com?subject=Support Request">
                    <Button className="btn-hero">
                      Contact Support
                    </Button>
                  </a>
                  <Link to="/contact">
                    <Button variant="secondary">
                      Send Feedback
                    </Button>
                  </Link>
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

export default HelpCenter;