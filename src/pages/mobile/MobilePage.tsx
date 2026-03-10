import { useState, useEffect } from 'react';
import { PageHeader, Card, StatCard } from '../../components/layout/Common';
import {
  Smartphone, Send, Activity, AlertCircle, BarChart2,
  Users, Database, Cpu, Server, Loader2, RefreshCw
} from 'lucide-react';
import { cn } from '../../lib/utils';

const MobilePage = () => {
  const [sysStats, setSysStats] = useState<any>(null);
  const [loading, setLoading]   = useState(true);

  const adminFetch = (path: string) =>
    fetch(`https://swifttrustapi.com/api/admin${path}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}`, 'Content-Type': 'application/json' },
    }).then(r => r.json()).then(d => d.data ?? d);

  useEffect(() => {
    adminFetch('/config/stats')
      .then(s => setSysStats(s))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={32} className="animate-spin text-primary-500" />
    </div>
  );

  const uptimeDays = sysStats?.uptime ? Math.floor(sysStats.uptime / 86400) : 0;
  const uptimeHours = sysStats?.uptime ? Math.floor((sysStats.uptime % 86400) / 3600) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Mobile App Governance"
        description="Release management, push notification engine, and mobile API performance monitoring."
        actions={
          <button className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all active:scale-95">
            <Send size={18} strokeWidth={3} /> Dispatch Push Alert
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Customers" value={String(sysStats?.totalUsers || 0)}        icon={Users}       color="primary" />
        <StatCard label="Total Wallets"   value={String(sysStats?.totalWallets || 0)}      icon={Database}    color="green"   />
        <StatCard label="Server Uptime"   value={`${uptimeDays}d ${uptimeHours}h`}         icon={Activity}    color="amber"   />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="System Performance" description="Real-time backend server metrics.">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Node Version',  value: sysStats?.nodeVersion || '—',                     icon: Server,   color: 'primary' },
              { label: 'Memory Usage',  value: `${sysStats?.memoryMB || 0} MB`,                  icon: Cpu,      color: 'amber'   },
              { label: 'Environment',   value: sysStats?.env || 'production',                     icon: Activity, color: 'emerald' },
              { label: 'Total Txns',    value: String(sysStats?.totalTransactions?.toLocaleString() || 0), icon: Database, color: 'primary' },
            ].map((m, i) => (
              <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary-200 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <m.icon size={16} className={cn(
                    m.color === 'primary' ? "text-primary-500" :
                    m.color === 'amber'   ? "text-amber-500"   :
                    "text-emerald-500"
                  )} />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</span>
                </div>
                <p className="text-lg font-black text-slate-900 tracking-tighter">{m.value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Push Notification Engine" description="Firebase Cloud Messaging status.">
          <div className="h-full flex flex-col items-center justify-center py-8 text-center gap-4 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
              <Send size={28} className="text-primary-500" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-black text-slate-900 text-sm">FCM Configured</p>
              <p className="text-xs text-slate-400 font-bold mt-1">Firebase push notifications active via service account</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Connected</span>
            </div>
          </div>
        </Card>

        <Card title="App Version Management" description="Mobile release tracking is managed externally via App Store / Play Store.">
          <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 text-center py-10">
            <Smartphone size={36} className="text-slate-300" strokeWidth={1.5} />
            <p className="font-black text-slate-500 text-sm">Version data not tracked server-side</p>
            <p className="text-xs text-slate-400 font-bold max-w-xs leading-relaxed">
              App version distribution is managed through the Apple App Store and Google Play Store consoles.
            </p>
          </div>
        </Card>

        <Card title="Server Health" description="Live process information.">
          <div className="space-y-4">
            {[
              { label: 'Process Uptime',  value: `${uptimeDays}d ${uptimeHours}h`,            status: 'ok'  },
              { label: 'Heap Memory',     value: `${sysStats?.memoryMB || 0} MB`,              status: 'ok'  },
              { label: 'Environment',     value: sysStats?.env || 'production',                status: 'ok'  },
              { label: 'Total Customers', value: sysStats?.totalUsers?.toLocaleString() || '0', status: 'ok' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-black text-slate-600 uppercase tracking-tight">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-slate-900">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MobilePage;
