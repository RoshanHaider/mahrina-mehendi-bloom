import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail, MessageCircle, Leaf, Sparkles, Recycle, FlaskConical } from "lucide-react";
import { LOGO } from "@/lib/assets";

type Settings = { whatsapp_number: string; support_email: string };

const values = [
  { icon: FlaskConical, title: "Clinical proof", text: "Tested for skin safety on every batch." },
  { icon: Leaf, title: "Clean beauty", text: "Botanical blend, no PPD, no synthetic dyes." },
  { icon: Sparkles, title: "Ritual over routine", text: "Slow ceremonies, made to be savoured." },
  { icon: Recycle, title: "Sustainable packaging", text: "Recyclable cellophane, paper-based labels." },
];

export default function Footer() {
  const [s, setS] = useState<Settings | null>(null);
  useEffect(() => {
    supabase.from("site_settings").select("whatsapp_number, support_email").eq("id", 1).single()
      .then(({ data }) => data && setS(data as Settings));
  }, []);

  const wa = s?.whatsapp_number ?? "923001234567";
  const email = s?.support_email ?? "hello@mahrina.com";

  return (
    <footer id="contact" className="bg-ink text-cream pt-24 pb-10">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-10 mb-16">
          {values.map((v) => (
            <div key={v.title}>
              <v.icon className="h-6 w-6 text-honey mb-3" strokeWidth={1.5} />
              <div className="font-display text-xl mb-2">{v.title}</div>
              <p className="text-sm text-cream/70 leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-cream/15 pt-12 grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={LOGO} alt="" className="h-10 w-10 rounded-full" />
              <div>
                <div className="font-display text-2xl">Mahrina</div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-cream/60">Return to nature</div>
              </div>
            </div>
            <p className="text-sm text-cream/70 max-w-xs leading-relaxed">
              Skin-safe henna crafted with eucalyptus, clove and lemon. Made in Lahore, delivered with care.
            </p>
          </div>

          <div>
            <div className="text-xs tracking-[0.3em] uppercase text-honey mb-4">Get in touch</div>
            <a href={`https://wa.me/${wa.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
              className="flex items-center gap-3 mb-3 hover:text-honey transition-colors">
              <MessageCircle className="h-4 w-4" /> WhatsApp +{wa}
            </a>
            <a href={`mailto:${email}`} className="flex items-center gap-3 hover:text-honey transition-colors">
              <Mail className="h-4 w-4" /> {email}
            </a>
            <p className="text-xs text-cream/50 mt-4">Delivery within Lahore: Rs 250 per order.</p>
          </div>

          <div>
            <div className="text-xs tracking-[0.3em] uppercase text-honey mb-4">Visit</div>
            <ul className="space-y-2 text-sm">
              <li><a href="#shop" className="hover:text-honey">Shop all</a></li>
              <li><a href="#ritual" className="hover:text-honey">The ritual</a></li>
              <li><a href="#designs" className="hover:text-honey">Design gallery</a></li>
              <li><a href="/admin" className="hover:text-honey">Store admin</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/15 mt-12 pt-6 text-xs text-cream/50 flex flex-wrap gap-3 justify-between">
          <span>© {new Date().getFullYear()} Mahrina. All rights reserved.</span>
          <span>Crafted in Lahore.</span>
        </div>
      </div>

      {/* Floating WhatsApp */}
      <a href={`https://wa.me/${wa.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
        className="fixed bottom-6 right-6 h-14 w-14 grid place-items-center rounded-full bg-leaf text-cream shadow-leaf hover:scale-105 transition-transform z-50"
        aria-label="Chat on WhatsApp">
        <MessageCircle className="h-6 w-6" />
      </a>
    </footer>
  );
}
