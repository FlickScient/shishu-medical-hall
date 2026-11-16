import { redirect } from "next/navigation";
import { auth } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/login");

  // Financial and membership permissions are enforced by Neon PostgreSQL RLS.
  return <>{children}</>;
}
