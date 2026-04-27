-- Public media bucket for product/promo uploads (images + videos)
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Open policies (admin is password-protected at app level)
CREATE POLICY "media public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY "media public insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "media public update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'media');

CREATE POLICY "media public delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'media');

-- Add video support to promotions
ALTER TABLE public.promotions
  ADD COLUMN IF NOT EXISTS video_url text;