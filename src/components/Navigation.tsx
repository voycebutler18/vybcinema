import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Bell,
  User,
  ChevronDown,
  Menu,
  X,
  Upload,
  Sparkles,
  Trophy,
  Radio,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

export const Navigation: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [showSearch, setShowSearch] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement | null>(null);

  // Teen-first IA
  const baseNav = [
    { path: "/", label: "Home" },
    { path: "/music", label: "Music" },
    { path: "/shows", label: "Shows" },
    { path: "/stories", label: "Stories" },
    { path: "/talent", label: "Talent" },
    { path: "/challenges", label: "Challenges", icon: Trophy },
    { path: "/live", label: "Live", icon: Radio },
  ];
  const navItems = user ? [...baseNav, { path: "/dashboard", label: "Dashboard" }] : baseNav;

  useEffect(() => {
    if (showSearch && searchRef.current) searchRef.current.focus();
  }, [showSearch]);

  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q.length > 0) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setShowSearch(false);
      setMobileOpen(false);
    }
  };

  const onEsc: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Escape") setShowSearch(false);
  };

  const Letter = (user?.email?.[0] ?? "U").toUpperCase();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Logo + Desktop Nav */}
          <div className="flex items-center gap-6">
            {/* Mobile toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:text-gray-300"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>

            {/* Teen-first logo + badge */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="text-xl sm:text-2xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 bg-clip-text text-transparent">
                  VYB Cinema
                </span>
              </div>
              <span className="hidden sm:inline text-[10px] uppercase tracking-widest text-white/80 bg-white/10 border border-white/10 rounded px-2 py-0.5">
                Teens 13–19
              </span>
              <Sparkles className="h-4 w-4 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-5">
              {navItems.map((item) => {
                const Icon = (item as any).icon;
                const isHome = item.path === "/";
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={isHome}
                    className={({ isActive }) =>
                      [
                        "text-sm font-semibold transition-colors duration-200 hover:text-gray-100 flex items-center gap-1.5",
                        isActive ? "text-white" : "text-gray-400",
                      ].join(" ")
                    }
                  >
                    {Icon ? <Icon className="h-4 w-4" /> : null}
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Right: Search + Create + Notifications + User */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <div className="relative hidden sm:block">
              {showSearch ? (
                <form onSubmit={onSubmitSearch}>
                  <Input
                    ref={searchRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={onEsc}
                    onBlur={() => setShowSearch(false)}
                    type="text"
                    placeholder="Search music, shows, creators"
                    aria-label="Search"
                    className="w-72 bg-neutral-900/80 border-neutral-700 text-white placeholder:text-gray-400"
                  />
                </form>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-gray-300"
                  onClick={() => setShowSearch(true)}
                  aria-label="Open search"
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Create: teen-friendly upload */}
            {user && (
              <Button asChild size="sm" className="bg-pink-500 hover:bg-pink-600 text-white">
                <Link to="/create" aria-label="Create">
                  <Upload className="h-4 w-4 mr-2" />
                  Create
                </Link>
              </Button>
            )}

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-gray-300"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </Button>

            {/* Auth */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-white hover:text-gray-300"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-red-600 text-white">{Letter}</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-neutral-900 text-white border border-gray-700"
                >
                  <DropdownMenuItem asChild className="hover:bg-neutral-800 cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-neutral-800 cursor-pointer">
                    <Link to="/dashboard">Creator Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-neutral-800 cursor-pointer">
                    <Link to="/create">Create</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-neutral-800 cursor-pointer">
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem className="hover:bg-neutral-800" onClick={() => signOut()}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-1 sm:gap-2">
                <Button asChild variant="ghost" className="text-white hover:text-gray-300">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild className="bg-pink-500 hover:bg-pink-600">
                  <Link to="/signup">Join Free</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile panel */}
        {mobileOpen && (
          <div className="md:hidden mt-3 border-t border-neutral-800 pt-3">
            {/* Mobile search */}
            <form onSubmit={onSubmitSearch} className="mb-3">
              <div className="flex items-center gap-2">
                <Input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onEsc}
                  type="text"
                  placeholder="Search music, shows, creators"
                  aria-label="Search"
                  className="bg-neutral-900/80 border-neutral-700 text-white placeholder:text-gray-400"
                />
                <Button type="submit" size="sm" className="bg-pink-500 hover:bg-pink-600">
                  Search
                </Button>
              </div>
            </form>

            <div className="grid gap-2">
              {navItems.map((item) => {
                const Icon = (item as any).icon;
                const isHome = item.path === "/";
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={isHome}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      [
                        "w-full text-left py-2 px-2 rounded-md transition-colors flex items-center gap-2",
                        isActive ? "bg-neutral-800 text-white" : "text-gray-300 hover:bg-neutral-800",
                      ].join(" ")
                    }
                  >
                    {Icon ? <Icon className="h-4 w-4" /> : null}
                    {item.label}
                  </NavLink>
                );
              })}

              {user ? (
                <>
                  <Button
                    variant="ghost"
                    className="justify-start text-gray-300 hover:text-white"
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/create");
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Create
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-gray-300 hover:text-white"
                    onClick={() => {
                      setMobileOpen(false);
                      signOut();
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Button asChild variant="ghost" className="flex-1 text-gray-300 hover:text-white">
                    <Link to="/login" onClick={() => setMobileOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild className="flex-1 bg-pink-500 hover:bg-pink-600">
                    <Link to="/signup" onClick={() => setMobileOpen(false)}>
                      Join Free
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Quick links row */}
            <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
              <Link to="/charts" onClick={() => setMobileOpen(false)} className="hover:text-white">
                Teen Charts
              </Link>
              <span className="opacity-30">•</span>
              <Link to="/safety" onClick={() => setMobileOpen(false)} className="hover:text-white">
              </Link>
              <span className="opacity-30">•</span>
              <Link to="/about" onClick={() => setMobileOpen(false)} className="hover:text-white">
                About
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
