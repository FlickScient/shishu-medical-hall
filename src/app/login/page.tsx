"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LockKeyhole, LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage(){
 const router=useRouter();
 const [email,setEmail]=useState("");
 const [password,setPassword]=useState("");
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();setBusy(true);setError("");
  try{
   const supabase=createClient();
   const {error}=await supabase.auth.signInWithPassword({email,password});
   if(error) throw error;
   router.replace("/dashboard");router.refresh();
  }catch(err){setError(err instanceof Error?err.message:"Unable to sign in.");}
  finally{setBusy(false);}
 }
 return <main className="shell flex min-h-screen items-center justify-center px-5 py-12"><div className="w-full max-w-md"><Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500"><ArrowLeft size={16}/> Back to website</Link><div className="soft-card p-7 sm:p-9"><div className="brand-gradient flex h-14 w-14 items-center justify-center rounded-2xl text-white"><LockKeyhole size={25}/></div><div className="mt-7 text-xs font-bold tracking-[.18em] text-teal-700">PRIVATE STORE WORKSPACE</div><h1 className="mt-2 text-3xl font-black">Welcome back.</h1><p className="mt-2 text-sm leading-6 text-slate-500">Sign in to manage Shishu Medical Hall.</p><form onSubmit={submit} className="mt-8 space-y-5"><div><label className="mb-2 block text-xs font-bold text-slate-500">EMAIL ADDRESS</label><input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-400" placeholder="you@example.com"/></div><div><label className="mb-2 block text-xs font-bold text-slate-500">PASSWORD</label><input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-400" placeholder="Your password"/></div><button disabled={busy} className="brand-gradient w-full rounded-xl px-4 py-4 text-sm font-bold text-white disabled:opacity-60">{busy?<LoaderCircle className="mr-2 inline animate-spin" size={16}/>:""}Sign in</button>{error&&<p role="alert" className="break-words text-xs leading-5 text-rose-700">{error}</p>}</form><p className="mt-6 text-xs leading-5 text-slate-400">Access is invitation-only. Ask the store owner to create your account and assign your role.</p></div></div></main>;
}
