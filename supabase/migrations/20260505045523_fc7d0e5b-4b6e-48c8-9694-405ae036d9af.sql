CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  service_type TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  location TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can book appointments"
ON public.appointments FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "public read appointments"
ON public.appointments FOR SELECT
USING (true);

CREATE POLICY "public update appointments"
ON public.appointments FOR UPDATE
USING (true) WITH CHECK (true);

CREATE POLICY "public delete appointments"
ON public.appointments FOR DELETE
USING (true);