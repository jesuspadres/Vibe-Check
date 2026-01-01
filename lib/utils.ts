import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatHandle(handle: string, platform: "twitter" | "instagram"): string {
  const cleanHandle = handle.startsWith("@") ? handle.slice(1) : handle;
  return `@${cleanHandle}`;
}

export function getProfileUrl(handle: string, platform: "twitter" | "instagram"): string {
  const cleanHandle = handle.startsWith("@") ? handle.slice(1) : handle;
  if (platform === "twitter") {
    return `https://x.com/${cleanHandle}`;
  }
  return `https://instagram.com/${cleanHandle}`;
}

export function truncateUrl(url: string, maxLength: number = 40): string {
  if (url.length <= maxLength) return url;
  
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace("www.", "");
    if (domain.length <= maxLength - 5) {
      return `${domain}...`;
    }
    return domain.slice(0, maxLength - 3) + "...";
  } catch {
    return url.slice(0, maxLength - 3) + "...";
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Calculate difference between two axis scores
export function calculateAxisDifference(
  score1: number,
  score2: number
): { difference: number; alignment: "high" | "medium" | "low" } {
  const diff = Math.abs(score1 - score2);
  
  if (diff <= 15) {
    return { difference: diff, alignment: "high" };
  }
  if (diff <= 35) {
    return { difference: diff, alignment: "medium" };
  }
  return { difference: diff, alignment: "low" };
}
