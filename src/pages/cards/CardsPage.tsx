import { useState, useEffect } from 'react';
import { PageHeader, Card, StatCard } from '../../components/layout/Common';
import {
  CreditCard, Plus, Search, Settings, MoreVertical, Lock, Unlock,
  ShieldAlert, Smartphone, RefreshCw, Zap, CheckCircle2, Filter, Loader2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { api } from '../../lib/api';

const CardsPage = () => {
  const [cards, setCards]         = useState<any[]>([]);
  const [stats, setStats]         = useState<any>(null);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const adminFetch = (path: string, opts?: RequestInit) =>
    fetch(`https://swifttrustapi.com/api/admin${path}`, {
      ...opts,
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}`, 'Content-Type': 'application/json', ...(opts?.headers || {}) },
    }).then(r => r.json()).then(d => d.data ?? d);

  useEffect(() => {
    Promise.all([adminFetch('/cards'), adminFetch('/cards/stats')])
      .then(([c, s]) => { setCards(c.cards || []); setStats(s); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleToggleBlock = async (cardId: string, isBlocked: boolean) => {
    setTogglingId(cardId);
    try {
      await (api as any).updateCardStatus?.(cardId, !isBlocked) ??
        adminFetch('/cards/status', { method: 'PUT', body: JSON.stringify({ cardId, isBlocked: !isBlocked }) });
      setCards(cs => cs.map(c => c.id === cardId ? { ...c, isBlocked: !isBlocked } : c));
    } catch (e: any) { alert(e.message); }
    setTogglingId(null);
  };

  const filtered = cards.filter(c => {
    const q = search.toLowerCase();
    const holder = `${c.User?.firstName || ''} ${c.User?.lastName || ''}`.toLowerCase();
    return !q || holder.includes(q) || c.cardNumber?.includes(q) || c.id?.includes(q);
  });

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={32} className="animate-spin text-primary-500" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Card & ATM Management"
        description="End-to-end card lifecycle management, issuance, and channel security controls."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Cards"   value={String(stats?.total || 0)}   icon={CreditCard}  color="primary" />
        <StatCard label="Active Cards"  value={String(stats?.active || 0)}  icon={CheckCircle2} color="green"  />
        <StatCard label="Blocked Cards" value={String(stats?.blocked || 0)} icon={ShieldAlert} color="rose"   />
      </div>

      <Card title="Card Issuance Registry" description="Track and manage individual card statuses.">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="relative w-full max-w-sm">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search cardholder or card ID..."
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
                <th className="px-8 py-4">Card</th>
                <th className="px-8 py-4">Holder</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Issued</th>
                <th className="px-8 py-4 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(card => (
                <tr key={card.id} className="hover:bg-slate-50/30 transition-colors group cursor-pointer">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-7 bg-slate-900 rounded-md flex items-center justify-center text-[8px] text-white font-black overflow-hidden relative group-hover:bg-primary-900 transition-colors shadow-sm">
                        <div className="absolute top-1 left-1 w-2 h-1.5 bg-amber-400 rounded-sm opacity-50" />
                        CARD
                      </div>
                      <div>
                        <p className="font-black text-slate-900 leading-none font-mono text-xs">{card.cardNumber ? `•••• •••• •••• ${card.cardNumber.slice(-4)}` : card.id?.slice(0, 12)}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">{card.cardType || 'Card'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-bold text-slate-700 tracking-tight">
                    {card.User ? `${card.User.firstName} ${card.User.lastName}` : '—'}
                    <p className="text-[10px] text-slate-400 font-bold mt-1">{card.User?.email}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      !card.isBlocked ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"
                    )}>
                      {card.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-xs text-slate-500 font-bold tracking-tight">
                    {card.createdAt ? new Date(card.createdAt).toLocaleDateString('en-NG') : '—'}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleToggleBlock(card.id, card.isBlocked)}
                        disabled={togglingId === card.id}
                        title={card.isBlocked ? "Unblock Card" : "Block Card"}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all active:scale-90"
                      >
                        {togglingId === card.id
                          ? <Loader2 size={18} className="animate-spin" />
                          : card.isBlocked ? <Unlock size={18} strokeWidth={2.5} /> : <Lock size={18} strokeWidth={2.5} />
                        }
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                        <MoreVertical size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-slate-400 font-bold text-xs uppercase">
                    No cards found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default CardsPage;
