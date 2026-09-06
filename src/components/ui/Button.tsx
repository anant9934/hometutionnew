import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline";
  size?: "default" | "sm" | "lg";
}

export const buttonVariants = {
  primary: "bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--accent)] hover:-translate-y-[2px]",
  ghost: "bg-transparent hover:text-[var(--accent)] hover:-translate-y-[2px]",
  outline: "bg-transparent border border-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:-translate-y-[2px]",
};

export const buttonSizes = {
  default: "h-11 px-6 py-2",
  sm: "h-9 px-4 py-1 text-sm",
  lg: "h-14 px-8 py-3 text-lg",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-[var(--radius-pill)] text-[0.95rem] font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
