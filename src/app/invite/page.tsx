"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, LoaderCircle, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function InvitePage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => { const value = new URLSearchParams(window.location.search).get("token") || ""; setToken(value); if (!value) setError("This invitation link is missing its token."); }, []);

  async function accept() {
    const db = createClient();
    const { data, error } = await db.rpc("accept_store_invitation", { p_token: token });
    if (error) throw error;
    setMessage("Invitation accepted. Your store access is ready.");
    setTimeout(() => router.replace("/dashboard"), 700);
    return data;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!token) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const db = createClient();
      if (mode === "signup") {
        const { data, error } = await db.auth.signUp({ email, password, options: { data: { name } } });
        if (error) throw error;
        if (!data.session) {
          setMessage("Account created. Verify the email, then open this same invitation link and sign in to finish joining.");
          setMode("signin");
          return;
        }
      } else {
        const { error } = await db.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      await accept();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not accept this invitation.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="shell flex min-h-screen items-center justify-center px-5 py-12"><div className="w-full max-w-md"><Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500"><ArrowLeft size={16}/> Public website</Link><div className="soft-card p-7 sm:p-9"><div className="brand-gradient flex h-14 w-14 items-center justify-center rounded-2xl text-white"><LockKeyhole size={24}/></div><div className="mt-7 text-xs font-bold tracking-[.18em] text-teal-700">PRIVATE STORE INVITATION</div><h1 className="mt-2 text-3xl font-black">{mode === "signup" ? "Join the store team." : "Welcome back."}</h1><p className="mt-2 text-sm leading-6 text-slate-500">Create or sign in to the email address this invitation was sent to. The invitation is checked against your verified account email.</p>
    <div className="mt-6 flex rounded-xl bg-slate-100 p-1"><button type="button" onClick={() => setMode("signup")} className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold ${mode === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>Create account</button><button type="button" onClick={() => setMode("signin")} className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold ${mode === "signin" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>Sign in</button></div>
    <form onSubmit={submit} className="mt-6 space-y-4">{mode === "signup" && <label className="block text-xs font-bold text-slate-500">YOUR NAME<input required value={name} onChange={e => setName(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" placeholder="Full name"/></label>}<label className="block text-xs font-bold text-slate-500">INVITED EMAIL<input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" placeholder="you@example.com"/></label><label className="block text-xs font-bold text-slate-500">PASSWORD<input required type="password" minLength={8} value={password} onChange={e => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" placeholder="At least 8 characters"/></label><button disabled={busy || !token} className="brand-gradient w-full rounded-xl px-4 py-4 text-sm font-bold text-white disabled:opacity-60">{busy ? <LoaderCircle className="mr-2 inline animate-spin" size={16}/> : <CheckCircle2 className="mr-2 inline" size={16}/>} {mode === "signup" ? "Create account & join" : "Sign in & accept invitation"}</button></form>
    {message && <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs leading-5 text-emerald-800">{message}</p>}{error && <p role="alert" className="mt-4 break-words text-xs leading-5 text-rose-700">{error}</p>}
    <p className="mt-6 text-[11px] leading-5 text-slate-400">Invitation links are single-use, expire after 7 days, and only work for the email address invited by the store owner.</p>
  </div></div></main>;
}
