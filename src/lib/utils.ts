import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const usd = (n: number, opts: Intl.NumberFormatOptions = {}) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    ...opts,
  });

export const usd0 = (n: number) =>
  usd(n, { maximumFractionDigits: 0, minimumFractionDigits: 0 });

export const pct = (n: number, digits = 1) =>
  `${n >= 0 ? "" : ""}${n.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;

export const btc = (n: number) =>
  `${n.toLocaleString("en-US", { maximumFractionDigits: 6 })} BTC`;

export const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);
