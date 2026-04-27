import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import PromoSlider, { Promo } from "@/components/PromoSlider";
import ProductCard, { Product } from "@/components/ProductCard";
import HowItWorks from "@/components/HowItWorks";
import DesignGallery from "@/components/DesignGallery";
import Reviews from "@/components/Reviews";
import Cart from "@/components/Cart";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);

  useEffect(() => {
    document.title = "Mahrina — Return to Nature | Botanical Henna from Lahore";
    const meta = document.querySelector('meta[name="description"]');
    const desc = "Skin-safe, botanical henna cones crafted in Lahore. Eucalyptus, clove and lemon — no chemicals. Delivery across the city.";
    if (meta) meta.setAttribute("content", desc);
    else {
      const m = document.createElement("meta");
      m.name = "description"; m.content = desc;
      document.head.appendChild(m);
    }

    supabase.from("products").select("*").order("created_at", { ascending: true })
      .then(({ data }) => data && setProducts(data as Product[]));
    supabase.from("promotions").select("*").eq("active", true).order("sort_order")
      .then(({ data }) => data && setPromos(data as Promo[]));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PromoSlider promos={promos} />

      <section id="shop" className="py-24">
        <div className="container">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="max-w-xl"
            >
              <div className="text-xs tracking-[0.3em] uppercase text-bark mb-3">The collection</div>
              <h2 className="font-display text-4xl md:text-5xl text-ink mb-4">Cones, packs & rituals.</h2>
              <p className="text-muted-foreground">
                Hand-crafted henna in three botanical shades. Add three or more items and 7.5% comes off automatically.
              </p>
            </motion.div>
            <div className="text-sm text-muted-foreground bg-parchment rounded-full px-4 py-2">
              {products.length} products · Delivery Rs 250
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      </section>

      <HowItWorks />
      <DesignGallery />
      <Reviews />
      <Cart />
      <Footer />
    </div>
  );
};

export default Index;
