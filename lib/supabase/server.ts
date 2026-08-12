import { createClient } from "@supabase/supabase-js";

// Server-only client. Uses the service-role key, which bypasses RLS —
// never import this file from a client component.
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing Supabase server env vars");
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
