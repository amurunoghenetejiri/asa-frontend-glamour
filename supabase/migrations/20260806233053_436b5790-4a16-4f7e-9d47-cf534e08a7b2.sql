
-- ===== enums =====
DO $$ BEGIN CREATE TYPE public.verification_status AS ENUM ('unverified','pending','verified','rejected'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.account_type AS ENUM ('customer','provider'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.post_media_type AS ENUM ('image','video'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.provider_doc_type AS ENUM ('government_id','selfie','certificate','resume'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ===== profiles extensions =====
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS username text,
  ADD COLUMN IF NOT EXISTS cover_url text,
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS gender text,
  ADD COLUMN IF NOT EXISTS languages text[],
  ADD COLUMN IF NOT EXISTS business_name text,
  ADD COLUMN IF NOT EXISTS professional_title text,
  ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS subcategory text,
  ADD COLUMN IF NOT EXISTS service_location text,
  ADD COLUMN IF NOT EXISTS starting_price numeric,
  ADD COLUMN IF NOT EXISTS account_type public.account_type NOT NULL DEFAULT 'customer',
  ADD COLUMN IF NOT EXISTS verification_status public.verification_status NOT NULL DEFAULT 'unverified';

CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_key ON public.profiles (lower(username)) WHERE username IS NOT NULL;

-- public read of profiles (social directory / feed)
DROP POLICY IF EXISTS "profiles public read" ON public.profiles;
CREATE POLICY "profiles public read" ON public.profiles FOR SELECT TO anon, authenticated USING (true);
GRANT SELECT ON public.profiles TO anon;

-- only admins may change verification_status
CREATE OR REPLACE FUNCTION public.guard_verification_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.verification_status IS DISTINCT FROM OLD.verification_status
     AND NOT (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin')) THEN
    NEW.verification_status := OLD.verification_status;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_guard_verification ON public.profiles;
CREATE TRIGGER trg_guard_verification BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_verification_status();

-- ===== subcategories =====
CREATE TABLE IF NOT EXISTS public.subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  slug text NOT NULL,
  name text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (category_id, slug)
);
GRANT SELECT ON public.subcategories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subcategories TO authenticated;
GRANT ALL ON public.subcategories TO service_role;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subcategories public read" ON public.subcategories FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "subcategories admin manage" ON public.subcategories FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'));
CREATE TRIGGER trg_subcategories_touch BEFORE UPDATE ON public.subcategories FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- ===== portfolio =====
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text,
  description text,
  media_url text NOT NULL,
  media_type public.post_media_type NOT NULL DEFAULT 'image',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.portfolio_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_items TO authenticated;
GRANT ALL ON public.portfolio_items TO service_role;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "portfolio public read" ON public.portfolio_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "portfolio owner manage" ON public.portfolio_items FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_portfolio_touch BEFORE UPDATE ON public.portfolio_items FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- ===== provider documents =====
CREATE TABLE IF NOT EXISTS public.provider_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doc_type public.provider_doc_type NOT NULL,
  file_path text NOT NULL,
  file_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.provider_documents TO authenticated;
GRANT ALL ON public.provider_documents TO service_role;
ALTER TABLE public.provider_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "docs owner or admin read" ON public.provider_documents FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin') OR has_role(auth.uid(),'support_agent'));
CREATE POLICY "docs owner write" ON public.provider_documents FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "docs owner delete" ON public.provider_documents FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ===== posts =====
CREATE TABLE IF NOT EXISTS public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text,
  shared_post_id uuid REFERENCES public.posts(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS posts_created_idx ON public.posts (created_at DESC);
GRANT SELECT ON public.posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts public read" ON public.posts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "posts owner insert" ON public.posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "posts owner update" ON public.posts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "posts owner or admin delete" ON public.posts FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'));
CREATE TRIGGER trg_posts_touch BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

CREATE TABLE IF NOT EXISTS public.post_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url text NOT NULL,
  media_type public.post_media_type NOT NULL DEFAULT 'image',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS post_media_post_idx ON public.post_media (post_id);
GRANT SELECT ON public.post_media TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_media TO authenticated;
GRANT ALL ON public.post_media TO service_role;
ALTER TABLE public.post_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "post media public read" ON public.post_media FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "post media owner manage" ON public.post_media FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.post_likes (
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);
GRANT SELECT ON public.post_likes TO anon;
GRANT SELECT, INSERT, DELETE ON public.post_likes TO authenticated;
GRANT ALL ON public.post_likes TO service_role;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "likes public read" ON public.post_likes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "likes self insert" ON public.post_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "likes self delete" ON public.post_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS post_comments_post_idx ON public.post_comments (post_id, created_at);
GRANT SELECT ON public.post_comments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_comments TO authenticated;
GRANT ALL ON public.post_comments TO service_role;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comments public read" ON public.post_comments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "comments self insert" ON public.post_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments self update" ON public.post_comments FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments self or admin delete" ON public.post_comments FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'));
CREATE TRIGGER trg_comments_touch BEFORE UPDATE ON public.post_comments FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

CREATE TABLE IF NOT EXISTS public.post_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.post_shares TO anon;
GRANT SELECT, INSERT, DELETE ON public.post_shares TO authenticated;
GRANT ALL ON public.post_shares TO service_role;
ALTER TABLE public.post_shares ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shares public read" ON public.post_shares FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "shares self insert" ON public.post_shares FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "shares self delete" ON public.post_shares FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ===== follows =====
CREATE TABLE IF NOT EXISTS public.follows (
  follower_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id <> following_id)
);
GRANT SELECT ON public.follows TO anon;
GRANT SELECT, INSERT, DELETE ON public.follows TO authenticated;
GRANT ALL ON public.follows TO service_role;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "follows public read" ON public.follows FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "follows self insert" ON public.follows FOR INSERT TO authenticated WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "follows self delete" ON public.follows FOR DELETE TO authenticated USING (auth.uid() = follower_id);

-- ===== reviews =====
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider_id, author_id),
  CHECK (provider_id <> author_id)
);
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews public read" ON public.reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "reviews self insert" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "reviews self update" ON public.reviews FOR UPDATE TO authenticated USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "reviews self or admin delete" ON public.reviews FOR DELETE TO authenticated
  USING (auth.uid() = author_id OR has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'));
CREATE TRIGGER trg_reviews_touch BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- ===== signup handler: capture new fields + provider account type =====
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  admin_row record;
  acct public.account_type;
BEGIN
  acct := COALESCE(NULLIF(NEW.raw_user_meta_data->>'account_type','')::public.account_type, 'customer');

  INSERT INTO public.profiles (id, email, full_name, username, phone, country, state, lga, city,
                               date_of_birth, gender, address, bio, account_type, verification_status)
  VALUES (
    NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NULLIF(NEW.raw_user_meta_data->>'username',''),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'country','Nigeria'),
    NEW.raw_user_meta_data->>'state',
    NEW.raw_user_meta_data->>'lga',
    NEW.raw_user_meta_data->>'city',
    NULLIF(NEW.raw_user_meta_data->>'date_of_birth','')::date,
    NULLIF(NEW.raw_user_meta_data->>'gender',''),
    NULLIF(NEW.raw_user_meta_data->>'address',''),
    NULLIF(NEW.raw_user_meta_data->>'bio',''),
    acct,
    CASE WHEN acct = 'provider' THEN 'pending'::public.verification_status ELSE 'unverified'::public.verification_status END
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer') ON CONFLICT DO NOTHING;
  INSERT INTO public.user_settings (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;

  INSERT INTO public.notifications (user_id, type, title, body, link)
  VALUES (NEW.id, 'welcome', 'Welcome to Asá 🎉',
          'Your account is ready. Complete your profile to get discovered.', '/feed');

  FOR admin_row IN SELECT DISTINCT user_id FROM public.user_roles WHERE role IN ('admin','super_admin') LOOP
    INSERT INTO public.notifications (user_id, type, title, body, link, metadata)
    VALUES (admin_row.user_id, 'user.registered', 'New user registered',
            COALESCE(NEW.email,'A new user just joined Asá'), '/admin/users',
            jsonb_build_object('new_user_id', NEW.id, 'email', NEW.email));
  END LOOP;

  RETURN NEW;
END $$;

-- ===== storage policies for public media buckets =====
DROP POLICY IF EXISTS "media public read" ON storage.objects;
CREATE POLICY "media public read" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id IN ('avatars','portfolio','posts'));
DROP POLICY IF EXISTS "media owner insert" ON storage.objects;
CREATE POLICY "media owner insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('avatars','portfolio','posts','documents','government-ids')
              AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "media owner update" ON storage.objects;
CREATE POLICY "media owner update" ON storage.objects FOR UPDATE TO authenticated
  USING (owner = auth.uid()) WITH CHECK (owner = auth.uid());
DROP POLICY IF EXISTS "media owner delete" ON storage.objects;
CREATE POLICY "media owner delete" ON storage.objects FOR DELETE TO authenticated USING (owner = auth.uid());
DROP POLICY IF EXISTS "private docs owner or admin read" ON storage.objects;
CREATE POLICY "private docs owner or admin read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id IN ('documents','government-ids')
         AND ((storage.foldername(name))[1] = auth.uid()::text
              OR has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin')));
