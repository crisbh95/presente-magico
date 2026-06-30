-- Garante colunas necessárias na tabela pages
ALTER TABLE pages ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE pages ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE pages ALTER COLUMN created_at SET DEFAULT now();

-- Remove e recria políticas RLS em pages para garantir que estão corretas sem recursão
DROP POLICY IF EXISTS "Usuários podem ver próprias páginas" ON pages;
CREATE POLICY "Usuários podem ver próprias páginas" ON pages
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem criar páginas" ON pages;
CREATE POLICY "Usuários podem criar páginas" ON pages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar próprias páginas" ON pages;
CREATE POLICY "Usuários podem atualizar próprias páginas" ON pages
  FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar próprias páginas" ON pages;
CREATE POLICY "Usuários podem deletar próprias páginas" ON pages
  FOR DELETE
  USING (auth.uid() = user_id);

-- Remove outras políticas que possam estar causando conflito
DROP POLICY IF EXISTS "Give authenticated users access to own page" ON pages;
DROP POLICY IF EXISTS "Enable access for own pages" ON pages;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON pages;

-- Garante políticas RLS em profiles
DROP POLICY IF EXISTS "Usuários podem ver próprio perfil" ON profiles;
CREATE POLICY "Usuários podem ver próprio perfil" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem atualizar próprio perfil" ON profiles;
CREATE POLICY "Usuários podem atualizar próprio perfil" ON profiles
  FOR UPDATE
  USING (auth.uid() = id);
