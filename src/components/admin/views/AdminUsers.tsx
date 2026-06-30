import { useState } from 'react';
import { Search, Filter, Edit2, Ban, Crown, ExternalLink, X } from 'lucide-react';

const MOCK_USERS = [
  { id: '1', name: 'Maria Silva', email: 'maria@example.com', plan: 'premium', lastAccess: 'Hoje, 14:30', gifts: 12, status: 'active' },
  { id: '2', name: 'João Santos', email: 'joao@example.com', plan: 'free', lastAccess: 'Ontem, 09:15', gifts: 1, status: 'active' },
  { id: '3', name: 'Ana Costa', email: 'ana.costa@example.com', plan: 'premium', lastAccess: 'Hoje, 10:20', gifts: 5, status: 'active' },
  { id: '4', name: 'Pedro Alves', email: 'pedro@example.com', plan: 'free', lastAccess: 'Há 3 dias', gifts: 1, status: 'blocked' },
  { id: '5', name: 'Carla Dias', email: 'carla@example.com', plan: 'premium', lastAccess: 'Hoje, 16:45', gifts: 28, status: 'active' },
];

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState(MOCK_USERS);

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário? (Esta é uma simulação)')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleBlock = (id: string) => {
    if (confirm('Deseja bloquear o acesso deste usuário?')) {
      setUsers(users.map(user => user.id === id ? { ...user, status: 'blocked' } : user));
    }
  };

  const handleAlert = (msg: string) => {
    alert(`Módulo em Desenvolvimento: ${msg}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gerenciar Usuários</h2>
          <p className="text-slate-500">Controle de clientes, planos e permissões.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por e-mail..." 
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
                <th className="px-6 py-4">Usuário</th>
                <th className="px-6 py-4">Plano</th>
                <th className="px-6 py-4">Presentes</th>
                <th className="px-6 py-4">Último Acesso</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                        <p className="text-slate-500 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.plan === 'premium' ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-full w-fit">
                        <Crown className="w-3 h-3" /> Premium
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full w-fit">
                        Free
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium">{user.gifts}</span> criados
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {user.lastAccess}
                  </td>
                  <td className="px-6 py-4">
                    {user.status === 'active' ? (
                      <span className="text-xs font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full w-fit">
                        Ativo
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-2.5 py-1 rounded-full w-fit">
                        Bloqueado
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors" 
                        title="Visualizar Perfil"
                        onClick={() => handleAlert('Visualização de perfil completo')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors" 
                        title="Editar Usuário"
                        onClick={() => handleAlert('Edição de dados cadastrais')}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors" 
                        title="Bloquear Usuário"
                        onClick={() => handleBlock(user.id)}
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors ml-1" 
                        title="Excluir Usuário"
                        onClick={() => handleDelete(user.id)}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500">
          <p>Mostrando 5 de 12.400 usuários</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50">Anterior</button>
            <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
}
