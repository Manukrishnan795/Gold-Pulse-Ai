import { createClient } from "@supabase/supabase-js";

// Public, read-only client (anon key + RLS). Safe to use in Server or
// Client Components — never put the service-role key behind this file.
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing Supabase public env vars");
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}
