import { useState, useEffect } from 'react';
import { PageHeader, Card, StatCard } from '../../components/layout/Common';
import {
  Smartphone, Send, Activity,
  Users, Database, Cpu, Server, Loader2, X, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { cn } from '../../lib/utils';

const MobilePage = () => {
  const [sysStats, setSysStats]       = useState<any>(null);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [pushTitle, setPushTitle]     = useState('');
  const [pushBody, setPushBody]       = useState('');
  const [pushType, setPushType]       = useState('ANNOUNCEMENT');
  const [sending, setSending]         = useState(false);
  const [result, setResult]           = useState<{ sent: number; failed: number; total: number } | null>(null);
  const [error, setError]             = useState('');

  const adminFetch = (path: string, opts?: RequestInit) =>
    fetch(`https://swifttrustapi.com/api/admin${path}`, {
      ...opts,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
        'Content-Type': 'application/json',
        ...(opts?.headers || {}),
      },
    }).then(r => r.json()).then(d => d.data ?? d);

  useEffect(() => {
    adminFetch('/config/stats')
      .then(s => setSysStats(s))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDispatch = async () => {
    if (!pushTitle.trim() || !pushBody.trim()) {
      setError('Title and message are required.');
      return;
    }
    setSending(true);
    setError('');
    setResult(null);
    try {
      const res = await adminFetch('/push-alert', {
        method: 'POST',
        body: JSON.stringify({ title: pushTitle.trim(), body: pushBody.trim(), type: pushType }),
      });
      if (res.message) {
        setResult({ sent: res.sent ?? 0, failed: res.failed ?? 0, total: res.total ?? 0 });
        setPushTitle('');
        setPushBody('');
        setPushType('ANNOUNCEMENT');
      } else {
        setError(res.message || 'Failed to dispatch push alert.');
      }
    } catch (e: any) {
      setError(e.message || 'Network error.');
    } finally {
      setSending(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setResult(null);
    setError('');
    setPushTitle('');
    setPushBody('');
    setPushType('ANNOUNCEMENT');
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={32} className="animate-spin text-primary-500" />
    </div>
  );

  const uptimeDays  = sysStats?.uptime ? Math.floor(sysStats.uptime / 86400) : 0;
  const uptimeHours = sysStats?.uptime ? Math.floor((sysStats.uptime % 86400) / 3600) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Mobile App Governance"
        description="Release management, push notification engine, and mobile API performance monitoring."
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all active:scale-95"
          >
            <Send size={18} strokeWidth={3} /> Dispatch Push Alert
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Customers" value={String(sysStats?.totalUsers || 0)}   icon={Users}    color="primary" />
        <StatCard label="Total Wallets"   value={String(sysStats?.totalWallets || 0)} icon={Database} color="green"   />
        <StatCard label="Server Uptime"   value={`${uptimeDays}d ${uptimeHours}h`}    icon={Activity} color="amber"   />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="System Performance" description="Real-time backend server metrics.">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Node Version', value: sysStats?.nodeVersion || '—',                               icon: Server,   color: 'primary' },
              { label: 'Memory Usage', value: `${sysStats?.memoryMB || 0} MB`,                            icon: Cpu,      color: 'amber'   },
              { label: 'Environment',  value: sysStats?.env || 'production',                              icon: Activity, color: 'emerald' },
              { label: 'Total Txns',   value: String(sysStats?.totalTransactions?.toLocaleString() || 0), icon: Database, color: 'primary' },
            ].map((m, i) => (
              <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary-200 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <m.icon size={16} className={cn(
                    m.color === 'primary' ? 'text-primary-500' :
                    m.color === 'amber'   ? 'text-amber-500'   :
                    'text-emerald-500'
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
            <button
              onClick={() => setShowModal(true)}
              className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 transition-all active:scale-95 shadow shadow-primary-200"
            >
              <Send size={14} strokeWidth={3} /> Send Bulk Notification
            </button>
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
              { label: 'Process Uptime',  value: `${uptimeDays}d ${uptimeHours}h`              },
              { label: 'Heap Memory',     value: `${sysStats?.memoryMB || 0} MB`               },
              { label: 'Environment',     value: sysStats?.env || 'production'                 },
              { label: 'Total Customers', value: sysStats?.totalUsers?.toLocaleString() || '0' },
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

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-8 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center">
                  <Send size={22} className="text-primary-600" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Dispatch Push Alert</h3>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">Sends to all active user devices</p>
                </div>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-5">
              {result && (
                <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-4">
                  <CheckCircle2 size={22} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-black text-emerald-800">Push alert dispatched successfully!</p>
                    <p className="text-xs text-emerald-600 font-bold mt-1">
                      {result.sent} delivered · {result.failed} failed · {result.total} total devices
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3">
                  <AlertTriangle size={18} className="text-rose-600 shrink-0" />
                  <p className="text-xs font-bold text-rose-700">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Notification Type</label>
                <select
                  value={pushType}
                  onChange={e => setPushType(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
                >
                  <option value="ANNOUNCEMENT">Announcement</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="PROMOTION">Promotion</option>
                  <option value="SECURITY">Security Alert</option>
                  <option value="GENERAL">General</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Title</label>
                <input
                  type="text"
                  placeholder="e.g. System Maintenance Tonight"
                  value={pushTitle}
                  onChange={e => setPushTitle(e.target.value)}
                  maxLength={100}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Message</label>
                <textarea
                  placeholder="e.g. Swift Trust MFB will be undergoing maintenance from 12am - 2am tonight."
                  value={pushBody}
                  onChange={e => setPushBody(e.target.value)}
                  maxLength={300}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all resize-none"
                />
                <p className="text-[10px] text-slate-400 font-bold mt-1 text-right">{pushBody.length}/300</p>
              </div>
            </div>

            <div className="p-8 pt-0 flex gap-3">
              <button onClick={closeModal} className="flex-1 py-3.5 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all">
                Cancel
              </button>
              <button
                onClick={handleDispatch}
                disabled={sending || !pushTitle.trim() || !pushBody.trim()}
                className="flex-1 py-3.5 bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary-200"
              >
                {sending
                  ? <><Loader2 size={14} className="animate-spin" /> Sending...</>
                  : <><Send size={14} strokeWidth={3} /> Send to All Users</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobilePage;
