import { Button } from "@/components/ui/button";
import { Search, Menu, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-cinema-gradient">
              VYB Cinema
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/movies" className="text-foreground hover:text-primary transition-colors">
                Movies
              </Link>
              <Link to="/tv-shows" className="text-foreground hover:text-primary transition-colors">
                TV Shows
              </Link>
              <Link to="/music-videos" className="text-foreground hover:text-primary transition-colors">
                Music Videos
              </Link>
              <Link to="/stories" className="text-foreground hover:text-primary transition-colors">
                Stories
              </Link>
              <Link to="/podcasts" className="text-foreground hover:text-primary transition-colors">
                Podcasts
              </Link>
              <Link to="/about" className="text-foreground hover:text-primary transition-colors">
                About
              </Link>
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
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="btn-hero text-sm px-6 py-2">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
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
            <Link to="/movies" className="block text-foreground hover:text-primary transition-colors">
              Movies
            </Link>
            <Link to="/tv-shows" className="block text-foreground hover:text-primary transition-colors">
              TV Shows
            </Link>
            <Link to="/music-videos" className="block text-foreground hover:text-primary transition-colors">
              Music Videos
            </Link>
            <Link to="/stories" className="block text-foreground hover:text-primary transition-colors">
              Stories
            </Link>
            <Link to="/podcasts" className="block text-foreground hover:text-primary transition-colors">
              Podcasts
            </Link>
            <Link to="/about" className="block text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <div className="flex flex-col space-y-2 pt-3">
              {user ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm" className="justify-start w-full">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="justify-start w-full text-destructive" 
                    onClick={signOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="justify-start w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="btn-hero text-sm w-full">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};