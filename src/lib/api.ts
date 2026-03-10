const BASE = 'https://swifttrustapi.com/api/admin';

function getToken() {
  return localStorage.getItem('admin_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Request failed');
  return json.data ?? json;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; role: string; name: string; email: string }>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Dashboard
  getStats: () => request<any>('/stats'),
  getActivity: (limit = 10) => request<any>(`/activity?limit=${limit}`),

  // Customers
  getCustomers: () => request<any>('/customers'),
  getCustomerTxns: (id: string) => request<any>(`/customers/${id}/transactions`),
  getCustomerBankOneTxns: (id: string, limit = 50) =>
    request<any>(`/customers/${id}/bankone-txns?numberOfItems=${limit}`),
  getCustomerAddress: (id: string) => request<any>(`/customers/${id}/address`),
  getCustomerDevices: (id: string) => request<any>(`/customers/${id}/devices`),
  updateCustomer: (data: any) => request<any>('/customers', { method: 'PUT', body: JSON.stringify(data) }),
  upgradeCustomer: (customerId: string, accessLevel: string) =>
    request<any>('/customers/upgrade', { method: 'POST', body: JSON.stringify({ customerId, accessLevel }) }),
  togglePnd: (customerId: string, pnd: boolean) =>
    request<any>('/customers/toggle-pnd', { method: 'POST', body: JSON.stringify({ customerId, pnd }) }),
  suspendCustomer: (customerId: string, suspend: boolean) =>
    request<any>('/customers/suspend', { method: 'POST', body: JSON.stringify({ customerId, suspend }) }),
  unlockPin: (customerId: string) =>
    request<any>('/customers/unlock-pin', { method: 'POST', body: JSON.stringify({ customerId }) }),
  revokeDevice: (customerId: string, deviceFingerprint: string) =>
    request<any>('/customers/revoke-device', { method: 'POST', body: JSON.stringify({ customerId, deviceFingerprint }) }),

  // Transactions
  getTransactions: (params?: { status?: string; limit?: number; offset?: number }) => {
    const q = new URLSearchParams();
    if (params?.status) q.set('status', params.status);
    if (params?.limit)  q.set('limit', String(params.limit));
    if (params?.offset) q.set('offset', String(params.offset));
    return request<any>(`/transactions?${q}`);
  },

  // Staff / Access
  getStaff: () => request<any>('/staff'),
  registerStaff: (data: { email: string; password: string; name: string; role: string }) =>
    request<any>('/register-staff', { method: 'POST', body: JSON.stringify(data) }),
  updateStaff: (data: any) => request<any>('/staff', { method: 'PUT', body: JSON.stringify(data) }),

  // Loans
  getLoans: (status?: string) => request<any>(`/loans${status ? `?status=${status}` : ''}`),
  approveLoan: (id: string) => request<any>(`/loans/${id}/approve`, { method: 'POST' }),
  rejectLoan: (id: string, adminNote?: string) =>
    request<any>(`/loans/${id}/reject`, { method: 'POST', body: JSON.stringify({ adminNote }) }),
};
