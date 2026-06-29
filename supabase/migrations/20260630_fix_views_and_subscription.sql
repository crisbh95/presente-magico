-- Função para incrementar views atomicamente
CREATE OR REPLACE FUNCTION increment_page_views(p_page_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE pages SET views = COALESCE(views, 0) + 1 WHERE id = p_page_id;
END;
$$;
