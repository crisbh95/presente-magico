-- Cria tabela de feedback dos presentes
CREATE TABLE IF NOT EXISTS public.page_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id TEXT REFERENCES public.pages(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.page_feedback ENABLE ROW LEVEL SECURITY;

-- Permitir inserções públicas/anonimas de feedback
DROP POLICY IF EXISTS "Permitir inserções públicas no feedback" ON public.page_feedback;
CREATE POLICY "Permitir inserções públicas no feedback" ON public.page_feedback
  FOR INSERT
  WITH CHECK (true);

-- Permitir que os donos dos presentes leiam os feedbacks de suas páginas
DROP POLICY IF EXISTS "Criadores podem ver feedback de suas páginas" ON public.page_feedback;
CREATE POLICY "Criadores podem ver feedback de suas páginas" ON public.page_feedback
  FOR SELECT
  USING (
    auth.uid() = (SELECT user_id FROM public.pages WHERE id = page_id)
  );
