import { useState, useEffect } from 'react';
import { PageHeader, Card, StatCard } from '../../components/layout/Common';
import {
  ShieldAlert, AlertTriangle, Search, Filter, CheckCircle2, XCircle,
  Eye, Activity, UserCheck, Flag, ShieldCheck, Clock, Plus, Loader2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { api } from '../../lib/api';

const FraudPage = () => {
  const [stats, setStats]   = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([
      (api as any).request ? (api as any).request('/fraud/stats') : fetch('https://swifttrustapi.com/api/admin/fraud/stats', { headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } }).then(r => r.json()).then(d => d.data ?? d),
      (api as any).request ? (api as any).request('/fraud/alerts') : fetch('https://swifttrustapi.com/api/admin/fraud/alerts', { headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } }).then(r => r.json()).then(d => d.data ?? d),
    ])
      .then(([s, a]) => { setStats(s); setAlerts(a.alerts || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = alerts.filter(a => {
    const q = search.toLowerCase();
    return !q || a.user?.toLowerCase().includes(q) || a.type?.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q);
  });

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={32} className="animate-spin text-primary-500" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Fraud, Risk & Compliance"
        description="Real-time heuristic monitoring, AML sanctions screening, and risk engine orchestration."
        actions={
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:shadow-sm transition-all bg-slate-50/50">
              <UserCheck size={16} strokeWidth={3} /> Sanctions Check
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Active Alerts"    value={String(alerts.filter(a => a.status === 'Pending' || a.status === 'In-Review').length)} icon={AlertTriangle} color="amber" />
        <StatCard label="Blocked / Locked" value={String(stats?.lockedUsers + stats?.suspendedUsers || 0)} icon={ShieldAlert} color="rose" />
        <StatCard label="Clean Score"      value={`${stats?.cleanScore || '—'}%`} icon={ShieldCheck} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2" title="Real-time Threat Intelligence" description="Autonomous detection stream flagging suspicious behavioral patterns.">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="relative w-full max-w-sm">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Name, email or alert type..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all"
              />
            </div>
            <button className="p-3 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
              <Filter size={18} />
            </button>
          </div>

          <div className="overflow-x-auto -mx-8">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/50 border-y border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-[0.15em]">
                <tr>
                  <th className="px-8 py-4">Threat Classification</th>
                  <th className="px-8 py-4">Subject</th>
                  <th className="px-8 py-4">Exposure</th>
                  <th className="px-8 py-4">Audit Status</th>
                  <th className="px-8 py-4 text-right">Investigation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((alert, i) => (
                  <tr key={i} className="hover:bg-slate-50/30 transition-colors group cursor-pointer">
                    <td className="px-8 py-5">
                      <div>
                        <p className="font-black text-slate-900 leading-none tracking-tight">{alert.type}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">{alert.detail}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-slate-700 tracking-tight">{alert.user}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1">{alert.email}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "inline-flex px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-[0.15em] border shadow-sm",
                        alert.risk === 'High'   ? "bg-rose-50 text-rose-700 border-rose-100" :
                        alert.risk === 'Medium' ? "bg-amber-50 text-amber-700 border-amber-100" :
                        "bg-primary-50 text-primary-700 border-primary-100"
                      )}>
                        {alert.risk} Risk
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        {alert.status === 'Locked'    && <Clock size={14} className="text-amber-500" strokeWidth={3} />}
                        {alert.status === 'Open'      && <Clock size={14} className="text-amber-500" strokeWidth={3} />}
                        {alert.status === 'In-Review' && <Activity size={14} className="text-primary-500 animate-pulse" strokeWidth={3} />}
                        {alert.status === 'Blocked'   && <XCircle size={14} className="text-rose-500" strokeWidth={3} />}
                        {alert.status === 'Pending'   && <Clock size={14} className="text-amber-500" strokeWidth={3} />}
                        <span className="text-xs font-black uppercase tracking-widest text-slate-600">{alert.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button title="Deep Investigation" className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all active:scale-90">
                          <Eye size={18} strokeWidth={2.5} />
                        </button>
                        <button title="Whitelist Entity" className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all active:scale-90">
                          <ShieldCheck size={18} strokeWidth={2.5} />
                        </button>
                        <button title="Restrict Access" className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all active:scale-90">
                          <ShieldAlert size={18} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-slate-400 font-bold text-xs uppercase">
                      No fraud alerts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-8">
          <Card title="Alert Summary" description="Breakdown by risk level.">
            <div className="space-y-3">
              {[
                { label: 'High Risk',   count: alerts.filter(a => a.risk === 'High').length,   color: 'rose'    },
                { label: 'Medium Risk', count: alerts.filter(a => a.risk === 'Medium').length, color: 'amber'   },
                { label: 'Low Risk',    count: alerts.filter(a => a.risk === 'Low').length,    color: 'primary' },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{r.label}</span>
                  <span className={cn("text-lg font-black",
                    r.color === 'rose' ? "text-rose-600" : r.color === 'amber' ? "text-amber-600" : "text-primary-600"
                  )}>{r.count}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="bg-rose-50 border-2 border-rose-100 p-8 rounded-3xl text-rose-900 shadow-xl shadow-rose-900/5 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12 transition-transform group-hover:scale-110 duration-700">
              <ShieldAlert size={140} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-rose-600 rounded-lg shadow-lg shadow-rose-200">
                  <Flag size={16} className="text-white" strokeWidth={3} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-600 leading-none">Regulatory Notice</span>
              </div>
              <h4 className="text-lg font-black tracking-tight mb-2 leading-tight">AML Compliance Sync</h4>
              <p className="text-xs text-rose-700 font-medium leading-relaxed mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
                CTR and STR reports for the current window are due for generation and CBN submission.
              </p>
              <button className="w-full py-3.5 bg-rose-600 text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-xl transition-all hover:bg-rose-700 active:scale-95 shadow-lg shadow-rose-900/20">
                Generate Regulatory Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FraudPage;
