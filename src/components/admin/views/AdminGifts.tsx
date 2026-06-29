import { useState } from 'react';
import { Search, Filter, Eye, Heart, Share2, Copy, EyeOff, Trash2 } from 'lucide-react';

const MOCK_GIFTS = [
  { id: '1', title: 'Para meu Amor', occasion: 'História de Amor', author: 'Maria Silva', views: 124, likes: 45, shares: 12, date: '12/10/2026', status: 'public' },
  { id: '2', title: 'Feliz Aniversário Mãe', occasion: 'Dia das Mães', author: 'João Santos', views: 56, likes: 20, shares: 3, date: '05/05/2026', status: 'public' },
  { id: '3', title: 'Nosso Casamento', occasion: 'Casamento', author: 'Carla Dias', views: 890, likes: 340, shares: 150, date: '20/12/2026', status: 'public' },
  { id: '4', title: 'Homenagem ao Vô', occasion: 'Homenagem para Avô', author: 'Pedro Alves', views: 12, likes: 5, shares: 1, date: '15/08/2026', status: 'hidden' },
];

export default function AdminGifts() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gerenciar Presentes</h2>
          <p className="text-slate-500">Controle, moderação e estatísticas dos presentes criados.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar presentes..." 
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Presente</th>
                <th className="px-6 py-4">Autor</th>
                <th className="px-6 py-4">Engajamento</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {MOCK_GIFTS.map((gift) => (
                <tr key={gift.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{gift.title}</p>
                      <p className="text-slate-500 text-xs">{gift.occasion}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {gift.author}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1" title="Visualizações"><Eye className="w-3.5 h-3.5" /> {gift.views}</div>
                      <div className="flex items-center gap-1" title="Curtidas"><Heart className="w-3.5 h-3.5" /> {gift.likes}</div>
                      <div className="flex items-center gap-1" title="Compartilhamentos"><Share2 className="w-3.5 h-3.5" /> {gift.shares}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {gift.date}
                  </td>
                  <td className="px-6 py-4">
                    {gift.status === 'public' ? (
                      <span className="text-xs font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full w-fit">
                        Público
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full w-fit">
                        Oculto
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-primary transition-colors" title="Visualizar">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors" title="Duplicar">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-amber-500 transition-colors" title="Ocultar">
                        <EyeOff className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors" title="Excluir">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500">
          <p>Mostrando 4 de 3.250 presentes</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50">Anterior</button>
            <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
}
