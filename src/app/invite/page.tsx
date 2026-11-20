"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, LoaderCircle, LockKeyhole, MailCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup" | "verify";

export default function InvitePage() {
  const router = useRouter();
  const [inviteToken, setInviteToken] = useState("");
  const [mode, setMode] = useState<Mode>("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("token") || "";
    setInviteToken(value);
    if (!value) setError("This invitation link is missing its token. Ask the store owner for a fresh invitation.");
  }, []);

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    setMessage("");
  }

  async function acceptInvitation() {
    const db = createClient();
    const { error: acceptError } = await db.rpc("accept_store_invitation", { p_token: inviteToken });
    if (acceptError) throw acceptError;
    setMessage("Invitation accepted. Opening your store workspace…");
    router.replace("/dashboard");
    router.refresh();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!inviteToken) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const db = createClient();
      const normalizedEmail = email.trim().toLowerCase();

      if (mode === "signup") {
        const { data, error: signUpError } = await db.auth.signUp({
          email: normalizedEmail,
          password,
          options: { data: { name: name.trim() } },
        });
        if (signUpError) throw signUpError;
        if (!data.session) {
          setMode("verify");
          setMessage("Your account was created. Enter the six-digit verification code sent to this email to finish joining the store.");
          return;
        }
      } else if (mode === "verify") {
        const { data, error: verifyError } = await db.auth.verifyOtp({
          email: normalizedEmail,
          token: otp.trim(),
          type: "signup",
        });
        if (verifyError) throw verifyError;
        if (!data.session) {
          const { error: signInError } = await db.auth.signInWithPassword({ email: normalizedEmail, password });
          if (signInError) throw signInError;
        }
      } else {
        const { error: signInError } = await db.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });
        if (signInError) throw signInError;
      }

      await acceptInvitation();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not complete this invitation.");
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
      setMessage("A fresh verification code has been sent. Check your inbox and spam folder.");
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
          <div className="auth-mark"><LockKeyhole size={23}/></div>
          <span className="auth-eyebrow">SHISHU MEDICAL HALL / PRIVATE ACCESS</span>
          <h1>{mode === "signup" ? "Your workspace awaits." : mode === "verify" ? "Verify your email." : "Welcome back."}</h1>
          <p className="auth-lede">{mode === "verify" ? "Enter the code sent to your invited email. Once verified, your invitation will be accepted automatically." : "Only the email address invited by the store owner can join this workspace."}</p>

          {mode !== "verify" && <div className="auth-switch">
            <button type="button" className={mode === "signup" ? "active" : ""} onClick={() => switchMode("signup")}>Create account</button>
            <button type="button" className={mode === "signin" ? "active" : ""} onClick={() => switchMode("signin")}>Sign in</button>
          </div>}

          <form onSubmit={submit} className="auth-form">
            {mode === "signup" && <label>Your name<input required value={name} onChange={e=>setName(e.target.value)} autoComplete="name" placeholder="Full name"/></label>}
            <label>Invited email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com"/></label>
            {mode !== "verify" && <label>Password<input required type="password" minLength={8} value={password} onChange={e=>setPassword(e.target.value)} autoComplete={mode==="signup"?"new-password":"current-password"} placeholder="At least 8 characters"/></label>}
            {mode === "verify" && <label>Six-digit verification code<input required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="123456" className="auth-otp"/></label>}
            <button className="auth-submit" disabled={busy || !inviteToken}>{busy?<LoaderCircle size={16} className="animate-spin"/>:mode==="verify"?<MailCheck size={16}/>:<CheckCircle2 size={16}/>} {busy?"Please wait…":mode==="signup"?"Create account & join":mode==="verify"?"Verify & accept invitation":"Sign in & accept invitation"}</button>
          </form>
          {mode === "verify" && <div className="auth-inline-actions"><button type="button" disabled={busy} onClick={resendCode}>Resend code</button><button type="button" disabled={busy} onClick={()=>switchMode("signin")}>Already verified? Sign in</button></div>}
          {message && <p role="status" className="auth-message">{message}</p>}
          {error && <p role="alert" className="auth-error">{error}</p>}
          <div className="auth-footnote">Invitation links are single-use and expire after seven days. Your account must use the email address that received the invitation.</div>
        </section>
      </div>
    </main>
  );
}
