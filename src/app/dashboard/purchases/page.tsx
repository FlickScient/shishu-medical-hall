"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ClipboardList, LoaderCircle, Minus, PackagePlus, Plus, Search, ShoppingCart, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Medicine = { id: string; brand_name: string; generic_name: string | null; strength: string | null; manufacturer: string | null };
type Supplier = { id: string; company_name: string };
type CartLine = { medicine: Medicine; quantity: number; unitCost: number };
type Order = { id: string; status: string; order_total: number; ordered_at: string; supplier_id: string | null; note: string | null };

const money = (n: number) => "৳ " + n.toLocaleString("en-BD", { maximumFractionDigits: 2 });

export default function PurchasesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [query, setQuery] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const db = createClient();
      const [m, s, o] = await Promise.all([
        db.from("medicines").select("id,brand_name,generic_name,strength,manufacturer").order("brand_name").limit(500),
        db.from("suppliers").select("id,company_name").order("company_name"),
        db.from("purchase_orders").select("id,status,order_total,ordered_at,supplier_id,note").order("ordered_at", { ascending: false }).limit(50),
      ]);
      if (m.error) throw m.error;
      if (s.error) throw s.error;
      if (o.error) throw o.error;
      setMedicines((m.data ?? []) as Medicine[]);
      setSuppliers((s.data ?? []) as Supplier[]);
      setOrders((o.data ?? []) as Order[]);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load purchase workspace.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return medicines.slice(0, 30);
    return medicines.filter(m => [m.brand_name, m.generic_name, m.strength, m.manufacturer].some(v => v?.toLowerCase().includes(q))).slice(0, 30);
  }, [medicines, query]);

  const total = cart.reduce((sum, line) => sum + line.quantity * line.unitCost, 0);
  const itemCount = cart.reduce((sum, line) => sum + line.quantity, 0);

  function add(medicine: Medicine) {
    setCart(current => {
      const found = current.find(line => line.medicine.id === medicine.id);
      if (found) return current.map(line => line.medicine.id === medicine.id ? { ...line, quantity: line.quantity + 1 } : line);
      return [...current, { medicine, quantity: 1, unitCost: 0 }];
    });
    setCartOpen(true);
  }

  function updateLine(id: string, patch: Partial<Pick<CartLine, "quantity" | "unitCost">>) {
    setCart(current => current.map(line => line.medicine.id === id ? { ...line, ...patch } : line).filter(line => line.quantity > 0));
  }

  async function saveOrder(event: FormEvent) {
    event.preventDefault();
    if (!cart.length) return;
    setBusy(true); setError(""); setSuccess("");
    const db = createClient();
    let orderId: string | null = null;
    try {
      const { data: order, error: orderError } = await db.from("purchase_orders").insert({
        supplier_id: supplierId || null,
        status: "draft",
        order_total: total,
        note: note.trim() || null,
      }).select("id").single();
      if (orderError) throw orderError;
      orderId = order.id;
      const rows = cart.map(line => ({
        purchase_order_id: order.id,
        medicine_id: line.medicine.id,
        item_name: [line.medicine.brand_name, line.medicine.strength].filter(Boolean).join(" "),
        quantity: line.quantity,
        unit_cost: line.unitCost,
        received_quantity: 0,
      }));
      const { error: itemsError } = await db.from("purchase_order_items").insert(rows);
      if (itemsError) throw itemsError;
      setCart([]); setNote(""); setSupplierId(""); setCartOpen(false);
      setSuccess("Purchase draft saved. You can update its status in the order history.");
      await load();
    } catch (e) {
      if (orderId) await db.from("purchase_orders").delete().eq("id", orderId);
      setError(e instanceof Error ? e.message : "Could not save purchase order.");
    } finally {
      setBusy(false);
    }
  }

  async function updateStatus(order: Order, status: string) {
    setError(""); setSuccess("");
    const db = createClient();
    const createdBatchIds: string[] = [];
    const updatedLines: { id: string; received: number }[] = [];
    try {
      if (status === "received" && order.status !== "received") {
        const { data: lines, error: lineError } = await db.from("purchase_order_items")
          .select("id,medicine_id,quantity,unit_cost,received_quantity")
          .eq("purchase_order_id", order.id);
        if (lineError) throw lineError;
        for (const line of lines ?? []) {
          const remaining = Math.max(0, Number(line.quantity) - Number(line.received_quantity || 0));
          if (!remaining) continue;
          if (!line.medicine_id) throw new Error("A purchase line is missing its medicine record.");
          const { data: batch, error: batchError } = await db.from("stock_batches").insert({
            medicine_id: line.medicine_id,
            supplier_id: order.supplier_id,
            quantity: remaining,
          }).select("id").single();
          if (batchError) throw batchError;
          createdBatchIds.push(batch.id);
          const { error: costError } = await db.from("stock_batch_costs").insert({
            batch_id: batch.id,
            purchase_unit_cost: Number(line.unit_cost || 0),
          });
          if (costError) throw costError;
          updatedLines.push({ id: line.id, received: Number(line.received_quantity || 0) });
          const { error: lineUpdateError } = await db.from("purchase_order_items")
            .update({ received_quantity: line.quantity }).eq("id", line.id);
          if (lineUpdateError) throw lineUpdateError;
        }
      }
      const { error } = await db.from("purchase_orders")
        .update({ status, received_at: status === "received" ? new Date().toISOString() : null })
        .eq("id", order.id);
      if (error) throw error;
      setSuccess(status === "received" ? "Received quantities were added to inventory and purchase costs recorded." : "Order status updated.");
      await load();
    } catch (e) {
      if (createdBatchIds.length) await db.from("stock_batches").delete().in("id", createdBatchIds);
      for (const line of updatedLines) await db.from("purchase_order_items").update({ received_quantity: line.received }).eq("id", line.id);
      setError(e instanceof Error ? e.message : "Could not update order status.");
    }
  }

  const supplierName = (id: string | null) => suppliers.find(s => s.id === id)?.company_name || "Supplier not selected";

  return <main className="min-h-screen bg-[#f4f8fb] px-5 py-7 text-slate-900 lg:px-10 lg:py-10">
    <div className="mx-auto max-w-7xl">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500"><ArrowLeft size={16}/> Dashboard</Link>
      <header className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div><div className="text-xs font-bold tracking-[.18em] text-teal-700">PROCUREMENT / ক্রয় ব্যবস্থাপনা</div><h1 className="mt-2 text-3xl font-black">Purchase workspace</h1><p className="mt-2 text-sm text-slate-500">Build a supplier order from your medicine list. This is an internal purchase tool, not a public cart.</p></div>
        <button onClick={() => setCartOpen(v => !v)} className="brand-gradient rounded-xl px-4 py-3 text-sm font-bold text-white"><ShoppingCart className="mr-2 inline" size={17}/> Cart · {itemCount}</button>
      </header>

      {(error || success) && <div role={error ? "alert" : "status"} className={`mt-5 rounded-xl px-4 py-3 text-sm ${error ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{error || success}</div>}

      <div className="mt-7 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <section className="soft-card p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3"><div><h2 className="font-bold">Find medicines</h2><p className="mt-1 text-xs text-slate-400">Search your existing stock catalogue and add items.</p></div><PackagePlus className="text-cyan-700" size={22}/></div>
          <div className="relative mt-5"><Search className="absolute left-3 top-3 text-slate-400" size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Brand, generic, strength or company..." className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-cyan-400"/></div>
          <div className="mt-4 divide-y divide-slate-100">
            {loading ? <div className="py-10 text-center text-sm text-slate-400"><LoaderCircle className="mx-auto mb-2 animate-spin"/>Loading medicines...</div> : filtered.length === 0 ? <div className="py-10 text-center text-sm text-slate-400">No matching medicine found.</div> : filtered.map(m => <div key={m.id} className="flex items-center gap-3 py-4"><div className="min-w-0 flex-1"><div className="truncate text-sm font-bold">{m.brand_name} {m.strength || ""}</div><div className="mt-1 truncate text-xs text-slate-500">{m.generic_name || "Generic not listed"} · {m.manufacturer || "Manufacturer not listed"}</div></div><button onClick={() => add(m)} className="rounded-xl bg-cyan-50 px-3 py-2 text-xs font-bold text-cyan-800"><Plus className="mr-1 inline" size={14}/> Add</button></div>)}
          </div>
        </section>

        <section className="soft-card p-5 sm:p-7">
          <div className="flex items-center justify-between"><div><h2 className="font-bold">Recent purchase orders</h2><p className="mt-1 text-xs text-slate-400">Latest 50 saved drafts and orders</p></div><ClipboardList className="text-slate-400" size={21}/></div>
          <div className="mt-5 space-y-3">
            {loading ? <div className="py-8 text-center text-sm text-slate-400">Loading orders...</div> : orders.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400">No purchase orders yet.</div> : orders.map(order => <article key={order.id} className="rounded-xl border border-slate-100 p-4"><div className="flex items-start justify-between gap-3"><div><div className="text-sm font-bold">{supplierName(order.supplier_id)}</div><div className="mt-1 text-[11px] text-slate-400">{new Date(order.ordered_at).toLocaleString()}</div><div className="mt-2 text-sm font-black">{money(Number(order.order_total))}</div></div><span className="rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-bold uppercase text-cyan-800">{order.status.replace(/_/g, " ")}</span></div><div className="mt-3 flex flex-wrap gap-2">{order.status === "draft" && <button onClick={() => updateStatus(order, "sent")} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold">Mark ordered</button>}{(order.status === "sent" || order.status === "partially_received") && <button onClick={() => updateStatus(order, "received")} className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">Mark received</button>}</div></article>)}
          </div>
        </section>
      </div>

      {cartOpen && <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/30" onClick={() => setCartOpen(false)}><aside className="h-full w-full max-w-lg overflow-y-auto bg-white p-5 shadow-2xl sm:p-7" onClick={e => e.stopPropagation()}><div className="flex items-center justify-between"><div><h2 className="text-xl font-black">Purchase cart</h2><p className="mt-1 text-xs text-slate-500">{itemCount} units · internal order draft</p></div><button onClick={() => setCartOpen(false)} aria-label="Close cart" className="rounded-xl border border-slate-200 p-2 text-slate-500">✕</button></div>
        <form onSubmit={saveOrder} className="mt-6">
          <label className="block text-xs font-bold text-slate-500">SUPPLIER</label><select value={supplierId} onChange={e => setSupplierId(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"><option value="">Select supplier (optional)</option>{suppliers.map(s => <option key={s.id} value={s.id}>{s.company_name}</option>)}</select>
          <div className="mt-5 space-y-3">{cart.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400">Your cart is empty.</div> : cart.map(line => <div key={line.medicine.id} className="rounded-xl border border-slate-100 p-3"><div className="flex items-start justify-between gap-3"><div className="min-w-0 text-sm font-bold">{line.medicine.brand_name} {line.medicine.strength || ""}</div><button type="button" onClick={() => setCart(items => items.filter(item => item.medicine.id !== line.medicine.id))} aria-label="Remove item" className="text-rose-500"><Trash2 size={16}/></button></div><div className="mt-3 grid grid-cols-2 gap-3"><label className="text-[11px] font-semibold text-slate-500">QUANTITY<div className="mt-1 flex items-center gap-2"><button type="button" onClick={() => updateLine(line.medicine.id, { quantity: Math.max(0, line.quantity - 1) })} className="rounded-lg border border-slate-200 p-2"><Minus size={13}/></button><span className="min-w-6 text-center text-sm font-bold">{line.quantity}</span><button type="button" onClick={() => updateLine(line.medicine.id, { quantity: line.quantity + 1 })} className="rounded-lg border border-slate-200 p-2"><Plus size={13}/></button></div></label><label className="text-[11px] font-semibold text-slate-500">UNIT COST (৳)<input type="number" min="0" step="0.01" value={line.unitCost} onChange={e => updateLine(line.medicine.id, { unitCost: Math.max(0, Number(e.target.value)) })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"/></label></div><div className="mt-2 text-right text-xs font-bold text-slate-600">Line total: {money(line.quantity * line.unitCost)}</div></div>)}</div>
          <label className="mt-5 block text-xs font-bold text-slate-500">NOTE (OPTIONAL)</label><textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Delivery date, representative, extra details..." className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"/>
          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><span className="text-sm font-semibold text-slate-500">Order estimate</span><strong className="text-xl">{money(total)}</strong></div>
          <button disabled={busy || cart.length === 0} className="brand-gradient mt-5 w-full rounded-xl px-4 py-4 text-sm font-bold text-white disabled:opacity-50">{busy ? <LoaderCircle className="mr-2 inline animate-spin" size={16}/> : <Check className="mr-2 inline" size={16}/>} Save purchase draft</button>
          <p className="mt-3 text-[11px] leading-5 text-slate-400">Saving a draft does not change stock. Marking an order received adds its remaining quantities to inventory and records purchase cost for finance roles.</p>
        </form>
      </aside></div>}
    </div>
  </main>;
}
