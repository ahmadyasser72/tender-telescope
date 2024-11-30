import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const base64 = {
  decode: (s: string) => atob(s),
  encode: (s: string) => btoa(s),
};

export const sleep = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration));

export const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const isBrowser = !import.meta.env.SSR;
