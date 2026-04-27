import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  { name: "Ayesha Khan", city: "DHA, Lahore", rating: 5, text: "The brown cones gave me the deepest stain I've ever had — by morning my hands were almost black-cherry. The fragrance is gentle, no headache at all." },
  { name: "Hira Saleem", city: "Gulberg, Lahore", rating: 5, text: "Used the bridal lineup for my sister's mehendi. Twelve cones lasted the whole evening, designs came out crisp and the colour set beautifully overnight." },
  { name: "Mahnoor Tariq", city: "Bahria Town, Lahore", rating: 5, text: "Finally a brand that actually feels clean. No chemical sting, no green stain residue. Packaging is gorgeous — felt like a gift to myself." },
  { name: "Sana Riaz", city: "Model Town, Lahore", rating: 4, text: "Loved the variety pack to test all three shades. Olive is my favourite for everyday. Delivery within Lahore was quick." },
  { name: "Zoya Iqbal", city: "Johar Town, Lahore", rating: 5, text: "Bought for Eid and shared with my cousins — everyone asked where it was from. The cones are smooth, no clumps, the line work was effortless." },
  { name: "Maryam Aftab", city: "Cantt, Lahore", rating: 5, text: "Repeat customer now. The ritual box with the eucalyptus oil is honestly luxurious. Worth every rupee." },
];

export default function Reviews() {
  return (
    <section id="reviews" className="py-24 bg-parchment">
      <div className="container">
        <div className="max-w-2xl mb-14">
          <div className="text-xs tracking-[0.3em] uppercase text-bark mb-3">Voices from Lahore</div>
          <h2 className="font-display text-4xl md:text-5xl text-ink">Held in trusted hands.</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <motion.blockquote
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="bg-cream rounded-2xl p-6 shadow-soft border border-border/50"
            >
              <div className="flex gap-0.5 mb-3 text-honey">
                {Array.from({ length: r.rating }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-ink/85 leading-relaxed mb-4 font-light">"{r.text}"</p>
              <footer className="text-sm">
                <div className="font-medium text-ink">{r.name}</div>
                <div className="text-muted-foreground text-xs">{r.city}</div>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
