import { MenuIcon, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import icon from "@/assets/icon.webp";

const TopBar = () => {
  return (
    <header className="bg-background sticky top-0 z-50">
      <div className="flex items-center justify-between gap-8 px-4 py-7 sm:px-6">
        <div className="flex flex-row items-center gap-2">
          <img src={icon} alt="The Data Refinery" className="h-11" />
          <span className="font-bold">The Data Refinery</span>
        </div>
        <div className="text-muted-foreground flex flex-1 items-center gap-8 font-medium md:justify-center lg:gap-16">
          <a href="#" className="hover:text-primary max-md:hidden">
            Upload
          </a>
          <a href="#" className="hover:text-primary max-md:hidden">
            Validation
          </a>
          <a href="#" className="hover:text-primary max-md:hidden">
            Metadata
          </a>
          <a href="#" className="hover:text-primary max-md:hidden">
            Ready
          </a>
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
            <DropdownMenuContent
              className="w-56"
              align="end"
            ></DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
