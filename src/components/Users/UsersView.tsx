import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile, RoleType, UserPermission } from '../../types';
import {
  ALL_MODULES,
  DEFAULT_ROLE_MODULES,
  DEFAULT_ROLE_PERMISSIONS,
  getRoleLabel,
  type ModuleType,
} from '../../utils/permissions';
import {
  ShieldCheck,
  UserPlus,
  Edit2,
  Trash2,
  X,
  Search,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Lock,
} from 'lucide-react';

const PERMISSION_KEYS: { key: keyof UserPermission; labelAr: string; labelEn: string }[] = [
  { key: 'view', labelAr: 'عرض البيانات', labelEn: 'View Records' },
  { key: 'add', labelAr: 'إضافة جديد', labelEn: 'Add New' },
  { key: 'edit', labelAr: 'تعديل السجلات', labelEn: 'Edit Data' },
  { key: 'delete', labelAr: 'حذف السجلات', labelEn: 'Delete Data' },
  { key: 'print', labelAr: 'طباعة الفواتير', labelEn: 'Print Invoices' },
  { key: 'export', labelAr: 'تصدير التقارير', labelEn: 'Export Reports' },
  { key: 'discount', labelAr: 'منح خصومات', labelEn: 'Grant Discounts' },
  { key: 'priceChange', labelAr: 'تعديل الأسعار', labelEn: 'Change Prices' },
  { key: 'returnItem', labelAr: 'عمل مرتجعات', labelEn: 'Process Returns' },
  { key: 'closeDay', labelAr: 'إغلاق الوردية', labelEn: 'Close Shift Day' },
];

const MODULE_LABELS: Record<ModuleType, { ar: string; en: string }> = {
  dashboard: { ar: 'لوحة التحكم', en: 'Dashboard' },
  pos: { ar: 'الكاشير', en: 'POS' },
  products: { ar: 'المنتجات', en: 'Products' },
  inventory: { ar: 'المخزون', en: 'Inventory' },
  sales: { ar: 'المبيعات', en: 'Sales' },
  purchases: { ar: 'المشتريات', en: 'Purchases' },
  customers: { ar: 'العملاء', en: 'Customers' },
  suppliers: { ar: 'الموردين', en: 'Suppliers' },
  expenses: { ar: 'المصروفات', en: 'Expenses' },
  financial: { ar: 'الصندوق', en: 'Cash' },
  reports: { ar: 'التقارير', en: 'Reports' },
  notifications: { ar: 'التنبيهات', en: 'Alerts' },
  users: { ar: 'الموظفين', en: 'Users' },
  settings: { ar: 'الإعدادات', en: 'Settings' },
};

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
];

