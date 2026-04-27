import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LOGO, PRESET_IMAGES, resolveImage } from "@/lib/assets";
import { Plus, Save, Trash2, ArrowLeft, Package, Tag, Settings as Cog, ListOrdered, Loader2, Upload, Lock } from "lucide-react";
import { toast } from "sonner";

type Tab = "products" | "promos" | "orders" | "settings";

const ADMIN_PASSWORD = "realmaheen12345";
const AUTH_KEY = "mahrina_admin_ok";

async function uploadToMedia(file: File): Promise<string | null> {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) { toast.error(error.message); return null; }
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

export default function Admin() {
  const [tab, setTab] = useState<Tab>("products");
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === "1");
  useEffect(() => { document.title = "Mahrina · Admin"; }, []);

  if (!authed) return <PasswordGate onOk={() => { sessionStorage.setItem(AUTH_KEY, "1"); setAuthed(true); }} />;

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-ink text-cream">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="" className="h-9 w-9 rounded-full" />
            <div>
              <div className="font-display text-lg leading-tight">Mahrina Admin</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-cream/60">Store control</div>
            </div>
          </div>
          <Link to="/" className="text-sm flex items-center gap-2 hover:text-honey">
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
        </div>
      </header>

      <div className="container py-10 grid md:grid-cols-[220px_1fr] gap-8">
        <nav className="flex md:flex-col gap-1 md:sticky md:top-6 h-fit">
          <TabBtn icon={Package} label="Products" active={tab === "products"} onClick={() => setTab("products")} />
          <TabBtn icon={Tag} label="Promotions" active={tab === "promos"} onClick={() => setTab("promos")} />
          <TabBtn icon={ListOrdered} label="Orders" active={tab === "orders"} onClick={() => setTab("orders")} />
          <TabBtn icon={Cog} label="Settings" active={tab === "settings"} onClick={() => setTab("settings")} />
        </nav>
        <main>
          {tab === "products" && <ProductsAdmin />}
          {tab === "promos" && <PromosAdmin />}
          {tab === "orders" && <OrdersAdmin />}
          {tab === "settings" && <SettingsAdmin />}
        </main>
      </div>
    </div>
  );
}

