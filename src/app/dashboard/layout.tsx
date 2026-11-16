import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const auth = await createClient();
  const { data: session } = await auth.getSession();

  if (!session?.user) redirect("/login");

  // Data permissions are enforced by PostgreSQL RLS policies on Neon.
  return <>{children}</>;
}
