// src/components/UserMenu.tsx
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const initials = (name?: string | null, email?: string | null) => {
  const base = (name && name.trim()) || (email && email.split("@")[0]) || "U";
  return base
    .split(/\s+/)
    .map((s) => s[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
};

export default function UserMenu() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    // Not signed in: show Sign in button (no other changes to your Navbar)
    return (
      <Button asChild size="sm" variant="secondary">
        <Link to="/login">Sign in</Link>
      </Button>
    );
  }

  const displayName =
    (profile?.username?.trim?.() || profile?.full_name?.trim?.() || user.email) ?? "User";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-full border border-border/50 bg-card px-2 py-1 hover:bg-card/80"
          aria-label="Account menu"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url || ""} alt={displayName} />
            <AvatarFallback>{initials(profile?.full_name, user.email)}</AvatarFallback>
          </Avatar>
          <span className="hidden sm:block text-sm">{displayName}</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">{displayName}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Profile → /profile */}
        <DropdownMenuItem asChild>
          <Link to="/profile">Profile</Link>
        </DropdownMenuItem>

        {/* Dashboard → /dashboard */}
        <DropdownMenuItem asChild>
          <Link to="/dashboard">Dashboard</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Sign out */}
        <DropdownMenuItem
          onSelect={async (e) => {
            e.preventDefault();
            await signOut();
            navigate("/"); // send them home after sign out
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
