import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from './api';

interface AdminUser {
  token: string;
  role: string;
  name: string;
  email: string;
}

interface AuthContextType {
  admin: AdminUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('admin_token');
    const name   = localStorage.getItem('admin_name') || '';
    const role   = localStorage.getItem('admin_role') || '';
    const email  = localStorage.getItem('admin_email') || '';
    if (stored) setAdmin({ token: stored, name, role, email });
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password);
    localStorage.setItem('admin_token', data.token);
    localStorage.setItem('admin_name',  data.name);
    localStorage.setItem('admin_role',  data.role);
    localStorage.setItem('admin_email', data.email);
    setAdmin(data);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_name');
    localStorage.removeItem('admin_role');
    localStorage.removeItem('admin_email');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
