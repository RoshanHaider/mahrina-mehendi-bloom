import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ShoppingBag, Settings, Sun, Moon } from "lucide-react";
import { LOGO } from "@/lib/assets";
import { useCart, totalQty } from "@/lib/cart";
import { useTheme } from "@/hooks/use-theme";
import { supabase } from "@/integrations/supabase/client";
import LogoZoom from "@/components/LogoZoom";

export default function Header() {
  const items = useCart((s) => s.items);
  const count = totalQty(items);
  const { theme, toggle } = useTheme();
  const [logo, setLogo] = useState<string>(LOGO);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("logo_url").eq("id", 1).maybeSingle()
      .then(({ data }) => { const u = (data as any)?.logo_url; if (u) setLogo(u); });
  }, []);


  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container flex items-center justify-between h-20">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setZoom(true)}
            aria-label="View logo full size"
            className="rounded-full focus:outline-none focus:ring-2 focus:ring-honey"
          >
            <img src={logo} alt="Mahrina logo" className="h-12 w-12 rounded-full shadow-soft hover:scale-105 transition-transform" />
          </button>
          <Link to="/" className="leading-tight">
            <div className="font-display text-2xl text-bark">Mahrina</div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Return to nature</div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#shop" className="hover:text-bark transition-colors">Shop</a>
          <a href="#ritual" className="hover:text-bark transition-colors">The Ritual</a>
          <a href="#designs" className="hover:text-bark transition-colors">Designs</a>
          <a href="#reviews" className="hover:text-bark transition-colors">Reviews</a>
          <a href="#booking" className="hover:text-bark transition-colors">Booking</a>
          <a href="#contact" className="hover:text-bark transition-colors">Contact</a>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="h-9 w-9 grid place-items-center rounded-full border border-border bg-secondary hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link
            to="/admin"
            className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground"
            aria-label="Admin"
            title="Admin portal"
          >
            <Settings className="h-4 w-4" />
          </Link>
          <a
            href="#cart"
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bark text-cream hover:bg-terracotta transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="text-sm">Cart</span>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 grid place-items-center rounded-full bg-honey text-ink text-[11px] font-semibold">
                {count}
              </span>
            )}
          </a>
        </div>
      </div>

      {zoom && (
        <div
          className="fixed inset-0 z-[60] bg-ink/90 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in"
          onClick={() => setZoom(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={() => setZoom(false)}
            aria-label="Close"
            className="absolute top-6 right-6 h-10 w-10 grid place-items-center rounded-full bg-cream/15 text-cream hover:bg-cream/25"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={logo}
            alt="Mahrina logo full size"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-soft"
          />
        </div>
      )}
    </header>
  );

}
