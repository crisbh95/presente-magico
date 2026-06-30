import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Plus, Edit3, Share2, BarChart2, LogOut, Loader2, Trash2, CreditCard, User as UserIcon, LayoutDashboard, ShieldAlert, CheckCircle2, Gift, ExternalLink, Building, Image as ImageIcon, Save, HelpCircle, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserPages, deletePage, getTotalPagesCount, getPremiumCount, updateAgencyProfile, uploadPhoto } from '../services/db';
import { supabase } from '../supabase/config';
import type { PageData, UserProfile } from '../services/db';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);

  const currentTab = location.pathname.split('/')[1] || 'dashboard';
  const isAdmin = profile?.role === 'admin' || user?.email === 'crisbh95@gmail.com' || user?.email === 'contato@presentemagico.com.br';

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    async function loadData() {
      if (!user) return;
      try {
        setLoading(true);
        const pagesData = await getUserPages(user.id);
        setPages(pagesData || []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar seus dados");
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id || !user) return;
    if (window.confirm('Tem certeza que deseja excluir este presente?')) {
      try {
        await deletePage(id, user.id);
        setPages(pages.filter(p => p.id !== id));
        toast.success('Presente excluído com sucesso');
      } catch (error) {
        toast.error('Erro ao excluir presente');
      }
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      );
    }

    switch (currentTab) {
      case 'profile':
      case 'settings':
        return <ProfileTab user={user} profile={profile} />;
      case 'plans':
        return <PlansTab profile={profile} />;
      case 'agency':
        return <AgencyTab user={user} profile={profile} />;
      case 'admin':
        return isAdmin ? <div className="p-8">Conteúdo Admin em breve</div> : null;
      default:
        return <DashboardHome pages={pages} profile={profile} onDelete={handleDelete} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row font-sans">
      <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-400 to-primary flex items-center justify-center shadow-lg shadow-rose-500/20">
            <Gift className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">Presente Mágico</span>
        </div>
        <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
          <LogOut className="h-5 w-5" />
        </button>
      </div>

      <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-20">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-400 to-primary flex items-center justify-center shadow-xl shadow-rose-500/30">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Presente Mágico</span>
          </div>

          <nav className="space-y-2">
            <SidebarLink to="/dashboard" icon={<LayoutDashboard />} label="Meus Presentes" active={currentTab === 'dashboard'} />
            <SidebarLink to="/plans" icon={<CreditCard />} label="Planos" active={currentTab === 'plans'} />
            <SidebarLink to="/agency" icon={<Building />} label="Minha Marca" active={currentTab === 'agency'} />
            <SidebarLink to="/profile" icon={<UserIcon />} label="Perfil" active={currentTab === 'profile' || currentTab === 'settings'} />
            {isAdmin && (
              <SidebarLink to="/admin" icon={<ShieldAlert />} label="Admin" active={currentTab === 'admin'} />
            )}
          </nav>
        </div>
        
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <Link to="/ajuda" className="text-sm font-medium text-slate-500 hover:text-primary flex items-center gap-2 transition-colors"><HelpCircle className="w-4 h-4"/> Central de Ajuda</Link>
          <Link to="/contato" className="text-sm font-medium text-slate-500 hover:text-primary flex items-center gap-2 transition-colors"><Mail className="w-4 h-4"/> Fale Conosco</Link>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all font-medium"
          >
            <LogOut className="h-5 w-5" />
            Sair da Conta
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold capitalize">
              {currentTab === 'dashboard' ? 'Meu Painel' : currentTab === 'plans' ? 'Planos' : currentTab === 'profile' ? 'Perfil' : currentTab}
            </h1>
            <Link to="/create" className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 hover:shadow-primary/40 flex items-center gap-2 transition-all hover:-translate-y-0.5">
              <Plus className="h-5 w-5" /> <span className="hidden sm:inline">Criar Presente</span>
            </Link>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full">
          {renderTabContent()}
        </div>
      </main>
      
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around items-start p-2 pt-2 z-50" style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))' }}>
        <MobileLink to="/dashboard" icon={<LayoutDashboard />} label="Painel" active={currentTab === 'dashboard'} />
        {!isAdmin && <MobileLink to="/create" icon={<Plus />} label="Criar" active={false} highlight />}
        <MobileLink to="/agency" icon={<Building />} label="Marca" active={currentTab === 'agency'} />
        <MobileLink to="/plans" icon={<CreditCard />} label="Planos" active={currentTab === 'plans'} />
        {isAdmin && <MobileLink to="/admin" icon={<ShieldAlert />} label="Admin" active={currentTab === 'admin'} />}
        <MobileLink to="/profile" icon={<UserIcon />} label="Perfil" active={currentTab === 'profile' || currentTab === 'settings'} />
      </div>
    </div>
  );
}

