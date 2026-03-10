import { useState, useEffect } from 'react';
import { PageHeader, Card } from '../../components/layout/Common';
import {
  Terminal, Database, RefreshCw, Globe, Save, CheckCircle2,
  Clock, Zap, Server, Cpu, Activity, ArrowRight, ShieldCheck,
  XCircle, TrendingUp, X, Loader2
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface TierLimit {
  id?: string;
  tier: string;
  dailyLimit: string;
  singleLimit: string;
  status: string;
}

interface PendingChange {
  id: number;
  type: string;
  target: string;
  oldValue: string;
  newValue: string;
  requestedBy: string;
  requestedAt: string;
}

const adminFetch = (path: string, opts?: RequestInit) =>
  fetch(`https://swifttrustapi.com/api/admin${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      'Content-Type': 'application/json',
      ...(opts?.headers || {}),
    },
  }).then(r => r.json()).then(d => d.data ?? d);

const ConfigPage = () => {
  const [activeTab, setActiveTab]         = useState<'limits' | 'system'>('limits');
  const [limits, setLimits]               = useState<TierLimit[]>([]);
  const [sysStats, setSysStats]           = useState<any>(null);
  const [loading, setLoading]             = useState(true);
  const [selectedLimit, setSelectedLimit] = useState<TierLimit | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newDailyLimit, setNewDailyLimit] = useState('');
  const [newSingleLimit, setNewSingleLimit] = useState('');
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const [saving, setSaving]               = useState(false);

  useEffect(() => {
    Promise.all([adminFetch('/config/tiers'), adminFetch('/config/stats')])
      .then(([t, s]) => {
        setLimits(t.tiers || []);
        setSysStats(s);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleEditLimit = (limit: TierLimit) => {
    setSelectedLimit(limit);
    setNewDailyLimit(limit.dailyLimit);
    setNewSingleLimit(limit.singleLimit);
    setIsEditModalOpen(true);
  };

  const handleSaveLimit = () => {
    if (!selectedLimit) return;
    const dailyChanged  = newDailyLimit  !== selectedLimit.dailyLimit;
    const singleChanged = newSingleLimit !== selectedLimit.singleLimit;
    if (!dailyChanged && !singleChanged) { setIsEditModalOpen(false); return; }

    const newChanges: PendingChange[] = [];
    if (dailyChanged) newChanges.push({
      id: Date.now() + 1, type: 'Limit Change',
      target: `${selectedLimit.tier} Daily Limit`,
      oldValue: selectedLimit.dailyLimit, newValue: newDailyLimit,
      requestedBy: 'Current Admin', requestedAt: 'Just now',
    });
    if (singleChanged) newChanges.push({
      id: Date.now() + 2, type: 'Limit Change',
      target: `${selectedLimit.tier} Single Transaction`,
      oldValue: selectedLimit.singleLimit, newValue: newSingleLimit,
      requestedBy: 'Current Admin', requestedAt: 'Just now',
    });
    setPendingChanges(prev => [...newChanges, ...prev]);
    setIsEditModalOpen(false);
  };

  const handleApprove = async (change: PendingChange) => {
    setSaving(true);
    try {
      // Find the tier and update it
      const tier = limits.find(l => change.target.startsWith(l.tier));
      if (tier) {
        const updated = {
          ...tier,
          dailyLimit:  change.target.includes('Daily')  ? change.newValue : tier.dailyLimit,
          singleLimit: change.target.includes('Single')  ? change.newValue : tier.singleLimit,
        };
        await adminFetch('/config/tiers', { method: 'PUT', body: JSON.stringify(updated) });
        setLimits(ls => ls.map(l => l.tier === tier.tier ? updated : l));
      }
      setPendingChanges(prev => prev.filter(c => c.id !== change.id));
    } catch (e: any) { alert(e.message); }
    setSaving(false);
  };

  const handleReject = (id: number) => setPendingChanges(prev => prev.filter(c => c.id !== id));

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={32} className="animate-spin text-primary-500" />
    </div>
  );

  const uptimeDays  = sysStats?.uptime ? Math.floor(sysStats.uptime / 86400) : 0;
  const uptimeHours = sysStats?.uptime ? Math.floor((sysStats.uptime % 86400) / 3600) : 0;

  const systemMetrics = [
    { label: 'Node Version',   value: sysStats?.nodeVersion || '—',                          color: 'primary', icon: Server   },
    { label: 'Memory Usage',   value: `${sysStats?.memoryMB || 0} MB`,                       color: 'amber',   icon: Cpu      },
    { label: 'Server Uptime',  value: `${uptimeDays}d ${uptimeHours}h`,                      color: 'emerald', icon: Activity },
    { label: 'Total Customers',value: String(sysStats?.totalUsers?.toLocaleString() || '0'), color: 'primary', icon: Database },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="System Configuration"
        description="Global environment variables, runtime parameters, and core service health orchestration."
        actions={
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all bg-slate-50/50">
              <Database size={16} strokeWidth={3} /> Snapshot DB
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemMetrics.map((metric, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:border-primary-200 transition-all">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{metric.label}</span>
              <metric.icon size={16} className={cn(
                metric.color === 'emerald' ? "text-emerald-500" :
                metric.color === 'amber'   ? "text-amber-500"   : "text-primary-500"
              )} strokeWidth={2.5} />
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{metric.value}</p>
            <div className="mt-4 flex items-center gap-1.5">
              <div className={cn("w-1.5 h-1.5 rounded-full",
                metric.color === 'emerald' ? "bg-emerald-500" :
                metric.color === 'amber'   ? "bg-amber-500"   : "bg-primary-500"
              )} />
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-tight">Live</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex border-b border-slate-200">
        {([
          { id: 'limits', label: 'Transaction Limits' },
          { id: 'system', label: 'System Info'        },
        ] as const).map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn("px-8 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative",
              activeTab === tab.id ? "text-primary-600" : "text-slate-400 hover:text-slate-600"
            )}>
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 rounded-t-full" />}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2"
          title={activeTab === 'limits' ? 'Customer Tier Limits' : 'Runtime Environment'}
          description={activeTab === 'limits' ? 'Set daily and single transaction limits across KYC tiers.' : 'Live server and environment metadata.'}
        >
          {activeTab === 'limits' ? (
            limits.length === 0 ? (
              <div className="py-16 text-center text-slate-400 font-bold text-xs uppercase">
                No tier limits configured
              </div>
            ) : (
              <div className="overflow-x-auto -mx-8">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50/50 border-y border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-[0.15em]">
                    <tr>
                      <th className="px-8 py-4">Customer Tier</th>
                      <th className="px-8 py-4">Daily Limit</th>
                      <th className="px-8 py-4">Single Transaction</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {limits.map((limit, i) => (
                      <tr key={i} className="hover:bg-slate-50/30 transition-colors group cursor-pointer" onClick={() => handleEditLimit(limit)}>
                        <td className="px-8 py-5 font-black text-slate-900">{limit.tier}</td>
                        <td className="px-8 py-5 font-mono font-bold text-primary-600">{limit.dailyLimit}</td>
                        <td className="px-8 py-5 font-mono font-bold text-slate-700">{limit.singleLimit}</td>
                        <td className="px-8 py-5">
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                            {limit.status || 'Active'}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button onClick={e => { e.stopPropagation(); handleEditLimit(limit); }}
                            className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                            <TrendingUp size={18} strokeWidth={2.5} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div className="space-y-4">
              {[
                { label: 'Environment',       value: sysStats?.env || 'production'                           },
                { label: 'Node Version',       value: sysStats?.nodeVersion || '—'                            },
                { label: 'Memory Heap (MB)',   value: String(sysStats?.memoryMB || 0)                         },
                { label: 'Total Customers',    value: sysStats?.totalUsers?.toLocaleString() || '0'           },
                { label: 'Total Wallets',      value: sysStats?.totalWallets?.toLocaleString() || '0'         },
                { label: 'Total Transactions', value: sysStats?.totalTransactions?.toLocaleString() || '0'    },
                { label: 'Server Uptime',      value: `${uptimeDays}d ${uptimeHours}h`                        },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary-100 transition-all">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                  <span className="font-mono font-black text-slate-900 text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="space-y-8">
          {activeTab === 'limits' && pendingChanges.length > 0 && (
            <Card title="Maker-Checker" description="Pending authorization requests.">
              <div className="space-y-4">
                {pendingChanges.map(change => (
                  <div key={change.id} className="p-4 bg-primary-50/50 border border-primary-100 rounded-2xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary-600">{change.type}</p>
                        <p className="text-sm font-black text-slate-900 mt-1">{change.target}</p>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight bg-white px-1.5 py-0.5 rounded border border-slate-100">{change.requestedAt}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-primary-100">
                      <span className="text-xs font-mono font-bold text-slate-400 line-through">{change.oldValue}</span>
                      <ArrowRight size={14} className="text-primary-400" />
                      <span className="text-xs font-mono font-black text-primary-600">{change.newValue}</span>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => handleApprove(change)} disabled={saving}
                        className="flex-1 py-2 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5 shadow-sm">
                        {saving ? <Loader2 size={12} className="animate-spin" /> : <ShieldCheck size={14} />} Approve
                      </button>
                      <button onClick={() => handleReject(change.id)}
                        className="flex-1 py-2 bg-white border border-rose-100 text-rose-600 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-rose-50 transition-all flex items-center justify-center gap-1.5">
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'limits' && pendingChanges.length === 0 && (
            <Card title="Maker-Checker" description="No pending authorization requests.">
              <div className="py-8 flex flex-col items-center gap-2 text-center">
                <CheckCircle2 size={32} className="text-emerald-300" />
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">All changes approved</p>
              </div>
            </Card>
          )}

          <Card title="Operational Context" description="Runtime environment metadata.">
            <div className="space-y-4">
              {[
                { label: 'Environment', value: sysStats?.env || 'production', icon: Globe      },
                { label: 'Engine',      value: sysStats?.nodeVersion || '—',  icon: Terminal   },
                { label: 'Status',      value: 'Operational',                 icon: CheckCircle2 },
              ].map((env, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center border-2 shadow-sm transition-transform group-hover:scale-105">
                      <env.icon size={22} className="text-primary-600" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1.5">{env.label}</p>
                      <p className="text-sm font-black text-slate-900 tracking-tight">{env.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="bg-slate-950 p-8 rounded-3xl text-white shadow-2xl shadow-slate-900 relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 transition-transform group-hover:scale-110 duration-1000">
              <Terminal size={160} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-rose-600 rounded-xl shadow-lg shadow-rose-500/20">
                  <Zap size={18} className="text-white fill-white" strokeWidth={3} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none">Panic Recovery</span>
              </div>
              <h4 className="text-xl font-black tracking-tight mb-2 leading-none">Atomic Rollback</h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
                Instantly revert all parameters to the last known-stable global snapshot.
              </p>
              <button className="w-full py-4 bg-rose-600 text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-2xl transition-all hover:bg-rose-700 active:scale-95 shadow-xl shadow-rose-900/40 flex items-center justify-center gap-3">
                <RefreshCw size={16} strokeWidth={3} /> Execute Global Reversion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Limit Modal */}
      {isEditModalOpen && selectedLimit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">Modify {selectedLimit.tier} Limits</h3>
                <p className="text-slate-500 text-xs mt-2 font-medium">Propose changes for Maker-Checker authorization.</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)}
                className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200">
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Daily Limit', value: newDailyLimit, onChange: setNewDailyLimit, current: selectedLimit.dailyLimit },
                  { label: 'Single Transaction', value: newSingleLimit, onChange: setNewSingleLimit, current: selectedLimit.singleLimit },
                ].map((field, i) => (
                  <div key={i} className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">{field.label}</label>
                    <div className="relative group">
                      <input type="text" value={field.value} onChange={e => field.onChange(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-mono font-bold text-slate-900 focus:outline-none focus:border-primary-500 focus:bg-white transition-all" />
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-black">NGN</div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium px-1">Current: <span className="text-slate-900 font-bold">{field.current}</span></p>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-primary-50/50 border border-primary-100 rounded-3xl flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border-2 border-primary-100 text-primary-600 shadow-sm shrink-0">
                  <ShieldCheck size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-600 leading-none mb-1.5">Compliance Protocol</h4>
                  <p className="text-[11px] text-primary-700 font-medium leading-relaxed">This update requires approval from a Level 2 System Administrator before it takes effect on live production.</p>
                </div>
              </div>
            </div>

            <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button onClick={() => setIsEditModalOpen(false)}
                className="flex-1 py-4 text-slate-600 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-white border border-transparent hover:border-slate-200 transition-all">
                Cancel
              </button>
              <button onClick={handleSaveLimit}
                className="flex-1 py-4 bg-primary-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                <TrendingUp size={16} strokeWidth={3} /> Propose Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigPage;
