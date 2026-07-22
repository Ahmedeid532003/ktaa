import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginView } from './components/Auth/LoginView';
import { DashboardView } from './components/Dashboard/DashboardView';
import { POSView } from './components/POS/POSView';
import { ProductsView } from './components/Products/ProductsView';
import { InventoryView } from './components/Inventory/InventoryView';
import { SalesView } from './components/Sales/SalesView';
import { PurchasesView } from './components/Purchases/PurchasesView';
import { CustomersView } from './components/Customers/CustomersView';
import { SuppliersView } from './components/Suppliers/SuppliersView';
import { ExpensesView } from './components/Expenses/ExpensesView';
import { FinancialView } from './components/Financial/FinancialView';
import { ReportsView } from './components/Reports/ReportsView';
import { NotificationsView } from './components/Notifications/NotificationsView';
import { UsersView } from './components/Users/UsersView';
import { SettingsView } from './components/Settings/SettingsView';
import { ToastContainer } from './components/Common/ToastContainer';
import { ReceiptModal } from './components/Common/ReceiptModal';
import { canAccessModule } from './utils/permissions';
import { Keyboard, ShieldAlert } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeModule,
    setActiveModule,
    darkMode,
    language,
    isBackendReady,
    backendError,
    isAuthenticated,
    currentUser,
    canAccess,
  } = useApp();

  // Keyboard shortcuts for speed
  useEffect(() => {
    if (!isAuthenticated) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'F2' && canAccess('pos')) {
        e.preventDefault();
        setActiveModule('pos');
      }
      if (e.key === 'F3' && canAccess('products')) {
        e.preventDefault();
        setActiveModule('products');
      }
      if (e.key === 'F4' && canAccess('customers')) {
        e.preventDefault();
        setActiveModule('customers');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isAuthenticated, canAccess, setActiveModule]);

  if (!isBackendReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-200">
        <div className="text-center space-y-2 animate-fade-up">
          <div className="text-lg font-bold">{language === 'ar' ? 'جاري الاتصال بالخادم...' : 'Connecting to server...'}</div>
          <div className="text-sm text-slate-500">AK ERP</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <LoginView />
        <ToastContainer />
      </>
    );
  }

  const renderActiveView = () => {
    if (!canAccessModule(currentUser, activeModule)) {
      return (
        <div className="p-10 flex flex-col items-center justify-center text-center gap-3">
          <ShieldAlert className="w-12 h-12 text-amber-500" />
          <h2 className="text-lg font-black">{language === 'ar' ? 'لا توجد صلاحية' : 'Access Denied'}</h2>
          <p className="text-sm text-slate-500 max-w-md">
            {language === 'ar'
              ? 'حسابك لا يملك صلاحية فتح هذا القسم. تواصل مع المدير لتعديل الصلاحيات.'
              : 'Your account cannot open this module. Ask an admin to update permissions.'}
          </p>
          <button
            onClick={() => setActiveModule('dashboard')}
            className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            {language === 'ar' ? 'العودة للوحة الرئيسية' : 'Back to Dashboard'}
          </button>
        </div>
      );
    }

    switch (activeModule) {
      case 'dashboard':
        return <DashboardView />;
      case 'pos':
        return <POSView />;
      case 'products':
        return <ProductsView />;
      case 'inventory':
        return <InventoryView />;
      case 'sales':
        return <SalesView />;
      case 'purchases':
        return <PurchasesView />;
      case 'customers':
        return <CustomersView />;
      case 'suppliers':
        return <SuppliersView />;
      case 'expenses':
        return <ExpensesView />;
      case 'financial':
        return <FinancialView />;
      case 'reports':
        return <ReportsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'users':
        return <UsersView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div
      className={`min-h-screen flex bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 theme-smooth ${darkMode ? 'dark' : ''}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {backendError && (
        <div className="fixed top-0 inset-x-0 z-50 bg-amber-500 text-white text-center text-sm py-1.5 px-3">
          {language === 'ar'
            ? `وضع محلي مؤقت — تعذر الاتصال بالباك اند: ${backendError}`
            : `Offline fallback — backend error: ${backendError}`}
        </div>
      )}

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <Header />

        <div className="px-4 md:px-6 pt-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2">
            <Keyboard className="w-3.5 h-3.5 text-indigo-500" />
            <span className="font-semibold">
              {language === 'ar'
                ? 'اختصارات: F2 كاشير · F3 المنتجات · F4 العملاء'
                : 'Shortcuts: F2 POS · F3 Products · F4 Customers'}
            </span>
            <span className="ms-auto hidden sm:inline font-medium text-slate-400">
              {language === 'ar'
                ? `مرحباً، ${currentUser.nameAr || currentUser.name}`
                : `Hi, ${currentUser.name}`}
            </span>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">{renderActiveView()}</main>
      </div>

      <ToastContainer />
      <ReceiptModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
