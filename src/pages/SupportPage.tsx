import { useState, useEffect } from 'react';
import { PageHeader, Card, StatCard } from '../../components/layout/Common';
import {
  MessageSquare, Search, Filter, CheckCircle2, Eye, Activity,
  Smartphone, Globe, Plus, Send, MoreVertical, LifeBuoy, Loader2, Clock
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { api } from '../../lib/api';

const SupportPage = () => {
  const [stats, setStats]     = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  const adminFetch = (path: string) =>
    fetch(`https://swifttrustapi.com/api/admin${path}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}`, 'Content-Type': 'application/json' },
    }).then(r => r.json()).then(d => d.data ?? d);

  useEffect(() => {
    Promise.all([adminFetch('/support/stats'), adminFetch('/support/tickets')])
      .then(([s, t]) => { setStats(s); setTickets(t.tickets || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = tickets.filter(t => {
    const q = search.toLowerCase();
    return !q || t.customer?.toLowerCase().includes(q) || t.subject?.toLowerCase().includes(q) || t.email?.toLowerCase().includes(q);
  });

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={32} className="animate-spin text-primary-500" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Internet Banking & Support"
        description="Monitor active user sessions, facilitate customer dispute resolution, and analyze service feedback."
        actions={
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:shadow-sm transition-all bg-slate-50/50">
              <Globe size={16} strokeWidth={3} /> Session Tracker
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Active Users"    value={String(stats?.activeUsers || 0)}    icon={Smartphone}    color="primary" />
        <StatCard label="Open Tickets"    value={String(tickets.filter(t => t.status === 'Open').length)} icon={MessageSquare} color="amber" />
        <StatCard label="Locked Accounts" value={String(stats?.lockedUsers || 0)}    icon={CheckCircle2}  color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2" title="Resolution Command Center" description="Unified queue for customer inquiries and platform disputes.">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="relative w-full max-w-sm">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Ticket subject or customer..."
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
                  <th className="px-8 py-4">Ticket Classification</th>
                  <th className="px-8 py-4">Customer</th>
                  <th className="px-8 py-4">Urgency</th>
                  <th className="px-8 py-4">Current Phase</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((ticket, i) => (
                  <tr key={i} className="hover:bg-slate-50/30 transition-colors group cursor-pointer">
                    <td className="px-8 py-5">
                      <div>
                        <p className="font-black text-slate-900 leading-none tracking-tight">{ticket.subject}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">
                          {new Date(ticket.time).toLocaleString('en-NG', { dateStyle: 'short', timeStyle: 'short' })}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-slate-700 tracking-tight">{ticket.customer}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1">{ticket.email}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "inline-flex px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border",
                        ticket.priority === 'High'   ? "bg-rose-50 text-rose-700 border-rose-100" :
                        ticket.priority === 'Medium' ? "bg-amber-50 text-amber-700 border-amber-100" :
                        "bg-primary-50 text-primary-700 border-primary-100"
                      )}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          ticket.status === 'Open'      ? "bg-amber-500 animate-pulse" :
                          ticket.status === 'In-Review' ? "bg-primary-500" :
                          "bg-emerald-500"
                        )} />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-600">{ticket.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button title="Case Details" className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all active:scale-90">
                          <Eye size={18} strokeWidth={2.5} />
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
                      No support tickets found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-8">
          <Card title="Ticket Summary" description="Current queue breakdown.">
            <div className="space-y-3">
              {[
                { label: 'Open',       count: tickets.filter(t => t.status === 'Open').length,       color: 'amber'   },
                { label: 'In-Review',  count: tickets.filter(t => t.status === 'In-Review').length,  color: 'primary' },
                { label: 'Resolved',   count: tickets.filter(t => t.status !== 'Open' && t.status !== 'In-Review').length, color: 'emerald' },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className={cn("w-2 h-2 rounded-full",
                      r.color === 'amber' ? "bg-amber-500" : r.color === 'primary' ? "bg-primary-500" : "bg-emerald-500"
                    )} />
                    <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{r.label}</span>
                  </div>
                  <span className={cn("text-lg font-black",
                    r.color === 'amber' ? "text-amber-600" : r.color === 'primary' ? "text-primary-600" : "text-emerald-600"
                  )}>{r.count}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12 transition-transform group-hover:scale-110 duration-700">
              <LifeBuoy size={140} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary-600 rounded-lg shadow-lg shadow-primary-500/20">
                  <MessageSquare size={16} className="text-white" strokeWidth={3} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 leading-none">Support Stats</span>
              </div>
              <h4 className="text-lg font-black tracking-tight mb-2 leading-tight">Account Health</h4>
              <div className="space-y-3 mt-4">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Active Users</span>
                  <span className="text-emerald-400 font-black">{stats?.activeUsers || 0}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Locked Accounts</span>
                  <span className="text-amber-400 font-black">{stats?.lockedUsers || 0}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Suspended Accounts</span>
                  <span className="text-rose-400 font-black">{stats?.suspendedUsers || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
