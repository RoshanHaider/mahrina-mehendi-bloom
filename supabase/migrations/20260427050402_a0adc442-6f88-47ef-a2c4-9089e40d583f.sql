
CREATE TABLE public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  label text NOT NULL,
  url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read social_links" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "public write social_links" ON public.social_links FOR ALL USING (true) WITH CHECK (true);

INSERT INTO public.social_links (platform, label, sort_order) VALUES
  ('facebook', 'Facebook', 1),
  ('instagram', 'Instagram', 2),
  ('tiktok', 'TikTok', 3),
  ('whatsapp', 'WhatsApp Channel', 4),
  ('other1', 'Other', 5),
  ('other2', 'Other', 6);

ALTER TABLE public.site_settings
  ADD COLUMN visit_address text,
  ADD COLUMN visit_map_url text,
  ADD COLUMN visit_label text;
