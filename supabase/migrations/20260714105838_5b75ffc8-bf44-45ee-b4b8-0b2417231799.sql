
-- ============================================================
-- Storage RLS for buckets: avatars, portfolio, government-ids, documents
-- Convention: files are uploaded under "<user_id>/<filename>"
-- ============================================================

-- Public read for avatars & portfolio
CREATE POLICY "Avatar images are publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Portfolio images are publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio');

-- User-scoped write for avatars
CREATE POLICY "Users upload own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users update own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- User-scoped write for portfolio
CREATE POLICY "Users upload own portfolio"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users update own portfolio"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own portfolio"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Private buckets: government-ids
CREATE POLICY "Users read own government-ids"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'government-ids'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR public.has_role(auth.uid(), 'admin')
      OR public.has_role(auth.uid(), 'super_admin')
    )
  );

CREATE POLICY "Users upload own government-ids"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'government-ids' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users update own government-ids"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'government-ids' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Private buckets: documents
CREATE POLICY "Users read own documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documents'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR public.has_role(auth.uid(), 'admin')
      OR public.has_role(auth.uid(), 'super_admin')
    )
  );

CREATE POLICY "Users upload own documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users update own documents"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
