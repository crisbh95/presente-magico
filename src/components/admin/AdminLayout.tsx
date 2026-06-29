import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Gift, DollarSign, CreditCard, 
  BarChart3, LayoutTemplate, Sparkles, Megaphone, 
  Settings, HeadphonesIcon, ShieldAlert, Search, BrainCircuit,
  ArrowLeft, Menu, X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentView: string;
  setCurrentView: (view: string) => void;
}

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'intelligence', label: 'Inteligência', icon: <BrainCircuit className="w-5 h-5" /> },
  { id: 'users', label: 'Usuários', icon: <Users className="w-5 h-5" /> },
  { id: 'gifts', label: 'Presentes', icon: <Gift className="w-5 h-5" /> },
  { id: 'finance', label: 'Financeiro', icon: <DollarSign className="w-5 h-5" /> },
  { id: 'subscriptions', label: 'Assinaturas', icon: <CreditCard className="w-5 h-5" /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'templates', label: 'Templates', icon: <LayoutTemplate className="w-5 h-5" /> },
  { id: 'ai', label: 'Inteligência Artificial', icon: <Sparkles className="w-5 h-5" /> },
  { id: 'marketing', label: 'Marketing', icon: <Megaphone className="w-5 h-5" /> },
  { id: 'support', label: 'Suporte', icon: <HeadphonesIcon className="w-5 h-5" /> },
  { id: 'security', label: 'Segurança', icon: <ShieldAlert className="w-5 h-5" /> },
  { id: 'seo', label: 'SEO', icon: <Search className="w-5 h-5" /> },
  { id: 'settings', label: 'Configurações', icon: <Settings className="w-5 h-5" /> },
];

export default function AdminLayout({ children, currentView, setCurrentView }: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 bg-slate-900 text-slate-300 z-50">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <ShieldAlert className="text-primary w-6 h-6" />
            Admin Pro
          </h1>
          <p className="text-xs text-slate-500 mt-1">Enterprise Dashboard v2.0</p>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          <nav className="space-y-1">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  currentView === item.id 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className={currentView === item.id ? 'text-primary' : 'text-slate-400'}>
                  {item.icon}
                </div>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition-all text-slate-400 mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar ao App
          </button>
          
          <div className="flex items-center gap-3 px-3 py-2 mt-4 bg-slate-800/50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs uppercase">
              {user?.email?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-medium text-white truncate">{user?.email}</p>
              <p className="text-[10px] text-slate-400">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header & Sidebar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 z-50 flex items-center justify-between px-4 border-b border-slate-800">
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <ShieldAlert className="text-primary w-5 h-5" />
          Admin Pro
        </h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-300 p-2">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="lg:hidden fixed inset-0 z-40 bg-slate-900 pt-16 flex flex-col"
          >
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {MENU_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    currentView === item.id 
                      ? 'bg-primary/20 text-primary' 
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className={currentView === item.id ? 'text-primary' : 'text-slate-400'}>
                    {item.icon}
                  </div>
                  {item.label}
                </button>
              ))}
              
              <div className="pt-4 mt-4 border-t border-slate-800">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Sair do Admin
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #475569; }
      `}</style>
    </div>
  );
}
