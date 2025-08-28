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
    <nav className="fixed top-0 z-50 w-full bg-gradient-glass backdrop-blur-2xl border-b border-border/20 shadow-glass" style={{ pointerEvents: 'auto' }}>
      <div className="container mx-auto px-6" style={{ pointerEvents: 'auto' }}>
        <div className="flex items-center justify-between h-20" style={{ pointerEvents: 'auto' }}>
          {/* Logo */}
          <div className="flex items-center space-x-12">
            <Link to="/" className="text-3xl font-display font-bold text-cinema-gradient hover:scale-105 transition-transform duration-300">
              VYB Cinema
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link to="/movies" className="nav-link text-foreground/80 hover:text-foreground font-medium transition-all duration-300 relative group">
                Movies
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/tv-shows" className="nav-link text-foreground/80 hover:text-foreground font-medium transition-all duration-300 relative group">
                TV Shows
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/music-videos" className="nav-link text-foreground/80 hover:text-foreground font-medium transition-all duration-300 relative group">
                Music Videos  
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/stories" className="nav-link text-foreground/80 hover:text-foreground font-medium transition-all duration-300 relative group">
                Stories
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/podcasts" className="nav-link text-foreground/80 hover:text-foreground font-medium transition-all duration-300 relative group">
                Podcasts
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/about" className="nav-link text-foreground/80 hover:text-foreground font-medium transition-all duration-300 relative group">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center space-x-6">
            {/* Search */}
            <div className="hidden sm:flex items-center space-x-2">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <input
                  type="text"
                  placeholder="Search movies, shows..."
                  className="w-80 pl-12 pr-6 py-3 bg-card/50 border border-border/30 rounded-2xl text-sm 
                           focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 
                           transition-all duration-300 backdrop-blur-sm hover:bg-card/70"
                />
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="lg" className="flex items-center space-x-3 px-4 py-3 rounded-2xl hover:bg-card/50 transition-all duration-300">
                      <User className="h-5 w-5" />
                      <span className="font-medium">Dashboard</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-xl border-border/50 rounded-2xl shadow-ultra">
                    <DropdownMenuItem onClick={() => navigate('/dashboard')} className="rounded-xl">
                      <User className="mr-3 h-5 w-5" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem onClick={signOut} className="text-destructive rounded-xl">
                      <LogOut className="mr-3 h-5 w-5" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="lg" className="font-semibold px-6 py-3 rounded-2xl hover:bg-card/50 transition-all duration-300">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="btn-hero text-base px-8 py-3 font-semibold">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="lg"
              className="lg:hidden p-3 rounded-2xl hover:bg-card/50 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border/30 py-6 space-y-4 animate-fade-in bg-gradient-glass backdrop-blur-xl rounded-b-3xl mt-2">
            <Link to="/movies" className="block text-foreground/80 hover:text-foreground transition-colors font-medium py-2 px-4 rounded-xl hover:bg-card/30">
              Movies
            </Link>
            <Link to="/tv-shows" className="block text-foreground/80 hover:text-foreground transition-colors font-medium py-2 px-4 rounded-xl hover:bg-card/30">
              TV Shows
            </Link>
            <Link to="/music-videos" className="block text-foreground/80 hover:text-foreground transition-colors font-medium py-2 px-4 rounded-xl hover:bg-card/30">
              Music Videos
            </Link>
            <Link to="/stories" className="block text-foreground/80 hover:text-foreground transition-colors font-medium py-2 px-4 rounded-xl hover:bg-card/30">
              Stories
            </Link>
            <Link to="/podcasts" className="block text-foreground/80 hover:text-foreground transition-colors font-medium py-2 px-4 rounded-xl hover:bg-card/30">
              Podcasts
            </Link>
            <Link to="/about" className="block text-foreground/80 hover:text-foreground transition-colors font-medium py-2 px-4 rounded-xl hover:bg-card/30">
              About
            </Link>
            <div className="flex flex-col space-y-3 pt-4 border-t border-border/30">
              {user ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost" size="lg" className="justify-start w-full py-3 px-4 rounded-xl font-medium hover:bg-card/30">
                      <User className="mr-3 h-5 w-5" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="lg" 
                    className="justify-start w-full text-destructive py-3 px-4 rounded-xl font-medium hover:bg-destructive/10" 
                    onClick={signOut}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="lg" className="justify-start w-full py-3 px-4 rounded-xl font-medium hover:bg-card/30">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="btn-hero w-full py-3 font-semibold">
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