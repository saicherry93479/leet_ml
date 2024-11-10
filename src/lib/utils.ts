import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function env(key: string): string {
  // First try Astro's import.meta.env
  const astroEnvValue = import.meta.env[key];
  if (astroEnvValue !== undefined) {
    return astroEnvValue;
  }

  // Fallback to process.env if running in Node.js production
  if (process.env[key] !== undefined) {
    return process.env[key] as string;
  }

  // If neither exists, throw an error
  throw new Error(`Environment variable ${key} is not defined`);
}
