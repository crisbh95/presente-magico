import { Link } from 'react-router-dom';
import { Plus, Edit3, Share2, BarChart2, LogOut } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <header className="flex justify-between items-center mb-10 max-w-6xl mx-auto pt-4">
        <h1 className="text-3xl font-bold">Meu Painel</h1>
        <div className="flex gap-4">
          <Link to="/create" className="px-4 py-2 bg-primary text-white rounded-xl font-medium shadow-lg hover:bg-primary/90 flex items-center gap-2 transition-all">
            <Plus className="h-5 w-5" /> Novo Presente
          </Link>
          <button className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <LogOut className="h-6 w-6" />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">
        {/* Stats */}
        <div className="md:col-span-4 grid sm:grid-cols-3 gap-6 mb-8">
          <StatCard title="Páginas Criadas" value="2" icon={<Plus className="text-primary h-6 w-6" />} />
          <StatCard title="Visualizações" value="128" icon={<BarChart2 className="text-emerald-500 h-6 w-6" />} />
          <StatCard title="Plano Atual" value="Premium" icon={<Edit3 className="text-purple-500 h-6 w-6" />} />
        </div>

        {/* Pages list */}
        <div className="md:col-span-4">
          <h2 className="text-2xl font-semibold mb-6">Meus Presentes</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <PageCard title="Feliz Aniversário Mãe" type="Aniversário" date="12/05/2026" />
            <PageCard title="Nosso 1º Ano" type="Amor" date="14/02/2026" />
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function PageCard({ title, type, date }: { title: string, type: string, date: string }) {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full mb-3 inline-block">{type}</span>
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm text-slate-400 mt-1">Criado em {date}</p>
        </div>
      </div>
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
        <Link to="/p/mock-id" className="text-sm text-primary font-medium hover:underline">Ver Página</Link>
        <div className="flex gap-2 text-slate-400">
          <button className="p-2 hover:text-primary transition-colors bg-slate-50 dark:bg-slate-800 rounded-lg"><Share2 className="h-4 w-4" /></button>
          <button className="p-2 hover:text-primary transition-colors bg-slate-50 dark:bg-slate-800 rounded-lg"><Edit3 className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  );
}
