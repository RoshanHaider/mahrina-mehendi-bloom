DROP POLICY IF EXISTS "No public read" ON public.newsletter_subscribers;
CREATE POLICY "public read subscribers" ON public.newsletter_subscribers FOR SELECT USING (true);
CREATE POLICY "public delete subscribers" ON public.newsletter_subscribers FOR DELETE USING (true);