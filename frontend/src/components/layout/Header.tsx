import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth.store";
import { Car, Heart, LogOut, Plus, User } from "lucide-react";
import { Link } from "react-router";
import { ModeToggle } from "../theme/mode-toggle";

export default function Header() {
  const { user, isLoggedIn, logout } = useAuthStore();

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Car className="size-8 text-primary" />
            <span className="text-2xl font-bold hidden sm:inline">Vechile Marketplace</span>
          </Link>

          <div className="flex items-center gap-3">
            {isLoggedIn && (
              <Link to="/create-listing">
                <Button
                  size="sm"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
                >
                  <Plus className="size-4" />
                  <span>Create Listing</span>
                </Button>
              </Link>
            )}

            <ModeToggle />

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className=" size-9 rounded-full">
                    <Avatar className="size-9">
                      <AvatarFallback>{user?.first_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <div className="flex">
                        <p className="font-medium text-sm">{user?.first_name}</p>
                        <p className="font-medium text-sm pl-1">{user?.last_name}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 size-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <Car className="mr-2 size-4" />
                      My Listings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <Heart className="mr-2 size-4" />
                      Saved Vehicles
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                    <LogOut className="mr-2 size-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="size-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
