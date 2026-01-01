"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  label,
  error,
  placeholder = "Select",
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const selectRef = React.useRef<HTMLDivElement>(null);
  const id = React.useId();

  const selectedOption = options.find((opt) => opt.value === value);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setIsFocused(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className={cn("w-full", className)} ref={selectRef}>
      <div className="relative">
        {/* Floating label */}
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "absolute left-0 transition-all duration-300 ease-out pointer-events-none z-10",
              isFocused || isOpen || selectedOption
                ? "-top-2 text-xs tracking-widest uppercase"
                : "top-4 text-base",
              isFocused || isOpen
                ? "text-green-800" 
                : selectedOption 
                  ? "text-stone-600" 
                  : "text-stone-400"
            )}
          >
            {label}
          </label>
        )}

        <button
          id={id}
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setIsFocused(true);
          }}
          onBlur={() => !isOpen && setIsFocused(false)}
          style={{ backgroundColor: 'transparent' }}
          className={cn(
            "w-full py-4 text-left relative",
            "border-b-2 transition-all duration-300",
            "bg-transparent",
            isFocused || isOpen ? "border-green-800" : "border-stone-300",
            error && "border-red-400"
          )}
        >
          <span className={cn(
            "flex items-center gap-3",
            !selectedOption && "text-stone-400"
          )}>
            {selectedOption?.icon && (
              <span className="text-stone-500">{selectedOption.icon}</span>
            )}
            <span className={selectedOption ? "text-zinc-900" : "text-stone-400"}>
              {selectedOption?.label || placeholder}
            </span>
          </span>
          <ChevronDown
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 transition-all duration-300",
              isOpen ? "rotate-180 text-green-800" : "text-stone-400"
            )}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div 
            className="absolute z-50 mt-2 w-full rounded-sm shadow-lg overflow-hidden"
            style={{ backgroundColor: '#ffffff', border: '1px solid #e7e5e4' }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-4 py-3 text-sm text-left flex items-center gap-3",
                  "transition-colors duration-150",
                  value === option.value 
                    ? "text-green-800" 
                    : "text-zinc-700"
                )}
                style={{ 
                  backgroundColor: value === option.value ? '#f5f5f4' : '#ffffff'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fafaf9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = value === option.value ? '#f5f5f4' : '#ffffff';
                }}
              >
                {option.icon && (
                  <span className={value === option.value ? "text-green-800" : "text-stone-400"}>
                    {option.icon}
                  </span>
                )}
                {option.label}
              </button>
            ))}
          </div>
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