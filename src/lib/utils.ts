import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names, letting later Tailwind utilities win over earlier ones.
 *
 * Without the merge step a call-site override such as `rounded-sm` would lose to
 * a component's default `rounded-lg`, which is exactly the kind of invisible
 * styling bug this site needs to avoid.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
