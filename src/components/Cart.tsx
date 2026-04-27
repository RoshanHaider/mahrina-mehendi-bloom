import { useEffect, useState } from "react";
import { useCart, subtotal, totalQty } from "@/lib/cart";
import { resolveImage } from "@/lib/assets";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Settings = {
  whatsapp_number: string;
  support_email: string;
  delivery_fee: number;
  bulk_discount_percent: number;
  bulk_discount_min_items: number;
};

export default function Cart() {
  const { items, customer, setQty, remove, setCustomer, clear } = useCart();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("*").eq("id", 1).single().then(({ data }) => {
      if (data) setSettings(data as Settings);
    });
  }, []);

  const sub = subtotal(items);
  const qty = totalQty(items);
  const eligibleForDiscount = settings && qty >= settings.bulk_discount_min_items;
  const discount = eligibleForDiscount ? (sub * Number(settings.bulk_discount_percent)) / 100 : 0;
  const delivery = items.length ? Number(settings?.delivery_fee ?? 250) : 0;
  const total = sub - discount + delivery;

  const checkout = async () => {
    if (!items.length) return;
    if (!customer.name || !customer.phone || !customer.address) {
      toast.error("Please fill in your name, phone and address.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("orders").insert({
      customer_name: customer.name,
      customer_phone: customer.phone,
      customer_email: customer.email || null,
      customer_address: customer.address,
      city: customer.city,
      items: items as any,
      subtotal: sub,
      discount,
      delivery_fee: delivery,
      total,
    });
    setLoading(false);
    if (error) {
      toast.error("Couldn't place order. Please try again.");
      return;
    }
    toast.success("Order placed! We'll be in touch shortly on WhatsApp.");
    clear();
  };

  return (
    <section id="cart" className="py-24 bg-cream">
      <div className="container max-w-5xl">
        <div className="text-xs tracking-[0.3em] uppercase text-bark mb-3">Your basket</div>
        <h2 className="font-display text-4xl md:text-5xl text-ink mb-10">Complete your ritual.</h2>

        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10">
          <div className="space-y-3">
            <AnimatePresence>
              {items.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-12 rounded-2xl border border-dashed border-border text-center text-muted-foreground"
                >
                  Your basket is empty. Add cones above to begin.
                </motion.div>
              )}
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex gap-4 items-center bg-parchment rounded-2xl p-3 pr-5"
                >
                  <img src={resolveImage(item.image_url)} alt="" className="h-20 w-20 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-ink truncate">{item.name}</div>
                    <div className="text-sm text-muted-foreground">Rs {item.price.toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-1 bg-cream rounded-full p-1">
                    <button onClick={() => setQty(item.id, item.qty - 1)} className="h-7 w-7 grid place-items-center rounded-full hover:bg-parchment">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
                    <button onClick={() => setQty(item.id, item.qty + 1)} className="h-7 w-7 grid place-items-center rounded-full hover:bg-parchment">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button onClick={() => remove(item.id)} className="text-muted-foreground hover:text-destructive p-2">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {items.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-3 pt-6">
                <input className="px-4 py-3 rounded-xl bg-parchment border border-border focus:outline-none focus:ring-2 focus:ring-bark"
                  placeholder="Full name" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
                <input className="px-4 py-3 rounded-xl bg-parchment border border-border focus:outline-none focus:ring-2 focus:ring-bark"
                  placeholder="Phone (e.g. 0300...)" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
                <input className="px-4 py-3 rounded-xl bg-parchment border border-border focus:outline-none focus:ring-2 focus:ring-bark sm:col-span-2"
                  placeholder="Email (optional)" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
                <input className="px-4 py-3 rounded-xl bg-parchment border border-border focus:outline-none focus:ring-2 focus:ring-bark sm:col-span-2"
                  placeholder="Delivery address" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />
                <input className="px-4 py-3 rounded-xl bg-parchment border border-border focus:outline-none focus:ring-2 focus:ring-bark sm:col-span-2"
                  placeholder="City" value={customer.city} onChange={(e) => setCustomer({ ...customer, city: e.target.value })} />
                <p className="text-xs text-muted-foreground sm:col-span-2">Your details are saved on this device for next time.</p>
              </div>
            )}
          </div>

          <aside className="bg-gradient-bark text-cream rounded-2xl p-8 h-fit sticky top-28 shadow-soft">
            <div className="font-display text-2xl mb-6">Order summary</div>
            <Row label="Subtotal" value={`Rs ${sub.toLocaleString()}`} />
            {settings && qty > 0 && (
              <Row
                label={`Bulk discount${eligibleForDiscount ? "" : ` (add ${settings.bulk_discount_min_items - qty} more)`}`}
                value={discount > 0 ? `– Rs ${Math.round(discount).toLocaleString()}` : "—"}
              />
            )}
            <Row label="Delivery (within city)" value={items.length ? `Rs ${delivery.toLocaleString()}` : "—"} />
            <div className="border-t border-cream/20 my-4" />
            <Row label="Total" value={`Rs ${Math.round(total).toLocaleString()}`} bold />
            <button
              onClick={checkout}
              disabled={loading || items.length === 0}
              className="w-full mt-6 py-4 rounded-full bg-honey text-ink font-medium hover:bg-cream transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Place order
            </button>
            <p className="text-xs text-cream/70 mt-4 text-center">Cash on delivery · Bank transfer · WhatsApp confirmation</p>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between py-1 ${bold ? "text-lg font-medium" : "text-sm"}`}>
      <span className={bold ? "" : "text-cream/80"}>{label}</span>
      <span>{value}</span>
    </div>
  );
}
