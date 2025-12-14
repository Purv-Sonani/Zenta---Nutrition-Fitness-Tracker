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
  // 🛑 FAANG-Standard: Prevent invalid chars in number inputs
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === "number") {
      // Block 'e', 'E', '+', and '-'
      if (["e", "E", "+", "-"].includes(e.key)) {
        e.preventDefault();
      }
    }
    // Pass through any existing onKeyDown prop if provided
    if (props.onKeyDown) {
      props.onKeyDown(e);
    }
  };

  return (
    <div className="w-full space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={type}
          ref={ref}
          min={type === "number" ? 0 : undefined} // Logic: Default min 0 for numbers
          onKeyDown={handleKeyDown} // Logic: Block negative typing
          className={cn(
            "block w-full rounded-lg border px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm transition-all",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            // 👇 CSS FIX: Hide browser default spinners (appearance-none)
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-primary focus:ring-primary/20",
            className
          )}
          {...props}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-500 text-sm sm:text-base">{suffix}</span>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500 animate-pulse">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
