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
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                About
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Careers
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Press
              </a>
            </div>
          </div>
          
          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Support</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Help Center
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact Us
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                DMCA
              </a>
            </div>
          </div>
          
          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 VYB Cinema. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};