
REVOKE ALL ON FUNCTION public.guard_verification_status() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_application_approved() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.notify_admins_of_application() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.tg_touch_updated_at() FROM PUBLIC, anon, authenticated;
