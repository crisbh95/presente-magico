import { Lightbulb, Trophy, Target, TrendingUp, CalendarDays } from 'lucide-react';

export default function AdminIntelligence() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lightbulb className="text-amber-500" /> Central de Inteligência
          </h2>
          <p className="text-slate-500">Insights avançados e sugestões geradas por IA para alavancar suas vendas.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Melhores Desempenhos */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Trophy className="text-amber-500 w-5 h-5"/> Ranking de Desempenho</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <p className="text-xs text-slate-500 font-medium mb-1">Categoria Mais Vendida</p>
                <p className="font-bold text-lg text-slate-900 dark:text-white">Casamento (34%)</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <p className="text-xs text-slate-500 font-medium mb-1">Template Mais Usado</p>
                <p className="font-bold text-lg text-slate-900 dark:text-white">História de Amor v2</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <p className="text-xs text-slate-500 font-medium mb-1">Origem Principal (Tráfego)</p>
                <p className="font-bold text-lg text-slate-900 dark:text-white">Instagram Ads (62%)</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <p className="text-xs text-slate-500 font-medium mb-1">Maior Pico de Faturamento</p>
                <p className="font-bold text-lg text-slate-900 dark:text-white">Dia dos Namorados</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><TrendingUp className="text-emerald-500 w-5 h-5"/> Métricas de Engajamento</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                <span className="text-sm font-medium">Produtos mais compartilhados</span>
                <span className="text-sm text-slate-500">História de Amor (450 shares)</span>
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                <span className="text-sm font-medium">Usuários Ativos (Últimos 7 dias)</span>
                <span className="text-sm font-bold text-emerald-500">2.450 usuários</span>
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                <span className="text-sm font-medium text-rose-500">Usuários Inativos (+30 dias)</span>
                <span className="text-sm text-rose-500 font-bold">124 usuários</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-500/20">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><Target className="w-5 h-5"/> Sugestão da IA</h3>
            <p className="text-sm text-indigo-100 mb-4 leading-relaxed">
              Notamos que <strong className="text-white">45 usuários</strong> estão próximos de renovar suas assinaturas. Sugerimos enviar um cupom de 10% de desconto para garantir a retenção.
            </p>
            <button className="w-full py-2 bg-white text-purple-600 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors">
              Criar Campanha Automática
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><CalendarDays className="text-blue-500 w-5 h-5"/> Próximas Datas</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-xl flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs font-bold uppercase">Ago</span>
                  <span className="text-lg font-black leading-none">11</span>
                </div>
                <div>
                  <p className="font-bold text-sm">Dia dos Pais</p>
                  <p className="text-xs text-slate-500">Prepare os templates de homenagem. Alta demanda esperada.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-rose-50 dark:bg-rose-500/10 text-rose-600 rounded-xl flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs font-bold uppercase">Out</span>
                  <span className="text-lg font-black leading-none">12</span>
                </div>
                <div>
                  <p className="font-bold text-sm">Dia das Crianças</p>
                  <p className="text-xs text-slate-500">Oportunidade para templates infantis e de nascimento.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
