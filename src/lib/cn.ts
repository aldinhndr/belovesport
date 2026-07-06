import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges class names using clsx for conditional logic and
 * tailwind-merge to eliminate conflicting Tailwind utilities.
 *
 * @example
 *   cn('px-4 py-2', isActive && 'bg-brand-pink', 'px-6') // → 'py-2 bg-brand-pink px-6'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
