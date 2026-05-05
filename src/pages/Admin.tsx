import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LOGO, PRESET_IMAGES, resolveImage } from "@/lib/assets";
import {
  Plus, Save, Trash2, ArrowLeft, Package, Tag, Settings as Cog, ListOrdered,
  Loader2, Share2, LayoutDashboard, Boxes, Lock, Eye, EyeOff,
} from "lucide-react";
import { toast } from "sonner";

type Tab = "dashboard" | "products" | "inventory" | "promos" | "orders" | "settings" | "socials";

const ADMIN_PASSWORD = "realmaheen12345";
const AUTH_KEY = "mahrina_admin_ok";

export default function Admin() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    document.title = "Mahrina · Admin";
    if (sessionStorage.getItem(AUTH_KEY) === "1") setAuthed(true);
  }, []);

  if (!authed) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pw === ADMIN_PASSWORD) {
              sessionStorage.setItem(AUTH_KEY, "1");
              setAuthed(true);
            } else {
              toast.error("Wrong password");
            }
          }}
          className="bg-white rounded-2xl border border-border shadow-soft p-8 w-full max-w-sm space-y-5"
        >
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="" className="h-10 w-10 rounded-full" />
            <div>
              <div className="font-display text-xl text-ink">Mahrina Admin</div>
              <div className="text-xs text-muted-foreground">Enter password to continue</div>
            </div>
          </div>
          <div className="relative">
            <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type={showPw ? "text" : "password"}
              autoFocus
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-border bg-cream text-sm outline-none focus:border-bark"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-ink"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <button className="w-full bg-bark text-cream py-2.5 rounded-full hover:bg-terracotta text-sm">
            Sign in
          </button>
        </form>
      </div>
    );
  }

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
          <div className="flex items-center gap-4">
            <button
              onClick={() => { sessionStorage.removeItem(AUTH_KEY); setAuthed(false); }}
              className="text-xs text-cream/70 hover:text-honey"
            >
              Lock
            </button>
            <Link to="/" className="text-sm flex items-center gap-2 hover:text-honey">
              <ArrowLeft className="h-4 w-4" /> Back to site
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-10 grid md:grid-cols-[220px_1fr] gap-8">
        <nav className="flex md:flex-col gap-1 md:sticky md:top-6 h-fit overflow-x-auto">
          <TabBtn icon={LayoutDashboard} label="Dashboard" active={tab === "dashboard"} onClick={() => setTab("dashboard")} />
          <TabBtn icon={Package} label="Products" active={tab === "products"} onClick={() => setTab("products")} />
          <TabBtn icon={Boxes} label="Inventory" active={tab === "inventory"} onClick={() => setTab("inventory")} />
          <TabBtn icon={Tag} label="Promotions" active={tab === "promos"} onClick={() => setTab("promos")} />
          <TabBtn icon={ListOrdered} label="Orders" active={tab === "orders"} onClick={() => setTab("orders")} />
          <TabBtn icon={Share2} label="Social links" active={tab === "socials"} onClick={() => setTab("socials")} />
          <TabBtn icon={Cog} label="Settings" active={tab === "settings"} onClick={() => setTab("settings")} />
        </nav>
        <main>
          {tab === "dashboard" && <Dashboard />}
          {tab === "products" && <ProductsAdmin />}
          {tab === "inventory" && <InventoryAdmin />}
          {tab === "promos" && <PromosAdmin />}
          {tab === "orders" && <OrdersAdmin />}
          {tab === "socials" && <SocialsAdmin />}
          {tab === "settings" && <SettingsAdmin />}
        </main>
      </div>
    </div>
  );
}

