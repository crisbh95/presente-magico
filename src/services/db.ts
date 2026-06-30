import { supabase } from '../supabase/config';
import imageCompression from 'browser-image-compression';

export interface PhotoData {
  url: string;
  caption: string;
}

export interface PageData {
  id?: string;
  user_id: string; // no supabase costumamos usar snake_case
  template: string;
  data: any;
  views?: number;
  created_at: string;
  status: 'active' | 'pending_payment';
}

// Salva uma nova página no Supabase
export const createPage = async (userId: string, template: string, data: any): Promise<string> => {
  // Geramos um ID criptograficamente seguro e url-friendly
  const shortId = window.crypto.randomUUID().replace(/-/g, '');
  
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

// Busca uma página específica pelo ID com o perfil do dono (N+1 Resolvido)
export const getPageById = async (pageId: string): Promise<any | null> => {
  // Chamamos direto a RPC unificada que busca a página e o plano do criador de uma vez
  const rpcRes = await supabase.rpc('get_page_with_profile', { p_page_id: pageId });
  
  if (!rpcRes.error && rpcRes.data && rpcRes.data.length > 0) {
    return rpcRes.data[0];
  } else {
    // Fallback: Se a RPC nova não existir (usuário não rodou o script), tentamos o método antigo
    let { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', pageId)
      .single();
      
    if (error || !data) {
      const fallbackRpc = await supabase.rpc('get_public_page', { p_page_id: pageId });
      if (!fallbackRpc.error && fallbackRpc.data && fallbackRpc.data.length > 0) {
        data = fallbackRpc.data[0];
      } else {
        console.error("Erro ao buscar página:", error || fallbackRpc.error);
        return null;
      }
    }
    return data;
  }
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
  
  let fileToUpload = file;
  if (file.type.startsWith('image/')) {
    try {
      fileToUpload = await imageCompression(file, {
        maxSizeMB: 0.4,
        maxWidthOrHeight: 1080,
        useWebWorker: true,
        initialQuality: 0.8,
      });
    } catch (error) {
      console.warn("Erro na compressão de imagem, usando original", error);
    }
  }
  
  const { error } = await supabase.storage
    .from('photos')
    .upload(fileName, fileToUpload);
    
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
  plan_type?: 'lifetime' | 'monthly' | 'annual' | 'agency' | null;
  subscription_end?: string | null;
  agency_name?: string | null;
  agency_logo_url?: string | null;
  agency_whatsapp?: string | null;
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

  // Don't downgrade owners
  const isOwner = data.email === 'crisbh95@gmail.com' || data.email === 'contato@presentemagico.com.br' || data.role === 'admin';

  if (!isOwner && data.plan === 'premium' && data.subscription_end && new Date(data.subscription_end) < new Date()) {
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

export const updateAgencyProfile = async (
  userId: string, 
  agencyData: { agency_name?: string, agency_logo_url?: string, agency_whatsapp?: string }
): Promise<boolean> => {
  const { error } = await supabase
    .from('profiles')
    .update(agencyData)
    .eq('id', userId);
    
  if (error) {
    console.error("Erro ao atualizar perfil de agência:", error);
    throw new Error(error.message);
  }
  return true;
};

// Busca todos os perfis cadastrados para o painel administrativo
export const getAllProfiles = async (): Promise<any[]> => {
  const { data: profiles, error: profError } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (profError) {
    console.error("Erro ao buscar todos os perfis:", profError);
    return [];
  }

  // Busca contagem de páginas para cada usuário
  const { data: pages, error: pagesError } = await supabase
    .from('pages')
    .select('user_id');

  const pageCounts: Record<string, number> = {};
  if (!pagesError && pages) {
    pages.forEach((page: any) => {
      pageCounts[page.user_id] = (pageCounts[page.user_id] || 0) + 1;
    });
  }

  return profiles.map((p: any) => ({
    ...p,
    name: p.email ? p.email.split('@')[0] : 'Usuário',
    gifts: pageCounts[p.id] || 0,
    lastAccess: p.created_at ? new Date(p.created_at).toLocaleDateString('pt-BR') : 'Sem dados',
    status: p.status || 'active'
  }));
};

// Exclui um perfil de usuário e todas as suas páginas associadas
export const deleteUserProfile = async (userId: string): Promise<boolean> => {
  // 1. Busca todas as páginas do usuário para poder excluir as mídias do storage
  const { data: userPages } = await supabase
    .from('pages')
    .select('id')
    .eq('user_id', userId);

  if (userPages && userPages.length > 0) {
    for (const page of userPages) {
      try {
        await deletePage(page.id, userId);
      } catch (err) {
        console.error(`Erro ao excluir página ${page.id} do usuário:`, err);
      }
    }
  }

  // 2. Deleta o perfil do usuário
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (error) {
    console.error("Erro ao excluir perfil de usuário:", error);
    throw new Error(error.message);
  }
  return true;
};

// Altera o status (ativo/bloqueado) de um perfil de usuário
export const updateUserStatus = async (userId: string, status: 'active' | 'blocked'): Promise<boolean> => {
  const { error } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', userId);

  if (error) {
    console.error("Erro ao atualizar status do usuário:", error);
    throw new Error(error.message);
  }
  return true;
};

// Altera o plano do usuário diretamente pelo painel admin
export const updateUserPlan = async (userId: string, plan: 'free' | 'premium', planType: string | null = null): Promise<boolean> => {
  const subscriptionEnd = plan === 'premium' 
    ? (planType === 'monthly' ? new Date(Date.now() + 30 * 86400000).toISOString()
       : planType === 'annual' ? new Date(Date.now() + 365 * 86400000).toISOString()
       : null)
    : null;

  const { error } = await supabase
    .from('profiles')
    .update({ 
      plan, 
      plan_type: planType, 
      subscription_end: subscriptionEnd 
    })
    .eq('id', userId);

  if (error) {
    console.error("Erro ao atualizar plano do usuário:", error);
    throw new Error(error.message);
  }
  return true;
};

// Salva a resposta/feedback de quem recebeu o presente no banco
export const sendPageFeedback = async (pageId: string, message: string): Promise<boolean> => {
  const { error } = await supabase
    .from('page_feedback')
    .insert([{ page_id: pageId, message }]);
    
  if (error) {
    console.error("Erro ao enviar feedback:", error);
    return false;
  }
  return true;
};
