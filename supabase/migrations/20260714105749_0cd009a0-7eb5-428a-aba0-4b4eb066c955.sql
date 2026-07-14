
-- ============================================================
-- ASÁ — Refinement Phase: Foundation (schema + notifications + settings + categories)
-- ============================================================

-- 1. Extend profiles with new fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS country text DEFAULT 'Nigeria',
  ADD COLUMN IF NOT EXISTS lga text,
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS profession text,
  ADD COLUMN IF NOT EXISTS skills text[],
  ADD COLUMN IF NOT EXISTS hourly_rate numeric,
  ADD COLUMN IF NOT EXISTS years_experience integer,
  ADD COLUMN IF NOT EXISTS availability jsonb,
  ADD COLUMN IF NOT EXISTS social_links jsonb,
  ADD COLUMN IF NOT EXISTS is_provider boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_profiles_profession ON public.profiles USING gin (to_tsvector('simple', coalesce(profession,'')));
CREATE INDEX IF NOT EXISTS idx_profiles_state ON public.profiles(state);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON public.profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_is_provider ON public.profiles(is_provider);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);

-- 2. Categories (seeded taxonomy)
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  icon text,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are publicly readable"
  ON public.categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins manage categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- Seed initial categories
INSERT INTO public.categories (slug, name, icon, sort_order) VALUES
  ('electrician', 'Electrician', '⚡', 1),
  ('plumber', 'Plumber', '🔧', 2),
  ('tailor', 'Tailor', '🧵', 3),
  ('mechanic', 'Mechanic', '🔩', 4),
  ('cleaner', 'Cleaner', '🧹', 5),
  ('carpenter', 'Carpenter', '🪚', 6),
  ('painter', 'Painter', '🎨', 7),
  ('welder', 'Welder', '🔥', 8),
  ('hair-stylist', 'Hair Stylist', '💇', 9),
  ('makeup-artist', 'Makeup Artist', '💄', 10),
  ('photographer', 'Photographer', '📷', 11),
  ('videographer', 'Videographer', '🎥', 12),
  ('graphic-designer', 'Graphic Designer', '🖌️', 13),
  ('software-engineer', 'Software Engineer', '💻', 14),
  ('computer-engineer', 'Computer Engineer', '🖥️', 15),
  ('civil-engineer', 'Civil Engineer', '🏗️', 16),
  ('architect', 'Architect', '📐', 17),
  ('solar-installer', 'Solar Installer', '☀️', 18),
  ('generator-repair', 'Generator Repair', '⚙️', 19),
  ('lawyer', 'Lawyer', '⚖️', 20),
  ('doctor', 'Doctor', '🩺', 21),
  ('teacher', 'Teacher', '📚', 22),
  ('chef', 'Chef', '👨‍🍳', 23),
  ('driver', 'Driver', '🚗', 24)
ON CONFLICT (slug) DO NOTHING;

-- 3. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  link text,
  metadata jsonb,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own notifications"
  ON public.notifications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'super_admin')
    OR auth.uid() = user_id
  );

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id) WHERE read = false;

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- 4. User settings (theme + preferences)
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme text NOT NULL DEFAULT 'dark',
  email_notifications boolean NOT NULL DEFAULT true,
  push_notifications boolean NOT NULL DEFAULT true,
  marketing_emails boolean NOT NULL DEFAULT false,
  profile_visibility text NOT NULL DEFAULT 'public',
  two_factor_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_settings TO authenticated;
GRANT ALL ON public.user_settings TO service_role;

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own settings"
  ON public.user_settings FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER trg_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- 5. Broaden handle_new_user to capture more signup fields + create settings + notify admins
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_row record;
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, country, state, lga, city)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'country', 'Nigeria'),
    NEW.raw_user_meta_data->>'state',
    NEW.raw_user_meta_data->>'lga',
    NEW.raw_user_meta_data->>'city'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer')
  ON CONFLICT DO NOTHING;

  INSERT INTO public.user_settings (user_id) VALUES (NEW.id)
  ON CONFLICT DO NOTHING;

  -- Welcome notification
  INSERT INTO public.notifications (user_id, type, title, body, link)
  VALUES (NEW.id, 'welcome', 'Welcome to Asá 🎉',
          'Your account is ready. Explore verified professionals or apply to become one.',
          '/dashboard');

  -- Notify admins / super admins of new user
  FOR admin_row IN
    SELECT DISTINCT user_id FROM public.user_roles WHERE role IN ('admin', 'super_admin')
  LOOP
    INSERT INTO public.notifications (user_id, type, title, body, link, metadata)
    VALUES (admin_row.user_id, 'user.registered', 'New user registered',
            COALESCE(NEW.email, 'A new user just joined Asá'),
            '/admin/users',
            jsonb_build_object('new_user_id', NEW.id, 'email', NEW.email));
  END LOOP;

  RETURN NEW;
END;
$$;

-- Ensure trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Extend application-approved trigger to notify the applicant + mark provider
CREATE OR REPLACE FUNCTION public.handle_application_approved()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'provider')
    ON CONFLICT DO NOTHING;

    UPDATE public.profiles SET is_provider = true, profession = COALESCE(profession, NEW.profession) WHERE id = NEW.user_id;

    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (NEW.user_id, 'application.approved',
            'You are now a verified Provider 🎉',
            'Your provider application has been approved. Visit your Provider dashboard to get started.',
            '/provider');
  ELSIF NEW.status = 'rejected' AND (OLD.status IS DISTINCT FROM 'rejected') THEN
    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (NEW.user_id, 'application.rejected',
            'Provider application update',
            COALESCE(NEW.admin_notes, 'Your application was not approved at this time.'),
            '/become-a-provider');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_application_status_change ON public.provider_applications;
CREATE TRIGGER on_application_status_change
  AFTER UPDATE ON public.provider_applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_application_approved();

-- 7. Notify admins on new provider application
CREATE OR REPLACE FUNCTION public.notify_admins_of_application()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_row record;
BEGIN
  FOR admin_row IN
    SELECT DISTINCT user_id FROM public.user_roles WHERE role IN ('admin', 'super_admin')
  LOOP
    INSERT INTO public.notifications (user_id, type, title, body, link, metadata)
    VALUES (admin_row.user_id, 'application.submitted',
            'New provider application',
            'A user submitted a provider application for ' || NEW.profession,
            '/admin/applications',
            jsonb_build_object('application_id', NEW.id, 'user_id', NEW.user_id));
  END LOOP;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_application_submitted ON public.provider_applications;
CREATE TRIGGER on_application_submitted
  AFTER INSERT ON public.provider_applications
  FOR EACH ROW EXECUTE FUNCTION public.notify_admins_of_application();

-- 8. Backfill user_settings for existing users
INSERT INTO public.user_settings (user_id)
SELECT id FROM auth.users
ON CONFLICT DO NOTHING;
