import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({children}:{children:React.ReactNode}){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user) redirect("/login");
 const {data:member,error}=await supabase.from("store_members").select("role,display_name").eq("user_id",user.id).maybeSingle();
 if(error || !member) redirect("/access-denied");
 return <>{children}</>;
}
