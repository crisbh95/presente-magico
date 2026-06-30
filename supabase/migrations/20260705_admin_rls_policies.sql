-- Políticas RLS para Administradores nas tabelas profiles e pages

-- Habilitar politicas de SELECT para administradores na tabela profiles
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON public.profiles;
CREATE POLICY "Admins podem ver todos os perfis" ON public.profiles
  FOR SELECT
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    OR auth.jwt() ->> 'email' = 'crisbh95@gmail.com'
    OR auth.jwt() ->> 'email' = 'contato@presentemagico.com.br'
  );

-- Habilitar politicas de UPDATE para administradores na tabela profiles
DROP POLICY IF EXISTS "Admins podem atualizar todos os perfis" ON public.profiles;
CREATE POLICY "Admins podem atualizar todos os perfis" ON public.profiles
  FOR UPDATE
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    OR auth.jwt() ->> 'email' = 'crisbh95@gmail.com'
    OR auth.jwt() ->> 'email' = 'contato@presentemagico.com.br'
  );

-- Habilitar politicas de DELETE para administradores na tabela profiles
DROP POLICY IF EXISTS "Admins podem deletar todos os perfis" ON public.profiles;
CREATE POLICY "Admins podem deletar todos os perfis" ON public.profiles
  FOR DELETE
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    OR auth.jwt() ->> 'email' = 'crisbh95@gmail.com'
    OR auth.jwt() ->> 'email' = 'contato@presentemagico.com.br'
  );

-- Habilitar politicas de SELECT para administradores na tabela pages
DROP POLICY IF EXISTS "Admins podem ver todas as páginas" ON public.pages;
CREATE POLICY "Admins podem ver todas as páginas" ON public.pages
  FOR SELECT
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    OR auth.jwt() ->> 'email' = 'crisbh95@gmail.com'
    OR auth.jwt() ->> 'email' = 'contato@presentemagico.com.br'
  );

-- Habilitar politicas de DELETE para administradores na tabela pages
DROP POLICY IF EXISTS "Admins podem deletar todas as páginas" ON public.pages;
CREATE POLICY "Admins podem deletar todas as páginas" ON public.pages
  FOR DELETE
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    OR auth.jwt() ->> 'email' = 'crisbh95@gmail.com'
    OR auth.jwt() ->> 'email' = 'contato@presentemagico.com.br'
  );
