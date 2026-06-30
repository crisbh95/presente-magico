-- Dump policies for debugging
CREATE TABLE IF NOT EXISTS public.rls_debug (
  schemaname text,
  tablename text,
  policyname text,
  roles text[],
  cmd text,
  qual text,
  with_check text
);

TRUNCATE public.rls_debug;

INSERT INTO public.rls_debug
SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename IN ('profiles', 'pages');
