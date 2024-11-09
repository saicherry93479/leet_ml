import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function env(key: string): string {
  if (import.meta.env.DEV) {
    return import.meta.env[key];
  }
  // @ts-ignore Deno is available during runtime
  return Deno.env.get(key) || "";
}
