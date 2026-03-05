import { PageHeader, Card, StatCard } from '../../components/layout/Common';
import { 
  Smartphone, 
  Send, 
  Activity, 
  AlertCircle, 
  BarChart2,
  MoreVertical,
  RefreshCw} from 'lucide-react';
import { cn } from '../../lib/utils';

const MobilePage = () => {
  const versions = [
    { platform: 'iOS', version: '2.4.5', status: 'Stable', users: '65%', release: '15 Dec 2023', color: 'slate' },
    { platform: 'Android', version: '2.4.2', status: 'Updating', users: '30%', release: '18 Dec 2023', color: 'emerald' },
    { platform: 'iOS', version: '2.4.0', status: 'Deprecated', users: '3%', release: '02 Nov 2023', color: 'rose' },
    { platform: 'Android', version: '2.3.8', status: 'Deprecated', users: '2%', release: '20 Oct 2023', color: 'rose' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Mobile App Governance" 
        description="Release management, push notification engine, and mobile API performance monitoring."
        actions={
          <button className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all active:scale-95">
            <Send size={18} strokeWidth={3} />
            Dispatch Push Alert
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Provisioned Devices" value="12,560" icon={Smartphone} color="primary" />
        <StatCard label="App Session Avg" value="4m 32s" icon={Activity} color="green" />
        <StatCard label="System Crash Rate" value="0.02%" icon={AlertCircle} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2" title="Release Version Control" description="Track app adoption and manage active binary versions across stores.">
          <div className="overflow-x-auto -mx-8">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/50 border-y border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-[0.15em]">
                <tr>
                  <th className="px-8 py-4">Environment</th>
                  <th className="px-8 py-4">Build #</th>
                  <th className="px-8 py-4">Deployment</th>
                  <th className="px-8 py-4">Market Share</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {versions.map((v, i) => (
                  <tr key={i} className="hover:bg-slate-50/30 transition-colors group cursor-pointer">
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center border transition-all group-hover:scale-105 shadow-sm",
                            v.platform === 'iOS' ? "bg-slate-900 text-white border-slate-800" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                          )}>
                            <Smartphone size={18} strokeWidth={2.5} />
                          </div>
                          <span className="font-black text-slate-900 tracking-tight leading-none">{v.platform}</span>
                       </div>
                    </td>
                    <td className="px-8 py-5 text-slate-600 font-mono font-bold text-xs">v{v.version}</td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        v.status === 'Stable' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : 
                        v.status === 'Updating' ? "bg-primary-50 text-primary-700 border-primary-100" : 
                        "bg-rose-50 text-rose-700 border-rose-100"
                      )}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                          <div className="bg-primary-500 h-full rounded-full" style={{ width: v.users }} />
                        </div>
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">{v.users}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button title="Rollback Version" className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all">
                          <RefreshCw size={18} strokeWidth={2.5} />
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
          <Card title="Mobile API Integrity" description="Real-time backend response metrics.">
            <div className="h-48 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 group">
               <BarChart2 size={40} className="mb-4 opacity-20 transition-transform group-hover:scale-110 duration-500" strokeWidth={1.5} />
               <p className="text-[10px] font-black uppercase tracking-[0.2em]">Stream Processing...</p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
               <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                  <p className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-widest">Avg Latency</p>
                  <p className="text-xl font-black text-slate-900 leading-none tracking-tighter">124ms</p>
               </div>
               <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                  <p className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-widest">Store Uptime</p>
                  <p className="text-xl font-black text-emerald-600 leading-none tracking-tighter">99.9%</p>
               </div>
            </div>
          </Card>

          <Card title="Feature Orchestration" description="Enable/Disable modules in real-time.">
            <div className="space-y-3">
               {[
                 { label: 'Biometric Auth', enabled: true },
                 { label: 'Dark Mode Beta', enabled: false },
                 { label: 'Instant Settlement', enabled: true },
                 { label: 'Virtual Assets', enabled: false },
               ].map((f, i) => (
                 <div key={i} className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl bg-slate-50/50 group hover:bg-white transition-all">
                    <div className="flex items-center gap-3">
                       <div className={cn("w-1.5 h-1.5 rounded-full", f.enabled ? "bg-emerald-500" : "bg-slate-300")}></div>
                       <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{f.label}</span>
                    </div>
                    <button className={cn(
                      "w-10 h-5 rounded-full transition-all relative border-2",
                      f.enabled ? "bg-primary-600 border-primary-600 shadow-sm shadow-primary-200" : "bg-slate-200 border-slate-200"
                    )}>
                      <div className={cn(
                        "absolute top-0.5 bg-white w-3 h-3 rounded-full transition-all shadow-sm",
                        f.enabled ? "right-0.5" : "left-0.5"
                      )} />
                    </button>
                 </div>
               ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MobilePage;
