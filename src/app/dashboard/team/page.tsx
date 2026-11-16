"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, LoaderCircle, MailPlus, ShieldCheck, Trash2, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Member = { id: string; user_id: string; display_name: string | null; role: "owner" | "co_owner" | "editor"; created_at: string };
type Invite = { id: string; email: string; role: "co_owner" | "editor"; created_at: string; expires_at: string; accepted_at: string | null };
type LinkItem = { id: string; url: string };

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"co_owner" | "editor">("editor");
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const db = createClient();
      const [m, i] = await Promise.all([
        db.from("store_members").select("id,user_id,display_name,role,created_at").order("created_at"),
        db.from("store_invitations").select("id,email,role,created_at,expires_at,accepted_at").order("created_at", { ascending: false }),
      ]);
      if (m.error) throw m.error;
      if (i.error) throw i.error;
      setMembers((m.data ?? []) as Member[]);
      setInvites((i.data ?? []) as Invite[]);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load team access.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function createInvite(event: FormEvent) {
    event.preventDefault();
    setBusy(true); setError(""); setMessage("");
    try {
      const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
      const db = createClient();
      const { data, error } = await db.rpc("create_store_invitation", { p_email: email.trim(), p_role: role, p_token: token });
      if (error) throw error;
      const url = window.location.origin + "/invite?token=" + encodeURIComponent(token);
      setLinks(current => [{ id: String(data), url }, ...current]);
      setEmail("");
      setMessage("Invitation created. Copy the private link and send it to the invited email address.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create invitation.");
    } finally {
      setBusy(false);
    }
  }

  async function updateRole(member: Member, nextRole: "co_owner" | "editor") {
    setError(""); setMessage("");
    try {
      const db = createClient();
      const { error } = await db.from("store_members").update({ role: nextRole }).eq("id", member.id);
      if (error) throw error;
      setMessage("Member role updated.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update role.");
    }
  }

  async function removeMember(member: Member) {
    if (!window.confirm("Remove " + (member.display_name || member.user_id) + " from the store?")) return;
    setError(""); setMessage("");
    try {
      const db = createClient();
      const { error } = await db.from("store_members").delete().eq("id", member.id);
      if (error) throw error;
      setMessage("Store access removed.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not remove member.");
    }
  }

  async function cancelInvite(invite: Invite) {
    try {
      const db = createClient();
      const { error } = await db.from("store_invitations").delete().eq("id", invite.id);
      if (error) throw error;
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not cancel invitation.");
    }
  }

  return <main className="min-h-screen bg-[#f4f8fb] px-5 py-7 text-slate-900 lg:px-10 lg:py-10"><div className="mx-auto max-w-6xl">
    <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500"><ArrowLeft size={16}/> Dashboard</Link>
    <div className="mt-8"><div className="text-xs font-bold tracking-[.18em] text-teal-700">ACCESS CONTROL / টিম</div><h1 className="mt-2 text-3xl font-black">Team & permissions</h1><p className="mt-2 text-sm text-slate-500">Invite people by private link and manage their store role.</p></div>
    {(error || message) && <div role={error ? "alert" : "status"} className={`mt-5 rounded-xl px-4 py-3 text-sm ${error ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{error || message}</div>}
    <div className="mt-7 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
      <section className="soft-card h-fit p-5 sm:p-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-cyan-50 p-3 text-cyan-800"><MailPlus size={20}/></div><div><h2 className="font-bold">Invite a team member</h2><p className="mt-1 text-xs text-slate-400">Link expires in 7 days and can be used once.</p></div></div>
        <form onSubmit={createInvite} className="mt-5 space-y-4"><label className="block text-xs font-bold text-slate-500">EMAIL ADDRESS<input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="person@example.com" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"/></label><label className="block text-xs font-bold text-slate-500">ROLE<select value={role} onChange={e => setRole(e.target.value as "co_owner" | "editor")} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"><option value="editor">Editor — stock & non-financial</option><option value="co_owner">Co-owner — full financial access</option></select></label><button disabled={busy} className="brand-gradient w-full rounded-xl px-4 py-3.5 text-sm font-bold text-white disabled:opacity-60">{busy ? <LoaderCircle className="mr-2 inline animate-spin" size={16}/> : <MailPlus className="mr-2 inline" size={16}/>} Create invitation link</button></form>
        {links.length > 0 && <div className="mt-5 space-y-3">{links.map(item => <div key={item.id} className="rounded-xl border border-cyan-100 bg-cyan-50/60 p-3"><div className="break-all text-xs text-slate-600">{item.url}</div><button onClick={() => navigator.clipboard.writeText(item.url)} className="mt-2 rounded-lg bg-white px-3 py-2 text-xs font-bold text-cyan-800"><Copy className="mr-1 inline" size={13}/> Copy invitation link</button></div>)}</div>}
      </section>
      <section className="soft-card p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-bold">Store members</h2><p className="mt-1 text-xs text-slate-400">{members.length} people with access</p></div><Users className="text-slate-400" size={21}/></div>
        <div className="mt-5 divide-y divide-slate-100">{loading ? <div className="py-10 text-center text-sm text-slate-400"><LoaderCircle className="mx-auto mb-2 animate-spin"/>Loading team...</div> : members.length === 0 ? <div className="py-10 text-center text-sm text-slate-400">No members yet. Bootstrap the first owner account first.</div> : members.map(member => <div key={member.id} className="flex flex-wrap items-center gap-3 py-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-800"><ShieldCheck size={18}/></div><div className="min-w-0 flex-1"><div className="truncate text-sm font-bold">{member.display_name || "Store member"}</div><div className="truncate text-[11px] text-slate-400">{member.user_id}</div></div>{member.role === "owner" ? <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">Owner</span> : <><select value={member.role} onChange={e => updateRole(member, e.target.value as "co_owner" | "editor")} className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-semibold"><option value="editor">Editor</option><option value="co_owner">Co-owner</option></select><button onClick={() => removeMember(member)} aria-label="Remove member" className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"><Trash2 size={16}/></button></>}</div>)}</div>
      </section>
    </div>
    <section className="soft-card mt-6 p-5 sm:p-6"><h2 className="font-bold">Invitation history</h2><div className="mt-4 divide-y divide-slate-100">{loading ? <p className="py-6 text-sm text-slate-400">Loading invitations...</p> : invites.length === 0 ? <p className="py-6 text-sm text-slate-400">No invitations created.</p> : invites.map(invite => <div key={invite.id} className="flex flex-wrap items-center gap-3 py-3"><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{invite.email}</div><div className="mt-1 text-[11px] text-slate-400">{invite.role.replace("_", " ")} · expires {new Date(invite.expires_at).toLocaleDateString()}</div></div><span className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${invite.accepted_at ? "bg-emerald-50 text-emerald-700" : new Date(invite.expires_at) < new Date() ? "bg-rose-50 text-rose-700" : "bg-cyan-50 text-cyan-800"}`}>{invite.accepted_at ? "Accepted" : new Date(invite.expires_at) < new Date() ? "Expired" : "Pending"}</span>{!invite.accepted_at && <button onClick={() => cancelInvite(invite)} aria-label="Cancel invitation" className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"><Trash2 size={15}/></button>}</div>)}</div></section>
  </div></main>;
}
