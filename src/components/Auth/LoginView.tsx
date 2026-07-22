import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getRoleLabel, DEFAULT_ROLE_MODULES, DEFAULT_ROLE_PERMISSIONS } from '../../utils/permissions';
import type { RoleType } from '../../types';
import {
  Eye,
  EyeOff,
  LogIn,
  Moon,
  Sun,
  UserPlus,
  Globe,
  Wrench,
} from 'lucide-react';

type Mode = 'login' | 'register';

export const LoginView: React.FC = () => {
  const {
    language,
    setLanguage,
    darkMode,
    setDarkMode,
    login,
    registerAccount,
    settings,
  } = useApp();

  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [reg, setReg] = useState({
    name: '',
    username: '',
    password: '',
    confirm: '',
    role: 'cashier' as RoleType,
  });

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const ok = await login(username.trim(), password);
      if (!ok) {
        setError(language === 'ar' ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'Invalid username or password');
      }
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!reg.name.trim()) {
      setError(language === 'ar' ? 'أدخل الاسم' : 'Name is required');
      return;
    }
    if (!reg.username.trim() || reg.password.length < 4) {
      setError(language === 'ar' ? 'اسم المستخدم وكلمة مرور (4 أحرف على الأقل)' : 'Username + password (min 4 chars)');
      return;
    }
    if (reg.password !== reg.confirm) {
      setError(language === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const result = await registerAccount({
        name: reg.name.trim(),
        nameAr: reg.name.trim(),
        email: `${reg.username.trim().toLowerCase()}@ak.com`,
        username: reg.username.trim().toLowerCase(),
        password: reg.password,
        role: reg.role,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
        permissions: { ...DEFAULT_ROLE_PERMISSIONS[reg.role] },
        modules: [...DEFAULT_ROLE_MODULES[reg.role]],
        isActive: true,
      });
      if (!result.ok) {
        setError(result.error || (language === 'ar' ? 'تعذر إنشاء الحساب' : 'Could not create account'));
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'mt-1.5 w-full px-4 py-3 rounded-lg bg-white/90 dark:bg-slate-900/80 border border-slate-300/80 dark:border-slate-600 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition';

  return (
    <div
      className={`min-h-screen relative flex flex-col theme-smooth ${darkMode ? 'dark' : ''}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Full-bleed workshop atmosphere */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(105deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.75) 45%, rgba(15,23,42,0.55) 100%), url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1920&q=80')",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent, transparent 40px, #fff 40px, #fff 41px), repeating-linear-gradient(0deg, transparent, transparent 40px, #fff 40px, #fff 41px)',
        }}
      />

      {/* Top controls */}
      <div className="relative z-10 flex items-center justify-between px-5 sm:px-8 py-5">
        <div className="flex items-center gap-3 text-white">
          <div className="w-10 h-10 rounded-lg bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
            <Wrench className="w-5 h-5 text-slate-950" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-lg font-black tracking-tight leading-none">AK</div>
            <div className="text-[11px] text-slate-300 mt-0.5 font-medium">
              {language === 'ar' ? settings.companyNameAr : settings.companyNameEn}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-white/10 text-white border border-white/15 hover:bg-white/20 backdrop-blur"
          >
            <Globe className="w-3.5 h-3.5" />
            {language === 'ar' ? 'EN' : 'ع'}
          </button>
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-white/10 text-white border border-white/15 hover:bg-white/20 backdrop-blur"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Center composition */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-10">
        <div className="w-full max-w-[420px] animate-fade-up">
          <div className="mb-8 text-center text-white">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              {mode === 'login'
                ? (language === 'ar' ? 'تسجيل الدخول' : 'Sign in')
                : (language === 'ar' ? 'إنشاء حساب' : 'Create account')}
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              {language === 'ar'
                ? 'ادخل لحسابك لإدارة المبيعات والمخزون'
                : 'Access POS, stock, and your team workspace'}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50/95 dark:bg-slate-950/90 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/40 p-6 sm:p-7">
            <div className="flex mb-6 border-b border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className={`flex-1 pb-3 text-sm font-bold transition border-b-2 -mb-px ${
                  mode === 'login'
                    ? 'border-teal-600 text-teal-700 dark:text-teal-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {language === 'ar' ? 'دخول' : 'Login'}
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); }}
                className={`flex-1 pb-3 text-sm font-bold transition border-b-2 -mb-px ${
                  mode === 'register'
                    ? 'border-teal-600 text-teal-700 dark:text-teal-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {language === 'ar' ? 'حساب جديد' : 'Register'}
              </button>
            </div>

            {mode === 'login' ? (
              <form onSubmit={onLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {language === 'ar' ? 'اسم المستخدم' : 'Username'}
                  </label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={inputClass}
                    placeholder={language === 'ar' ? 'مثال: admin' : 'e.g. admin'}
                    autoComplete="username"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {language === 'ar' ? 'كلمة المرور' : 'Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${inputClass} pe-11`}
                      placeholder="••••••"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 -translate-y-1/2 end-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-lg px-3 py-2.5">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-extrabold tracking-wide transition disabled:opacity-60"
                >
                  <LogIn className="w-4 h-4" />
                  {loading
                    ? (language === 'ar' ? 'جاري الدخول...' : 'Signing in...')
                    : (language === 'ar' ? 'دخول' : 'Sign in')}
                </button>

                <p className="text-[11px] text-center text-slate-500 pt-1">
                  {language === 'ar' ? 'تجريبي:' : 'Demo:'}{' '}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">admin / 123456</span>
                </p>
              </form>
            ) : (
              <form onSubmit={onRegister} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {language === 'ar' ? 'الاسم' : 'Name'}
                  </label>
                  <input
                    value={reg.name}
                    onChange={(e) => setReg({ ...reg, name: e.target.value })}
                    className={inputClass}
                    placeholder={language === 'ar' ? 'اسم الموظف' : 'Full name'}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {language === 'ar' ? 'اسم المستخدم' : 'Username'}
                  </label>
                  <input
                    value={reg.username}
                    onChange={(e) => setReg({ ...reg, username: e.target.value })}
                    className={inputClass}
                    placeholder={language === 'ar' ? 'للدخول للنظام' : 'For signing in'}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {language === 'ar' ? 'الدور' : 'Role'}
                  </label>
                  <select
                    value={reg.role}
                    onChange={(e) => setReg({ ...reg, role: e.target.value as RoleType })}
                    className={inputClass}
                  >
                    {(['cashier', 'sales', 'warehouse', 'accountant', 'manager'] as RoleType[]).map((r) => (
                      <option key={r} value={r}>{getRoleLabel(r, language)}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      {language === 'ar' ? 'كلمة المرور' : 'Password'}
                    </label>
                    <input
                      type="password"
                      value={reg.password}
                      onChange={(e) => setReg({ ...reg, password: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      {language === 'ar' ? 'تأكيد' : 'Confirm'}
                    </label>
                    <input
                      type="password"
                      value={reg.confirm}
                      onChange={(e) => setReg({ ...reg, confirm: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-lg px-3 py-2.5">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-extrabold tracking-wide transition disabled:opacity-60"
                >
                  <UserPlus className="w-4 h-4" />
                  {language === 'ar' ? 'إنشاء ودخول' : 'Create & enter'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
