import { useEffect, useState } from 'react';
import { PageHeader, Card, StatCard } from '../../components/layout/Common';
import { RefreshCw, Search, Filter, CheckCircle2, Download, TrendingUp, Settings, ShieldCheck, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { api } from '../../lib/api';

const PaymentsPage = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [total, setTotal]               = useState(0);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const load = (status?: string) => {
    setLoading(true);
    api.getTransactions({ status, limit: 50 })
      .then(d => { setTransactions(d.transactions || []); setTotal(d.total || 0); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = transactions.filter(t => {
    const q = search.toLowerCase();
    return !q ||
      t.transactionReference?.toLowerCase().includes(q) ||
      t.user?.firstName?.toLowerCase().includes(q) ||
      t.user?.lastName?.toLowerCase().includes(q);
  });

  const settled = transactions.filter(t => t.transactionStatus === 'SUCCESS').reduce((s, t) => s + Number(t.amount || 0), 0);
  const successRate = transactions.length ? (transactions.filter(t => t.transactionStatus === 'SUCCESS').length / transactions.length * 100).toFixed(1) : '0';
  const reversals = transactions.filter(t => t.transactionStatus === 'REVERSED').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Payments & Transfers"
        description="Enterprise settlement engine, real-time transaction auditing, and global limit orchestration."
        actions={
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:shadow-sm transition-all bg-slate-50/50">
              <Download size={16} strokeWidth={3} /> Export
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Daily Settlement" value={`₦${(settled / 1000).toFixed(0)}K`} icon={TrendingUp} color="primary" />
        <StatCard label="Success Rate"     value={`${successRate}%`}                   icon={CheckCircle2} color="green" />
        <StatCard label="Reversals"        value={String(reversals)}                    icon={RefreshCw}   color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2" title="Transaction Monitor" description="Live audit of all processing movements.">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="relative w-full max-w-sm">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Reference, name..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all" />
            </div>
            <div className="flex gap-2">
              {['', 'SUCCESS', 'FAILED', 'PENDING'].map(s => (
                <button key={s} onClick={() => { setStatusFilter(s); load(s || undefined); }}
                  className={cn("px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all",
                    statusFilter === s ? "bg-primary-600 text-white border-primary-600" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  )}>
                  {s || 'All'}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 size={28} className="animate-spin text-primary-500" /></div>
          ) : (
            <div className="overflow-x-auto -mx-8">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50/50 border-y border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-[0.15em]">
                  <tr>
                    <th className="px-8 py-4">Reference</th>
                    <th className="px-8 py-4">Customer</th>
                    <th className="px-8 py-4">Type</th>
                    <th className="px-8 py-4">Amount</th>
                    <th className="px-8 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((t, i) => (
                    <tr key={i} className="hover:bg-slate-50/30 transition-colors cursor-pointer">
                      <td className="px-8 py-5">
                        <p className="font-black text-slate-900 leading-none text-xs font-mono">{t.transactionReference || t.id?.slice(0,12)}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1">{new Date(t.createdAt).toLocaleString('en-NG', { dateStyle:'short', timeStyle:'short' })}</p>
                      </td>
                      <td className="px-8 py-5 font-bold text-slate-700">{t.user ? `${t.user.firstName} ${t.user.lastName}` : '—'}</td>
                      <td className="px-8 py-5">
                        <span className="text-[10px] font-black uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{t.transactionType}</span>
                      </td>
                      <td className="px-8 py-5 font-mono font-black text-slate-900 text-xs">₦{Number(t.amount).toLocaleString()}</td>
                      <td className="px-8 py-5 text-right">
                        <span className={cn("inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                          t.transactionStatus === 'SUCCESS' ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : t.transactionStatus === 'FAILED'  ? "bg-rose-50 text-rose-700 border-rose-100"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                        )}>{t.transactionStatus}</span>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={5} className="px-8 py-12 text-center text-slate-400 font-bold text-xs uppercase">No transactions found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-6 pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-black uppercase tracking-widest">
            Showing {filtered.length} of {total} total transactions
          </div>
        </Card>

        <div className="space-y-8">
          <Card title="Threshold Matrix" description="Global and tier-based limits.">
            <div className="space-y-4">
              {[
                { label: 'Tier 1 (Daily)', limit: '₦50,000',     color: 'slate'   },
                { label: 'Tier 2 (Daily)', limit: '₦500,000',    color: 'primary' },
                { label: 'Tier 3 (Daily)', limit: '₦5,000,000',  color: 'emerald' },
                { label: 'ATM Max',        limit: '₦100,000',    color: 'amber'   },
              ].map((limit, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-primary-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border-2 shadow-sm flex items-center justify-center">
                      <ShieldCheck size={18} className={cn(
                        limit.color === 'slate' ? 'text-slate-400' : limit.color === 'primary' ? 'text-primary-600' :
                        limit.color === 'emerald' ? 'text-emerald-600' : 'text-amber-600'
                      )} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">{limit.label}</p>
                      <p className="text-sm font-mono font-black text-slate-900">{limit.limit}</p>
                    </div>
                  </div>
                  <button className="p-2 text-slate-300 hover:text-primary-600 transition-colors"><Settings size={14} /></button>
                </div>
              ))}
            </div>
          </Card>

          <div className="bg-primary-600 p-8 rounded-3xl text-white shadow-2xl shadow-primary-600/20 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-200">Settlement Summary</span>
              <div>
                <p className="text-[10px] font-black uppercase text-primary-200 opacity-80">Total Settled</p>
                <p className="text-2xl font-black font-mono tracking-tighter mt-1">₦{settled.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="h-px w-full bg-white/10" />
              <div>
                <p className="text-[10px] font-black uppercase text-primary-200 opacity-80">Total Transactions</p>
                <p className="text-xl font-black font-mono tracking-tighter mt-1">{total.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
