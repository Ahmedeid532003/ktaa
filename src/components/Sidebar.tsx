import React from 'react';
import { useApp, ModuleType } from '../context/AppContext';
import {
  LayoutDashboard,
  ShoppingCart,
  PackageSearch,
  Boxes,
  Receipt,
  ShoppingBag,
  Users,
  Truck,
  DollarSign,
  Landmark,
  BarChart3,
  Bell,
  ShieldCheck,
  Settings,
  ChevronRight,
} from 'lucide-react';

interface SidebarItem {
  id: ModuleType;
  labelEn: string;
  labelAr: string;
  icon: React.FC<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const {
    activeModule,
    setActiveModule,
    language,
    products,
    notifications,
    heldInvoices,
    canAccess,
    currentUser,
  } = useApp();

  const lowStockCount = products.filter((p) => p.status === 'low_stock' || p.status === 'out_of_stock').length;
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const sections: { titleAr: string; titleEn: string; items: SidebarItem[] }[] = [
    {
      titleAr: 'الأساسيات',
      titleEn: 'Main & POS',
      items: [
        { id: 'dashboard', labelEn: 'Dashboard', labelAr: 'اللوحة الرئيسية', icon: LayoutDashboard },
        {
          id: 'pos',
          labelEn: 'POS Cashier',
          labelAr: 'كاشير المبيعات',
          icon: ShoppingCart,
          badge: heldInvoices.length > 0 ? (language === 'ar' ? `${heldInvoices.length} معلقة` : `${heldInvoices.length} Hold`) : undefined,
          badgeColor: 'bg-amber-500',
        },
      ],
    },
    {
      titleAr: 'المخزون',
      titleEn: 'Stock & Parts',
      items: [
        { id: 'products', labelEn: 'Parts Catalog', labelAr: 'قطع الغيار', icon: PackageSearch },
        {
          id: 'inventory',
          labelEn: 'Inventory Log',
          labelAr: 'حركة المخزن',
          icon: Boxes,
          badge: lowStockCount > 0 ? lowStockCount : undefined,
          badgeColor: 'bg-rose-500',
        },
      ],
    },
    {
      titleAr: 'العمليات',
      titleEn: 'Operations',
      items: [
        { id: 'sales', labelEn: 'Sales Invoices', labelAr: 'فواتير المبيعات', icon: Receipt },
        { id: 'purchases', labelEn: 'Purchase Orders', labelAr: 'أوامر الشراء', icon: ShoppingBag },
        { id: 'expenses', labelEn: 'Expenses', labelAr: 'المصروفات', icon: DollarSign },
      ],
    },
    {
      titleAr: 'العلاقات',
      titleEn: 'People',
      items: [
        { id: 'customers', labelEn: 'Customers', labelAr: 'العملاء', icon: Users },
        { id: 'suppliers', labelEn: 'Suppliers', labelAr: 'الموردين', icon: Truck },
      ],
    },
    {
      titleAr: 'الإدارة',
      titleEn: 'Admin',
      items: [
        { id: 'reports', labelEn: 'Reports', labelAr: 'التقارير', icon: BarChart3 },
        { id: 'financial', labelEn: 'Cash Register', labelAr: 'الصندوق', icon: Landmark },
        {
          id: 'notifications',
          labelEn: 'Notifications',
          labelAr: 'التنبيهات',
          icon: Bell,
          badge: unreadNotifs > 0 ? unreadNotifs : undefined,
          badgeColor: 'bg-rose-500',
        },
        { id: 'users', labelEn: 'Users & Roles', labelAr: 'الموظفين والصلاحيات', icon: ShieldCheck },
        { id: 'settings', labelEn: 'Settings', labelAr: 'الإعدادات', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 border-e border-slate-800 flex flex-col shrink-0 min-h-screen select-none">
      <div className="px-4 py-4 border-b border-slate-800">
        <div className="text-xs font-black text-white">
          {language === 'ar' ? currentUser.nameAr || currentUser.name : currentUser.name}
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5">
          {language === 'ar' ? 'القائمة حسب صلاحياتك' : 'Menu filtered by your role'}
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        {sections.map((sec, sIdx) => {
          const visible = sec.items.filter((item) => canAccess(item.id));
          if (visible.length === 0) return null;
          return (
            <div key={sIdx} className="space-y-1">
              <div className="px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-800/60 mb-1">
                {language === 'ar' ? sec.titleAr : sec.titleEn}
              </div>
              {visible.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveModule(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span>{language === 'ar' ? item.labelAr : item.labelEn}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 text-[9px] font-extrabold text-white rounded-full ${item.badgeColor || 'bg-indigo-600'}`}>
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 ${isActive ? 'opacity-100 text-white' : 'text-slate-500'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-500 text-center">
        <span className="font-bold text-slate-400">AK</span>
        <span className="block text-[9px] text-slate-600 mt-0.5">
          {language === 'ar' ? 'سهل • سريع • آمن بالصلاحيات' : 'Simple · Fast · Permission-safe'}
        </span>
      </div>
    </aside>
  );
};
