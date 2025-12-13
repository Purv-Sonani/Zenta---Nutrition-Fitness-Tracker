import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, label, error, id, ...props }, ref) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        className={cn(
          // Updated focus colors to use 'primary' instead of 'blue-500'
          "relative block w-full appearance-none rounded-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-1 sm:text-sm transition-colors",
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-primary focus:ring-primary",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500 font-medium animate-pulse">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
