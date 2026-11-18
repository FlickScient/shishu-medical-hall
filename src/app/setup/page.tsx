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
    const { error: signInError } = await db.auth.signInWithPassword({ email, password });
    if (signInError) throw signInError;

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
    <main className="shell flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
          <ArrowLeft size={16} /> Public website
        </Link>
        <div className="soft-card p-7 sm:p-9">
          <div className="brand-gradient flex h-14 w-14 items-center justify-center rounded-2xl text-white">
            {mode === "verify" ? <MailCheck size={25} /> : <ShieldCheck size={25} />}
          </div>
          <div className="mt-7 text-xs font-bold tracking-[.18em] text-teal-700">ONE-TIME INITIALIZATION</div>
          <h1 className="mt-2 text-3xl font-black">
            {mode === "verify" ? "Verify your email." : mode === "signin" ? "Continue owner setup." : "Set up the store owner."}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {mode === "verify"
              ? "Enter the 6-digit verification code sent to your email. After verification, we will sign you in and initialize the owner account."
              : "Create the first Owner account using a verified email and the private one-time setup code supplied by the project administrator."}
          </p>

          <div className="mt-6 flex rounded-xl bg-slate-100 p-1">
            <button type="button" onClick={() => changeMode("signup")} className={`flex-1 rounded-lg px-2 py-2 text-xs font-bold ${mode === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>Create account</button>
            <button type="button" onClick={() => changeMode("verify")} className={`flex-1 rounded-lg px-2 py-2 text-xs font-bold ${mode === "verify" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>Verify email</button>
            <button type="button" onClick={() => changeMode("signin")} className={`flex-1 rounded-lg px-2 py-2 text-xs font-bold ${mode === "signin" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>Sign in</button>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <label className="block text-xs font-bold text-slate-500">YOUR NAME
                <input required value={name} onChange={e => setName(e.target.value)} placeholder="Full name" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" />
              </label>
            )}
            <label className="block text-xs font-bold text-slate-500">EMAIL ADDRESS
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="owner@example.com" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" />
            </label>
            {mode !== "verify" && (
              <label className="block text-xs font-bold text-slate-500">PASSWORD
                <input required type="password" minLength={8} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" />
              </label>
            )}
            {mode === "verify" && (
              <label className="block text-xs font-bold text-slate-500">6-DIGIT EMAIL VERIFICATION CODE
                <input required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\\D/g, "").slice(0, 6))} placeholder="123456" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-center text-lg font-bold tracking-[.35em]" />
              </label>
            )}
            <label className="block text-xs font-bold text-slate-500">PRIVATE SETUP CODE
              <div className="relative mt-2">
                <KeyRound className="absolute left-3 top-3 text-slate-400" size={16} />
                <input required value={token} onChange={e => setToken(e.target.value)} placeholder="64-character one-time code" className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm" />
              </div>
            </label>
            <button disabled={busy} className="brand-gradient w-full rounded-xl px-4 py-4 text-sm font-bold text-white disabled:opacity-60">
              {busy ? <LoaderCircle className="mr-2 inline animate-spin" size={16} /> : mode === "verify" ? <MailCheck className="mr-2 inline" size={16} /> : <ShieldCheck className="mr-2 inline" size={16} />}
              {busy ? "Please wait…" : mode === "signup" ? "Create account & continue" : mode === "verify" ? "Verify email & initialize owner" : "Sign in & initialize owner"}
            </button>
          </form>

          {mode === "verify" && (
            <button type="button" disabled={busy} onClick={resendCode} className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-600 disabled:opacity-50">
              Resend verification code
            </button>
          )}
          {message && <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs leading-5 text-emerald-800">{message}</p>}
          {error && <p role="alert" className="mt-4 break-words text-xs leading-5 text-rose-700">{error}</p>}
          <p className="mt-6 text-[11px] leading-5 text-slate-400">The email code verifies your identity. The private setup code separately authorizes creation of the first Owner account. The setup code can be used once, expires after 7 days, and is stored only as a hash in the database.</p>
        </div>
      </div>
    </main>
  );
}
