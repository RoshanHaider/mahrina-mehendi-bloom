import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CalendarDays, Loader2, Sparkles } from "lucide-react";

const SERVICES = [
  "Bridal Mehendi",
  "Party / Engagement",
  "Eid Special",
  "Simple / Minimal",
  "Group Booking",
];
const SLOTS = ["Morning (9–12)", "Afternoon (12–4)", "Evening (4–8)", "Night (8–11)"];

export default function Booking() {
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    service_type: SERVICES[0],
    preferred_date: "",
    time_slot: SLOTS[0],
    location: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_name || !form.customer_phone || !form.preferred_date || !form.location) {
      toast.error("Please fill in name, phone, date and location.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("appointments").insert({
      ...form,
      customer_email: form.customer_email || null,
      notes: form.notes || null,
    });
    setLoading(false);
    if (error) return toast.error("Couldn't book. Please try again.");
    toast.success("Appointment requested! We'll confirm on WhatsApp.");
    setForm({ ...form, customer_name: "", customer_phone: "", customer_email: "", preferred_date: "", location: "", notes: "" });
  };

  const input = "px-4 py-3 rounded-xl bg-parchment border border-border text-ink focus:outline-none focus:ring-2 focus:ring-bark";

  return (
    <section id="book" className="py-24 bg-background">
      <div className="container max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="grid lg:grid-cols-[1fr_1.4fr] gap-10 items-start"
        >
          <div>
            <div className="text-xs tracking-[0.3em] uppercase text-bark mb-3 flex items-center gap-2">
              <Sparkles className="h-3 w-3" /> Artist booking
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-ink mb-4">
              Book a henna artist for your day.
            </h2>
            <p className="text-muted-foreground mb-6">
              From bridal mehendi to intimate Eid sittings — choose a service, pick a slot,
              and we'll confirm on WhatsApp within hours.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• In-home appointments across the city</li>
              <li>• Premium botanical cones used for every booking</li>
              <li>• Trial sessions available for bridal clients</li>
            </ul>
          </div>

          <form onSubmit={submit} className="bg-parchment/50 rounded-2xl p-6 md:p-8 border border-border space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <input className={input} placeholder="Full name"
                value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
              <input className={input} placeholder="Phone (e.g. 0300...)"
                value={form.customer_phone} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} />
              <input className={`${input} sm:col-span-2`} placeholder="Email (optional)"
                value={form.customer_email} onChange={(e) => setForm({ ...form, customer_email: e.target.value })} />
              <select className={input}
                value={form.service_type} onChange={(e) => setForm({ ...form, service_type: e.target.value })}>
                {SERVICES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <select className={input}
                value={form.time_slot} onChange={(e) => setForm({ ...form, time_slot: e.target.value })}>
                {SLOTS.map((s) => <option key={s}>{s}</option>)}
              </select>
              <input type="date" className={`${input} sm:col-span-2`}
                value={form.preferred_date} onChange={(e) => setForm({ ...form, preferred_date: e.target.value })} />
              <input className={`${input} sm:col-span-2`} placeholder="Address / venue"
                value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <textarea className={`${input} sm:col-span-2 min-h-[80px]`} placeholder="Notes (number of guests, design style, etc.)"
                value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full mt-2 py-3.5 rounded-full bg-bark text-cream font-medium hover:bg-terracotta transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarDays className="h-4 w-4" />}
              Request appointment
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
