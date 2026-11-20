"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity, ArrowDownLeft, ArrowUpRight, Boxes, CalendarDays, ChevronRight,
  CircleDollarSign, ClipboardList, LayoutDashboard, PackagePlus, PackageSearch,
  Settings, ShoppingBasket, Users, Languages, LoaderCircle
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Role = "owner" | "co_owner" | "editor";
type Module = { href: string; icon: typeof Activity; title: string; bn: string; desc: string; bnDesc: string; finance?: boolean; ownerOnly?: boolean };

const modules: Module[] = [
  { href: "/dashboard/transactions", icon: Activity, title: "Transactions", bn: "আয় ও ব্যয়", desc: "Quick amount-first entries", bnDesc: "দ্রুত আয় ও ব্যয়ের হিসাব", finance: true },
  { href: "/dashboard/sales", icon: ShoppingBasket, title: "Daily sales", bn: "দৈনিক বিক্রি", desc: "Sales, cost & gross profit", bnDesc: "বিক্রি, খরচ ও মোট লাভ", finance: true },
  { href: "/dashboard/purchases", icon: PackagePlus, title: "Purchases", bn: "ক্রয় ব্যবস্থাপনা", desc: "Supplier orders and receiving", bnDesc: "সরবরাহকারীর অর্ডার ও মাল গ্রহণ", finance: true },
  { href: "/dashboard/inventory", icon: Boxes, title: "Inventory", bn: "স্টক ব্যবস্থাপনা", desc: "Stock, batches & expiry", bnDesc: "স্টক, ব্যাচ ও মেয়াদ", },
  { href: "/dashboard/shortages", icon: PackageSearch, title: "Shortages", bn: "ওষুধের সংকট", desc: "Low stock & company requests", bnDesc: "কম স্টক ও কোম্পানির কাছে চাহিদা" },
  { href: "/dashboard/dues", icon: ClipboardList, title: "Due & debt", bn: "বাকি ও দেনা", desc: "Customer and supplier ledgers", bnDesc: "কাস্টমার বাকি ও কোম্পানির দেনা", finance: true },
  { href: "/dashboard/suppliers", icon: Users, title: "Suppliers", bn: "সরবরাহকারী", desc: "Company and MPO directory", bnDesc: "কোম্পানি ও MPO যোগাযোগ" },
  { href: "/dashboard/medicines", icon: CircleDollarSign, title: "Medicine database", bn: "ওষুধের তথ্য", desc: "Search brands and generics", bnDesc: "ব্র্যান্ড ও জেনেরিক খুঁজুন" },
  { href: "/dashboard/reports", icon: CalendarDays, title: "Reports", bn: "রিপোর্ট", desc: "Daily and monthly overview", bnDesc: "দৈনিক ও মাসিক সারসংক্ষেপ", finance: true },
  { href: "/dashboard/team", icon: Users, title: "Team access", bn: "টিম ও অনুমতি", desc: "Invite members and manage roles", bnDesc: "সদস্য আমন্ত্রণ ও ভূমিকা পরিচালনা", ownerOnly: true },
];

