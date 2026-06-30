-- Remove política antiga quebrada que causava erro de permissão na tabela auth.users
DROP POLICY IF EXISTS "Admins podem ver e atualizar tudo" ON public.profiles;

-- Limpeza da tabela de depuração
DROP TABLE IF EXISTS public.rls_debug;
