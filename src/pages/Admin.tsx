import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getProfile, getPendingPayments, approvePayment, type PaymentRequest } from '../services/db';

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    async function checkAdminAndLoad() {
      if (!user) {
        navigate('/login');
        return;
      }
      
      const profile = await getProfile(user.id);
      if (profile?.role === 'admin') {
        setIsAdmin(true);
        const data = await getPendingPayments();
        setRequests(data);
      } else {
        navigate('/dashboard'); // Não é admin, joga pro dashboard
      }
      setLoading(false);
    }
    
    checkAdminAndLoad();
  }, [user, navigate]);

  const handleApprove = async (request: PaymentRequest) => {
    setProcessingId(request.id);
    const success = await approvePayment(request.id, request.user_id);
    if (success) {
      setRequests(requests.filter(r => r.id !== request.id));
      alert(`O plano Premium de ${request.user_email} foi ativado!`);
    } else {
      alert("Erro ao aprovar. Tente novamente.");
    }
    setProcessingId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12 text-slate-900 dark:text-slate-100">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
        </button>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Painel de Administração</h1>
            <p className="text-slate-500">Aprove ou rejeite comprovantes de pagamento Pix.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold mb-6">Solicitações Pendentes ({requests.length})</h2>
          
          {requests.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <CheckCircle2 className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
              Nenhum pagamento pendente de aprovação no momento.
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map(req => (
                <div key={req.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <div className="mb-4 md:mb-0">
                    <p className="font-bold text-lg">{req.user_email}</p>
                    <p className="text-sm text-slate-500">Solicitado em: {new Date(req.created_at).toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={() => handleApprove(req)}
                    disabled={processingId === req.id}
                    className="w-full md:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
                  >
                    {processingId === req.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                    Aprovar Pagamento
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
