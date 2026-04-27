import { motion } from "framer-motion";
import { DESIGN_GALLERY } from "@/lib/assets";

export default function DesignGallery() {
  return (
    <section id="designs" className="py-24 bg-gradient-warm">
      <div className="container">
        <div className="max-w-2xl mb-14">
          <div className="text-xs tracking-[0.3em] uppercase text-bark mb-3">Inspiration</div>
          <h2 className="font-display text-4xl md:text-5xl text-ink mb-4">Heritage in every detail.</h2>
          <p className="text-muted-foreground">Dainty swirls, vines and florals to wear with our cones — from everyday to bridal.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {DESIGN_GALLERY.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
              className={`relative overflow-hidden rounded-2xl shadow-soft ${i % 5 === 0 ? "row-span-2 aspect-[3/5]" : "aspect-square"}`}
            >
              <img src={src} alt={`Mehendi design ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
