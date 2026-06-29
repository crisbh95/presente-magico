import { supabase } from '../supabase/config';

export interface PhotoData {
  url: string;
  caption: string;
}

export interface PageData {
  id?: string;
  user_id: string; // no supabase costumamos usar snake_case
  template: string;
  data: any;
  created_at: string;
  status: 'active' | 'pending_payment';
}

// Salva uma nova página no Supabase
export const createPage = async (userId: string, template: string, data: any): Promise<string> => {
  // Geramos um ID amigável de 8 caracteres
  const shortId = Math.random().toString(36).substring(2, 10);
  
  const newPage = {
    id: shortId,
    user_id: userId,
    template,
    data,
    status: 'active',
  };
  
  const { error } = await supabase
    .from('pages')
    .insert([newPage]);
    
  if (error) {
    console.error("Erro ao criar página:", error);
    throw new Error(error.message);
  }
  
  return shortId;
};

// Atualiza uma página existente no Supabase
export const updatePage = async (pageId: string, userId: string, data: any): Promise<boolean> => {
  const { error } = await supabase
    .from('pages')
    .update({ data })
    .eq('id', pageId)
    .eq('user_id', userId);
    
  if (error) {
    console.error("Erro ao atualizar página:", error);
    throw new Error(error.message);
  }
  
  return true;
};

// Busca uma página específica pelo ID
export const getPageById = async (pageId: string): Promise<PageData | null> => {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', pageId)
    .single();
    
  if (error) {
    console.error("Erro ao buscar página:", error);
    return null;
  }
  
  return data as PageData;
};

// Busca todas as páginas criadas por um usuário específico
export const getUserPages = async (userId: string): Promise<PageData[]> => {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Erro ao buscar páginas do usuário:", error);
    return [];
  }
  
  return data as PageData[];
};

// Fazer upload de mídia (foto, vídeo ou áudio) usando Storage do Supabase
export const uploadPhoto = async (file: File, userId: string): Promise<string> => {
  // Validação de Segurança - Tipo de Arquivo
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'video/mp4', 'video/webm',
    'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'
  ];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Formato inválido. Use JPG, PNG, WEBP, MP4 ou MP3.');
  }

  // Validação de Segurança - Tamanho (Max 30MB)
  const maxSize = 30 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('O arquivo é muito grande. O tamanho máximo é 30MB.');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from('photos')
    .upload(fileName, file);
    
  if (error) {
    console.error("Erro ao subir foto:", error);
    throw new Error(error.message);
  }
  
  // Pega a URL pública
  const { data: publicUrlData } = supabase.storage
    .from('photos')
    .getPublicUrl(fileName);
    
  return publicUrlData.publicUrl;
};

// Exclui uma página e suas fotos
export const deletePage = async (pageId: string, userId: string): Promise<boolean> => {
  // 1. Buscar a página para obter as URLs das fotos
  const { data: pageData, error: fetchError } = await supabase
    .from('pages')
    .select('*')
    .eq('id', pageId)
    .eq('user_id', userId)
    .single();

  if (fetchError || !pageData) {
    console.error("Erro ao buscar a página para exclusão:", fetchError);
    throw new Error("Página não encontrada ou sem permissão.");
  }

  // 2. Extrair os nomes dos arquivos do bucket (se existirem) a partir das URLs públicas
  const photosUrls = [pageData.data.photoUrl1, pageData.data.photoUrl2, pageData.data.photoUrl3].filter(Boolean) as string[];
  const filesToDelete = photosUrls.map(url => {
    // A URL pública é no formato: https://<project>.supabase.co/storage/v1/object/public/photos/<userId>/<fileName>
    // Precisamos extrair apenas o '<userId>/<fileName>'
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/photos/');
    return pathParts.length > 1 ? pathParts[1] : null;
  }).filter(Boolean) as string[];

  // 3. Deletar os arquivos do bucket
  if (filesToDelete.length > 0) {
    const { error: storageError } = await supabase.storage
      .from('photos')
      .remove(filesToDelete);
      
    if (storageError) {
      console.error("Erro ao excluir fotos do storage:", storageError);
      // Não interrompemos a exclusão da página, mas registramos o erro no servidor
    }
  }

  // 4. Deletar o registro do banco de dados (A Fonte da Verdade)
  const { error } = await supabase
    .from('pages')
    .delete()
    .eq('id', pageId)
    .eq('user_id', userId);
    
  if (error) {
    console.error("Erro de RLS/banco ao excluir página:", error);
    throw new Error("Erro ao excluir página. Verifique as permissões do banco.");
  }
  
  return true;
};

// ==========================================
// ADMIN & PAYMENTS
// ==========================================

export interface UserProfile {
  id: string;
  email: string;
  role: 'user' | 'admin';
  plan: 'free' | 'premium';
  plan_type?: 'lifetime' | 'monthly' | 'annual' | null;
  subscription_end?: string | null;
}

export interface PaymentRequest {
  id: string;
  user_id: string;
  user_email: string;
  status: 'pending' | 'approved' | 'rejected';
  mercadopago_id?: string;
  created_at: string;
}

export const getProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error("Erro ao buscar perfil:", error);
    return null;
  }

  if (data.plan === 'premium' && data.subscription_end && new Date(data.subscription_end) < new Date()) {
    await supabase
      .from('profiles')
      .update({ plan: 'free', plan_type: null, subscription_end: null })
      .eq('id', userId);
    data.plan = 'free';
    data.plan_type = null;
    data.subscription_end = null;
  }

  return data as UserProfile;
};

export const createPaymentRequest = async (userId: string, email: string): Promise<boolean> => {
  const { error } = await supabase
    .from('payment_requests')
    .insert([{ user_id: userId, user_email: email, status: 'pending' }]);

  if (error) {
    console.error("Erro ao criar solicitação de pagamento:", error);
    return false;
  }
  return true;
};

export const getPendingPayments = async (): Promise<PaymentRequest[]> => {
  const { data, error } = await supabase
    .from('payment_requests')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erro ao buscar pagamentos pendentes:", error);
    return [];
  }
  return data as PaymentRequest[];
};

export const approvePayment = async (requestId: string, userId: string): Promise<boolean> => {
  // Update request status
  const { error: reqError } = await supabase
    .from('payment_requests')
    .update({ status: 'approved' })
    .eq('id', requestId);

  if (reqError) {
    console.error("Erro ao aprovar requisição:", reqError);
    return false;
  }

  // Update user plan
  const { error: profError } = await supabase
    .from('profiles')
    .update({ plan: 'premium' })
    .eq('id', userId);

  if (profError) {
    console.error("Erro ao atualizar plano do usuário:", profError);
    return false;
  }

  return true;
};

export const incrementPageViews = async (pageId: string): Promise<void> => {
  const { error } = await supabase.rpc('increment_page_views', { p_page_id: pageId });

  if (error) {
    console.error("Erro ao incrementar views:", error);
  }
};

export const getTotalPagesCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('pages')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error("Erro ao contar páginas:", error);
    return 0;
  }
  return count || 0;
};

export const getPremiumCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('plan', 'premium');

  if (error) {
    console.error("Erro ao contar premiums:", error);
    return 0;
  }
  return count || 0;
};

export const getUserPaymentRequest = async (userId: string): Promise<PaymentRequest | null> => {
  const { data, error } = await supabase
    .from('payment_requests')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'pending')
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar solicitação do usuário:", error);
    return null;
  }
  return data as PaymentRequest | null;
};
