import { Button } from "@/components/ui/button";
import { Search, Menu, User } from "lucide-react";
import { useState } from "react";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-bold text-cinema-gradient">
              VYB Cinema
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                Browse
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                Pricing
              </a>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden sm:flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search movies..."
                  className="w-64 pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
              <Button className="btn-hero text-sm px-6 py-2">
                Sign up
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/50 py-4 space-y-3 animate-fade-in">
            <a href="#" className="block text-foreground hover:text-primary transition-colors">
              Browse
            </a>
            <a href="#" className="block text-foreground hover:text-primary transition-colors">
              Pricing
            </a>
            <div className="flex flex-col space-y-2 pt-3">
              <Button variant="ghost" size="sm" className="justify-start">
                Log in
              </Button>
              <Button className="btn-hero text-sm">
                Sign up
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};