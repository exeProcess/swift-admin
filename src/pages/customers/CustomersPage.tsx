import { useState, useEffect } from 'react';
import { PageHeader, Card } from '../../components/layout/Common';
import {
  Search, Filter, UserPlus, CheckCircle2, XCircle, Clock, Download,
  Eye, Edit2, Unlock, MoreHorizontal, ChevronRight, ShieldCheck, X,
  Mail, User, Phone, Wallet, EyeOff, Smartphone, CreditCard,
  History, FileText, Bell, Lock, RefreshCw, AlertTriangle, Ban, Plus, Loader2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { api } from '../../lib/api';

const CustomersPage = () => {
  const [customers, setCustomers]           = useState<any[]>([]);
  const [loading, setLoading]               = useState(true);
  const [searchTerm, setSearchTerm]         = useState('');
  const [showBalance, setShowBalance]       = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<'profile'|'kyc'|'devices'|'accounts'|'transactions'>('profile');
  const [customerTxns, setCustomerTxns]     = useState<any[]>([]);
  const [customerDevices, setCustomerDevices] = useState<any[]>([]);
  const [actionLoading, setActionLoading]   = useState('');

  useEffect(() => {
    api.getCustomers()
      .then(d => setCustomers(d.customers || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openProfile = async (c: any) => {
    setSelectedCustomer(c);
    setActiveProfileTab('profile');
    setCustomerTxns([]);
    setCustomerDevices([]);
    // Preload txns and devices
    api.getCustomerTxns(c.id).then(d => setCustomerTxns(d.transactions || [])).catch(() => {});
    api.getCustomerDevices(c.id).then(d => setCustomerDevices(d.devices || [])).catch(() => {});
  };

  const handlePnd = async (customerId: string, pnd: boolean) => {
    setActionLoading('pnd');
    try {
      await api.togglePnd(customerId, pnd);
      setCustomers(cs => cs.map(c => c.id === customerId ? { ...c, wallet: { ...c.wallet, pndActive: pnd } } : c));
      setSelectedCustomer((prev: any) => prev ? { ...prev, wallet: { ...prev.wallet, pndActive: pnd } } : prev);
    } catch (e: any) { alert(e.message); }
    setActionLoading('');
  };

  const handleSuspend = async (customerId: string, suspend: boolean) => {
    setActionLoading('suspend');
    try {
      await api.suspendCustomer(customerId, suspend);
      setCustomers(cs => cs.map(c => c.id === customerId ? { ...c, isActive: !suspend } : c));
      setSelectedCustomer((prev: any) => prev ? { ...prev, isActive: !suspend } : prev);
    } catch (e: any) { alert(e.message); }
    setActionLoading('');
  };

  const handleUnlockPin = async (customerId: string) => {
    setActionLoading('unlock');
    try {
      await api.unlockPin(customerId);
      alert('PIN unlocked successfully');
    } catch (e: any) { alert(e.message); }
    setActionLoading('');
  };

  const handleUpgrade = async (customerId: string, level: string) => {
    setActionLoading('upgrade');
    try {
      await api.upgradeCustomer(customerId, level);
      setCustomers(cs => cs.map(c => c.id === customerId ? { ...c, wallet: { ...c.wallet, accessLevel: level } } : c));
      setSelectedCustomer((prev: any) => prev ? { ...prev, wallet: { ...prev.wallet, accessLevel: level } } : prev);
      alert(`Upgraded to Tier ${level}`);
    } catch (e: any) { alert(e.message); }
    setActionLoading('');
  };

  const filtered = customers.filter(c => {
    const q = searchTerm.toLowerCase();
    return !q ||
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phoneNumber1?.includes(q);
  });

  const kycLabel = (w: any) => {
    if (!w) return 'Tier 1';
    return `Tier ${w.accessLevel || 1}`;
  };

  const statusLabel = (c: any) => {
    if (!c.isActive) return 'Suspended';
    return 'Active';
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={32} className="animate-spin text-primary-500" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Customer Directory"
        description="Comprehensive 360° view and lifecycle management of bank customers."
        actions={
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:shadow-sm transition-all bg-slate-50/50">
              <Download size={16} strokeWidth={3} /> Export
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Verified',     value: customers.filter(c => c.isActive).length, icon: ShieldCheck, color: 'emerald' },
          { label: 'Suspended',          value: customers.filter(c => !c.isActive).length, icon: XCircle,    color: 'rose'    },
          { label: 'With PND',           value: customers.filter(c => c.wallet?.pndActive).length, icon: Clock, color: 'amber' },
          { label: 'Tier 3',             value: customers.filter(c => c.wallet?.accessLevel === '3').length, icon: Unlock, color: 'primary' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center border",
              stat.color === 'emerald' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
              stat.color === 'amber'   ? "bg-amber-50 border-amber-100 text-amber-600" :
              stat.color === 'rose'    ? "bg-rose-50 border-rose-100 text-rose-600" :
              "bg-primary-50 border-primary-100 text-primary-600"
            )}>
              <stat.icon size={20} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">{stat.label}</p>
              <p className="text-xl font-black text-slate-900 leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="relative w-full max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowBalance(!showBalance)} className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
              {showBalance ? <EyeOff size={14} /> : <Eye size={14} />}
              {showBalance ? 'Hide Balances' : 'Show Balances'}
            </button>
            <button className="p-3 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-8">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/50 border-y border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-[0.15em]">
              <tr>
                <th className="px-8 py-4">Customer</th>
                <th className="px-8 py-4">KYC Tier</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Balance</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(c => (
                <tr key={c.id} onClick={() => openProfile(c)} className="hover:bg-slate-50/30 transition-colors group cursor-pointer">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-black border-2 border-white ring-1 ring-slate-200 shadow-sm group-hover:ring-primary-400 transition-all">
                        {`${c.firstName?.[0] || ''}${c.lastName?.[0] || ''}`}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 tracking-tight leading-none">{c.firstName} {c.lastName}</p>
                        <p className="text-xs text-slate-400 font-bold tracking-tight mt-1">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 text-primary-700 rounded-full text-[10px] font-black uppercase tracking-wider border border-primary-100 w-fit">
                      <CheckCircle2 size={12} strokeWidth={3} /> {kycLabel(c.wallet)}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      c.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"
                    )}>
                      {statusLabel(c)}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-mono font-bold text-slate-900 tracking-tighter">
                    {showBalance
                      ? `₦${Number(c.wallet?.accountBalance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`
                      : '••••••••'}
                  </td>
                  <td className="px-8 py-5 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openProfile(c)} title="View Profile" className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                        <Eye size={18} strokeWidth={2.5} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                        <MoreHorizontal size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-8 py-12 text-center text-slate-400 font-bold text-xs uppercase">No customers found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-8">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
            Showing <span className="text-slate-900">{filtered.length}</span> of <span className="text-slate-900">{customers.length}</span> customers
          </p>
        </div>
      </Card>

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="relative h-40 bg-slate-900 shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-transparent" />
              <button onClick={() => setSelectedCustomer(null)} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white z-10">
                <X size={20} />
              </button>
              <div className="absolute -bottom-16 left-10 flex items-end gap-6">
                <div className="w-32 h-32 rounded-3xl bg-white p-1.5 shadow-2xl">
                  <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-black text-4xl border border-slate-100">
                    {`${selectedCustomer.firstName?.[0] || ''}${selectedCustomer.lastName?.[0] || ''}`}
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="text-3xl font-black text-white tracking-tight leading-none">{selectedCustomer.firstName} {selectedCustomer.lastName}</h3>
                  <p className="text-sm text-slate-400 font-bold mt-2 uppercase tracking-widest">{selectedCustomer.email}</p>
                </div>
              </div>
            </div>

            <div className="mt-20 px-10 border-b border-slate-100 flex gap-6 shrink-0 overflow-x-auto">
              {[
                { id: 'profile',       label: 'Overview',    icon: User       },
                { id: 'transactions',  label: 'History',     icon: History    },
                { id: 'devices',       label: 'Devices',     icon: Smartphone },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveProfileTab(tab.id as any)}
                  className={cn("flex items-center gap-2.5 py-5 text-xs font-black uppercase tracking-widest transition-all relative whitespace-nowrap",
                    activeProfileTab === tab.id ? "text-primary-600" : "text-slate-400 hover:text-slate-600"
                  )}>
                  <tab.icon size={16} strokeWidth={2.5} />
                  {tab.label}
                  {activeProfileTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 rounded-t-full" />}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-10">
              {activeProfileTab === 'profile' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-3 gap-6">
                    {[
                      { label: 'Balance',    value: `₦${Number(selectedCustomer.wallet?.accountBalance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}` },
                      { label: 'KYC Tier',   value: kycLabel(selectedCustomer.wallet) },
                      { label: 'Status',     value: statusLabel(selectedCustomer) },
                    ].map((card, i) => (
                      <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{card.label}</p>
                        <p className="text-lg font-black text-slate-900">{card.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-5 flex items-center gap-2">
                        <User size={18} className="text-primary-600" /> Basic Information
                      </h4>
                      <div className="space-y-4">
                        {[
                          { label: 'Full Name',  value: `${selectedCustomer.firstName} ${selectedCustomer.middleName || ''} ${selectedCustomer.lastName}`.trim(), icon: User },
                          { label: 'Email',      value: selectedCustomer.email,        icon: Mail  },
                          { label: 'Phone',      value: selectedCustomer.phoneNumber1, icon: Phone },
                          { label: 'Account No', value: selectedCustomer.wallet?.accountNumber || '—', icon: CreditCard },
                        ].map((item, i) => (
                          <div key={i} className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
                              <item.icon size={18} strokeWidth={2.5} />
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                              <p className="text-sm font-bold text-slate-900">{item.value || '—'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-5 flex items-center gap-2">
                        <Lock size={18} className="text-rose-600" /> Administrative Controls
                      </h4>
                      <div className="space-y-3">
                        <button disabled={actionLoading === 'pnd'}
                          onClick={() => handlePnd(selectedCustomer.id, !selectedCustomer.wallet?.pndActive)}
                          className={cn("w-full flex items-center justify-between p-5 rounded-2xl border transition-all active:scale-95",
                            selectedCustomer.wallet?.pndActive ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"
                          )}>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border">
                              {actionLoading === 'pnd' ? <Loader2 size={18} className="animate-spin" /> : <Ban size={18} strokeWidth={2.5} />}
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-black uppercase tracking-widest leading-none mb-1">{selectedCustomer.wallet?.pndActive ? 'Disable PND' : 'Enable PND'}</p>
                              <p className="text-[10px] opacity-70 font-bold uppercase tracking-tight">Debit restriction</p>
                            </div>
                          </div>
                          <ChevronRight size={18} />
                        </button>

                        <button disabled={actionLoading === 'suspend'}
                          onClick={() => handleSuspend(selectedCustomer.id, selectedCustomer.isActive)}
                          className="w-full flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 hover:bg-slate-100 transition-all active:scale-95">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm text-amber-600">
                              {actionLoading === 'suspend' ? <Loader2 size={18} className="animate-spin" /> : <AlertTriangle size={18} strokeWidth={2.5} />}
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-black uppercase tracking-widest leading-none mb-1">{selectedCustomer.isActive ? 'Suspend Account' : 'Reactivate Account'}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Toggle account status</p>
                            </div>
                          </div>
                          <ChevronRight size={18} />
                        </button>

                        <button disabled={actionLoading === 'unlock'}
                          onClick={() => handleUnlockPin(selectedCustomer.id)}
                          className="w-full flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 hover:bg-slate-100 transition-all active:scale-95">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm text-primary-600">
                              {actionLoading === 'unlock' ? <Loader2 size={18} className="animate-spin" /> : <Unlock size={18} strokeWidth={2.5} />}
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-black uppercase tracking-widest leading-none mb-1">Unlock PIN</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Clear login lockout</p>
                            </div>
                          </div>
                          <ChevronRight size={18} />
                        </button>

                        <div className="pt-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Upgrade KYC Tier</p>
                          <div className="flex gap-2">
                            {['1','2','3'].map(level => (
                              <button key={level} disabled={actionLoading === 'upgrade' || selectedCustomer.wallet?.accessLevel === level}
                                onClick={() => handleUpgrade(selectedCustomer.id, level)}
                                className={cn("flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border",
                                  selectedCustomer.wallet?.accessLevel === level
                                    ? "bg-primary-600 text-white border-primary-600"
                                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-primary-50 hover:border-primary-200"
                                )}>
                                Tier {level}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeProfileTab === 'transactions' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-black text-slate-900">Transaction History</h4>
                  <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-[0.15em]">
                        <tr>
                          <th className="px-6 py-4">Reference</th>
                          <th className="px-6 py-4">Type</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {customerTxns.map((t, i) => (
                          <tr key={i} className="hover:bg-slate-50/30">
                            <td className="px-6 py-4 font-mono font-bold text-slate-700 text-xs">{t.transactionReference || t.id?.slice(0,8)}</td>
                            <td className="px-6 py-4 text-[10px] font-black uppercase text-slate-500">{t.transactionType}</td>
                            <td className="px-6 py-4 font-mono font-black text-slate-900 text-xs">₦{Number(t.amount).toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <span className={cn("px-2 py-0.5 rounded text-[9px] font-black uppercase border",
                                t.transactionStatus === 'SUCCESS' ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : t.transactionStatus === 'FAILED' ? "bg-rose-50 text-rose-700 border-rose-100"
                                : "bg-amber-50 text-amber-700 border-amber-100"
                              )}>{t.transactionStatus}</span>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-400 font-bold">
                              {new Date(t.createdAt).toLocaleDateString('en-NG')}
                            </td>
                          </tr>
                        ))}
                        {customerTxns.length === 0 && (
                          <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-bold text-xs uppercase">No transactions</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeProfileTab === 'devices' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-black text-slate-900">Trusted Devices</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {customerDevices.map((d, i) => (
                      <div key={i} className="p-6 bg-white border border-slate-100 rounded-2xl hover:border-primary-200 transition-all group">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
                            <Smartphone size={24} />
                          </div>
                          <button onClick={() => api.revokeDevice(selectedCustomer.id, d.deviceFingerprint).then(() => setCustomerDevices(ds => ds.filter(x => x.id !== d.id)))}
                            className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                            <Ban size={16} />
                          </button>
                        </div>
                        <h5 className="font-black text-slate-900">{d.deviceLabel || d.platform || 'Unknown Device'}</h5>
                        <p className="text-xs text-slate-400 font-bold mt-1">{d.deviceFingerprint?.slice(0, 16)}...</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-3 uppercase tracking-tight">
                          Last seen {new Date(d.updatedAt).toLocaleDateString('en-NG')}
                        </p>
                      </div>
                    ))}
                    {customerDevices.length === 0 && (
                      <div className="col-span-2 py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center">
                        <Smartphone size={40} className="text-slate-200 mb-3" />
                        <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No trusted devices</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setSelectedCustomer(null)} className="px-8 py-3.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-50 transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
