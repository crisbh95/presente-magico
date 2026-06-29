-- Adicionar coluna mercadopago_id na tabela payment_requests
ALTER TABLE payment_requests
ADD COLUMN IF NOT EXISTS mercadopago_id TEXT UNIQUE;

-- Índice para buscar rapidamente por mercadopago_id
CREATE INDEX IF NOT EXISTS idx_payment_requests_mercadopago_id
ON payment_requests (mercadopago_id);
