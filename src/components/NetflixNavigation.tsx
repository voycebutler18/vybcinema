import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Bell, User, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

export const NetflixNavigation = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);

  // Favorites and Music Videos removed (to avoid 404)
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/movies", label: "Movies" },
    { path: "/tv-shows", label: "TV Shows" },
    { path: "/stories", label: "Short Stories" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm transition-all duration-300">
      <div className="container mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="text-red-600 text-2xl font-bold">STREAMFLIX</div>
            </Link>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors duration-200 hover:text-gray-300 ${
                    isActive(item.path) ? "text-white" : "text-gray-400"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              {showSearch ? (
                <Input
                  type="text"
                  placeholder="Search titles..."
                  className="w-64 bg-black/50 border-gray-600 text-white placeholder:text-gray-400"
                  autoFocus
                  onBlur={() => setShowSearch(false)}
                />
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-gray-300"
                  onClick={() => setShowSearch(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-gray-300"
            >
              <Bell className="h-5 w-5" />
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-white hover:text-gray-300">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-red-600 text-white">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-black/90 border-gray-700">
                  <DropdownMenuItem className="text-white hover:bg-gray-800">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem
                    className="text-white hover:bg-gray-800"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button asChild variant="ghost" className="text-white hover:text-gray-300">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild className="bg-gray-300 hover:bg-gray-300">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
