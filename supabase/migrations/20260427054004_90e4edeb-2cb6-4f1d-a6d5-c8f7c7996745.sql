ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS stock_quantity integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS low_stock_threshold integer NOT NULL DEFAULT 5;

ALTER TABLE public.promotions
  ADD COLUMN IF NOT EXISTS media_type text NOT NULL DEFAULT 'image',
  ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'promo';