function TabBtn({ icon: Icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${active ? "bg-bark text-cream" : "hover:bg-parchment text-ink"}`}>
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}

function ImagePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-foreground">Image</label>
      <div className="grid grid-cols-7 gap-2 mt-2">
        {PRESET_IMAGES.map((p) => (
          <button key={p} type="button" onClick={() => onChange(p)}
            className={`aspect-square rounded-lg overflow-hidden border-2 ${value === p ? "border-bark" : "border-transparent"}`}>
            <img src={resolveImage(p)} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
      <input className="mt-2 w-full px-3 py-2 rounded-lg border border-border bg-white text-sm"
        placeholder="Or paste an image URL" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

/* ---------- PRODUCTS ---------- */
type Product = { id: string; name: string; description: string | null; price: number; image_url: string | null; category: string | null; badge: string | null; in_stock: boolean };

function ProductsAdmin() {
  const [items, setItems] = useState<Product[]>([]);
  const [draft, setDraft] = useState<Partial<Product>>({ name: "", price: 0, image_url: PRESET_IMAGES[0], in_stock: true });
  const [busy, setBusy] = useState(false);

  const load = () => supabase.from("products").select("*").order("created_at").then(({ data }) => data && setItems(data as Product[]));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!draft.name || !draft.price) { toast.error("Name and price required"); return; }
    setBusy(true);
    const { error } = await supabase.from("products").insert({
      name: draft.name!, description: draft.description ?? null, price: Number(draft.price),
      image_url: draft.image_url ?? null, category: draft.category ?? null, badge: draft.badge ?? null, in_stock: draft.in_stock ?? true,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Product added");
    setDraft({ name: "", price: 0, image_url: PRESET_IMAGES[0], in_stock: true });
    load();
  };

  const update = async (id: string, patch: Partial<Product>) => {
    await supabase.from("products").update(patch).eq("id", id);
    load();
  };
  const del = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-8">
      <Card title="Add new product">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Name"><input className="input" value={draft.name ?? ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
          <Field label="Price (Rs)"><input type="number" className="input" value={draft.price ?? 0} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} /></Field>
          <Field label="Category"><input className="input" value={draft.category ?? ""} onChange={(e) => setDraft({ ...draft, category: e.target.value })} /></Field>
          <Field label="Badge (optional)"><input className="input" value={draft.badge ?? ""} onChange={(e) => setDraft({ ...draft, badge: e.target.value })} placeholder="Bestseller / New" /></Field>
          <Field label="Description" full>
            <textarea className="input min-h-24" value={draft.description ?? ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </Field>
          <div className="md:col-span-2"><ImagePicker value={draft.image_url ?? ""} onChange={(v) => setDraft({ ...draft, image_url: v })} /></div>
        </div>
        <button disabled={busy} onClick={save} className="mt-5 inline-flex items-center gap-2 bg-bark text-cream px-5 py-2.5 rounded-full hover:bg-terracotta">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add product
        </button>
      </Card>

      <Card title={`All products (${items.length})`}>
        <div className="space-y-3">
          {items.map((p) => (
            <div key={p.id} className="grid grid-cols-[60px_1fr_120px_120px_auto] items-center gap-4 p-3 bg-parchment rounded-xl">
              <img src={resolveImage(p.image_url)} alt="" className="h-14 w-14 rounded-lg object-cover" />
              <div>
                <input className="bg-transparent font-medium w-full outline-none" defaultValue={p.name} onBlur={(e) => e.target.value !== p.name && update(p.id, { name: e.target.value })} />
                <div className="text-xs text-muted-foreground">{p.category}</div>
              </div>
              <input type="number" className="input" defaultValue={Number(p.price)} onBlur={(e) => Number(e.target.value) !== Number(p.price) && update(p.id, { price: Number(e.target.value) })} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked={p.in_stock} onChange={(e) => update(p.id, { in_stock: e.target.checked })} /> In stock
              </label>
              <button onClick={() => del(p.id)} className="text-destructive hover:bg-destructive/10 p-2 rounded-lg"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ---------- PROMOS ---------- */
type Promo = { id: string; title: string; subtitle: string | null; image_url: string | null; cta_text: string | null; active: boolean; sort_order: number };

function PromosAdmin() {
  const [items, setItems] = useState<Promo[]>([]);
  const [draft, setDraft] = useState<Partial<Promo>>({ title: "", image_url: PRESET_IMAGES[0], active: true, sort_order: 1 });

  const load = () => supabase.from("promotions").select("*").order("sort_order").then(({ data }) => data && setItems(data as Promo[]));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!draft.title) return toast.error("Title required");
    const { error } = await supabase.from("promotions").insert({
      title: draft.title!, subtitle: draft.subtitle ?? null, image_url: draft.image_url ?? null,
      cta_text: draft.cta_text ?? null, active: draft.active ?? true, sort_order: draft.sort_order ?? 1,
    });
    if (error) return toast.error(error.message);
    toast.success("Promotion added");
    setDraft({ title: "", image_url: PRESET_IMAGES[0], active: true, sort_order: 1 });
    load();
  };
  const update = async (id: string, patch: Partial<Promo>) => { await supabase.from("promotions").update(patch).eq("id", id); load(); };
  const del = async (id: string) => { if (confirm("Delete promotion?")) { await supabase.from("promotions").delete().eq("id", id); load(); } };

  return (
    <div className="space-y-8">
      <Card title="Add slider promotion">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Title"><input className="input" value={draft.title ?? ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
          <Field label="CTA text"><input className="input" value={draft.cta_text ?? ""} onChange={(e) => setDraft({ ...draft, cta_text: e.target.value })} /></Field>
          <Field label="Subtitle" full><textarea className="input" value={draft.subtitle ?? ""} onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })} /></Field>
          <Field label="Sort order"><input type="number" className="input" value={draft.sort_order ?? 1} onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })} /></Field>
          <Field label="Active"><label className="flex items-center gap-2"><input type="checkbox" checked={draft.active ?? true} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} /> Show on landing</label></Field>
          <div className="md:col-span-2"><ImagePicker value={draft.image_url ?? ""} onChange={(v) => setDraft({ ...draft, image_url: v })} /></div>
        </div>
        <button onClick={save} className="mt-5 inline-flex items-center gap-2 bg-bark text-cream px-5 py-2.5 rounded-full hover:bg-terracotta">
          <Plus className="h-4 w-4" /> Add promotion
        </button>
      </Card>

      <Card title={`All promotions (${items.length})`}>
        <div className="space-y-3">
          {items.map((p) => (
            <div key={p.id} className="grid grid-cols-[80px_1fr_80px_auto_auto] items-center gap-4 p-3 bg-parchment rounded-xl">
              <img src={resolveImage(p.image_url)} alt="" className="h-16 w-20 rounded-lg object-cover" />
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-muted-foreground line-clamp-1">{p.subtitle}</div>
              </div>
              <input type="number" className="input" defaultValue={p.sort_order} onBlur={(e) => Number(e.target.value) !== p.sort_order && update(p.id, { sort_order: Number(e.target.value) })} />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked={p.active} onChange={(e) => update(p.id, { active: e.target.checked })} /> Active</label>
              <button onClick={() => del(p.id)} className="text-destructive hover:bg-destructive/10 p-2 rounded-lg"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ---------- ORDERS ---------- */
function OrdersAdmin() {
  const [orders, setOrders] = useState<any[]>([]);
  const load = () => supabase.from("orders").select("*").order("created_at", { ascending: false }).then(({ data }) => data && setOrders(data));
  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: string) => { await supabase.from("orders").update({ status }).eq("id", id); load(); };

  return (
    <Card title={`Orders (${orders.length})`}>
      {orders.length === 0 && <p className="text-muted-foreground">No orders yet.</p>}
      <div className="space-y-3">
        {orders.map((o) => (
          <details key={o.id} className="bg-parchment rounded-xl p-4">
            <summary className="cursor-pointer flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="font-medium">{o.customer_name} <span className="text-muted-foreground text-sm">· {o.customer_phone}</span></div>
                <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()} · {o.city}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-bark">Rs {Number(o.total).toLocaleString()}</span>
                <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value)} className="bg-cream rounded-full px-3 py-1 text-xs border border-border">
                  <option>pending</option><option>confirmed</option><option>shipped</option><option>delivered</option><option>cancelled</option>
                </select>
              </div>
            </summary>
            <div className="mt-4 text-sm space-y-1">
              <div>Address: {o.customer_address}</div>
              {o.customer_email && <div>Email: {o.customer_email}</div>}
              <div className="pt-2 font-medium">Items:</div>
              <ul className="list-disc list-inside text-muted-foreground">
                {(o.items as any[]).map((it, i) => <li key={i}>{it.qty} × {it.name} (Rs {it.price})</li>)}
              </ul>
              <div className="pt-2">Subtotal Rs {o.subtotal} · Discount Rs {o.discount} · Delivery Rs {o.delivery_fee}</div>
            </div>
          </details>
        ))}
      </div>
    </Card>
  );
}

/* ---------- SETTINGS ---------- */
function SettingsAdmin() {
  const [s, setS] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { supabase.from("site_settings").select("*").eq("id", 1).single().then(({ data }) => setS(data)); }, []);
  if (!s) return <p>Loading…</p>;

  const save = async () => {
    setBusy(true);
    const { error } = await supabase.from("site_settings").update({
      whatsapp_number: s.whatsapp_number, support_email: s.support_email,
      delivery_fee: Number(s.delivery_fee), bulk_discount_percent: Number(s.bulk_discount_percent),
      bulk_discount_min_items: Number(s.bulk_discount_min_items),
    }).eq("id", 1);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
  };

  return (
    <Card title="Store settings">
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="WhatsApp number (with country code, no +)"><input className="input" value={s.whatsapp_number} onChange={(e) => setS({ ...s, whatsapp_number: e.target.value })} /></Field>
        <Field label="Support email"><input className="input" value={s.support_email} onChange={(e) => setS({ ...s, support_email: e.target.value })} /></Field>
        <Field label="Delivery fee (Rs)"><input type="number" className="input" value={s.delivery_fee} onChange={(e) => setS({ ...s, delivery_fee: e.target.value })} /></Field>
        <Field label="Bulk discount (%)"><input type="number" step="0.5" className="input" value={s.bulk_discount_percent} onChange={(e) => setS({ ...s, bulk_discount_percent: e.target.value })} /></Field>
        <Field label="Min items for discount"><input type="number" className="input" value={s.bulk_discount_min_items} onChange={(e) => setS({ ...s, bulk_discount_min_items: e.target.value })} /></Field>
      </div>
      <button disabled={busy} onClick={save} className="mt-5 inline-flex items-center gap-2 bg-bark text-cream px-5 py-2.5 rounded-full hover:bg-terracotta">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save settings
      </button>
    </Card>
  );
}

/* ---------- shared ---------- */
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-border p-6 shadow-soft">
      <h2 className="font-display text-2xl mb-5 text-ink">{title}</h2>
      {children}
    </section>
  );
}
function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? "md:col-span-2" : ""}`}>
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
