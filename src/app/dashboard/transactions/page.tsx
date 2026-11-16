"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowDownLeft, ArrowLeft, ArrowUpRight, Clock3, LoaderCircle, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Entry = { id:string; kind:"income"|"expense"; amount:number; description:string|null; occurred_at:string };

export default function TransactionsPage(){
  const [kind,setKind]=useState<"income"|"expense">("income");
  const [amount,setAmount]=useState("");
  const [description,setDescription]=useState("");
  const [entries,setEntries]=useState<Entry[]>([]);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [notice,setNotice]=useState("");

  const loadEntries=useCallback(async()=>{
    try{
      const supabase=createClient();
      const {data,error}=await supabase.from("transactions").select("id,kind,amount,description,occurred_at").order("occurred_at",{ascending:false}).limit(100);
      if(error) throw error;
      setEntries((data??[]) as Entry[]);
      setNotice("");
    }catch(error){
      setNotice(error instanceof Error?error.message:"Could not load transactions. Check your Supabase setup and sign-in.");
    }finally{setLoading(false);}
  },[]);

  useEffect(()=>{void loadEntries();},[loadEntries]);

  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    const numeric=Number(amount);
    if(!Number.isFinite(numeric)||numeric<=0){setNotice("Enter an amount greater than zero.");return;}
    setSaving(true);setNotice("");
    const temporary:Entry={id:`temp-${Date.now()}`,kind,amount:numeric,description:description.trim()||null,occurred_at:new Date().toISOString()};
    setEntries(current=>[temporary,...current]);
    setAmount("");setDescription("");
    try{
      const supabase=createClient();
      const {error}=await supabase.from("transactions").insert({kind,amount:numeric,description:temporary.description});
      if(error) throw error;
      await loadEntries();
    }catch(error){
      setEntries(current=>current.filter(entry=>entry.id!==temporary.id));
      setNotice(error instanceof Error?error.message:"Could not save this entry.");
    }finally{setSaving(false);}
  }

  const today=new Date().toDateString();
  const todayEntries=entries.filter(e=>new Date(e.occurred_at).toDateString()===today);
  const income=todayEntries.filter(e=>e.kind==="income").reduce((s,e)=>s+Number(e.amount),0);
  const expense=todayEntries.filter(e=>e.kind==="expense").reduce((s,e)=>s+Number(e.amount),0);

  return <main className="min-h-screen bg-[#f4f8fb] px-5 py-7 text-slate-900 lg:px-10 lg:py-10"><div className="mx-auto max-w-6xl"><Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500"><ArrowLeft size={16}/> Dashboard</Link><div className="mt-8"><div className="text-xs font-bold tracking-[.18em] text-teal-700">CASHBOOK / আয় ও ব্যয়</div><h1 className="mt-2 text-3xl font-black">Transactions</h1><p className="mt-2 text-sm text-slate-500">Just enter the amount. Name and medicine details are optional.</p></div>
  <section className="mt-7 grid gap-4 sm:grid-cols-3"><div className="soft-card p-5"><div className="text-xs text-slate-500">Today's income</div><div className="mt-3 text-2xl font-black text-emerald-700">৳ {income.toLocaleString("en-BD")}</div></div><div className="soft-card p-5"><div className="text-xs text-slate-500">Today's expenses</div><div className="mt-3 text-2xl font-black text-rose-700">৳ {expense.toLocaleString("en-BD")}</div></div><div className="soft-card p-5"><div className="text-xs text-slate-500">Today's net</div><div className="mt-3 text-2xl font-black">৳ {(income-expense).toLocaleString("en-BD")}</div></div></section>
  <section className="mt-6 grid gap-6 lg:grid-cols-[.85fr_1.15fr]"><form onSubmit={submit} className="soft-card h-fit p-5 sm:p-7"><div className="text-sm font-bold">Quick entry</div><div className="mt-5 grid grid-cols-2 gap-2"><button type="button" onClick={()=>setKind("income")} className={`rounded-xl px-4 py-3 text-sm font-bold ${kind==="income"?"bg-emerald-600 text-white":"bg-emerald-50 text-emerald-800"}`}><ArrowDownLeft className="mr-2 inline" size={16}/> Income</button><button type="button" onClick={()=>setKind("expense")} className={`rounded-xl px-4 py-3 text-sm font-bold ${kind==="expense"?"bg-rose-600 text-white":"bg-rose-50 text-rose-800"}`}><ArrowUpRight className="mr-2 inline" size={16}/> Expense</button></div><label className="mt-6 block text-xs font-bold text-slate-500">AMOUNT (BDT)</label><div className="mt-2 flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4"><span className="text-xl font-bold text-slate-400">৳</span><input required min="0.01" step="0.01" type="number" inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.00" className="w-full bg-transparent px-3 py-4 text-2xl font-black outline-none" /></div><label className="mt-5 block text-xs font-bold text-slate-500">DESCRIPTION <span className="font-normal normal-case text-slate-400">(optional)</span></label><input value={description} onChange={e=>setDescription(e.target.value)} placeholder="e.g. Cash sale, electricity bill..." className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400"/><button disabled={saving} className="brand-gradient mt-6 w-full rounded-xl px-4 py-4 text-sm font-bold text-white disabled:opacity-60">{saving?<LoaderCircle className="mr-2 inline animate-spin" size={16}/>:<Plus className="mr-2 inline" size={16}/>} Save {kind}</button>{notice&&<p role="alert" className="mt-4 break-words text-xs leading-5 text-rose-700">{notice}</p>}<p className="mt-4 text-[11px] leading-5 text-slate-400">Entries are stored in the shared database. Owner and co-owner roles can access financial records; editors cannot.</p></form>
  <div className="soft-card p-5 sm:p-7"><div className="flex items-center justify-between"><div><h2 className="font-bold">Transaction timeline</h2><p className="mt-1 text-xs text-slate-400">Latest 100 entries</p></div><Clock3 className="text-slate-400" size={19}/></div><div className="mt-5 space-y-5">{loading?<div className="py-12 text-center text-sm text-slate-400"><LoaderCircle className="mx-auto mb-3 animate-spin"/>Loading entries...</div>:entries.length===0?<div className="rounded-2xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-400">No transactions yet.</div>:entries.map((entry,index)=><div key={entry.id} className="flex items-center gap-3"><div className={`rounded-xl p-3 ${entry.kind==="income"?"bg-emerald-50 text-emerald-700":"bg-rose-50 text-rose-700"}`}>{entry.kind==="income"?<ArrowDownLeft size={18}/>:<ArrowUpRight size={18}/>}</div><div className="min-w-0 flex-1"><div className="truncate text-sm font-bold">{entry.description|| (entry.kind==="income"?"Income entry":"Expense entry")}</div><div className="mt-1 text-[11px] text-slate-400">{new Date(entry.occurred_at).toLocaleString()}</div></div><div className={`whitespace-nowrap text-sm font-black ${entry.kind==="income"?"text-emerald-700":"text-rose-700"}`}>{entry.kind==="income"?"+":"−"} ৳{Number(entry.amount).toLocaleString("en-BD")}</div></div>)}</div></div></section></div></main>;
}
