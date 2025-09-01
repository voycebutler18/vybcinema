import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-card/50 border-t border-border/50 py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-bold text-cinema-gradient">
              VYB Cinema
            </div>
            <p className="text-muted-foreground text-sm">
              Premium streaming experience with unlimited entertainment
            </p>
          </div>
          
          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Company</h4>
            <div className="space-y-2 text-sm">
              <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/careers" className="block text-muted-foreground hover:text-primary transition-colors">
                Careers
              </Link>
              <Link to="/press" className="block text-muted-foreground hover:text-primary transition-colors">
                Press
              </Link>
            </div>
          </div>
          
          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Support</h4>
            <div className="space-y-2 text-sm">
              <Link to="/help" className="block text-muted-foreground hover:text-primary transition-colors">
                Help Center
              </Link>
              <Link to="/contact" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact Us
              </Link>
              <Link to="/dmca" className="block text-muted-foreground hover:text-primary transition-colors">
                DMCA
              </Link>
            </div>
          </div>
          
          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <div className="space-y-2 text-sm">
              <Link to="/privacy" className="block text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="block text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="block text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-8 pt-8 space-y-4">
          <div className="text-center">
            <a 
              href="mailto:voycebutler@vybcinema.com" 
              className="text-primary hover:underline font-medium"
            >
              voycebutler@vybcinema.com
            </a>
            <p className="text-xs text-muted-foreground mt-2">
              For legal or general questions, please use our contact form
            </p>
          </div>
          <div className="text-center text-sm text-muted-foreground border-t border-border/50 pt-4">
            <p>&copy; 2025 VYB Cinema. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
