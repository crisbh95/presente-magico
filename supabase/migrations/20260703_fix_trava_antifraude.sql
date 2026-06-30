-- Função SECURITY DEFINER para contar páginas sem causar recursão RLS
CREATE OR REPLACE FUNCTION get_user_page_count(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (SELECT count(*) FROM public.pages WHERE user_id = p_user_id);
END;
$$;

-- Recria a trava anti-fraude sem recursão (usa a função que ignora RLS)
DROP POLICY IF EXISTS "Trava Anti-Fraude na Criação" ON pages;
CREATE POLICY "Trava Anti-Fraude na Criação" ON pages
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (plan = 'premium' OR role = 'admin'))
      OR
      (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND plan = 'free') AND get_user_page_count(auth.uid()) < 1)
    )
  );

-- Garante DEFAULT na coluna status
ALTER TABLE pages ALTER COLUMN status SET DEFAULT 'active';
