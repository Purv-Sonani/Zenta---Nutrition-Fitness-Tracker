import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Loader } from "./Loader";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "outline";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, children, isLoading, variant = "primary", disabled, ...props }, ref) => {
  // Base styles
  const baseStyles = "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // Variants using design tokens
  const variants = {
    primary: "bg-(--color-primary) text-(--color-primary-foreground) hover:bg-(--color-primary-hover) focus:ring-(--color-primary) border border-transparent",
    secondary: "bg-(--surface-muted) text-(--foreground) hover:bg-(--border-subtle) focus:ring-(--border-strong) border border-transparent",
    outline: "bg-transparent border border-(--border-strong) text-(--foreground) hover:bg-(--surface-muted) focus:ring-(--color-primary)",
  };

  return (
    <button ref={ref} disabled={disabled || isLoading} className={cn(baseStyles, variants[variant], className)} {...props}>
      {isLoading && <Loader className="mr-2 h-4 w-4" />}
      {children}
    </button>
  );
});

Button.displayName = "Button";
