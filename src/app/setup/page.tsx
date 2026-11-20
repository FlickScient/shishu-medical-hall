"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound, LoaderCircle, ShieldCheck, MailCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "signup" | "verify" | "signin";

export default function InitialOwnerSetupPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function changeMode(next: Mode) {
    setMode(next);
    setError("");
    setMessage("");
  }

  async function initializeOwner(db: ReturnType<typeof createClient>) {
    const { data: currentSession, error: sessionError } = await db.auth.getSession();
    if (sessionError) throw sessionError;
    if (!currentSession.session?.user?.id) {
      const { error: signInError } = await db.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
      if (signInError) throw signInError;
    }
    if (token.trim().length !== 64) throw new Error("The private setup code must be exactly 64 characters.");

    const { error: setupError } = await db.rpc("bootstrap_store_owner", { p_token: token.trim() });
    if (setupError) throw setupError;

    setMessage("Initial owner access created successfully. Redirecting to your store…");
    router.replace("/dashboard");
    router.refresh();
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const db = createClient();

      if (mode === "signup") {
        const { data, error: signUpError } = await db.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: { data: { name: name.trim() } },
        });
        if (signUpError) throw signUpError;

        if (!data.session) {
          setMode("verify");
          setMessage("A verification code has been sent to your email. Enter that 6-digit code below to verify your account.");
          return;
        }

        await initializeOwner(db);
        return;
      }

      if (mode === "verify") {
        const { error: verifyError } = await db.auth.verifyOtp({
          email: email.trim().toLowerCase(),
          token: otp.trim(),
          type: "signup",
        });
        if (verifyError) throw verifyError;

        await initializeOwner(db);
        return;
      }

      await initializeOwner(db);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not complete initial owner setup.");
    } finally {
      setBusy(false);
    }
  }

  async function resendCode() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const db = createClient();
      const { error: resendError } = await db.auth.resend({
        type: "signup",
        email: email.trim().toLowerCase(),
      });
      if (resendError) throw resendError;
      setMessage("A new verification code has been sent. Check your inbox and spam folder.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not resend the verification code.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-layout">
        <Link href="/" className="auth-back"><ArrowLeft size={15}/> Public website</Link>
        <section className="auth-card">
          <div className="auth-mark">{mode === "verify" ? <MailCheck size={23}/> : <ShieldCheck size={23}/>}</div>
          <span className="auth-eyebrow">SHISHU MEDICAL HALL / INITIAL OWNER ACCESS</span>
          <h1>{mode === "verify" ? "Verify your email." : mode === "signin" ? "Continue owner setup." : "Create the owner account."}</h1>
          <p className="auth-lede">{mode === "verify" ? "Enter the six-digit code sent to your email. After verification, your first Owner access will be initialized." : "This private setup creates the first Owner account. You need a verified email and the one-time setup code from the project administrator."}</p>

          <div className="auth-switch auth-switch-three">
            <button type="button" className={mode==="signup"?"active":""} onClick={()=>changeMode("signup")}>Create account</button>
            <button type="button" className={mode==="verify"?"active":""} onClick={()=>changeMode("verify")}>Verify email</button>
            <button type="button" className={mode==="signin"?"active":""} onClick={()=>changeMode("signin")}>Sign in</button>
          </div>

          <form onSubmit={submit} className="auth-form">
            {mode === "signup" && <label>Your name<input required value={name} onChange={e=>setName(e.target.value)} autoComplete="name" placeholder="Full name"/></label>}
            <label>Email address<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" placeholder="owner@example.com"/></label>
            {mode !== "verify" && <label>Password<input required type="password" minLength={8} value={password} onChange={e=>setPassword(e.target.value)} autoComplete={mode==="signup"?"new-password":"current-password"} placeholder="At least 8 characters"/></label>}
            {mode === "verify" && <label>Six-digit email verification code<input required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,"").slice(0,6))} className="auth-otp" placeholder="123456"/></label>}
            <label>Private one-time setup code<input required minLength={64} maxLength={64} autoComplete="off" value={token} onChange={e=>setToken(e.target.value.slice(0,64))} placeholder="Paste your 64-character setup code"/></label>
            <button className="auth-submit" disabled={busy}>{busy?<LoaderCircle size={16} className="animate-spin"/>:mode==="verify"?<MailCheck size={16}/>:<ShieldCheck size={16}/>} {busy?"Please wait…":mode==="signup"?"Create account & continue":mode==="verify"?"Verify email & initialize owner":"Sign in & initialize owner"}</button>
          </form>

          {mode === "verify" && <div className="auth-inline-actions"><button type="button" disabled={busy} onClick={resendCode}>Resend verification code</button><button type="button" disabled={busy} onClick={()=>changeMode("signin")}>Already verified? Sign in</button></div>}
          {message && <p role="status" className="auth-message">{message}</p>}
          {error && <p role="alert" className="auth-error">{error}</p>}
          <div className="auth-footnote">The email code verifies your email address. The separate private setup code authorizes first-owner creation and is accepted only once. Keep it private.</div>
        </section>
      </div>
    </main>
  );
}
