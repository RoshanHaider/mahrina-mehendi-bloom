import { motion } from "framer-motion";
import { resolveImage } from "@/lib/assets";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  badge: string | null;
  in_stock: boolean;
};

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const add = useCart((s) => s.add);
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08 }}
      className="group"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-parchment shadow-soft">
        <img
          src={resolveImage(product.image_url)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-cream/95 backdrop-blur text-[10px] uppercase tracking-widest text-bark font-semibold">
            {product.badge}
          </span>
        )}
        <button
          onClick={() => {
            add({ id: product.id, name: product.name, price: Number(product.price), image_url: product.image_url });
            toast.success(`${product.name} added to cart`);
          }}
          className="absolute bottom-4 inset-x-4 py-3 rounded-full bg-bark text-cream text-sm opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-terracotta"
        >
          Add to cart
        </button>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          {product.category && (
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">{product.category}</div>
          )}
          <h3 className="font-display text-xl text-ink leading-snug">{product.name}</h3>
        </div>
        <div className="text-bark font-medium whitespace-nowrap">Rs {Number(product.price).toLocaleString()}</div>
      </div>
      {product.description && (
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
      )}
    </motion.article>
  );
}
