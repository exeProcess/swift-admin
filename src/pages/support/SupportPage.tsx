import { PageHeader, Card, StatCard } from '../../components/layout/Common';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  CheckCircle2, 
  Eye, 
  Activity,
  Smartphone,
  Globe,
  Plus,
  Send,
  MoreVertical,
  LifeBuoy
} from 'lucide-react';
import { cn } from '../../lib/utils';

const SupportPage = () => {
  const tickets = [
    { id: 'TIC-102', user: 'Olawale Johnson', subject: 'Card Transaction Declined', priority: 'High', status: 'Open', time: '10 mins ago' },
    { id: 'TIC-103', user: 'Amaka Chinedu', subject: 'KYC Document Upload Issue', priority: 'Medium', status: 'In-Review', time: '25 mins ago' },
    { id: 'TIC-104', user: 'Ibrahim Musa', subject: 'Account Login Lockout', priority: 'High', status: 'Resolved', time: '1 hour ago' },
    { id: 'TIC-105', user: 'Sarah Wilson', subject: 'Transfer Limit Inquiry', priority: 'Low', status: 'Open', time: '2 hours ago' },
    { id: 'TIC-106', user: 'Michael Brown', subject: 'Mobile App Refresh Issue', priority: 'Medium', status: 'Closed', time: '3 hours ago' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Internet Banking & Support" 
        description="Monitor active user sessions, facilitate customer dispute resolution, and analyze service feedback."
        actions={
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:shadow-sm transition-all bg-slate-50/50">
              <Globe size={16} strokeWidth={3} />
              Session Tracker
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-700 shadow-md shadow-primary-200 transition-all">
              <Plus size={16} strokeWidth={3} />
              Create Support Case
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Live Sessions" value="1,245" icon={Smartphone} color="primary" />
        <StatCard label="Pending Tickets" value="12" icon={MessageSquare} color="amber" />
        <StatCard label="SLA Resolution" value="95.4%" icon={CheckCircle2} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2" title="Resolution Command Center" description="Unified queue for customer inquiries and platform disputes.">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="relative w-full max-w-sm">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Ticket ID, subject or customer..." 
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
                {tickets.map((ticket, i) => (
                  <tr key={i} className="hover:bg-slate-50/30 transition-colors group cursor-pointer">
                    <td className="px-8 py-5">
                      <div>
                        <p className="font-black text-slate-900 leading-none tracking-tight">{ticket.subject}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">{ticket.id} • {ticket.time}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-bold text-slate-700 tracking-tight">{ticket.user}</td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "inline-flex px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border",
                        ticket.priority === 'High' ? "bg-rose-50 text-rose-700 border-rose-100" : 
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
                           ticket.status === 'Open' ? "bg-amber-500 animate-pulse" :
                           ticket.status === 'Resolved' ? "bg-emerald-500" : "bg-primary-500"
                         )}></span>
                         <span className="text-xs font-black uppercase tracking-widest text-slate-600">{ticket.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button title="Case Details" className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all active:scale-90">
                          <Eye size={18} strokeWidth={2.5} />
                        </button>
                        <button title="Direct Response" className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all active:scale-90">
                           <Send size={18} strokeWidth={2.5} />
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
          <Card title="Live In-App Presence" description="Active customer internet banking sessions.">
             <div className="space-y-4">
                {[
                  { user: 'Olawale Johnson', ip: '102.168.1.1', device: 'iPhone 15 Pro', status: 'Active' },
                  { user: 'Amaka Chinedu', ip: '105.168.1.45', device: 'Windows 11', status: 'Idle' },
                  { user: 'Ibrahim Musa', ip: '41.0.5.21', device: 'Samsung S24', status: 'Active' },
                ].map((session, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-primary-200 transition-all">
                     <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center border-2 shadow-sm">
                           <Activity size={22} className={cn("text-primary-600", session.status === 'Active' ? 'animate-pulse' : 'opacity-40')} strokeWidth={2.5} />
                        </div>
                        <div>
                           <p className="text-sm font-black text-slate-900 leading-none tracking-tight">{session.user}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">{session.device} • {session.ip}</p>
                        </div>
                     </div>
                     <span className={cn(
                        "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border",
                        session.status === 'Active' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"
                      )}>
                        {session.status}
                      </span>
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
                   <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 leading-none">Intelligence Engine</span>
                </div>
                <h4 className="text-lg font-black tracking-tight mb-2 leading-tight">Customer Satisfaction Pulse</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6 opacity-80 group-hover:opacity-100 transition-opacity">You have <span className="text-white font-black">05 new</span> analytical feedback logs to review regarding the recent app update.</p>
                <button className="w-full py-3.5 bg-primary-600 text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-xl transition-all hover:bg-primary-700 active:scale-95 shadow-lg shadow-primary-900/20">Review Analytic Logs</button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
