import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  suffix?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, label, error, suffix, id, type, ...props }, ref) => {
  // Prevent invalid chars in number inputs
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === "number" && ["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
    if (props.onKeyDown) {
      props.onKeyDown(e);
    }
  };

  return (
    <div className="w-full space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-(--foreground)">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={type}
          ref={ref}
          min={type === "number" ? 0 : undefined}
          onKeyDown={handleKeyDown}
          className={cn(
            "block w-full rounded-lg border px-3 py-2 shadow-sm transition-all",
            "bg-(--surface) text-(--foreground) placeholder:text-(--border-strong)",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            error ? "border-red-500 focus:border-red-500 focus:ring-red-300" : "border-(--border-subtle) focus:border-(--color-primary) focus:ring-(--color-primary)/20",
            className
          )}
          {...props}
        />

        {suffix && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-(--border-strong) text-sm sm:text-base">{suffix}</span>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500 animate-pulse">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
