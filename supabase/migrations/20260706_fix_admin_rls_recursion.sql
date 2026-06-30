-- Cria função SECURITY DEFINER para verificar se é admin sem causar recursão RLS
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = p_user_id AND role = 'admin'
  );
END;
$$;

-- Recria políticas para public.profiles
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON public.profiles;
CREATE POLICY "Admins podem ver todos os perfis" ON public.profiles
  FOR SELECT
  USING (
    public.is_admin(auth.uid())
    OR auth.jwt() ->> 'email' = 'crisbh95@gmail.com'
    OR auth.jwt() ->> 'email' = 'contato@presentemagico.com.br'
  );

DROP POLICY IF EXISTS "Admins podem atualizar todos os perfis" ON public.profiles;
CREATE POLICY "Admins podem atualizar todos os perfis" ON public.profiles
  FOR UPDATE
  USING (
    public.is_admin(auth.uid())
    OR auth.jwt() ->> 'email' = 'crisbh95@gmail.com'
    OR auth.jwt() ->> 'email' = 'contato@presentemagico.com.br'
  );

DROP POLICY IF EXISTS "Admins podem deletar todos os perfis" ON public.profiles;
CREATE POLICY "Admins podem deletar todos os perfis" ON public.profiles
  FOR DELETE
  USING (
    public.is_admin(auth.uid())
    OR auth.jwt() ->> 'email' = 'crisbh95@gmail.com'
    OR auth.jwt() ->> 'email' = 'contato@presentemagico.com.br'
  );

-- Recria políticas para public.pages
DROP POLICY IF EXISTS "Admins podem ver todas as páginas" ON public.pages;
CREATE POLICY "Admins podem ver todas as páginas" ON public.pages
  FOR SELECT
  USING (
    public.is_admin(auth.uid())
    OR auth.jwt() ->> 'email' = 'crisbh95@gmail.com'
    OR auth.jwt() ->> 'email' = 'contato@presentemagico.com.br'
  );

DROP POLICY IF EXISTS "Admins podem deletar todas as páginas" ON public.pages;
CREATE POLICY "Admins podem deletar todas as páginas" ON public.pages
  FOR DELETE
  USING (
    public.is_admin(auth.uid())
    OR auth.jwt() ->> 'email' = 'crisbh95@gmail.com'
    OR auth.jwt() ->> 'email' = 'contato@presentemagico.com.br'
  );
