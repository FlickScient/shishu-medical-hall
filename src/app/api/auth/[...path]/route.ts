import { auth } from "@/lib/supabase/server";

export const { GET, POST } = auth.handler();
