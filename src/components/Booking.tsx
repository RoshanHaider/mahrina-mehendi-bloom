import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SERVICE_TYPES = [
  "Bridal Mehendi",
  "Party / Engagement",
  "Eid Special",
  "Wedding",
  "Simple / Minimal",
  "Group Booking",
];

const TIME_SLOTS = [
  "Morning (9–12)",
  "Afternoon (12–4)",
  "Evening (4–8)",
  "Night (8–11)",
];

const STORAGE_KEY = "mahrina-booking-customer";

type Saved = { name: string; phone: string; email: string; address: string };

export default function Booking() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [serviceType, setServiceType] = useState(SERVICE_TYPES[0]);
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [date, setDate] = useState<Date | undefined>();
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const s: Saved = JSON.parse(raw);
        setName(s.name || "");
        setPhone(s.phone || "");
        setEmail(s.email || "");
        setAddress(s.address || "");
      } catch {}
    }
  }, []);

  const submit = async () => {
    if (!name || !phone || !date || !address) {
      toast.error("Please fill in your name, phone, date and venue.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("appointments").insert({
      customer_name: name,
      customer_phone: phone,
      customer_email: email || null,
      service_type: serviceType,
      preferred_date: format(date, "yyyy-MM-dd"),
      time_slot: timeSlot,
      location: address,
      notes: notes || null,
    });
    setLoading(false);
    if (error) {
      toast.error("Couldn't request appointment. Please try again.");
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, phone, email, address }));
    toast.success("Appointment requested! We'll confirm on WhatsApp shortly.");
    setNotes("");
  };

  return (
    <section id="booking" className="py-24 bg-parchment">
      <div className="container max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="text-xs tracking-[0.3em] uppercase text-bark mb-3 inline-flex items-center gap-2">
            <Sparkles className="h-3 w-3" /> Book a henna artist
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-ink mb-4">Mehendi, brought to your door.</h2>
          <p className="text-muted-foreground">
            Request an appointment for bridal, parties, Eid, weddings or intimate gatherings.
            Service fee Rs 500 within Lahore · travel charges apply outside the city.
          </p>
          <ul className="mt-4 text-sm text-muted-foreground space-y-1">
            <li>• Premium botanical cones used for every booking</li>
            <li>• Trial sessions available for bridal clients</li>
          </ul>
        </motion.div>

        <div className="bg-cream rounded-2xl p-6 md:p-10 shadow-soft border border-border">
          <div className="grid md:grid-cols-2 gap-4">
            <input className="px-4 py-3 rounded-xl bg-parchment border border-border focus:outline-none focus:ring-2 focus:ring-bark"
              placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="px-4 py-3 rounded-xl bg-parchment border border-border focus:outline-none focus:ring-2 focus:ring-bark"
              placeholder="Phone (e.g. 0300...)" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input className="px-4 py-3 rounded-xl bg-parchment border border-border focus:outline-none focus:ring-2 focus:ring-bark md:col-span-2"
              placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />

            <select
              className="px-4 py-3 rounded-xl bg-parchment border border-border focus:outline-none focus:ring-2 focus:ring-bark"
              value={serviceType} onChange={(e) => setServiceType(e.target.value)}
            >
              {SERVICE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              className="px-4 py-3 rounded-xl bg-parchment border border-border focus:outline-none focus:ring-2 focus:ring-bark"
              value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}
            >
              {TIME_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "px-4 py-6 rounded-xl bg-parchment border border-border justify-start font-normal hover:bg-parchment",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>

            <input className="px-4 py-3 rounded-xl bg-parchment border border-border focus:outline-none focus:ring-2 focus:ring-bark"
              placeholder="Address / venue" value={address} onChange={(e) => setAddress(e.target.value)} />

            <textarea
              className="px-4 py-3 rounded-xl bg-parchment border border-border focus:outline-none focus:ring-2 focus:ring-bark md:col-span-2 min-h-[110px]"
              placeholder="Notes (number of guests, design style, etc.)"
              value={notes} onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className="w-full mt-6 py-4 rounded-full bg-bark text-cream font-medium hover:bg-terracotta transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarIcon className="h-4 w-4" />}
            Request appointment
          </button>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Your details are saved on this device for faster repeat bookings.
          </p>
        </div>
      </div>
    </section>
  );
}
