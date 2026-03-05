import React from 'react';
import { cn } from '../../lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">{title}</h1>
        {description && <p className="text-slate-500 mt-2 text-sm font-medium">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};

export const Card: React.FC<{ children: React.ReactNode; title?: string; description?: string; className?: string }> = ({ 
  children, 
  title, 
  description,
  className 
}) => {
  return (
    <div className={cn("bg-white rounded-2xl border border-slate-200 shadow-sm shadow-slate-200/50 overflow-hidden", className)}>
      {(title || description) && (
        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div>
            {title && <h3 className="text-base font-bold text-slate-900 leading-none">{title}</h3>}
            {description && <p className="text-slate-500 text-xs mt-1.5 font-medium">{description}</p>}
          </div>
        </div>
      )}
      <div className="p-8">
        {children}
      </div>
    </div>
  );
};

export const StatCard: React.FC<{ 
  label: string; 
  value: string | number; 
  change?: string; 
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
  color?: string;
}> = ({ label, value, change, trend, icon: Icon, color = "primary" }) => {
  const colorMap = {
    primary: "bg-primary-50 text-primary-600 border-primary-100 ring-primary-500/10",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 ring-emerald-500/10",
    amber: "bg-amber-50 text-amber-600 border-amber-100 ring-amber-500/10",
    rose: "bg-rose-50 text-rose-600 border-rose-100 ring-rose-500/10",
    slate: "bg-slate-50 text-slate-600 border-slate-100 ring-slate-500/10",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm shadow-slate-200/50 flex items-center gap-5 transition-all hover:border-slate-300 group">
      <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center border ring-4 transition-transform group-hover:scale-105", colorMap[color as keyof typeof colorMap] || colorMap.primary)}>
        <Icon size={28} strokeWidth={2.5} />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
        <p className="text-2xl font-black text-slate-900 tracking-tight leading-none">{value}</p>
        {change && (
          <div className="flex items-center gap-1.5 mt-2">
            <span className={cn(
              "text-[10px] font-black px-1.5 py-0.5 rounded tracking-wide",
              trend === 'up' ? "bg-emerald-100 text-emerald-700" : 
              trend === 'down' ? "bg-rose-100 text-rose-700" : 
              "bg-slate-100 text-slate-700"
            )}>
              {trend === 'up' && '+'}
              {change}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">vs prev month</span>
          </div>
        )}
      </div>
    </div>
  );
};
