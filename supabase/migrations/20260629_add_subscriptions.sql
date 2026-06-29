-- Adicionar colunas de assinatura à tabela profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_end TIMESTAMPTZ DEFAULT NULL;

-- Adicionar plan_type à tabela payment_requests
ALTER TABLE payment_requests ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'lifetime';

-- Adicionar contador de visualizações à tabela pages
ALTER TABLE pages ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
