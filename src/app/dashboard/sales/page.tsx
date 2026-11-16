"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, LoaderCircle, Plus, ShoppingBasket, TrendingUp, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Medicine = { id: string; brand_name: string; strength: string | null; generic_name: string | null; unit_price: number | null };
type Batch = { id: string; medicine_id: string; batch_number: string | null; quantity: number; selling_unit_price: number | null; expiry_date: string | null };
type Sale = { id: string; sold_at: string; total_amount: number; total_cost: number; note: string | null };
type CartLine = { batch: Batch; medicine: Medicine; quantity: number; unitPrice: number };

const money = (n: number) => "৳ " + n.toLocaleString("en-BD", { maximumFractionDigits: 2 });

export default function SalesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [query, setQuery] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    try {
      const db = createClient();
      const [m, b, s] = await Promise.all([
        db.from("medicines").select("id,brand_name,strength,generic_name,unit_price").order("brand_name").limit(1000),
        db.from("stock_batches").select("id,medicine_id,batch_number,quantity,selling_unit_price,expiry_date").gt("quantity", 0).order("expiry_date", { ascending: true, nullsFirst: false }).limit(1500),
        db.from("sales").select("id,sold_at,total_amount,total_cost,note").order("sold_at", { ascending: false }).limit(150),
      ]);
      if (m.error) throw m.error;
      if (b.error) throw b.error;
      if (s.error) throw s.error;
      setMedicines((m.data ?? []) as Medicine[]);
      setBatches((b.data ?? []) as Batch[]);
      setSales((s.data ?? []) as Sale[]);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load sales workspace.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const medicineById = useMemo(() => new Map(medicines.map(m => [m.id, m])), [medicines]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return batches.map(batch => ({ batch, medicine: medicineById.get(batch.medicine_id) }))
      .filter((x): x is { batch: Batch; medicine: Medicine } => !!x.medicine)
      .filter(x => !q || [x.medicine.brand_name, x.medicine.generic_name, x.medicine.strength, x.batch.batch_number].some(v => v?.toLowerCase().includes(q)))
      .slice(0, 60);
  }, [batches, medicineById, query]);

  function add(batch: Batch, medicine: Medicine) {
    setCart(current => {
      const existing = current.find(x => x.batch.id === batch.id);
      if (existing) return current.map(x => x.batch.id === batch.id ? { ...x, quantity: Math.min(x.quantity + 1, batch.quantity) } : x);
      return [...current, { batch, medicine, quantity: 1, unitPrice: Number(batch.selling_unit_price ?? medicine.unit_price ?? 0) }];
    });
    setSuccess("");
  }

  function patchLine(id: string, patch: Partial<Pick<CartLine, "quantity" | "unitPrice">>) {
    setCart(current => current.map(x => x.batch.id === id ? { ...x, ...patch } : x));
  }

  const total = cart.reduce((sum, x) => sum + x.quantity * x.unitPrice, 0);
  const today = new Date().toDateString();
  const daily = sales.filter(s => new Date(s.sold_at).toDateString() === today);
  const revenue = daily.reduce((sum, x) => sum + Number(x.total_amount), 0);
  const cogs = daily.reduce((sum, x) => sum + Number(x.total_cost), 0);

  async function saveSale(event: FormEvent) {
    event.preventDefault();
    if (!cart.length) { setError("Add at least one medicine."); return; }
    if (cart.some(x => !Number.isInteger(x.quantity) || x.quantity < 1 || x.quantity > Number(x.batch.quantity) || !Number.isFinite(x.unitPrice) || x.unitPrice < 0)) {
      setError("Check quantities and selling prices. Quantity cannot exceed available stock."); return;
    }
    setBusy(true); setError(""); setSuccess("");
    try {
      const db = createClient();
      const { error } = await db.rpc("record_store_sale", {
        p_items: cart.map(x => ({ batch_id: x.batch.id, quantity: x.quantity, unit_price: x.unitPrice })),
        p_note: note.trim() || null,
      });
      if (error) throw error;
      setCart([]); setNote("");
      setSuccess("Sale saved. Inventory was deducted and cost of goods was calculated from the selected batches.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save sale.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="min-h-screen bg-[#f4f8fb] px-5 py-7 text-slate-900 lg:px-10 lg:py-10"><div className="mx-auto max-w-7xl">
    <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500"><ArrowLeft size={16}/> Dashboard</Link>
    <header className="mt-8"><div className="text-xs font-bold tracking-[.18em] text-teal-700">SALES / দৈনিক বিক্রি</div><h1 className="mt-2 text-3xl font-black">Daily sales</h1><p className="mt-2 text-sm text-slate-500">Sell from actual stock batches. Stock deduction and cost calculation happen together in the database.</p></header>
    {(error || success) && <div role={error ? "alert" : "status"} className={`mt-5 rounded-xl px-4 py-3 text-sm ${error ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{error || success}</div>}
    <div className="mt-7 grid gap-4 sm:grid-cols-3"><div className="soft-card p-5"><div className="text-xs text-slate-500">Today's sales revenue</div><div className="mt-2 text-2xl font-black">{money(revenue)}</div></div><div className="soft-card p-5"><div className="text-xs text-slate-500">Today's cost of goods</div><div className="mt-2 text-2xl font-black">{money(cogs)}</div></div><div className="soft-card p-5"><div className="flex items-center gap-2 text-xs text-slate-500"><TrendingUp size={15}/> Gross profit</div><div className={`mt-2 text-2xl font-black ${revenue-cogs>=0?"text-emerald-700":"text-rose-700"}`}>{money(revenue-cogs)}</div></div></div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
      <section className="soft-card p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-bold">Available stock</h2><p className="mt-1 text-xs text-slate-400">Choose the exact batch to sell. Expiring batches appear first.</p></div><span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-800">{batches.length} batches</span></div>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search brand, generic, strength or batch..." className="mt-5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400"/>
        <div className="mt-4 divide-y divide-slate-100">{loading?<div className="py-12 text-center text-sm text-slate-400"><LoaderCircle className="mx-auto mb-2 animate-spin"/>Loading stock...</div>:filtered.length===0?<div className="py-12 text-center text-sm text-slate-400">No available stock matches.</div>:filtered.map(({batch,medicine})=><div key={batch.id} className="flex items-center gap-3 py-4"><div className="min-w-0 flex-1"><div className="truncate text-sm font-bold">{medicine.brand_name} {medicine.strength||""}</div><div className="mt-1 truncate text-xs text-slate-500">{medicine.generic_name||"Generic not listed"} · Batch {batch.batch_number||"—"}</div><div className="mt-1 text-[11px] text-slate-400">{batch.expiry_date? "Expiry "+batch.expiry_date+" · ":""}{batch.quantity} units available · {money(Number(batch.selling_unit_price??medicine.unit_price??0))}/unit</div></div><button onClick={()=>add(batch,medicine)} className="rounded-xl bg-cyan-50 px-3 py-2 text-xs font-bold text-cyan-800"><Plus className="mr-1 inline" size={14}/> Add</button></div>)}</div>
      </section>
      <div className="space-y-6">
        <form onSubmit={saveSale} className="soft-card h-fit p-5 sm:p-6"><div className="flex items-center justify-between"><h2 className="font-bold">Current bill</h2><ShoppingBasket className="text-cyan-700"/></div>
          {cart.length===0?<div className="py-9 text-center text-sm text-slate-400">Add stock batches to build a bill.</div>:<div className="mt-4 space-y-3">{cart.map(line=><div key={line.batch.id} className="rounded-xl border border-slate-100 p-3"><div className="flex items-start gap-2"><div className="min-w-0 flex-1"><div className="text-sm font-bold">{line.medicine.brand_name} {line.medicine.strength||""}</div><div className="mt-1 text-[11px] text-slate-400">Available: {line.batch.quantity}</div></div><button type="button" onClick={()=>setCart(current=>current.filter(x=>x.batch.id!==line.batch.id))} className="rounded-lg p-2 text-rose-500 hover:bg-rose-50" aria-label="Remove item"><Trash2 size={15}/></button></div><div className="mt-3 grid grid-cols-2 gap-3"><label className="text-[11px] font-bold text-slate-500">QUANTITY<input type="number" min="1" max={line.batch.quantity} step="1" value={line.quantity} onChange={e=>patchLine(line.batch.id,{quantity:Number(e.target.value)})} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"/></label><label className="text-[11px] font-bold text-slate-500">SELLING PRICE / UNIT<input type="number" min="0" step=".01" value={line.unitPrice} onChange={e=>patchLine(line.batch.id,{unitPrice:Number(e.target.value)})} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"/></label></div><div className="mt-2 text-right text-sm font-black">{money(line.quantity*line.unitPrice)}</div></div>)}</div>}
          <label className="mt-4 block text-xs font-bold text-slate-500">NOTE (OPTIONAL)<input value={note} onChange={e=>setNote(e.target.value)} placeholder="Customer / receipt note" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"/></label>
          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><span className="text-sm font-semibold text-slate-500">Bill total</span><span className="text-2xl font-black">{money(total)}</span></div>
          <button disabled={busy||cart.length===0} className="brand-gradient mt-4 w-full rounded-xl px-4 py-3.5 text-sm font-bold text-white disabled:opacity-50">{busy?<LoaderCircle className="mr-2 inline animate-spin" size={16}/>:<ShoppingBasket className="mr-2 inline" size={16}/>} Complete sale & deduct stock</button>
        </form>
        <section className="soft-card p-5"><h2 className="font-bold">Recent sales</h2><p className="mt-1 text-xs text-slate-400">Latest 150 posted sales</p><div className="mt-4 divide-y divide-slate-100">{sales.slice(0,12).map(s=><div key={s.id} className="flex items-center gap-3 py-3"><div className="min-w-0 flex-1"><div className="text-sm font-semibold">{s.note||"Medicine sale"}</div><div className="mt-1 text-[11px] text-slate-400">{new Date(s.sold_at).toLocaleString()}</div><div className="text-[11px] text-slate-500">COGS {money(Number(s.total_cost))} · Profit {money(Number(s.total_amount)-Number(s.total_cost))}</div></div><div className="text-sm font-black">{money(Number(s.total_amount))}</div></div>)}{!sales.length&&<p className="py-8 text-center text-sm text-slate-400">No sales recorded.</p>}</div></section>
      </div>
    </div>
  </div></main>;
}
