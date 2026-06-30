import { useState, useEffect } from 'react';
import { Search, Filter, Ban, Crown, X, Loader2 } from 'lucide-react';
import { getAllProfiles, deleteUserProfile, updateUserStatus, updateUserPlan } from '../../../services/db';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllProfiles();
      setUsers(data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      toast.error("Erro ao carregar lista de usuários");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string, email: string) => {
    if (confirm(`Tem certeza absoluta que deseja excluir o usuário ${email}? Todas as páginas e fotos criadas por ele serão apagadas permanentemente.`)) {
      try {
        await deleteUserProfile(id);
        toast.success('Usuário excluído com sucesso');
        setUsers(users.filter(user => user.id !== id));
      } catch (error: any) {
        toast.error(`Erro ao excluir usuário: ${error.message}`);
      }
    }
  };

  const handleBlock = async (id: string, currentStatus: string, email: string) => {
    const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
    const actionText = newStatus === 'blocked' ? 'bloquear' : 'desbloquear';
    if (confirm(`Deseja realmente ${actionText} o acesso de ${email}?`)) {
      try {
        await updateUserStatus(id, newStatus);
        toast.success(`Usuário ${newStatus === 'blocked' ? 'bloqueado' : 'desbloqueado'} com sucesso`);
        setUsers(users.map(user => user.id === id ? { ...user, status: newStatus } : user));
      } catch (error: any) {
        toast.error(`Erro ao atualizar status: ${error.message}`);
      }
    }
  };

  const handleEditPlan = async (id: string, currentPlan: string, email: string) => {
    const targetPlan = currentPlan === 'premium' ? 'free' : 'premium';
    const planType = targetPlan === 'premium' ? 'lifetime' : null; // Padrão vitalício ao ativar via admin
    
    if (confirm(`Deseja alterar o plano de ${email} de "${currentPlan}" para "${targetPlan}"?`)) {
      try {
        await updateUserPlan(id, targetPlan, planType);
        toast.success('Plano atualizado com sucesso');
        setUsers(users.map(user => user.id === id ? { ...user, plan: targetPlan, plan_type: planType } : user));
      } catch (error: any) {
        toast.error(`Erro ao atualizar plano: ${error.message}`);
      }
    }
  };

  // Filter users based on search term (email or name)
  const filteredUsers = users.filter(user => 
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
              placeholder="Buscar por e-mail ou nome..." 
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={fetchUsers} className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors" title="Atualizar lista">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <span className="text-sm text-slate-400">Carregando usuários...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              Nenhum usuário cadastrado ou correspondente à busca.
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Usuário</th>
                  <th className="px-6 py-4">Plano</th>
                  <th className="px-6 py-4">Presentes</th>
                  <th className="px-6 py-4">Cadastro</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold capitalize">
                          {user.name ? user.name.charAt(0) : 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white capitalize">{user.name}</p>
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
                      {user.status === 'blocked' ? (
                        <span className="text-xs font-medium text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-2.5 py-1 rounded-full w-fit">
                          Bloqueado
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full w-fit">
                          Ativo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="p-1.5 text-slate-400 hover:text-amber-500 transition-colors" 
                          title="Alterar Plano (Free <-> Premium)"
                          onClick={() => handleEditPlan(user.id, user.plan, user.email)}
                        >
                          <Crown className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors" 
                          title={user.status === 'blocked' ? "Desbloquear Usuário" : "Bloquear Usuário"}
                          onClick={() => handleBlock(user.id, user.status, user.email)}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1.5 text-slate-400 hover:text-red-500 transition-colors ml-1" 
                          title="Excluir Usuário"
                          onClick={() => handleDelete(user.id, user.email)}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500">
          <p>Mostrando {filteredUsers.length} de {users.length} usuários</p>
        </div>
      </div>
    </div>
  );
}
