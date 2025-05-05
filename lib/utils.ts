import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Combine tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format numbers with thousand separators
export function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}
