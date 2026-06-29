import { createClient } from '@supabase/supabase-js';

// As variáveis de ambiente devem ser passadas no .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'sua-url-aqui';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sua-chave-anon-aqui';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
