import { PageHeader, Card, StatCard } from '../../components/layout/Common';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Settings, 
  MoreVertical, 
  Lock, 
  Unlock, 
  ShieldAlert, 
  Smartphone,
  RefreshCw,
  Zap,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { cn } from '../../lib/utils';

const CardsPage = () => {
  const cards = [
    { id: 'CRD-001', customer: 'Olawale Johnson', number: '•••• •••• •••• 4567', type: 'Visa Platinum', status: 'Active', issued: '20 Nov 2023' },
    { id: 'CRD-002', customer: 'Amaka Chinedu', number: '•••• •••• •••• 8901', type: 'MasterCard Gold', status: 'Blocked', issued: '15 Oct 2023' },
    { id: 'CRD-003', customer: 'Ibrahim Musa', number: '•••• •••• •••• 2345', type: 'Visa Classic', status: 'Active', issued: '05 Sep 2023' },
    { id: 'CRD-004', customer: 'Sarah Wilson', number: '•••• •••• •••• 6789', type: 'Visa Platinum', status: 'Expired', issued: '10 Jan 2022' },
    { id: 'CRD-005', customer: 'Michael Brown', number: '•••• •••• •••• 3456', type: 'MasterCard Gold', status: 'Active', issued: '05 Jan 2024' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Card & ATM Management" 
        description="End-to-end card lifecycle management, issuance, and channel security controls."
        actions={
          <button className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 active:scale-95">
            <Plus size={18} strokeWidth={3} />
            Provision New Card
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Circulating Cards" value="8,456" icon={CreditCard} color="primary" />
        <StatCard label="Pending Requests" value="124" icon={RefreshCw} color="amber" />
        <StatCard label="Total Blocked" value="45" icon={ShieldAlert} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2" title="Card Issuance Registry" description="Track and manage individual card statuses.">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="relative w-full max-w-sm">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search card PAN or holder..." 
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
                  <th className="px-8 py-4">Card Identification</th>
                  <th className="px-8 py-4">Holder</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Issuance</th>
                  <th className="px-8 py-4 text-right">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {cards.map((card) => (
                  <tr key={card.id} className="hover:bg-slate-50/30 transition-colors group cursor-pointer">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-7 bg-slate-900 rounded-md flex items-center justify-center text-[8px] text-white font-black overflow-hidden relative group-hover:bg-primary-900 transition-colors shadow-sm">
                           <div className="absolute top-1 left-1 w-2 h-1.5 bg-amber-400 rounded-sm opacity-50"></div>
                           {card.type.split(' ')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 leading-none">{card.number}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">{card.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-bold text-slate-700 tracking-tight">
                      {card.customer}
                    </td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        card.status === 'Active' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : 
                        card.status === 'Blocked' ? "bg-rose-50 text-rose-700 border-rose-100" : 
                        "bg-slate-100 text-slate-600 border-slate-200"
                      )}>
                        {card.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-xs text-slate-500 font-bold tracking-tight">
                      {card.issued}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button title="Settings" className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all active:scale-90">
                          <Settings size={18} strokeWidth={2.5} />
                        </button>
                        <button title={card.status === 'Blocked' ? "Unblock Card" : "Restrict Card"} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all active:scale-90">
                           {card.status === 'Blocked' ? <Unlock size={18} strokeWidth={2.5} /> : <Lock size={18} strokeWidth={2.5} />}
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                          <MoreVertical size={18} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-8">
          <Card title="Security Controls" description="Global channel restriction toggles.">
             <div className="space-y-4">
                {[
                  { label: 'ATM Withdrawals', icon: CreditCard, enabled: true, desc: 'Physical cash points' },
                  { label: 'POS Terminal', icon: CreditCard, enabled: true, desc: 'Retail merchant points' },
                  { label: 'Web / E-commerce', icon: Smartphone, enabled: false, desc: 'Online transactions' },
                  { label: 'International Use', icon: ShieldAlert, enabled: false, desc: 'Cross-border processing' },
                ].map((channel, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center border-2 ring-4",
                        channel.enabled 
                          ? "bg-white text-primary-600 border-primary-50 ring-primary-500/5 shadow-sm" 
                          : "bg-slate-100 text-slate-400 border-slate-200 ring-transparent opacity-60"
                      )}>
                        <channel.icon size={24} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 leading-none">{channel.label}</p>
                        <p className="text-[10px] text-slate-400 font-bold tracking-tight mt-1.5">{channel.desc}</p>
                      </div>
                    </div>
                    <button className={cn(
                      "w-11 h-6 rounded-full transition-all relative border-2",
                      channel.enabled ? "bg-primary-600 border-primary-600 shadow-sm shadow-primary-200" : "bg-slate-200 border-slate-200"
                    )}>
                      <div className={cn(
                        "absolute top-0.5 bg-white w-4 h-4 rounded-full transition-all shadow-sm",
                        channel.enabled ? "right-0.5" : "left-0.5"
                      )} />
                    </button>
                  </div>
                ))}
             </div>
             
             <div className="mt-8 p-5 bg-linear-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-800 shadow-xl shadow-slate-900/20 relative overflow-hidden group">
               <div className="absolute -right-2 -bottom-2 text-white/5 -rotate-12 transition-transform group-hover:scale-110 duration-700">
                  <ShieldAlert size={80} />
               </div>
               <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-3">
                    <Zap size={16} className="text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Compliance Logic</span>
                 </div>
                 <p className="text-xs text-slate-300 font-medium leading-relaxed">Changes to these controls trigger an instant <span className="text-white font-black">Tier 2 Audit</span> and require Maker-Checker clearance.</p>
               </div>
             </div>
          </Card>

          <Card title="Quick Reports" description="Terminal performance insights.">
             <div className="grid grid-cols-2 gap-3">
                <button className="p-4 bg-primary-50 border border-primary-100 rounded-xl flex flex-col items-center gap-2 group hover:bg-primary-600 transition-all">
                   <CreditCard size={20} className="text-primary-600 group-hover:text-white transition-colors" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-primary-700 group-hover:text-white transition-colors">BIN Logs</span>
                </button>
                <button className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex flex-col items-center gap-2 group hover:bg-emerald-600 transition-all">
                   <CheckCircle2 size={20} className="text-emerald-600 group-hover:text-white transition-colors" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 group-hover:text-white transition-colors">Settled</span>
                </button>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CardsPage;
