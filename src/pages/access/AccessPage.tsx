import { useState, useEffect } from 'react';
import { PageHeader, Card, StatCard } from '../../components/layout/Common';
import { ShieldCheck, Users, Key, Fingerprint, History, Lock, ShieldAlert, Settings, UserCheck, Zap, UserPlus, Mail, Shield, X, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { api } from '../../lib/api';

const AccessPage = () => {
  const [activeTab, setActiveTab] = useState<'roles' | 'members'>('roles');
  const [staff, setStaff]         = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', password: '', role: 'Staff' });
  const [error, setError]         = useState('');

  useEffect(() => {
    api.getStaff()
      .then(d => setStaff(d.staff || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const created = await api.registerStaff(newMember as any);
      setStaff(s => [...s, created]);
      setShowAddMember(false);
      setNewMember({ name: '', email: '', password: '', role: 'Staff' });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const roles = [
    { name: 'Superadmin',     permissions: 'Full Access (System Wide)',          color: 'primary' },
    { name: 'Staff',          permissions: 'Customer Mgmt, Card Operations',     color: 'primary' },
    { name: 'Credit Manager', permissions: 'Loan Approvals, Credit Assessment',  color: 'emerald' },
  ];

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 size={32} className="animate-spin text-primary-500" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Access Control & Governance"
        description="Enterprise RBAC, security policy configuration, and administrative audit trails."
        actions={
          activeTab === 'members' ? (
            <button onClick={() => setShowAddMember(true)} className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-700 shadow-lg shadow-primary-200 active:scale-95 transition-all">
              <UserPlus size={18} strokeWidth={3} /> Add Member
            </button>
          ) : null
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Authorized Admins" value={staff.length}                                   icon={Users}       color="primary" />
        <StatCard label="Active Staff"       value={staff.filter(s => s.isActive).length}          icon={Key}         color="emerald" />
        <StatCard label="Superadmins"        value={staff.filter(s => s.role === 'Superadmin').length} icon={ShieldAlert} color="rose"   />
      </div>

      <div className="flex border-b border-slate-200">
        {(['roles', 'members'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn("px-8 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative",
              activeTab === tab ? "text-primary-600" : "text-slate-400 hover:text-slate-600"
            )}>
            {tab === 'roles' ? 'Roles & Permissions' : 'Team Members'}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 rounded-t-full" />}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2" title={activeTab === 'roles' ? 'Administrative Hierarchy' : 'Institution Members'}>
          {activeTab === 'roles' ? (
            <div className="overflow-x-auto -mx-8">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50/50 border-y border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-[0.15em]">
                  <tr>
                    <th className="px-8 py-4">Role</th>
                    <th className="px-8 py-4">Permissions</th>
                    <th className="px-8 py-4">Members</th>
                    <th className="px-8 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {roles.map((role, i) => (
                    <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-2 h-2 rounded-full", role.color === 'primary' ? "bg-primary-500" : "bg-emerald-500")} />
                          <span className="font-black text-slate-900">{role.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-slate-500 font-bold text-xs">{role.permissions}</td>
                      <td className="px-8 py-5 font-mono font-black text-xs text-slate-900">
                        {String(staff.filter(s => s.role === role.name).length).padStart(2, '0')}
                      </td>
                      <td className="px-8 py-5">
                        <span className="inline-flex px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-8">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50/50 border-y border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-[0.15em]">
                  <tr>
                    <th className="px-8 py-4">Member</th>
                    <th className="px-8 py-4">Role</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {staff.map((member, i) => (
                    <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-black text-xs border border-slate-200">
                            {member.name?.split(' ').map((n: string) => n[0]).join('').slice(0,2)}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 leading-none">{member.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold mt-1">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-2.5 py-1 bg-primary-50 text-primary-700 rounded-lg text-[10px] font-black uppercase tracking-wider border border-primary-100">{member.role}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={cn("inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                          member.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"
                        )}>{member.isActive ? 'Active' : 'Inactive'}</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"><Settings size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {staff.length === 0 && (
                    <tr><td colSpan={4} className="px-8 py-12 text-center text-slate-400 font-bold text-xs uppercase">No staff found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <div className="space-y-8">
          <Card title="Security Protocols" description="Core system protection layers.">
            <div className="space-y-4">
              {[
                { label: 'Two-Factor (MFA)',  icon: Fingerprint, enabled: true  },
                { label: 'Session Hardening', icon: History,     enabled: true  },
                { label: 'Deep Audit Logs',   icon: Lock,        enabled: true  },
                { label: 'IP Allowlisting',   icon: ShieldCheck, enabled: false },
              ].map((policy, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center border-2",
                      policy.enabled ? "bg-white text-primary-600 border-primary-50" : "bg-slate-100 text-slate-400 border-slate-200 opacity-60"
                    )}>
                      <policy.icon size={20} strokeWidth={2.5} />
                    </div>
                    <p className="text-sm font-black text-slate-900">{policy.label}</p>
                  </div>
                  <div className={cn("w-10 h-5 rounded-full relative border-2",
                    policy.enabled ? "bg-primary-600 border-primary-600" : "bg-slate-200 border-slate-200"
                  )}>
                    <div className={cn("absolute top-0.5 bg-white w-3 h-3 rounded-full shadow-sm", policy.enabled ? "right-0.5" : "left-0.5")} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="bg-slate-900 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12"><UserCheck size={140} /></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={16} className="text-amber-400 fill-amber-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Protocol</span>
              </div>
              <h4 className="text-lg font-black tracking-tight mb-2">Maker-Checker</h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6 opacity-80">Financial operations require dual-factor authorization from a Secondary Admin.</p>
              <button className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all">Configure Approval Matrix</button>
            </div>
          </div>
        </div>
      </div>

      {showAddMember && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Onboard Team Member</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">Assign roles and permissions to new personnel.</p>
              </div>
              <button onClick={() => setShowAddMember(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={20} className="text-slate-400" /></button>
            </div>

            <form onSubmit={handleAddMember} className="p-8 space-y-5">
              {error && <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-sm font-bold">{error}</div>}

              {[
                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Alexander Pierce', icon: Users },
                { label: 'Work Email', key: 'email', type: 'email', placeholder: 'name@swifttrust.com', icon: Mail },
                { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••', icon: Lock },
              ].map(field => (
                <div key={field.key} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{field.label}</label>
                  <div className="relative">
                    <field.icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input required type={field.type} placeholder={field.placeholder}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                      value={(newMember as any)[field.key]} onChange={e => setNewMember({ ...newMember, [field.key]: e.target.value })} />
                  </div>
                </div>
              ))}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Role</label>
                <div className="relative">
                  <Shield size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none appearance-none"
                    value={newMember.role} onChange={e => setNewMember({ ...newMember, role: e.target.value })}>
                    <option value="Staff">Staff</option>
                    <option value="Credit Manager">Credit Manager</option>
                    <option value="Superadmin">Superadmin</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddMember(false)} className="flex-1 py-4 bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-100 transition-all">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-4 bg-primary-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-primary-700 shadow-xl shadow-primary-200 transition-all active:scale-95 flex items-center justify-center gap-2">
                  {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : 'Confirm Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessPage;