function SidebarLink({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active: boolean }) {
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
        active 
          ? 'bg-primary/10 text-primary' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
      }`}
    >
      <div className={active ? 'text-primary' : ''}>
        {icon}
      </div>
      {label}
    </Link>
  );
}

function MobileLink({ to, icon, label, active, highlight }: { to: string, icon: React.ReactNode, label: string, active: boolean, highlight?: boolean }) {
  return (
    <Link 
      to={to} 
      className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-[64px] ${
        highlight && !active
          ? 'text-primary hover:bg-primary/5'
          : active 
            ? 'bg-primary/10 text-primary' 
            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
      }`}
    >
      <div className={highlight && !active ? 'bg-primary/10 p-1.5 rounded-full' : ''}>
        {icon}
      </div>
      <span className="text-[10px] font-semibold leading-tight">{label}</span>
    </Link>
  );
}

function DashboardHome({ pages, profile, onDelete }: { pages: PageData[], profile: UserProfile | null, onDelete: (id: string | undefined) => void }) {
  const totalViews = pages.reduce((sum, p) => sum + ((p as any).views || 0), 0);
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid sm:grid-cols-3 gap-6 mb-10">
        <StatCard title="Páginas Criadas" value={pages.length.toString()} icon={<Plus className="text-primary h-6 w-6" />} />
        <StatCard title="Total de Visualizações" value={totalViews.toString()} icon={<BarChart2 className="text-emerald-500 h-6 w-6" />} />
        <StatCard title="Seu Plano" value={profile?.plan === 'premium' ? 'Premium' : 'Grátis'} icon={<CheckCircle2 className="text-rose-500 h-6 w-6" />} />
      </div>

      <div className="flex justify-between items-end mb-6">
        <h2 className="text-xl font-bold">Seus Presentes Recentes</h2>
      </div>

      {pages.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-dashed rounded-3xl p-12 text-center">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="h-10 w-10 text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Nenhum presente ainda</h3>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">Crie seu primeiro presente mágico e emocione alguém especial hoje mesmo.</p>
          <Link to="/create" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-105 transition-all">
            <Plus className="h-5 w-5" /> Criar Primeiro Presente
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <PageCard key={page.id} page={page} onDelete={onDelete} isPremium={profile?.plan === 'premium' || profile?.role === 'admin'} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:border-primary/30 hover:shadow-md transition-all">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-50 dark:bg-slate-800/50 rounded-full group-hover:scale-150 transition-transform duration-700 -z-10" />
      <div className="flex items-center gap-3">
        <div className="p-3 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 rounded-2xl">
          {icon}
        </div>
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{title}</p>
      </div>
      <p className="text-4xl font-black text-slate-800 dark:text-white">{value}</p>
    </div>
  );
}

