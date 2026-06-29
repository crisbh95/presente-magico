import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getProfile } from '../services/db';

import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from '../components/admin/views/AdminDashboard';
import AdminFinance from '../components/admin/views/AdminFinance';
import AdminUsers from '../components/admin/views/AdminUsers';
import AdminGifts from '../components/admin/views/AdminGifts';
import AdminIntelligence from '../components/admin/views/AdminIntelligence';

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    async function checkAdminAndLoad() {
      if (!user) {
        navigate('/login');
        return;
      }
      
      const profile = await getProfile(user.id);
      if (profile?.role === 'admin' || user.email === 'crisbh95@gmail.com' || user.email === 'contato@presentemagico.com.br') {
        setIsAdmin(true);
      } else {
        navigate('/dashboard'); // Não é admin, joga pro dashboard
      }
      setLoading(false);
    }
    
    checkAdminAndLoad();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  if (!isAdmin) return null;

  // Render view conditionally based on state
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <AdminUsers />;
      case 'gifts':
        return <AdminGifts />;
      case 'finance':
        return <AdminFinance />;
      case 'intelligence':
        return <AdminIntelligence />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 animate-in fade-in">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Módulo em Desenvolvimento</h2>
            <p className="text-slate-500 max-w-md">
              A tela de {currentView.toUpperCase()} está sendo construída e será liberada na próxima atualização com gráficos e estatísticas completas.
            </p>
          </div>
        );
    }
  };

  return (
    <AdminLayout currentView={currentView} setCurrentView={setCurrentView}>
      {renderView()}
    </AdminLayout>
  );
}
