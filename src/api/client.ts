import type {
  Product,
  Customer,
  Supplier,
  Invoice,
  PurchaseOrder,
  StockMovement,
  Expense,
  UserProfile,
  CompanySettings,
  SystemNotification,
  CashDrawerShift,
  CartItem,
  InvoicePayment,
} from '../types';

export interface AppBootstrap {
  settings: CompanySettings;
  users: UserProfile[];
  products: Product[];
  categories: string[];
  customers: Customer[];
  suppliers: Supplier[];
  invoices: Invoice[];
  purchaseOrders: PurchaseOrder[];
  stockMovements: StockMovement[];
  expenses: Expense[];
  notifications: SystemNotification[];
  currentShift: CashDrawerShift;
  heldInvoices: Invoice[];
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export const api = {
  health: () => request<{ ok: boolean }>('/health'),
  bootstrap: () => request<AppBootstrap>('/bootstrap'),
  saveState: (state: Partial<AppBootstrap>) =>
    request<AppBootstrap>('/state', { method: 'PUT', body: JSON.stringify(state) }),

  updateSettings: (settings: CompanySettings) =>
    request<CompanySettings>('/settings', { method: 'PUT', body: JSON.stringify(settings) }),

  replaceCollection: <K extends keyof AppBootstrap>(key: K, value: AppBootstrap[K]) =>
    request<AppBootstrap[K]>(`/${String(key)}`, { method: 'PUT', body: JSON.stringify(value) }),

  checkout: (payload: {
    cart: CartItem[];
    payments: InvoicePayment[];
    notes?: string;
    customerId: string;
    invoiceDiscount?: number;
    invoiceDiscountType?: 'fixed' | 'percentage';
    cashierName: string;
  }) =>
    request<{ invoice: Invoice; store: AppBootstrap }>('/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  receivePurchaseOrder: (id: string, performedBy: string) =>
    request<{ po: PurchaseOrder; store: AppBootstrap }>(`/purchase-orders/${id}/receive`, {
      method: 'POST',
      body: JSON.stringify({ performedBy }),
    }),

  createPurchaseOrder: (po: Omit<PurchaseOrder, 'id'>) =>
    request<PurchaseOrder>('/purchase-orders', { method: 'POST', body: JSON.stringify(po) }),

  addStockMovement: (movement: Omit<StockMovement, 'id' | 'date'>) =>
    request<{ movement: StockMovement; store: AppBootstrap }>('/stock-movements', {
      method: 'POST',
      body: JSON.stringify(movement),
    }),

  closeShift: (actualCash: number, notes?: string) =>
    request<CashDrawerShift>('/shifts/close', {
      method: 'POST',
      body: JSON.stringify({ actualCash, notes }),
    }),

  openShift: (openingCash: number, cashierName: string) =>
    request<CashDrawerShift>('/shifts/open', {
      method: 'POST',
      body: JSON.stringify({ openingCash, cashierName }),
    }),

  partLookup: (query: string, language: 'ar' | 'en' = 'ar') =>
    request<{ result: unknown }>('/ai/part-lookup', {
      method: 'POST',
      body: JSON.stringify({ query, language }),
    }),
};
