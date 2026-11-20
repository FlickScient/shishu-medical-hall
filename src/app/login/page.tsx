"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, LoaderCircle, LockKeyhole, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const db = createClient();
      const { error: signInError } = await db.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (signInError) throw signInError;
      const requested = new URLSearchParams(window.location.search).get("next");
      const destination = requested && requested.startsWith("/dashboard") && !requested.startsWith("//")
        ? requested
        : "/dashboard";
      router.replace(destination);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to sign in. Check your email and password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-layout">
        <Link href="/" className="auth-back"><ArrowLeft size={15}/> Back to website</Link>
        <section className="auth-card">
          <div className="auth-mark"><LockKeyhole size={23}/></div>
          <span className="auth-eyebrow">SHISHU MEDICAL HALL / STORE PORTAL</span>
          <h1>Good to have you back.</h1>
          <p className="auth-lede">Sign in to your private store workspace. Your business records stay behind this secure account.</p>
          <form onSubmit={submit} className="auth-form">
            <label>Email address<input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label>
            <label>Password<input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password"/></label>
            <button className="auth-submit" disabled={busy}>{busy?<LoaderCircle size={16} className="animate-spin"/>:<ArrowRight size={16}/>} {busy?"Signing in…":"Sign in to workspace"}</button>
          </form>
          {error && <p role="alert" className="auth-error">{error}</p>}
          <div className="auth-first-owner">
            <ShieldCheck size={18}/>
            <div><b>Setting up the store for the first time?</b><p>Create the first Owner account with the private one-time setup code.</p><Link href="/setup">Open first-time owner setup <ArrowRight size={13}/></Link></div>
          </div>
          <div className="auth-footnote">Team members must use the private invitation link sent by the store owner. There is no public registration.</div>
        </section>
      </div>
    </main>
  );
}
