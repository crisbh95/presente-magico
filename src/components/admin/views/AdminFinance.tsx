import { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, Loader2, DollarSign, ArrowUpRight, CreditCard, Receipt } from 'lucide-react';
import { getPendingPayments, approvePayment, type PaymentRequest } from '../../../services/db';

export default function AdminFinance() {
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const data = await getPendingPayments();
      setRequests(data);
      setLoading(false);
    }
    loadData();
  }, []);

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
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Financeiro</h2>
          <p className="text-slate-500">Controle de receitas, aprovações e assinaturas.</p>
        </div>
        <button className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-slate-800 transition-colors">
          Exportar Relatório
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">
              <ArrowUpRight className="w-3 h-3" /> +12.5%
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Receita Mensal</p>
          <h3 className="text-2xl font-bold">R$ 14.250,00</h3>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-500/20 text-blue-600 rounded-xl">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">
              <ArrowUpRight className="w-3 h-3" /> +5.2%
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Via Pix</p>
          <h3 className="text-2xl font-bold">R$ 9.800,00</h3>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-500/20 text-purple-600 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Cartão de Crédito</p>
          <h3 className="text-2xl font-bold">R$ 4.450,00</h3>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rose-100 dark:bg-rose-500/20 text-rose-600 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Aprovações Pendentes</p>
          <h3 className="text-2xl font-bold">{requests.length}</h3>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <ShieldAlert className="w-6 h-6 text-rose-500" />
          <h2 className="text-xl font-bold">Aprovações de Pix Pendentes</h2>
        </div>
        
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
  );
}
