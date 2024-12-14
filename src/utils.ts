import { isTauri as isTauriFn } from "@tauri-apps/api/core";
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

export const padNumber = (value: number, width = 2) =>
  value.toString().padStart(width, "0");
export const titleCase = (value: string) =>
  value
    .toLowerCase()
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

export const range = (to: number) =>
  Array.from({ length: to }, (_, idx) => idx);
export const range2 = (from: number, to: number) =>
  Array.from({ length: to - from }, (_, idx) => from + idx);

// https://docs.python.org/3/library/itertools.html#itertools.combinations
export function* combinations<T>(iterable: T[], r: number) {
  const pool = [...iterable];
  const n = pool.length;
  if (r > n) return;
  const indices = range(r);

  yield indices.map((idx) => pool[idx]);
  while (true) {
    let i = 0;
    for (i of range(r).reverse()) {
      if (indices[i] != i + n - r) break;
      else if (i === 0) return;
    }

    indices[i] += 1;
    for (const j of range2(i + 1, r)) indices[j] = indices[j - 1] + 1;
    yield indices.map((idx) => pool[idx]);
  }
}

export const isBrowser = !import.meta.env.SSR;
export const isTauri = isBrowser && isTauriFn();
export const isTauriAndroid = isTauri && navigator.maxTouchPoints > 0;
