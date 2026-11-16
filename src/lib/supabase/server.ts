import { createAuthClient } from "@neondatabase/neon-js/auth/next";

export async function createClient() {
  return createAuthClient();
}