export const UsersView: React.FC = () => {
  const { users, currentUser, addUser, updateUser, deleteUser, language, canAccess } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '123456',
    role: 'cashier' as RoleType,
    avatar: AVATAR_OPTIONS[0],
    permissions: { ...DEFAULT_ROLE_PERMISSIONS.cashier },
    modules: [...DEFAULT_ROLE_MODULES.cashier] as ModuleType[],
    isActive: true,
  });

  if (!canAccess('users')) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        {language === 'ar' ? 'لا تملك صلاحية إدارة الموظفين' : 'You cannot manage users'}
      </div>
    );
  }

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      username: '',
      password: '123456',
      role: 'cashier',
      avatar: AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)],
      permissions: { ...DEFAULT_ROLE_PERMISSIONS.cashier },
      modules: [...DEFAULT_ROLE_MODULES.cashier],
      isActive: true,
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (u: UserProfile) => {
    setEditingUser(u);
    setFormData({
      name: u.nameAr || u.name,
      email: u.email,
      phone: u.phone || '',
      username: u.username || u.email.split('@')[0],
      password: u.password || '123456',
      role: u.role,
      avatar: u.avatar,
      permissions: { ...u.permissions },
      modules: [...(u.modules || DEFAULT_ROLE_MODULES[u.role])],
      isActive: u.isActive !== false,
    });
    setShowModal(true);
  };

  const handleRoleChange = (newRole: RoleType) => {
    setFormData((prev) => ({
      ...prev,
      role: newRole,
      permissions: { ...DEFAULT_ROLE_PERMISSIONS[newRole] },
      modules: [...DEFAULT_ROLE_MODULES[newRole]],
    }));
  };

  const handleSaveUser = () => {
    if (!formData.name.trim()) return;
    if (!formData.username.trim()) return;
    const payload = {
      name: formData.name.trim(),
      nameAr: formData.name.trim(),
      email: formData.email || `${formData.username}@ak.com`,
      phone: formData.phone,
      username: formData.username.trim().toLowerCase(),
      password: formData.password || '123456',
      role: formData.role,
      avatar: formData.avatar,
      permissions: formData.permissions,
      modules: formData.modules,
      isActive: formData.isActive,
    };
    if (editingUser) updateUser({ ...editingUser, ...payload });
    else addUser(payload);
    setShowModal(false);
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(q) ||
      (u.nameAr && u.nameAr.includes(searchQuery)) ||
      u.email.toLowerCase().includes(q) ||
      (u.username && u.username.toLowerCase().includes(q));
    return matchesSearch && (roleFilter === 'all' || u.role === roleFilter);
  });

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            <span>{language === 'ar' ? 'الموظفين والصلاحيات' : 'Users & Permissions'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'ar'
              ? 'حسابات، كلمات مرور، أقسام مسموحة، وصلاحيات العمليات'
              : 'Accounts, passwords, allowed modules, and action permissions'}
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl"
        >
          <UserPlus className="w-4 h-4" />
          {language === 'ar' ? 'إضافة موظف' : 'Add Employee'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute start-3 top-3 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
            className="w-full ps-9 pe-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold"
        >
          <option value="all">{language === 'ar' ? 'كل الأدوار' : 'All Roles'}</option>
          {(['super_admin', 'manager', 'cashier', 'sales', 'warehouse', 'accountant'] as RoleType[]).map((r) => (
            <option key={r} value={r}>{getRoleLabel(r, language)}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {filteredUsers.map((u) => (
          <div
            key={u.id}
            className={`p-5 rounded-2xl border ${
              u.id === currentUser.id
                ? 'bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-500'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <img src={u.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover" />
                <div>
                  <div className="font-extrabold text-sm">{u.nameAr || u.name}</div>
                  <div className="text-[11px] text-indigo-600 font-bold">{getRoleLabel(u.role, language)}</div>
                  <div className="text-[10px] text-slate-400">@{u.username || u.email.split('@')[0]}</div>
                </div>
              </div>
            </div>
            <div className="space-y-1 text-[11px] text-slate-500 mb-3">
              <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{u.email}</div>
              {u.phone && <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{u.phone}</div>}
              <div className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" />{language === 'ar' ? 'كلمة مرور محددة' : 'Password set'}</div>
            </div>
            <div className="flex flex-wrap gap-1 mb-4">
              {(u.modules || DEFAULT_ROLE_MODULES[u.role]).slice(0, 6).map((m) => (
                <span key={m} className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-bold">
                  {language === 'ar' ? MODULE_LABELS[m].ar : MODULE_LABELS[m].en}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleOpenEditModal(u)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
                <Edit2 className="w-3.5 h-3.5" />{language === 'ar' ? 'تعديل' : 'Edit'}
              </button>
              <button
                onClick={() => u.id !== currentUser.id && deleteUser(u.id)}
                disabled={u.id === currentUser.id}
                className="px-3 py-2 rounded-xl bg-rose-50 text-rose-600 disabled:opacity-40"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 my-8 space-y-4 animate-fade-up">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold">{editingUser ? (language === 'ar' ? 'تعديل موظف' : 'Edit Employee') : (language === 'ar' ? 'موظف جديد' : 'New Employee')}</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="md:col-span-2">
                <label className="font-bold">{language === 'ar' ? 'الاسم' : 'Name'}</label>
                <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full mt-1 p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold" />
              </div>
              <div>
                <label className="font-bold">{language === 'ar' ? 'اسم المستخدم' : 'Username'}</label>
                <input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full mt-1 p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono font-bold" />
              </div>
              <div>
                <label className="font-bold">{language === 'ar' ? 'كلمة المرور' : 'Password'}</label>
                <input value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full mt-1 p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono font-bold" />
              </div>
              <div>
                <label className="font-bold">Email</label>
                <input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full mt-1 p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl" />
              </div>
              <div>
                <label className="font-bold">{language === 'ar' ? 'الجوال' : 'Phone'}</label>
                <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full mt-1 p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl" />
              </div>
            </div>

            <div className="text-xs">
              <label className="font-bold">{language === 'ar' ? 'الدور' : 'Role'}</label>
              <select value={formData.role} onChange={(e) => handleRoleChange(e.target.value as RoleType)} className="w-full mt-1 p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-indigo-600">
                {(['super_admin', 'manager', 'cashier', 'sales', 'warehouse', 'accountant'] as RoleType[]).map((r) => (
                  <option key={r} value={r}>{getRoleLabel(r, language)}</option>
                ))}
              </select>
            </div>

            <div className="text-xs">
              <label className="font-bold block mb-2">{language === 'ar' ? 'الأقسام المسموح بها' : 'Allowed Modules'}</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ALL_MODULES.map((mod) => {
                  const on = formData.modules.includes(mod);
                  return (
                    <button
                      key={mod}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          modules: on ? prev.modules.filter((m) => m !== mod) : [...prev.modules, mod],
                        }))
                      }
                      className={`px-2.5 py-2 rounded-xl border text-[11px] font-bold text-start ${
                        on
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-400 text-indigo-700'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      {language === 'ar' ? MODULE_LABELS[mod].ar : MODULE_LABELS[mod].en}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-xs">
              <label className="font-bold block mb-2">{language === 'ar' ? 'صلاحيات العمليات' : 'Action Permissions'}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PERMISSION_KEYS.map((pk) => (
                  <button
                    key={pk.key}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        permissions: { ...prev.permissions, [pk.key]: !prev.permissions[pk.key] },
                      }))
                    }
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <span className="font-bold">{language === 'ar' ? pk.labelAr : pk.labelEn}</span>
                    {formData.permissions[pk.key] ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-slate-400" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))}
                className="flex items-center gap-2 text-xs font-bold"
              >
                {formData.isActive ? <ToggleRight className="w-6 h-6 text-emerald-500" /> : <ToggleLeft className="w-6 h-6 text-slate-400" />}
                {language === 'ar' ? 'الحساب نشط' : 'Active'}
              </button>
              <div className="flex gap-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800">
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button onClick={handleSaveUser} className="px-5 py-2 rounded-xl text-xs font-extrabold bg-indigo-600 text-white">
                  {language === 'ar' ? 'حفظ' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