const money = (value: number) => "৳ " + value.toLocaleString("en-BD", { maximumFractionDigits: 2 });

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("editor");
  const [figures, setFigures] = useState({ income: 0, expense: 0, sales: 0, lowStock: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lang, setLang] = useState<"en" | "bn">("en");
  const isBn = lang === "bn";
  const canSeeFinances = role === "owner" || role === "co_owner";

  useEffect(() => {
    const saved = window.localStorage.getItem("shishu-dashboard-language");
    if (saved === "bn" || saved === "en") setLang(saved);
  }, []);

  function toggleLanguage() {
    const next = isBn ? "en" : "bn";
    setLang(next);
    window.localStorage.setItem("shishu-dashboard-language", next);
  }

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const db = createClient();
        const { data: { session } } = await db.auth.getSession();
        if (!session?.user?.id) {
          router.replace("/login?next=%2Fdashboard");
          return;
        }
        const { data: member, error: memberError } = await db.from("store_members")
          .select("role").eq("user_id", session.user.id).maybeSingle();
        if (memberError) throw memberError;
        if (!member) throw new Error("This account has not been added to the store team yet.");
        const currentRole = member.role as Role;
        if (active) setRole(currentRole);

        let income = 0, expense = 0, sales = 0;
        if (currentRole === "owner" || currentRole === "co_owner") {
          const start = new Date(); start.setHours(0, 0, 0, 0);
          const end = new Date(start); end.setDate(end.getDate() + 1);
          const [transactions, saleRows] = await Promise.all([
            db.from("transactions").select("kind,amount").gte("occurred_at", start.toISOString()).lt("occurred_at", end.toISOString()),
            db.from("sales").select("total_amount").gte("sold_at", start.toISOString()).lt("sold_at", end.toISOString()),
          ]);
          if (transactions.error) throw transactions.error;
          if (saleRows.error) throw saleRows.error;
          income = (transactions.data ?? []).filter(row => row.kind === "income").reduce((sum, row) => sum + Number(row.amount), 0);
          expense = (transactions.data ?? []).filter(row => row.kind === "expense").reduce((sum, row) => sum + Number(row.amount), 0);
          sales = (saleRows.data ?? []).reduce((sum, row) => sum + Number(row.total_amount), 0);
        }

        const { data: batches, error: batchError } = await db.from("stock_batches").select("medicine_id,quantity").limit(5000);
        if (batchError) throw batchError;
        const totals = new Map<string, number>();
        for (const batch of batches ?? []) totals.set(batch.medicine_id, (totals.get(batch.medicine_id) || 0) + Number(batch.quantity));
        let lowStock = 0;
        totals.forEach(quantity => { if (quantity <= 5) lowStock += 1; });
        if (active) { setFigures({ income, expense, sales, lowStock }); setError(""); }
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Could not load dashboard data.");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [router]);

  const visibleModules = useMemo(
    () => modules.filter(item => (!item.finance || canSeeFinances) && (!item.ownerOnly || role === "owner")),
    [canSeeFinances, role]
  );

  const metrics = [
    ...(canSeeFinances ? [
      { label: isBn ? "আজকের আয়" : "Today's income", value: money(figures.income), icon: ArrowDownLeft, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: isBn ? "আজকের ব্যয়" : "Today's expenses", value: money(figures.expense), icon: ArrowUpRight, color: "text-rose-600", bg: "bg-rose-50" },
      { label: isBn ? "আজকের বিক্রি" : "Today's sales", value: money(figures.sales), icon: ShoppingBasket, color: "text-blue-600", bg: "bg-blue-50" },
    ] : []),
    { label: isBn ? "কম স্টকের ওষুধ" : "Low stock items", value: String(figures.lowStock), icon: Boxes, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return <div className="min-h-screen bg-[#f4f8fb] text-slate-900">
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-200 bg-white p-5 lg:flex">
      <Link href="/" className="mb-10 flex items-center gap-3"><img src="/logo.jpg" alt="Shishu Medical Hall logo" className="h-11 w-11 rounded-2xl object-contain bg-white"/><div><div className="text-sm font-black">SHISHU MEDICAL</div><div className="text-[10px] text-slate-400">STORE COMMAND CENTER</div></div></Link>
      <div className="mb-3 px-3 text-[10px] font-bold tracking-[.18em] text-slate-400">{isBn ? "কর্মক্ষেত্র" : "WORKSPACE"}</div>
      <div className="rounded-xl bg-cyan-50 px-3 py-3 text-sm font-bold text-cyan-800"><LayoutDashboard className="mr-2 inline" size={17}/> {isBn ? "ওভারভিউ" : "Overview"}</div>
      <div className="mt-auto space-y-2">
        {role === "owner" && <Link href="/dashboard/team" className="block rounded-xl px-3 py-3 text-sm text-slate-500 hover:bg-slate-50"><Users className="mr-2 inline" size={17}/> {isBn ? "টিম অ্যাক্সেস" : "Team access"}</Link>}
        <Link href="/dashboard/settings" className="block rounded-xl px-3 py-3 text-sm text-slate-500 hover:bg-slate-50"><Settings className="mr-2 inline" size={17}/> {isBn ? "সেটিংস" : "Settings"}</Link>
        <Link href="/" className="block rounded-xl px-3 py-3 text-sm text-slate-500 hover:bg-slate-50">← {isBn ? "পাবলিক ওয়েবসাইট" : "Public website"}</Link>
      </div>
    </aside>
    <main className="mx-auto max-w-7xl px-5 py-7 lg:ml-64 lg:px-10 lg:py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div><div className="text-xs font-bold tracking-[.18em] text-teal-700">STORE COMMAND CENTER</div><h1 className="mt-2 text-3xl font-black tracking-tight">{isBn ? "স্বাগতম।" : "Good morning."}</h1><p className="mt-1 text-sm text-slate-500">{isBn ? "দোকানের গুরুত্বপূর্ণ হিসাব ও কাজ এক জায়গায়।" : "Your shop at a glance. Start with a quick entry or open a workspace."}</p></div>
        <div className="flex items-center gap-2"><button onClick={toggleLanguage} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-bold text-slate-600"><Languages className="mr-1 inline" size={15}/>{isBn ? "English" : "বাংলা"}</button><div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-500">SHISHU MEDICAL HALL <span className="ml-2 text-teal-600">● Online</span></div></div>
      </header>
      {error && <div role="alert" className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(({ label, value, icon: Icon, color, bg }) => <div key={label} className="soft-card p-5"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-500">{label}</span><span className={`rounded-xl p-2 ${bg} ${color}`}><Icon size={18}/></span></div><div className="mt-5 text-2xl font-black">{loading ? "—" : value}</div><div className="mt-1 text-[11px] text-slate-400">{isBn ? "নিয়ন ডাটাবেস থেকে লাইভ হিসাব" : "Live totals from the Neon database"}</div></div>)}</section>
      <section className="mt-10"><div className="mb-5 flex items-end justify-between"><div><h2 className="text-xl font-black">{isBn ? "আপনার কাজের জায়গা" : "Your workspaces"}</h2><p className="mt-1 text-sm text-slate-500">{isBn ? "প্রতিটি কাজ আলাদা, গুছানো ও নিরাপদ।" : "Everything important, neatly separated."}</p></div><span className="text-xs text-slate-400">{visibleModules.length} {isBn ? "মডিউল" : "modules"}</span></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{visibleModules.map(({ href, icon: Icon, title, bn, desc, bnDesc }) => <Link key={href} href={href} className="soft-card group p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl"><div className="flex items-center justify-between"><span className="rounded-2xl bg-cyan-50 p-3 text-cyan-800"><Icon size={21}/></span><ChevronRight size={17} className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-cyan-700"/></div><h3 className="mt-5 font-bold">{isBn ? bn : title}</h3><div className="mt-1 text-xs font-semibold text-teal-700">{isBn ? title : bn}</div><p className="mt-3 text-xs text-slate-500">{isBn ? bnDesc : desc}</p></Link>)}</div>
      </section>
      <div className="mt-8 rounded-2xl border border-cyan-100 bg-cyan-50/60 p-5 text-sm text-cyan-900"><strong>{isBn ? "ডাটাবেস:" : "Database:"}</strong> {isBn ? "Neon PostgreSQL এবং Neon Auth সংযুক্ত।" : "Neon PostgreSQL and Neon Auth are provisioned. The deployment still needs its Neon environment variables."}</div>
    </main>
  </div>;
}
