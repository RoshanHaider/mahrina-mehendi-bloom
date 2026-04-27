import { motion } from "framer-motion";
import { Search, ShoppingBag, Truck, Sparkles } from "lucide-react";

const steps = [
  { icon: Search, title: "Browse the ritual", text: "Explore cones, gift packs and bridal lineups crafted from natural henna and botanicals." },
  { icon: ShoppingBag, title: "Build your cart", text: "Add 3 or more items and a 7.5% bulk discount unlocks automatically at checkout." },
  { icon: Truck, title: "City delivery", text: "Flat Rs 250 delivery within Lahore. Cash on delivery and bank transfer accepted." },
  { icon: Sparkles, title: "Apply & adore", text: "Follow our application ritual — leave overnight for the deepest, most natural stain." },
];

export default function HowItWorks() {
  return (
    <section id="ritual" className="py-24">
      <div className="container">
        <div className="max-w-2xl mb-14">
          <div className="text-xs tracking-[0.3em] uppercase text-bark mb-3">The buying experience</div>
          <h2 className="font-display text-4xl md:text-5xl text-ink mb-4">Four gentle steps, from browse to bloom.</h2>
          <p className="text-muted-foreground">A slow, considered ritual — not a checkout sprint.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative bg-cream rounded-2xl p-8 border border-border shadow-soft"
            >
              <div className="absolute -top-4 left-8 h-8 w-8 grid place-items-center rounded-full bg-bark text-cream text-sm font-medium">
                {i + 1}
              </div>
              <s.icon className="h-7 w-7 text-bark mb-4" strokeWidth={1.5} />
              <h3 className="font-display text-2xl mb-2 text-ink">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
