import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { resolveImage } from "@/lib/assets";

export type Promo = {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  cta_text: string | null;
};

export default function PromoSlider({ promos }: { promos: Promo[] }) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setIdx(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    onSelect();
  }, [embla]);

  if (!promos.length) return null;

  return (
    <section className="relative">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {promos.map((p) => (
            <div key={p.id} className="relative flex-[0_0_100%] min-w-0">
              <div className="relative h-[88vh] min-h-[600px] glossy overflow-hidden">
                <img src={resolveImage(p.image_url)} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/30 to-transparent" />
                <div className="container relative h-full flex items-center">
                  <motion.div
                    key={p.id + idx}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="max-w-xl text-cream"
                  >
                    <div className="text-xs tracking-[0.3em] uppercase mb-4 text-honey">Mahrina</div>
                    <h1 className="font-display text-5xl md:text-7xl leading-[1.05] mb-6 text-balance">
                      {p.title}
                    </h1>
                    {p.subtitle && (
                      <p className="text-lg md:text-xl text-cream/85 mb-8 max-w-md font-light">{p.subtitle}</p>
                    )}
                    {p.cta_text && (
                      <a
                        href="#shop"
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-honey text-ink font-medium hover:bg-cream transition-all hover:gap-4"
                      >
                        {p.cta_text} <span aria-hidden>→</span>
                      </a>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {promos.map((_, i) => (
          <button
            key={i}
            onClick={() => embla?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all ${i === idx ? "w-10 bg-honey" : "w-4 bg-cream/50"}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
