import * as React from "react"

import { cn } from "@/lib/utils"

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-s border border-border bg-input px-4 text-foreground outline-none",
        "placeholder:text-muted-foreground focus:border-primary",
        className
      )}
      {...props}
    />
  )
}
