"use client";

import { createClient as createNeonClient, SupabaseAuthAdapter } from "@neondatabase/neon-js";

export function createClient() {
  const authUrl = process.env.NEXT_PUBLIC_NEON_AUTH_URL;
  const dataApiUrl = process.env.NEXT_PUBLIC_NEON_DATA_API_URL;

  if (!authUrl || !dataApiUrl) {
    throw new Error("Neon Auth and Data API environment variables are missing.");
  }

  // SupabaseAuthAdapter preserves the existing .from() and signInWithPassword()
  // call sites while routing both auth and PostgREST queries through Neon.
  return createNeonClient({
    auth: { adapter: SupabaseAuthAdapter(), url: authUrl },
    dataApi: { url: dataApiUrl },
  });
}
