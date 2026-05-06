import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail, MessageCircle, Leaf, Sparkles, Recycle, FlaskConical, MapPin, Facebook, Instagram, Music2, Globe } from "lucide-react";
import { LOGO } from "@/lib/assets";

type Settings = {
  whatsapp_number: string;
  support_email: string;
  visit_address: string | null;
  visit_map_url: string | null;
  visit_label: string | null;
};

type SocialLink = { id: string; platform: string; label: string; url: string | null; sort_order: number };

const values = [
  { icon: FlaskConical, title: "Clinical proof", text: "Tested for skin safety on every batch." },
  { icon: Leaf, title: "Clean beauty", text: "Botanical blend, no PPD, no synthetic dyes." },
  { icon: Sparkles, title: "Ritual over routine", text: "Slow ceremonies, made to be savoured." },
  { icon: Recycle, title: "Sustainable packaging", text: "Recyclable cellophane, paper-based labels." },
];

function platformIcon(platform: string) {
  switch (platform) {
    case "facebook": return Facebook;
    case "instagram": return Instagram;
    case "tiktok": return Music2;
    case "whatsapp": return MessageCircle;
    default: return Globe;
  }
}

export default function Footer() {
  const [s, setS] = useState<Settings | null>(null);
  const [socials, setSocials] = useState<SocialLink[]>([]);

  useEffect(() => {
    supabase.from("site_settings")
      .select("whatsapp_number, support_email, visit_address, visit_map_url, visit_label")
      .eq("id", 1).single()
      .then(({ data }) => data && setS(data as Settings));
    supabase.from("social_links").select("*").order("sort_order")
      .then(({ data }) => data && setSocials(data as SocialLink[]));
  }, []);

  const wa = s?.whatsapp_number ?? "923001234567";
  const email = s?.support_email ?? "hello@mahrina.com";
  const activeSocials = socials.filter((sl) => sl.url && sl.url.trim().length > 0);
  const hasVisit = !!(s?.visit_address || s?.visit_map_url);

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

            {activeSocials.length > 0 && (
              <div className="mt-6">
                <div className="text-xs tracking-[0.3em] uppercase text-honey mb-3">Follow us</div>
                <div className="flex flex-wrap gap-2">
                  {activeSocials.map((sl) => {
                    const Icon = platformIcon(sl.platform);
                    return (
                      <a
                        key={sl.id}
                        href={sl.url!}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={sl.label}
                        title={sl.label}
                        className="h-11 w-11 grid place-items-center rounded-xl bg-[hsl(28_35%_55%)] text-white shadow-sm hover:bg-[hsl(28_45%_45%)] transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
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
            <div className="text-xs tracking-[0.3em] uppercase text-honey mb-4">
              {hasVisit ? (s?.visit_label || "Visit us") : "Visit"}
            </div>
            {hasVisit ? (
              <div className="space-y-3 text-sm">
                {s?.visit_map_url && (
                  <a href={s.visit_map_url} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 hover:text-honey transition-colors">
                    <MapPin className="h-4 w-4" /> Open in Maps
                  </a>
                )}
                {s?.visit_address && (
                  <p className="text-cream/70 leading-relaxed whitespace-pre-line">{s.visit_address}</p>
                )}
              </div>
            ) : (
              <ul className="space-y-2 text-sm">
                <li><a href="#shop" className="hover:text-honey">Shop all</a></li>
                <li><a href="#ritual" className="hover:text-honey">The ritual</a></li>
                <li><a href="#designs" className="hover:text-honey">Design gallery</a></li>
                <li><a href="/admin" className="hover:text-honey">Store admin</a></li>
              </ul>
            )}
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
