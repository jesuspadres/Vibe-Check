"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, leftIcon, ...props }, ref) => {
    const id = React.useId();
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value.length > 0);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };

    return (
      <div className="w-full space-y-1">
        <div className="relative">
          {leftIcon && (
            <div className={cn(
              "absolute left-0 top-4 transition-colors duration-300",
              isFocused ? "text-green-800" : "text-stone-400"
            )}>
              {leftIcon}
            </div>
          )}
          <input
            id={id}
            type={type}
            className={cn(
              "w-full bg-transparent py-4 text-zinc-900",
              "border-0 border-b-2 border-stone-300",
              "transition-all duration-300",
              "focus:outline-none focus:border-green-800",
              "placeholder:text-transparent",
              leftIcon && "pl-8",
              error && "border-red-400 focus:border-red-400",
              className
            )}
            ref={ref}
            placeholder={label}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
          {label && (
            <label
              htmlFor={id}
              className={cn(
                "absolute left-0 transition-all duration-300 ease-out pointer-events-none",
                leftIcon && "left-8",
                isFocused || hasValue
                  ? "-top-2 text-xs tracking-widest uppercase"
                  : "top-4 text-base",
                isFocused 
                  ? "text-green-800" 
                  : hasValue 
                    ? "text-stone-600" 
                    : "text-stone-400",
                error && (isFocused || hasValue) && "text-red-500"
              )}
            >
              {label}
            </label>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-500 pt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };