import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Users, Gift, TrendingUp, Activity, ArrowUpRight } from 'lucide-react';

const revenueData = [
  { name: 'Jan', total: 4500 },
  { name: 'Fev', total: 5200 },
  { name: 'Mar', total: 4800 },
  { name: 'Abr', total: 6100 },
  { name: 'Mai', total: 5900 },
  { name: 'Jun', total: 8400 },
  { name: 'Jul', total: 9100 },
];

const conversionData = [
  { name: 'Acessos', value: 12400 },
  { name: 'Cadastros', value: 3200 },
  { name: 'Vendas', value: 850 },
];

const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd'];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Geral</h2>
        <p className="text-slate-500">Métricas principais e desempenho do sistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI Cards */}
        {[
          { title: 'Receita Total', value: 'R$ 43.900', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { title: 'Usuários Ativos', value: '12.4K', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'Presentes Criados', value: '3.250', icon: Gift, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { title: 'Taxa de Conversão', value: '6.8%', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 ${kpi.bg} ${kpi.color} rounded-xl`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">
                <ArrowUpRight className="w-3 h-3" /> 12%
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1 relative z-10">{kpi.title}</p>
            <h3 className="text-2xl font-bold relative z-10">{kpi.value}</h3>
            
            {/* Decorative background shape */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-transparent to-slate-100 dark:to-slate-800/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold">Faturamento (2026)</h3>
            <p className="text-sm text-slate-500">Receita recorrente e avulsa</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funnel Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold">Funil de Conversão</h3>
            <p className="text-sm text-slate-500">Últimos 30 dias</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.2} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={80} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={32}>
                  {conversionData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
