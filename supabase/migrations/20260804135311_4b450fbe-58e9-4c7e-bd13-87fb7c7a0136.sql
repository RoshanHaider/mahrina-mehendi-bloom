ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS admin_username text NOT NULL DEFAULT 'owner',
  ADD COLUMN IF NOT EXISTS admin_password_hash text;

UPDATE public.site_settings
SET admin_password_hash = encode(digest('realmaheen12345', 'sha256'), 'hex')
WHERE admin_password_hash IS NULL;