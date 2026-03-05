import { useEffect, useState } from 'react';
import { PageHeader, StatCard, Card } from '../../components/layout/Common';
import { Users, Clock, ShieldCheck, Activity, Zap, ArrowUpRight, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { api } from '../../lib/api';

const DashboardPage = () => {
  const [stats, setStats]       = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    Promise.all([api.getStats(), api.getActivity(8)])
      .then(([s, a]) => { setStats(s); setActivity(a.activity || []); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n: number) =>
    n >= 1_000_000 ? `₦${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000   ? `₦${(n / 1_000).toFixed(0)}K`
    : `₦${n}`;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={32} className="animate-spin text-primary-500" />
    </div>
  );

  if (error) return (
    <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 font-bold">{error}</div>
  );

  const statCards = [
    { label: 'Total Customers', value: stats?.totalCustomers?.toLocaleString() || '0', icon: Users,       color: 'primary' },
    { label: 'Settled Volume',  value: fmt(stats?.settledVolume || 0),                  icon: Zap,         color: 'emerald' },
    { label: 'Today Txns',      value: String(stats?.todayTransactions || 0),           icon: Activity,    color: 'primary' },
    { label: 'Active Wallets',  value: String(stats?.activeWallets || 0),               icon: ShieldCheck, color: 'amber'   },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Dashboard Overview"
        description="Monitor system-wide performance and administrative activities."
        actions={
          <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            <button className="px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-colors">Last 24h</button>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary-700 transition-colors shadow-md shadow-primary-200">Download Report</button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => <StatCard key={idx} {...(stat as any)} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2" title="Transaction Volume" description="Real-time settlement vs processing data.">
          <div className="h-72 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
            <div className="flex items-end gap-2 mb-6">
              {[40, 60, 35, 80, 55, 90, 70].map((h, i) => (
                <div key={i} className="group relative">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">₦{h * 10}k</div>
                  <div className={cn("w-10 rounded-t-lg transition-all duration-500", i === 5 ? "bg-primary-600" : "bg-primary-200 group-hover:bg-primary-300")} style={{ height: `${h * 2}px` }} />
                </div>
              ))}
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">7-Day Performance Matrix</p>
          </div>
        </Card>

        <div className="space-y-8">
          <Card title="Recent Activity" description="Latest system events.">
            <div className="space-y-3">
              {activity.slice(0, 5).map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-primary-200 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 truncate max-w-32">{item.user}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight truncate max-w-32">{item.action}</p>
                    </div>
                  </div>
                  <ArrowUpRight size={14} className="text-slate-300 group-hover:text-primary-500 transition-colors shrink-0" />
                </div>
              ))}
              {activity.length === 0 && <p className="text-center text-slate-400 text-xs font-bold uppercase py-4">No recent activity</p>}
            </div>
          </Card>

          <div className="bg-slate-900 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12"><ShieldCheck size={120} /></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Pulse</span>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-black border border-emerald-500/30">SECURE</span>
              </div>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 text-slate-300">
                    <span>Admin MFA</span><span className="text-emerald-400">100%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full w-full rounded-full" /></div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 text-slate-300">
                    <span>Active Admins</span><span className="text-primary-400">{stats?.totalAdmins || 0}</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden"><div className="bg-primary-500 h-full rounded-full" style={{ width: '80%' }} /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card title="Activity Audit Log" description="Granular tracking of all system events.">
        <div className="overflow-x-auto -mx-8">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-y border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-[0.15em]">
              <tr>
                <th className="px-8 py-4">Entity</th>
                <th className="px-8 py-4">Operation</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4">Timestamp</th>
                <th className="px-8 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {activity.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-[10px] font-black border border-slate-200">
                        {item.user?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="font-bold text-slate-900">{item.user}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-slate-600 font-medium max-w-48 truncate">{item.action}</td>
                  <td className="px-8 py-4 font-mono font-bold text-slate-900 text-xs">
                    {item.amount ? `₦${Number(item.amount).toLocaleString()}` : '---'}
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                      <Clock size={14} strokeWidth={2.5} />
                      {new Date(item.time).toLocaleString('en-NG', { dateStyle: 'short', timeStyle: 'short' })}
                    </div>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <span className={cn(
                      "px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5",
                      item.status === 'SUCCESS' ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : item.status === 'FAILED' ? "bg-rose-50 text-rose-700 border border-rose-100"
                        : "bg-amber-50 text-amber-700 border border-amber-100"
                    )}>
                      <span className={cn("w-1 h-1 rounded-full", item.status === 'SUCCESS' ? "bg-emerald-500" : item.status === 'FAILED' ? "bg-rose-500" : "bg-amber-500")} />
                      {item.status || 'PENDING'}
                    </span>
                  </td>
                </tr>
              ))}
              {activity.length === 0 && (
                <tr><td colSpan={5} className="px-8 py-12 text-center text-slate-400 font-bold text-xs uppercase">No activity yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
