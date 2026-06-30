-- Corrige políticas RLS das tabelas profiles e pages
-- Remove recursão infinita e permite acesso do usuário ao próprio perfil

-- ============================================================
-- PROFILES
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Remove políticas existentes que possam estar quebradas
DROP POLICY IF EXISTS "Usuários podem ver próprio perfil" ON profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar próprio perfil" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable read access for own profile" ON profiles;
DROP POLICY IF EXISTS "Enable update for own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Cria política: usuário autenticado pode SELECT no próprio perfil
CREATE POLICY "Usuários podem ver próprio perfil" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Cria política: usuário autenticado pode UPDATE no próprio perfil
CREATE POLICY "Usuários podem atualizar próprio perfil" ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================
-- PAGES - Garantir schema completo
-- ============================================================
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Garante que todas as colunas necessárias existem
ALTER TABLE pages ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE pages ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE pages ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE pages ALTER COLUMN created_at SET DEFAULT now();

-- Remove TODAS as políticas existentes que possam causar recursão
DROP POLICY IF EXISTS "Usuários podem ver próprias páginas" ON pages;
DROP POLICY IF EXISTS "Usuários podem criar páginas" ON pages;
DROP POLICY IF EXISTS "Usuários podem atualizar próprias páginas" ON pages;
DROP POLICY IF EXISTS "Usuários podem deletar próprias páginas" ON pages;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON pages;
DROP POLICY IF EXISTS "Enable read access for own pages" ON pages;
DROP POLICY IF EXISTS "Enable update for own pages" ON pages;
DROP POLICY IF EXISTS "Enable delete for own pages" ON pages;
DROP POLICY IF EXISTS "Users can view own pages" ON pages;
DROP POLICY IF EXISTS "Users can create own pages" ON pages;
DROP POLICY IF EXISTS "Users can update own pages" ON pages;
DROP POLICY IF EXISTS "Users can delete own pages" ON pages;
DROP POLICY IF EXISTS "Permitir insert para usuários autenticados" ON pages;
DROP POLICY IF EXISTS "Permitir select para próprias páginas" ON pages;
DROP POLICY IF EXISTS "Permitir update para próprias páginas" ON pages;
DROP POLICY IF EXISTS "Permitir delete para próprias páginas" ON pages;
DROP POLICY IF EXISTS "Give authenticated users access to own page" ON pages;
DROP POLICY IF EXISTS "Enable access for own pages" ON pages;

-- Cria políticas sem recursão (usam auth.uid() diretamente, sem subquery na mesma tabela)
CREATE POLICY "Usuários podem ver próprias páginas" ON pages
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar páginas" ON pages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar próprias páginas" ON pages
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar próprias páginas" ON pages
  FOR DELETE
  USING (auth.uid() = user_id);
