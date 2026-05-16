import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import slugifyLib from "slugify";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string as "January 1, 2025"
 */
export function formatDate(date) {
  if (!date) return "";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMMM d, yyyy");
}

/**
 * Format a date as "3 days ago"
 */
export function timeAgo(date) {
  if (!date) return "";
  const d = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

/**
 * Estimate read time from HTML content (avg 200 wpm)
 */
export function estimateReadTime(htmlContent) {
  if (!htmlContent) return 1;
  const text = htmlContent
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const wordCount = text.split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Generate a URL-safe slug from a title
 */
export function generateSlug(title) {
  return slugifyLib(title, {
    lower: true,
    strict: true,
    trim: true,
  });
}

/**
 * Truncate text to a max length, adding ellipsis
 */
export function truncate(text, maxLength = 160) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

/**
 * Strip HTML tags from a string
 */
export function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Get absolute URL for Open Graph, sitemaps, etc.
 */
export function absoluteUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${base}${path}`;
}
