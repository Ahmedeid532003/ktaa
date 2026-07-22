import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getRoleLabel } from '../utils/permissions';
import {
  Search,
  Bell,
  Volume2,
  VolumeX,
  Globe,
  Sun,
  Moon,
  ShoppingCart,
  Building2,
  ChevronDown,
  LogOut,
  UserRound,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeModule,
    setActiveModule,
    language,
    setLanguage,
    darkMode,
    setDarkMode,
    soundEnabled,
    toggleSound,
    settings,
    currentUser,
    logout,
    notifications,
    quickSearchQuery,
    setQuickSearchQuery,
    cart,
    canAccess,
  } = useApp();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 theme-smooth">
      <div className="flex items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/20">
            AK
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
              {language === 'ar' ? settings.companyNameAr : settings.companyNameEn}
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <Building2 className="w-3 h-3 text-indigo-500" />
              <span>{language === 'ar' ? 'المستودع الرئيسي - الرياض' : settings.defaultWarehouse}</span>
            </p>
          </div>
        </div>

        <div className="relative hidden md:block w-64 lg:w-80">
          <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={quickSearchQuery}
            onChange={(e) => {
              setQuickSearchQuery(e.target.value);
              if (activeModule !== 'pos' && activeModule !== 'products' && e.target.value.trim() !== '') {
                if (canAccess('products')) setActiveModule('products');
              }
            }}
            placeholder={
              language === 'ar'
                ? 'بحث برقم القطعة، OEM، الفئة...'
                : 'Search Part #, OEM, Vehicle, Barcode...'
            }
            className="w-full ps-9 pe-4 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {canAccess('pos') && (
          <button
            onClick={() => setActiveModule('pos')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              activeModule === 'pos'
                ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'ar' ? 'كاشير POS' : 'POS Cashier'}</span>
            {cart.length > 0 && (
              <span className="ms-1 px-1.5 py-0.5 text-[10px] bg-emerald-600 text-white rounded-full font-black">
                {cart.length}
              </span>
            )}
          </button>
        )}

        {canAccess('notifications') && (
          <button
            onClick={() => setActiveModule('notifications')}
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1 end-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                {unreadNotifs}
              </span>
            )}
          </button>
        )}

        <button
          onClick={toggleSound}
          className={`p-2 rounded-xl transition-colors ${
            soundEnabled
              ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
              : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>

        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
        >
          <Globe className="w-4 h-4 text-indigo-500" />
          <span>{language === 'en' ? 'العربية' : 'English'}</span>
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 ps-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-lg object-cover ring-2 ring-indigo-500/20"
            />
            <div className="text-start hidden lg:block">
              <div className="text-xs font-bold text-slate-900 dark:text-white leading-none">
                {language === 'ar' ? currentUser.nameAr || currentUser.name : currentUser.name}
              </div>
              <div className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                {getRoleLabel(currentUser.role, language)}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute end-0 mt-2 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-fade-up">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UserRound className="w-4 h-4 text-indigo-500" />
                  {language === 'ar' ? currentUser.nameAr || currentUser.name : currentUser.name}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  @{currentUser.username || currentUser.email.split('@')[0]} · {getRoleLabel(currentUser.role, language)}
                </div>
              </div>
              {canAccess('users') && (
                <button
                  onClick={() => {
                    setActiveModule('users');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-start px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {language === 'ar' ? 'إدارة الموظفين والصلاحيات' : 'Manage users & permissions'}
                </button>
              )}
              {canAccess('settings') && (
                <button
                  onClick={() => {
                    setActiveModule('settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-start px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {language === 'ar' ? 'إعدادات النظام' : 'System settings'}
                </button>
              )}
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="w-full text-start px-3 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {language === 'ar' ? 'تسجيل الخروج' : 'Sign out'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
