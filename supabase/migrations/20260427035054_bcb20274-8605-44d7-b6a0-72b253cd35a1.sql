
-- Products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  badge TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Promotions (slider on landing)
CREATE TABLE public.promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  cta_text TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_address TEXT NOT NULL,
  city TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  discount NUMERIC(10,2) NOT NULL DEFAULT 0,
  delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 250,
  total NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Site settings (single row pattern)
CREATE TABLE public.site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  whatsapp_number TEXT NOT NULL DEFAULT '923001234567',
  support_email TEXT NOT NULL DEFAULT 'hello@mahrina.com',
  delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 250,
  bulk_discount_percent NUMERIC(5,2) NOT NULL DEFAULT 7.5,
  bulk_discount_min_items INT NOT NULL DEFAULT 3,
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO public.site_settings (id) VALUES (1);

-- Enable RLS but allow public access (MVP, no auth)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "public write products" ON public.products FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "public read promotions" ON public.promotions FOR SELECT USING (true);
CREATE POLICY "public write promotions" ON public.promotions FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "public write orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "public read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "public write settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);