function TabBtn({ icon: Icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors whitespace-nowrap ${active ? "bg-bark text-cream" : "hover:bg-parchment text-ink"}`}>
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

/* ---------- DASHBOARD ---------- */
type RangeKey = "day" | "week" | "month";
const RANGE_LABEL: Record<RangeKey, string> = { day: "Last 24 hours", week: "Last 7 days", month: "Last 30 days" };

function startOf(range: RangeKey) {
  const d = new Date();
  if (range === "day") d.setHours(d.getHours() - 24);
  else if (range === "week") d.setDate(d.getDate() - 7);
  else d.setDate(d.getDate() - 30);
  return d;
}

function Dashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [revenueRange, setRevenueRange] = useState<RangeKey>("month");
  const [fulfilledRange, setFulfilledRange] = useState<RangeKey>("month");

  useEffect(() => {
    supabase.from("orders").select("*").order("created_at", { ascending: false })
      .then(({ data }) => data && setOrders(data));
  }, []);

  const counts = useMemo(() => {
    const c = { pending: 0, transit: 0, fulfilled: 0 };
    for (const o of orders) {
      if (o.status === "pending" || o.status === "confirmed") c.pending++;
      else if (o.status === "shipped") c.transit++;
      else if (o.status === "delivered") c.fulfilled++;
    }
    return c;
  }, [orders]);

  const revenue = useMemo(() => {
    const since = startOf(revenueRange);
    return orders
      .filter((o) => o.status === "delivered" && new Date(o.created_at) >= since)
      .reduce((s, o) => s + Number(o.total || 0), 0);
  }, [orders, revenueRange]);

  const fulfilledCount = useMemo(() => {
    const since = startOf(fulfilledRange);
    return orders.filter((o) => o.status === "delivered" && new Date(o.created_at) >= since).length;
  }, [orders, fulfilledRange]);

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Pending orders" value={counts.pending} accent="bg-honey/30" />
        <StatCard label="In transit" value={counts.transit} accent="bg-terracotta/20" />
        <StatCard label="Fulfilled (all time)" value={counts.fulfilled} accent="bg-bark/15" />
      </div>

      <Card title="Net revenue">
        <RangeTabs value={revenueRange} onChange={setRevenueRange} />
        <div className="mt-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{RANGE_LABEL[revenueRange]}</div>
          <div className="font-display text-4xl text-bark mt-1">Rs {revenue.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">Counted from delivered orders only.</div>
        </div>
      </Card>

      <Card title="Fulfilled orders">
        <RangeTabs value={fulfilledRange} onChange={setFulfilledRange} />
        <div className="mt-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{RANGE_LABEL[fulfilledRange]}</div>
          <div className="font-display text-4xl text-bark mt-1">{fulfilledCount}</div>
          <div className="text-xs text-muted-foreground mt-1">Orders marked as delivered in this period.</div>
        </div>
      </Card>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className={`rounded-2xl p-5 border border-border ${accent}`}>
      <div className="text-xs uppercase tracking-wider text-ink/70">{label}</div>
      <div className="font-display text-3xl text-ink mt-1">{value}</div>
    </div>
  );
}

function RangeTabs({ value, onChange }: { value: RangeKey; onChange: (v: RangeKey) => void }) {
  const opts: { key: RangeKey; label: string }[] = [
    { key: "day", label: "24 hours" }, { key: "week", label: "Weekly" }, { key: "month", label: "Monthly" },
  ];
  return (
    <div className="inline-flex bg-parchment rounded-full p-1">
      {opts.map((o) => (
        <button key={o.key} onClick={() => onChange(o.key)}
          className={`px-4 py-1.5 rounded-full text-xs ${value === o.key ? "bg-bark text-cream" : "text-ink/70"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- PRODUCTS ---------- */
type Product = {
  id: string; name: string; description: string | null; price: number;
  image_url: string | null; category: string | null; badge: string | null;
  in_stock: boolean; stock_quantity: number; low_stock_threshold: number;
};

function ProductsAdmin() {
  const [items, setItems] = useState<Product[]>([]);
  const [draft, setDraft] = useState<Partial<Product>>({ name: "", price: 0, image_url: PRESET_IMAGES[0], in_stock: true, stock_quantity: 0, low_stock_threshold: 5 });
  const [busy, setBusy] = useState(false);

  const load = () => supabase.from("products").select("*").order("created_at").then(({ data }) => data && setItems(data as Product[]));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!draft.name || !draft.price) { toast.error("Name and price required"); return; }
    setBusy(true);
    const { error } = await supabase.from("products").insert({
      name: draft.name!, description: draft.description ?? null, price: Number(draft.price),
      image_url: draft.image_url ?? null, category: draft.category ?? null, badge: draft.badge ?? null,
      in_stock: draft.in_stock ?? true,
      stock_quantity: Number(draft.stock_quantity ?? 0),
      low_stock_threshold: Number(draft.low_stock_threshold ?? 5),
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Product added");
    setDraft({ name: "", price: 0, image_url: PRESET_IMAGES[0], in_stock: true, stock_quantity: 0, low_stock_threshold: 5 });
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
          <Field label="Badge / discount label (optional)"><input className="input" value={draft.badge ?? ""} onChange={(e) => setDraft({ ...draft, badge: e.target.value })} placeholder="Bestseller / 10% OFF" /></Field>
          <Field label="Stock quantity"><input type="number" className="input" value={draft.stock_quantity ?? 0} onChange={(e) => setDraft({ ...draft, stock_quantity: Number(e.target.value) })} /></Field>
          <Field label="Low-stock alert at"><input type="number" className="input" value={draft.low_stock_threshold ?? 5} onChange={(e) => setDraft({ ...draft, low_stock_threshold: Number(e.target.value) })} /></Field>
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
            <div key={p.id} className="grid grid-cols-[60px_1fr_110px_90px_auto] items-center gap-3 p-3 bg-parchment rounded-xl">
              <img src={resolveImage(p.image_url)} alt="" className="h-14 w-14 rounded-lg object-cover" />
              <div>
                <input className="bg-transparent font-medium w-full outline-none" defaultValue={p.name} onBlur={(e) => e.target.value !== p.name && update(p.id, { name: e.target.value })} />
                <div className="text-xs text-muted-foreground">{p.category} {p.badge && `· ${p.badge}`}</div>
              </div>
              <Field label="Price"><input type="number" className="input" defaultValue={Number(p.price)} onBlur={(e) => Number(e.target.value) !== Number(p.price) && update(p.id, { price: Number(e.target.value) })} /></Field>
              <Field label="Stock"><input type="number" className="input" defaultValue={p.stock_quantity} onBlur={(e) => Number(e.target.value) !== p.stock_quantity && update(p.id, { stock_quantity: Number(e.target.value), in_stock: Number(e.target.value) > 0 })} /></Field>
              <button onClick={() => del(p.id)} className="text-destructive hover:bg-destructive/10 p-2 rounded-lg"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ---------- INVENTORY ---------- */
type InvFilter = "all" | "low" | "out" | "in";

function InventoryAdmin() {
  const [items, setItems] = useState<Product[]>([]);
  const [filter, setFilter] = useState<InvFilter>("all");
  const [search, setSearch] = useState("");

  const load = () => supabase.from("products").select("*").order("name").then(({ data }) => data && setItems(data as Product[]));
  useEffect(() => { load(); }, []);

  const stats = useMemo(() => {
    let total = 0, low = 0, out = 0, inStock = 0;
    for (const p of items) {
      total++;
      if (p.stock_quantity <= 0) out++;
      else if (p.stock_quantity <= p.low_stock_threshold) low++;
      else inStock++;
    }
    return { total, low, out, inStock };
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filter === "out") return p.stock_quantity <= 0;
      if (filter === "low") return p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold;
      if (filter === "in") return p.stock_quantity > p.low_stock_threshold;
      return true;
    });
  }, [items, filter, search]);

  const updateStock = async (id: string, qty: number) => {
    await supabase.from("products").update({ stock_quantity: qty, in_stock: qty > 0 }).eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total products" value={stats.total} accent="bg-bark/15" />
        <StatCard label="In stock" value={stats.inStock} accent="bg-honey/30" />
        <StatCard label="Low-stock alert" value={stats.low} accent="bg-terracotta/30" />
        <StatCard label="Out of stock" value={stats.out} accent="bg-destructive/20" />
      </div>

      <Card title="Quick filter">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex bg-parchment rounded-full p-1">
            {([
              { k: "all", l: "All" },
              { k: "in", l: "In stock" },
              { k: "low", l: "Low stock" },
              { k: "out", l: "Out of stock" },
            ] as { k: InvFilter; l: string }[]).map((o) => (
              <button key={o.k} onClick={() => setFilter(o.k)}
                className={`px-4 py-1.5 rounded-full text-xs ${filter === o.k ? "bg-bark text-cream" : "text-ink/70"}`}>
                {o.l}
              </button>
            ))}
          </div>
          <input
            className="input flex-1 min-w-[200px]" placeholder="Search by product name…"
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mt-5 space-y-3">
          {filtered.length === 0 && <p className="text-muted-foreground text-sm">No products match this filter.</p>}
          {filtered.map((p) => {
            const status =
              p.stock_quantity <= 0 ? { label: "Out", cls: "bg-destructive/20 text-destructive" } :
              p.stock_quantity <= p.low_stock_threshold ? { label: "Low", cls: "bg-terracotta/30 text-terracotta" } :
              { label: "In stock", cls: "bg-honey/40 text-bark" };
            return (
              <div key={p.id} className="grid grid-cols-[56px_1fr_120px_110px] items-center gap-3 p-3 bg-parchment rounded-xl">
                <img src={resolveImage(p.image_url)} alt="" className="h-14 w-14 rounded-lg object-cover" />
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">Alert at ≤ {p.low_stock_threshold}</div>
                </div>
                <input type="number" className="input" defaultValue={p.stock_quantity}
                  onBlur={(e) => Number(e.target.value) !== p.stock_quantity && updateStock(p.id, Number(e.target.value))} />
                <span className={`text-xs px-2.5 py-1 rounded-full text-center ${status.cls}`}>{status.label}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* ---------- PROMOS ---------- */
type Promo = {
  id: string; title: string; subtitle: string | null; image_url: string | null;
  video_url: string | null; cta_text: string | null; active: boolean;
  sort_order: number; media_type: string; kind: string;
};

const PROMO_KINDS = [
  { value: "promo", label: "Promotion" },
  { value: "ad", label: "Ad campaign" },
  { value: "photoshoot", label: "Photoshoot" },
];

function PromosAdmin() {
  const [items, setItems] = useState<Promo[]>([]);
  const [draft, setDraft] = useState<Partial<Promo>>({
    title: "", image_url: PRESET_IMAGES[0], active: true, sort_order: 1,
    media_type: "image", kind: "promo",
  });
  const [filter, setFilter] = useState<string>("all");

  const load = () => supabase.from("promotions").select("*").order("sort_order").then(({ data }) => data && setItems(data as Promo[]));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!draft.title) return toast.error("Title required");
    const { error } = await supabase.from("promotions").insert({
      title: draft.title!, subtitle: draft.subtitle ?? null,
      image_url: draft.media_type === "image" ? (draft.image_url ?? null) : null,
      video_url: draft.media_type === "video" ? (draft.video_url ?? null) : null,
      cta_text: draft.cta_text ?? null, active: draft.active ?? true, sort_order: draft.sort_order ?? 1,
      media_type: draft.media_type ?? "image", kind: draft.kind ?? "promo",
    });
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setDraft({ title: "", image_url: PRESET_IMAGES[0], active: true, sort_order: 1, media_type: "image", kind: "promo" });
    load();
  };
  const update = async (id: string, patch: Partial<Promo>) => { await supabase.from("promotions").update(patch).eq("id", id); load(); };
  const del = async (id: string) => { if (confirm("Delete this entry?")) { await supabase.from("promotions").delete().eq("id", id); load(); } };

  const filtered = filter === "all" ? items : items.filter((i) => i.kind === filter);

  return (
    <div className="space-y-8">
      <Card title="Add to promotions">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Type">
            <select className="input" value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value })}>
              {PROMO_KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
            </select>
          </Field>
          <Field label="Media">
            <select className="input" value={draft.media_type} onChange={(e) => setDraft({ ...draft, media_type: e.target.value })}>
              <option value="image">Photo</option>
              <option value="video">Video</option>
            </select>
          </Field>
          <Field label="Title"><input className="input" value={draft.title ?? ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
          <Field label="CTA text (optional)"><input className="input" value={draft.cta_text ?? ""} onChange={(e) => setDraft({ ...draft, cta_text: e.target.value })} /></Field>
          <Field label="Subtitle" full><textarea className="input" value={draft.subtitle ?? ""} onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })} /></Field>
          <Field label="Sort order"><input type="number" className="input" value={draft.sort_order ?? 1} onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })} /></Field>
          <Field label="Active"><label className="flex items-center gap-2"><input type="checkbox" checked={draft.active ?? true} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} /> Show on landing</label></Field>

          {draft.media_type === "video" ? (
            <Field label="Video URL (YouTube, MP4, etc.)" full>
              <input className="input" value={draft.video_url ?? ""} onChange={(e) => setDraft({ ...draft, video_url: e.target.value })} placeholder="https://..." />
            </Field>
          ) : (
            <div className="md:col-span-2"><ImagePicker value={draft.image_url ?? ""} onChange={(v) => setDraft({ ...draft, image_url: v })} /></div>
          )}
        </div>
        <button onClick={save} className="mt-5 inline-flex items-center gap-2 bg-bark text-cream px-5 py-2.5 rounded-full hover:bg-terracotta">
          <Plus className="h-4 w-4" /> Add
        </button>
      </Card>

      <Card title={`Library (${filtered.length})`}>
        <div className="inline-flex bg-parchment rounded-full p-1 mb-5">
          {[{ k: "all", l: "All" }, ...PROMO_KINDS.map(p => ({ k: p.value, l: p.label }))].map((o) => (
            <button key={o.k} onClick={() => setFilter(o.k)}
              className={`px-4 py-1.5 rounded-full text-xs ${filter === o.k ? "bg-bark text-cream" : "text-ink/70"}`}>
              {o.l}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {filtered.map((p) => (
            <div key={p.id} className="grid grid-cols-[80px_1fr_90px_auto_auto] items-center gap-4 p-3 bg-parchment rounded-xl">
              {p.media_type === "video" ? (
                <div className="h-16 w-20 rounded-lg bg-ink text-cream text-[10px] flex items-center justify-center uppercase tracking-wider">Video</div>
              ) : (
                <img src={resolveImage(p.image_url)} alt="" className="h-16 w-20 rounded-lg object-cover" />
              )}
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-muted-foreground line-clamp-1">{PROMO_KINDS.find((k) => k.value === p.kind)?.label} · {p.subtitle}</div>
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
      visit_address: s.visit_address || null,
      visit_map_url: s.visit_map_url || null,
      visit_label: s.visit_label || null,
    }).eq("id", 1);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
  };

  return (
    <div className="space-y-8">
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

      <Card title="Visit us (optional)">
        <p className="text-sm text-muted-foreground mb-4">
          Fill these only if customers can visit you in person. Leave blank to hide the visit section from the website.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Visit label (e.g. 'Visit our studio')">
            <input className="input" value={s.visit_label ?? ""} onChange={(e) => setS({ ...s, visit_label: e.target.value })} placeholder="Visit our studio" />
          </Field>
          <Field label="Map / location link (Google Maps URL)">
            <input className="input" value={s.visit_map_url ?? ""} onChange={(e) => setS({ ...s, visit_map_url: e.target.value })} placeholder="https://maps.google.com/..." />
          </Field>
          <Field label="Full address" full>
            <textarea className="input min-h-20" value={s.visit_address ?? ""} onChange={(e) => setS({ ...s, visit_address: e.target.value })} placeholder="Street, area, city" />
          </Field>
        </div>
        <button disabled={busy} onClick={save} className="mt-5 inline-flex items-center gap-2 bg-bark text-cream px-5 py-2.5 rounded-full hover:bg-terracotta">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save visit info
        </button>
      </Card>
    </div>
  );
}

/* ---------- SOCIALS ---------- */
type SocialLink = { id: string; platform: string; label: string; url: string | null; sort_order: number };

function SocialsAdmin() {
  const [items, setItems] = useState<SocialLink[]>([]);
  const [busy, setBusy] = useState(false);

  const load = () =>
    supabase.from("social_links").select("*").order("sort_order").then(({ data }) => data && setItems(data as SocialLink[]));
  useEffect(() => { load(); }, []);

  const saveAll = async () => {
    setBusy(true);
    for (const it of items) {
      await supabase.from("social_links").update({
        label: it.label, url: it.url || null, sort_order: it.sort_order,
      }).eq("id", it.id);
    }
    setBusy(false);
    toast.success("Social links saved");
    load();
  };

  const update = (id: string, patch: Partial<SocialLink>) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  return (
    <Card title="Social media links">
      <p className="text-sm text-muted-foreground mb-5">
        Paste your page links. Empty links are hidden from the website footer.
      </p>
      <div className="space-y-3">
        {items.map((it) => (
          <div key={it.id} className="grid md:grid-cols-[160px_1fr] gap-3 p-3 bg-parchment rounded-xl">
            <input
              className="input" value={it.label}
              onChange={(e) => update(it.id, { label: e.target.value })}
              placeholder="Label"
            />
            <input
              className="input" value={it.url ?? ""}
              onChange={(e) => update(it.id, { url: e.target.value })}
              placeholder={`Paste your ${it.platform} link`}
            />
          </div>
        ))}
      </div>
      <button disabled={busy} onClick={saveAll} className="mt-5 inline-flex items-center gap-2 bg-bark text-cream px-5 py-2.5 rounded-full hover:bg-terracotta">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save all links
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
