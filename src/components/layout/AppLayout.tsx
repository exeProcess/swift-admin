import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Smartphone, 
  ShieldCheck, 
  Send, 
  AlertTriangle, 
  LifeBuoy, 
  Settings,
  ChevronRight,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '../../lib/utils';
import mainLogo from '../../assets/main_logo.svg';
import collapsedLogo from '../../assets/logo.jpg';

const Sidebar = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/' },
    { name: 'Access Control', icon: ShieldCheck, path: '/access' },
    { name: 'Customers', icon: Users, path: '/customers' },
    { name: 'Card & ATM', icon: CreditCard, path: '/cards' },
    { name: 'Mobile App', icon: Smartphone, path: '/mobile' },
    { name: 'Payments & Transfers', icon: Send, path: '/payments' },
    { name: 'Fraud & Risk', icon: AlertTriangle, path: '/fraud' },
    { name: 'Support Tools', icon: LifeBuoy, path: '/support' },
    { name: 'System Config', icon: Settings, path: '/config' },
  ];

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-full bg-primary-950 text-primary-100 transition-all duration-300 z-20 shadow-2xl",
      isOpen ? "w-64" : "w-20"
    )}>
      <div className="flex items-center justify-center p-4 h-24 border-b border-primary-900 bg-white">
        <div className={cn("flex items-center justify-center transition-all duration-300", !isOpen ? "w-12 h-12 overflow-hidden rounded-lg shadow-sm" : "w-auto")}>
          {isOpen ? (
            <img 
              src={mainLogo} 
              alt="Swift Trust Logo" 
              className="h-14 w-auto" 
            />
          ) : (
            <img 
              src={collapsedLogo} 
              alt="ST" 
              className="h-full w-full object-cover" 
            />
          )}
        </div>
      </div>
      
      <div className="absolute -right-3 top-9 z-30">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="flex h-6 w-6 items-center justify-center rounded-full border border-primary-800 bg-primary-900 text-primary-300 hover:text-white transition-colors shadow-lg"
        >
          {isOpen ? <X size={14} /> : <Menu size={14} />}
        </button>
      </div>

      <nav className="p-3 flex flex-col gap-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 p-3 rounded-xl transition-all group relative",
              isActive 
                ? "bg-primary-600 text-white shadow-lg shadow-black/40" 
                : "text-primary-300/70 hover:bg-primary-900 hover:text-white"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} className={cn("shrink-0 transition-transform", !isActive && "group-hover:scale-110")} />
                <span className={cn("text-sm font-bold whitespace-nowrap transition-all duration-300", !isOpen && "opacity-0 invisible w-0 -translate-x-2.5")}>
                  {item.name}
                </span>
                {isOpen && <ChevronRight size={14} className={cn("ml-auto transition-opacity", isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100")} />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-primary-900 bg-black/20">
        <button onClick={() => { logout(); navigate('/login'); }} className={cn(
          "flex items-center gap-3 w-full p-3 rounded-xl text-rose-300 hover:bg-rose-500/20 transition-all group",
          !isOpen && "justify-center"
        )}>
          <LogOut size={20} className="shrink-0 group-hover:-translate-x-1 transition-transform" />
          {isOpen && <span className="text-sm font-bold uppercase tracking-widest">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

const Header = () => {
  const { admin } = useAuth();
  return (
    <header className="fixed top-0 right-0 left-0 bg-white border-b border-slate-200 h-16 z-10 transition-all duration-300">
      <div className="h-full flex items-center justify-between px-6 ml-20 md:ml-64">
        <div className="flex items-center gap-4 w-1/3">
          <div className="relative w-full max-w-md hidden md:block">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search customers, txn, vault..." 
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-col items-end mr-2 hidden sm:flex text-right">
             <span className="text-[9px] font-black text-primary-600 uppercase tracking-[0.25em] leading-none mb-1">Server Status</span>
             <div className="flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Synchronized</span>
             </div>
          </div>

          <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>

          <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl relative transition-all active:scale-90">
            <Bell size={20} strokeWidth={2.5} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white shadow-sm"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-2 cursor-pointer group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-900 leading-tight tracking-tight">{admin?.name || 'Admin'}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight mt-0.5">{admin?.role || 'Staff'}</p>
            </div>
            <div className="w-11 h-11 bg-slate-100 border-2 border-white ring-1 ring-slate-200 rounded-2xl flex items-center justify-center text-slate-600 group-hover:ring-primary-500 transition-all overflow-hidden shadow-sm">
               <User size={24} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Header />
      <main className="transition-all duration-300 pt-16 ml-20 md:ml-64 min-h-screen">
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
