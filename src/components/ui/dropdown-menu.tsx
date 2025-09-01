// src/components/UserMenu.tsx
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function UserMenu() {
  const { user, signOut } = useAuth();

  // You can customize avatar data here
  const avatarLetter =
    (user?.user_metadata?.username?.[0] ||
      user?.user_metadata?.full_name?.[0] ||
      user?.email?.[0] ||
      "U")?.toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 w-10 rounded-full p-0 data-[state=open]:bg-accent"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
            <AvatarFallback>{avatarLetter}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* Profile (now navigates) */}
        <DropdownMenuItem asChild>
          <Link to="/profile" className="w-full">
            Profile
          </Link>
        </DropdownMenuItem>

        {/* Creator dashboard */}
        <DropdownMenuItem asChild>
          <Link to="/dashboard" className="w-full">
            Creator Dashboard
          </Link>
        </DropdownMenuItem>

        {/* Create / upload */}
        <DropdownMenuItem asChild>
          <Link to="/create" className="w-full">
            Create
          </Link>
        </DropdownMenuItem>

        {/* Safety center */}
        <DropdownMenuItem asChild>
          <Link to="/safety" className="w-full">
            Safety Center
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Sign out */}
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            signOut?.();
          }}
          className="cursor-pointer"
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
