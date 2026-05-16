import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Fallback placeholders allow the build to succeed before env vars are set.
  // Replace with real values in .env.local before running.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key",
  );
}
