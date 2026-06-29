import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Heart, Loader2, ShieldAlert, Crown } from 'lucide-react';
import { getPageById, incrementPageViews, getProfile } from '../services/db';
import { useAuth } from '../contexts/AuthContext';
import GiftViewer from '../components/GiftViewer';

export default function ViewPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const counted = useRef(false);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const data = await getPageById(id);
        if (data) {
          // data.creator_plan e data.creator_role vêm da nova RPC (se o usuário não rodou o script, vamos buscar manual)
          let isCreatorFree = false;
          
          if (data.creator_plan !== undefined) {
            isCreatorFree = data.creator_plan === 'free' && data.creator_role !== 'admin';
          } else {
            // Fallback (caso não tenha rodado o SQL)
            const creatorProfile = await getProfile(data.user_id);
            isCreatorFree = creatorProfile?.plan === 'free' && creatorProfile?.role !== 'admin';
          }
          
          if (isCreatorFree && (data.views || 0) >= 30) {
            setBlocked(true);
            setPageData({ user_id: data.user_id }); // Keep user_id to check if viewer is owner
          } else {
            setPageData({ 
              ...data.data, 
              template: data.template, 
              user_id: data.user_id,
              creator_plan: data.creator_plan,
              agency_name: data.agency_name,
              agency_logo_url: data.agency_logo_url,
              agency_whatsapp: data.agency_whatsapp
            });
            if (!counted.current) {
              counted.current = true;
              incrementPageViews(id);
            }
          }
        } else setError(true);
      } catch (err) { setError(true); } finally { setLoading(false); }
    }
    loadData();
  }, [id]);

  if (loading) return <div className="min-h-[100dvh] bg-black flex flex-col items-center justify-center p-4"><Loader2 className="animate-spin text-rose-500 w-12 h-12" /></div>;
  if (error || (!pageData && !blocked)) return <div className="min-h-[100dvh] bg-black flex flex-col items-center justify-center p-4 text-white"><Heart className="text-white/20 w-16 h-16 mb-4" /><h2 className="text-2xl font-bold">Presente não encontrado</h2></div>;

  if (blocked) {
    const isOwner = user && user.id === pageData?.user_id;
    return (
      <div className="min-h-[100dvh] bg-black flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] max-w-md w-full animate-in fade-in zoom-in duration-500 shadow-2xl">
          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-10 h-10 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Limite de Visualizações Excedido</h1>
          
          {isOwner ? (
            <>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Este presente atingiu o limite de <strong className="text-white">30 visualizações</strong> do plano Gratuito. 
                Faça o upgrade para o Premium para liberar acessos ilimitados e eternizar este momento para sempre.
              </p>
              <Link 
                to="/plans" 
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-amber-500/20"
              >
                <Crown className="w-5 h-5" /> Liberar Acesso Ilimitado
              </Link>
            </>
          ) : (
            <>
              <p className="text-slate-400 leading-relaxed mb-2">
                Este presente atingiu o seu limite máximo de visualizações.
              </p>
              <p className="text-slate-500 text-sm mb-8">
                Avise quem te enviou para liberar o acesso ilimitado.
              </p>
              <Link 
                to="/" 
                className="inline-block text-primary font-semibold hover:text-primary-hover transition-colors"
              >
                Criar o meu Presente Mágico
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  return <GiftViewer pageData={pageData} />;
}
