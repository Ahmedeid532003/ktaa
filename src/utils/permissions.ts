import type { RoleType, UserPermission, UserProfile } from '../types';

export type ModuleType =
  | 'dashboard'
  | 'pos'
  | 'products'
  | 'inventory'
  | 'sales'
  | 'purchases'
  | 'customers'
  | 'suppliers'
  | 'expenses'
  | 'financial'
  | 'reports'
  | 'notifications'
  | 'users'
  | 'settings';

export const ALL_MODULES: ModuleType[] = [
  'dashboard',
  'pos',
  'products',
  'inventory',
  'sales',
  'purchases',
  'customers',
  'suppliers',
  'expenses',
  'financial',
  'reports',
  'notifications',
  'users',
  'settings',
];

export const DEFAULT_ROLE_PERMISSIONS: Record<RoleType, UserPermission> = {
  super_admin: {
    view: true, add: true, edit: true, delete: true, print: true,
    export: true, discount: true, priceChange: true, returnItem: true, closeDay: true,
  },
  owner: {
    view: true, add: true, edit: true, delete: true, print: true,
    export: true, discount: true, priceChange: true, returnItem: true, closeDay: true,
  },
  manager: {
    view: true, add: true, edit: true, delete: false, print: true,
    export: true, discount: true, priceChange: true, returnItem: true, closeDay: true,
  },
  cashier: {
    view: true, add: true, edit: false, delete: false, print: true,
    export: false, discount: true, priceChange: false, returnItem: true, closeDay: true,
  },
  sales: {
    view: true, add: true, edit: false, delete: false, print: true,
    export: false, discount: true, priceChange: false, returnItem: false, closeDay: false,
  },
  warehouse: {
    view: true, add: true, edit: true, delete: false, print: true,
    export: true, discount: false, priceChange: false, returnItem: false, closeDay: false,
  },
  accountant: {
    view: true, add: true, edit: true, delete: false, print: true,
    export: true, discount: false, priceChange: false, returnItem: true, closeDay: true,
  },
};

export const DEFAULT_ROLE_MODULES: Record<RoleType, ModuleType[]> = {
  super_admin: [...ALL_MODULES],
  owner: [...ALL_MODULES],
  manager: ALL_MODULES.filter((m) => m !== 'users'),
  cashier: ['dashboard', 'pos', 'sales', 'customers', 'products', 'notifications', 'financial'],
  sales: ['dashboard', 'pos', 'sales', 'customers', 'products', 'notifications'],
  warehouse: ['dashboard', 'products', 'inventory', 'purchases', 'suppliers', 'notifications'],
  accountant: ['dashboard', 'sales', 'expenses', 'financial', 'reports', 'customers', 'notifications'],
};

export const ROLE_LABELS: Record<RoleType, { ar: string; en: string }> = {
  super_admin: { ar: 'مدير عام النظام', en: 'Super Admin' },
  owner: { ar: 'مالك المؤسسة', en: 'Owner' },
  manager: { ar: 'مدير الفرع', en: 'Branch Manager' },
  cashier: { ar: 'كاشير مبيعات', en: 'Cashier' },
  sales: { ar: 'ممثل مبيعات', en: 'Sales Rep' },
  warehouse: { ar: 'أمين المستودع', en: 'Warehouse' },
  accountant: { ar: 'محاسب مالي', en: 'Accountant' },
};

export function getRoleLabel(role: RoleType, language: 'ar' | 'en'): string {
  return ROLE_LABELS[role]?.[language] || role;
}

export function canAccessModule(user: UserProfile | null | undefined, module: ModuleType): boolean {
  if (!user || user.isActive === false) return false;
  if (user.role === 'super_admin' || user.role === 'owner') return true;
  const modules = user.modules?.length ? user.modules : DEFAULT_ROLE_MODULES[user.role] || [];
  return modules.includes(module);
}

export function hasPermission(user: UserProfile | null | undefined, key: keyof UserPermission): boolean {
  if (!user || user.isActive === false) return false;
  if (user.role === 'super_admin' || user.role === 'owner') return true;
  return Boolean(user.permissions?.[key]);
}

export function normalizeUser(user: UserProfile): UserProfile {
  const role = user.role || 'cashier';
  return {
    ...user,
    username: user.username || user.email?.split('@')[0] || `user_${user.id}`,
    password: user.password || '123456',
    isActive: user.isActive !== false,
    permissions: user.permissions || { ...DEFAULT_ROLE_PERMISSIONS[role] },
    modules: user.modules?.length ? user.modules : [...DEFAULT_ROLE_MODULES[role]],
  };
}
