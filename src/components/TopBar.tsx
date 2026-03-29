import { MenuIcon, Settings } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import icon from "@/assets/icon.webp";

type NavItem = {
  label: string;
  to?: string;
};

const navItems: NavItem[] = [
  { label: "Upload", to: "/" },
  { label: "Validation" },
  { label: "Metadata", to: "/metadata" },
  { label: "Ready" },
];

const TopBar = () => {
  return (
    <header className="bg-background sticky top-0 z-50">
      <div className="flex items-center justify-between gap-8 px-4 py-7 sm:px-6">
        <Link to="/" className="flex flex-row items-center gap-2">
          <img src={icon} alt="The Data Refinery" className="h-11" />
          <span className="font-bold">The Data Refinery</span>
        </Link>
        <div className="text-muted-foreground flex flex-1 items-center gap-8 font-medium md:justify-center lg:gap-16">
          {navItems.map((item) =>
            item.to ? (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "max-md:hidden transition-colors hover:text-primary",
                    isActive && "text-primary",
                  )
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <span
                key={item.label}
                className="text-muted-foreground/50 max-md:hidden cursor-not-allowed"
              >
                {item.label}
              </span>
            ),
          )}
        </div>

        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon">
            <Settings />
            <span className="sr-only">Search</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger className="md:hidden" asChild>
              <Button variant="outline" size="icon">
                <MenuIcon />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              {navItems.map((item) =>
                item.to ? (
                  <DropdownMenuItem key={item.label} asChild>
                    <NavLink to={item.to}>{item.label}</NavLink>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    key={item.label}
                    disabled
                    className="text-muted-foreground/50"
                  >
                    {item.label}
                  </DropdownMenuItem>
                ),
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
