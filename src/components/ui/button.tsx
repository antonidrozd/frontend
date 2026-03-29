import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
};

export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium outline-none transition-all",
        "disabled:pointer-events-none disabled:opacity-50",
        "[&_svg]:shrink-0",
        variant === "default" && "bg-primary text-primary-foreground",
        variant === "outline" && "border border-border bg-background hover:bg-muted",
        variant === "secondary" && "bg-secondary text-secondary-foreground",
        variant === "ghost" && "hover:bg-muted hover:text-foreground",
        variant === "destructive" && "bg-destructive/10 text-destructive hover:bg-destructive/20",
        variant === "link" && "text-primary underline-offset-4 hover:underline",
        size === "default" && "h-10 px-4 text-sm",
        size === "sm" && "h-9 px-3 text-sm",
        size === "lg" && "h-15 px-9 text-base",
        size === "icon" && "size-10 p-0",
        className,
      )}
      {...props}
    />
  );
}
