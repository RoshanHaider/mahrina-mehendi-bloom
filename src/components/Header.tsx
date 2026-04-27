import { Link } from "react-router-dom";
import { ShoppingBag, Settings } from "lucide-react";
import { LOGO } from "@/lib/assets";
import { useCart, totalQty } from "@/lib/cart";

export default function Header() {
  const items = useCart((s) => s.items);
  const count = totalQty(items);
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-cream/80 border-b border-border">
      <div className="container flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-3">
          <img src={LOGO} alt="Mahrina logo" className="h-12 w-12 rounded-full shadow-soft" />
          <div className="leading-tight">
            <div className="font-display text-2xl text-bark">Mahrina</div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Return to nature</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#shop" className="hover:text-bark transition-colors">Shop</a>
          <a href="#ritual" className="hover:text-bark transition-colors">The Ritual</a>
          <a href="#designs" className="hover:text-bark transition-colors">Designs</a>
          <a href="#reviews" className="hover:text-bark transition-colors">Reviews</a>
          <a href="#contact" className="hover:text-bark transition-colors">Contact</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/admin"
            className="p-2 rounded-full hover:bg-parchment transition-colors text-muted-foreground"
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
    </header>
  );
}