function PageCard({ page, onDelete, isPremium }: { page: PageData, onDelete: (id: string | undefined) => void, isPremium?: boolean }) {
  const date = new Date(page.created_at || Date.now()).toLocaleDateString('pt-BR');
  const typeLabel = page.template === 'amor' || page.template === 'love' ? 'Amor' : page.template === 'aniversario' || page.template === 'birthday' ? 'Aniversário' : page.template === 'wedding' || page.template === 'casamento' ? 'Casamento' : 'Especial';
  const typeColor = page.template === 'amor' || page.template === 'love' ? 'bg-rose-100 text-rose-600 border-rose-200' : 'bg-blue-100 text-blue-600 border-blue-200';
  
  const views = page.views || 0;
  const isWarning = views >= 25;
  const isBlocked = views >= 30;

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={`text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-full mb-3 inline-block border ${typeColor}`}>{typeLabel}</span>
          {!isPremium && (
            <span className={`text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-full mb-3 ml-2 inline-block border ${isBlocked ? 'bg-rose-100 text-rose-600 border-rose-200' : isWarning ? 'bg-amber-100 text-amber-600 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`} title="Limite de visualizações do plano grátis">
              {views}/30 views
            </span>
          )}
          <h3 className="font-bold text-xl line-clamp-1 text-slate-800 dark:text-white">{page.data?.name || page.data?.name1 || 'Presente'}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">Criado em {date}</p>
        </div>
      </div>
      
      <div className="flex-1" />
      
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
        <Link to={`/success`} state={{ pageId: page.id }} className="text-sm text-primary font-bold hover:underline flex items-center gap-1">
          Ver QR Code
        </Link>
        <div className="flex gap-1">
          <Link to={`/edit/${page.id}`} className="p-2.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors rounded-xl" title="Editar">
            <Edit3 className="h-4 w-4" />
          </Link>
          <Link to={`/p/${page.id}`} target="_blank" className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors rounded-xl" title="Visualizar">
            <Share2 className="h-4 w-4" />
          </Link>
          <button onClick={() => onDelete(page.id)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors rounded-xl" title="Excluir">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function PlanCard({ name, price, oldPrice, period, description, features, highlight, badge, onSubscribe }: {
  name: string; price: string; oldPrice: string; period: string; description: string;
  features: string[]; highlight: boolean; badge?: string; onSubscribe: () => void;
}) {
  return (
    <div className={`relative rounded-[2rem] p-8 flex flex-col border-2 transition-all hover:-translate-y-1 hover:shadow-xl ${
      highlight
        ? 'bg-slate-900 dark:bg-slate-950 text-white border-primary shadow-lg shadow-primary/20 ring-4 ring-primary/20'
        : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800'
    }`}>
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-extrabold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg">
          {badge}
        </div>
      )}
      <h3 className={`text-2xl font-bold mb-1 ${highlight ? 'text-white' : ''}`}>{name}</h3>
      <p className={`text-sm mb-6 ${highlight ? 'text-slate-400' : 'text-slate-500'}`}>{description}</p>
      <div className="mb-6">
        <span className="text-4xl font-black">{price}</span>
        <span className={`text-lg line-through ml-2 ${highlight ? 'text-slate-500' : 'text-slate-400'}`}>{oldPrice}</span>
        <span className={`text-sm ml-1 ${highlight ? 'text-slate-400' : 'text-slate-500'}`}>{period}</span>
      </div>
      <ul className="space-y-3 mb-8 flex-1">
        {features.map((f, i) => (
          <li key={i} className={`flex items-start gap-2 text-sm ${highlight ? 'text-slate-200' : 'text-slate-600 dark:text-slate-300'}`}>
            <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${highlight ? 'text-primary' : 'text-emerald-500'}`} />
            {f}
          </li>
        ))}
      </ul>
      <button
        onClick={onSubscribe}
        className={`w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
          highlight
            ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/30'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        Assinar
      </button>
    </div>
  );
}

function PlansTab({ profile }: { profile: UserProfile | null }) {
  const { user } = useAuth();
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [premiumCount, setPremiumCount] = useState(0);
  const [urgencyDaysLeft, setUrgencyDaysLeft] = useState(7);

  useEffect(() => {
    getTotalPagesCount().then(setTotalPages);
    getPremiumCount().then(setPremiumCount);
    const launchEnd = new Date();
    launchEnd.setDate(launchEnd.getDate() + 7);
    const updateDays = () => {
      const now = new Date();
      const diff = Math.max(0, Math.ceil((launchEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      setUrgencyDaysLeft(diff);
    };
    updateDays();
    const timer = setInterval(updateDays, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = async (planType?: string) => {
    if (!user) return;
    setLoadingCheckout(true);
    setCheckoutError('');

    try {
      const { data, error } = await supabase.functions.invoke('create-pix', {
        body: { plan_type: planType || 'lifetime' },
      });

      if (error) throw new Error(error.message || 'Erro ao criar pagamento');
      if (data?.error) throw new Error(data.error);

      window.location.href = data.init_point;
    } catch (err: any) {
      console.error('Erro checkout:', err);
      setCheckoutError(err.message || 'Erro ao iniciar pagamento. Tente novamente.');
      setLoadingCheckout(false);
    }
  };

  if (profile?.plan === 'premium') {
    return (
      <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-10 rounded-[2.5rem] border border-emerald-200 dark:border-emerald-800 text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-emerald-400/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 p-32 bg-emerald-500/10 blur-[100px] rounded-full" />
          <CheckCircle2 className="w-20 h-20 mx-auto mb-6 text-emerald-500 relative z-10" />
          <h3 className="text-4xl font-extrabold mb-4 relative z-10">Você é Premium!</h3>
          <p className="text-xl max-w-lg mx-auto mb-10 relative z-10">Sua conta possui acesso ilimitado. Crie quantas páginas quiser, use templates exclusivos e surpreenda quem você ama sem limites.</p>
          <Link to="/create" className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:shadow-xl hover:bg-emerald-700 transition-all shadow-emerald-500/30 text-lg relative z-10 inline-flex items-center gap-2">
            <Plus size={20} /> Criar Novo Presente
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-4">Eternize momentos sem limites</h2>
        <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">Escolha o plano Premium para criar presentes inesquecíveis que duram para sempre.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-3xl font-black text-primary">{totalPages > 0 ? totalPages.toLocaleString('pt-BR') : '...'}</p>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Presentes Criados</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-3xl font-black text-emerald-500">{premiumCount > 0 ? premiumCount.toLocaleString('pt-BR') : '...'}</p>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Membros Premium</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-3xl font-black text-amber-500">{urgencyDaysLeft}d</p>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Preço de Lançamento</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <PlanCard
          name="Mensal"
          price="R$ 9,90"
          oldPrice="R$ 29,90"
          period="/mês"
          description="Para testar sem compromisso"
          features={['Presentes Ilimitados', 'Todos os Templates', 'Sem marca d\'água', 'IA Ilimitada']}
          highlight={false}
          onSubscribe={() => handleSubscribe('monthly')}
        />
        <PlanCard
          name="Anual"
          price="R$ 49,90"
          oldPrice="R$ 119"
          period="/ano"
          description="Acesso garantido (R$ 4,16/mês)"
          features={['Presentes Ilimitados', 'Todos os Templates', 'Sem marca d\'água', 'IA Ilimitada', 'Economize 58%']}
          highlight={true}
          badge="🔥 Mais Popular"
          onSubscribe={() => handleSubscribe('annual')}
        />
        <PlanCard
          name="Agência"
          price="R$ 149,90"
          oldPrice="R$ 299"
          period="/mês"
          description="Para Eventos e Produtoras"
          features={['Tudo do plano Premium', 'Adicione sua Logomarca', 'Sem Footer Presente Mágico', 'Suporte Prioritário', 'Ideal para Cerimonialistas']}
          highlight={false}
          onSubscribe={() => handleSubscribe('agency')}
        />
      </div>

      {loadingCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-md p-8 relative shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200 text-center">
            <div className="flex flex-col items-center gap-6 py-8">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-slate-500 font-medium">Redirecionando para o Mercado Pago...</p>
              <p className="text-sm text-slate-400 max-w-xs">Você será redirecionado para escolher a forma de pagamento (Pix, Cartão, Boleto).</p>
            </div>
          </div>
        </div>
      )}

      {checkoutError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-md p-8 relative shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200 text-center">
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <ExternalLink className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-red-600 dark:text-red-400 font-medium">{checkoutError}</p>
              <button onClick={() => setCheckoutError('')} className="px-6 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileTab({ user, profile }: { user: any, profile: UserProfile | null }) {
  const isPremium = profile?.plan === 'premium';
  const planTypeLabel = profile?.plan_type === 'monthly' ? 'Mensal'
    : profile?.plan_type === 'annual' ? 'Anual'
    : profile?.plan_type === 'lifetime' ? 'Vitalício'
    : null;
  const subEnd = profile?.subscription_end ? new Date(profile.subscription_end).toLocaleDateString('pt-BR') : null;
  const daysLeft = profile?.subscription_end
    ? Math.max(0, Math.ceil((new Date(profile.subscription_end).getTime() - Date.now()) / 86400000))
    : null;
  const canCancel = isPremium && profile?.plan_type && profile.plan_type !== 'lifetime';

  const handleCancel = async () => {
    if (!window.confirm('Tem certeza que deseja cancelar sua assinatura? Você perderá acesso Premium ao final do período.')) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ plan: 'free', plan_type: null, subscription_end: null })
        .eq('id', user?.id);
      if (error) throw error;
      toast.success('Assinatura cancelada com sucesso');
      window.location.reload();
    } catch (e) {
      toast.error('Erro ao cancelar assinatura');
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold mb-8">Meu Perfil</h2>
      
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
        <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-rose-400/20 rounded-full flex items-center justify-center mb-6">
          <UserIcon className="w-10 h-10 text-primary" />
        </div>
        
        <h3 className="text-xl font-bold mb-1">{user?.email}</h3>
        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold mb-6 uppercase tracking-wider ${isPremium ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
          {isPremium ? '✦ Premium' : 'Grátis'}
        </span>

        {isPremium && planTypeLabel && (
          <div className="w-full space-y-3 mb-6">
            <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <span className="text-sm text-slate-500">Plano</span>
              <span className="font-bold capitalize">{planTypeLabel}</span>
            </div>
            {subEnd && (
              <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                <span className="text-sm text-slate-500">Válido até</span>
                <span className="font-bold">{subEnd} {daysLeft !== null && `(${daysLeft}d restantes)`}</span>
              </div>
            )}
            {canCancel && (
              <button onClick={handleCancel} className="w-full py-3 text-sm text-rose-500 hover:text-rose-600 font-semibold bg-rose-50 dark:bg-rose-900/20 rounded-2xl hover:bg-rose-100 dark:hover:bg-rose-900/40 transition">
                Cancelar Assinatura
              </button>
            )}
          </div>
        )}
        
        <div className="w-full grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-8">
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-1">Status</p>
            <p className="font-bold text-emerald-500">Ativo</p>
          </div>
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-1">Membro desde</p>
            <p className="font-bold">{new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        <div className="w-full mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2 md:hidden">
          <Link to="/ajuda" className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition">
            <div className="flex items-center gap-3"><HelpCircle className="w-5 h-5 text-slate-400" /> <span className="font-medium">Central de Ajuda</span></div>
            <ExternalLink className="w-4 h-4 text-slate-300" />
          </Link>
          <Link to="/contato" className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition">
            <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-slate-400" /> <span className="font-medium">Fale Conosco</span></div>
            <ExternalLink className="w-4 h-4 text-slate-300" />
          </Link>
          <div className="flex justify-center gap-4 mt-6 pb-2">
            <Link to="/termos" className="text-xs text-slate-400 hover:text-slate-600">Termos de Uso</Link>
            <Link to="/privacidade" className="text-xs text-slate-400 hover:text-slate-600">Privacidade</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function AgencyTab({ user, profile }: { user: any, profile: UserProfile | null }) {
  const isAdmin = profile?.role === 'admin' || user?.email === 'crisbh95@gmail.com' || user?.email === 'contato@presentemagico.com.br';
  
  if (profile?.plan_type !== 'agency' && !isAdmin) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-rose-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Building className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-3xl font-bold mb-4">Módulo Exclusivo para Agências</h3>
        <p className="text-slate-500 text-lg mb-8 max-w-lg mx-auto">
          O plano Agência permite que você remova a nossa marca d'água e utilize a sua própria logomarca em todos os presentes criados, além de oferecer suporte VIP via WhatsApp.
        </p>
        <Link to="/plans" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-105 transition-all">
          <CreditCard className="w-5 h-5" />
          Conhecer o Plano Agência
        </Link>
      </div>
    );
  }

  const [agencyName, setAgencyName] = useState(profile?.agency_name || '');
  const [agencyWhatsapp, setAgencyWhatsapp] = useState(profile?.agency_whatsapp || '');
  const [agencyLogoUrl, setAgencyLogoUrl] = useState(profile?.agency_logo_url || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    setIsUploading(true);
    const toastId = toast.loading('Fazendo upload da logomarca...');
    
    try {
      const url = await uploadPhoto(file, user.id);
      setAgencyLogoUrl(url);
      toast.success('Logomarca atualizada!', { id: toastId });
    } catch (error) {
      toast.error('Erro ao fazer upload da imagem', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    const toastId = toast.loading('Salvando configurações...');
    
    try {
      await updateAgencyProfile(user.id, {
        agency_name: agencyName,
        agency_whatsapp: agencyWhatsapp,
        agency_logo_url: agencyLogoUrl
      });
      toast.success('Marca atualizada com sucesso!', { id: toastId });
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      toast.error('Erro ao salvar configurações', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Minha Empresa (White-Label)</h2>
            <p className="text-slate-500">Substitua a marca do Presente Mágico pela sua.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Logomarca da Agência</label>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center bg-slate-50 dark:bg-slate-800 overflow-hidden relative group">
                {agencyLogoUrl ? (
                  <img src={agencyLogoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-400" />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <label className="cursor-pointer text-white text-xs font-bold px-3 py-1 bg-white/20 rounded-full backdrop-blur-md">
                    Trocar
                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={isUploading} />
                  </label>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500 mb-3">Recomendamos uma imagem com fundo transparente (PNG).</p>
                <label className="cursor-pointer px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-semibold text-sm transition inline-block">
                  {isUploading ? 'Enviando...' : 'Fazer Upload'}
                  <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={isUploading} />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nome da Empresa</label>
            <input 
              type="text" 
              value={agencyName}
              onChange={e => setAgencyName(e.target.value)}
              placeholder="Ex: Ana Eventos"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">WhatsApp Profissional (Opcional)</label>
            <input 
              type="text" 
              value={agencyWhatsapp}
              onChange={e => setAgencyWhatsapp(e.target.value.replace(/\D/g, ''))}
              placeholder="Ex: 5511999999999"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isSaving ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
