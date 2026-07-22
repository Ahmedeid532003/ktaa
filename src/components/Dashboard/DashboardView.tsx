import React from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../Common/Badge';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Building2,
  AlertTriangle,
  PackageX,
  ShoppingCart,
  PlusCircle,
  Receipt,
  Users,
  BarChart3,
  ArrowUpRight,
  Clock,
  ChevronRight,
  Flame,
  CheckCircle2
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    invoices,
    purchaseOrders,
    products,
    expenses,
    customers,
    currentShift,
    notifications,
    setActiveModule,
    settings,
    language
  } = useApp();

  // Metrics Calculations
  const todayStr = new Date().toISOString().split('T')[0];

  const todayInvoices = invoices.filter(
    i => i.date.startsWith(todayStr) && i.type === 'pos_sale'
  );

  const todaySales = todayInvoices.reduce((acc, inv) => acc + inv.grandTotal, 0);

  const todayPOs = purchaseOrders.filter(po => po.date === todayStr);
  const todayPurchases = todayPOs.reduce((acc, po) => acc + po.grandTotal, 0);

  // Profit calculation simulation
  const todayCost = todayInvoices.reduce((acc, inv) => {
    const cost = inv.items.reduce((itemCost, item) => itemCost + (item.product.costPrice * item.quantity), 0);
    return acc + cost;
  }, 0);

  const todayExpenses = expenses
    .filter(e => e.date === todayStr)
    .reduce((acc, e) => acc + e.amount, 0);

  const dailyProfit = Math.max(0, todaySales - todayCost - todayExpenses);
  const monthlyProfit = dailyProfit * 26; // Simulated monthly projection

  const cashInHand = currentShift.closingCashSystem;
  const bankBalance = 148500.00; // Simulated bank account balance

  const lowStockProducts = products.filter(p => p.status === 'low_stock');
  const outOfStockProducts = products.filter(p => p.status === 'out_of_stock');

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-300">
      {/* Top Banner & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800">
        <div>
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold border border-indigo-500/30">
            {language === 'ar' ? 'مؤسسة AK' : 'AK Establishment'}
          </span>
          <h2 className="text-xl md:text-2xl font-black mt-2">
            {language === 'ar' ? 'مرحباً بك في لوحة تحكم قطع الغيار' : 'Automotive Spare Parts Overview'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ar'
              ? 'متابعة المبيعات، المخزون الحرج، وحركات الصندوق لحظياً'
              : 'Real-time sales tracking, critical inventory alerts, and shift totals'}
          </p>
        </div>

        {/* Quick Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveModule('pos')}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{language === 'ar' ? 'نقطة البيع السريعة' : 'Quick POS'}</span>
          </button>

          <button
            onClick={() => setActiveModule('products')}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl backdrop-blur-md transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'ar' ? 'إضافة قطعة' : 'Add Part'}</span>
          </button>

          <button
            onClick={() => setActiveModule('financial')}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl backdrop-blur-md transition-all"
          >
            <Receipt className="w-4 h-4" />
            <span>{language === 'ar' ? 'إغلاق اليومية' : 'Daily Closing'}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3.5">
        {/* Today Sales */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {language === 'ar' ? 'مبيعات اليوم' : "Today's Sales"}
            </span>
            <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-2">
            {todaySales.toFixed(2)} <span className="text-xs font-normal text-slate-500">{settings.currency}</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>{language === 'ar' ? `${todayInvoices.length} فاتورة صادرة` : `${todayInvoices.length} invoices generated`}</span>
          </div>
        </div>

        {/* Today Purchases */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {language === 'ar' ? 'مشتريات اليوم' : "Today's Purchases"}
            </span>
            <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-2">
            {todayPurchases.toFixed(2)} <span className="text-xs font-normal text-slate-500">{settings.currency}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            <span>{language === 'ar' ? `${todayPOs.length} أمر شراء PO` : `${todayPOs.length} purchase orders`}</span>
          </div>
        </div>

        {/* Daily Profit */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {language === 'ar' ? 'الربح اليومي الصافي' : 'Daily Profit'}
            </span>
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            {dailyProfit.toFixed(2)} <span className="text-xs font-normal text-slate-500">{settings.currency}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            <span>{language === 'ar' ? `التقدير الشهري: ${monthlyProfit.toFixed(0)} ${settings.currency}` : `Est. Month: ${monthlyProfit.toFixed(0)} ${settings.currency}`}</span>
          </div>
        </div>

        {/* Cash in Hand & Bank */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {language === 'ar' ? 'رصيد الصندوق والبنك' : 'Cash & Bank'}
            </span>
            <div className="p-2 bg-sky-500/10 text-sky-600 rounded-xl">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-black text-slate-900 dark:text-white mt-1">
            {language === 'ar' ? `كاش الصندوق: ${cashInHand.toFixed(2)}` : `Cash: ${cashInHand.toFixed(2)}`}
          </div>
          <div className="text-xs font-bold text-slate-500">
            {language === 'ar' ? `رصيد البنك: ${bankBalance.toFixed(2)} ${settings.currency}` : `Bank: ${bankBalance.toFixed(2)} ${settings.currency}`}
          </div>
        </div>
      </div>

      {/* Stock Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Low Stock Warning Box */}
        <div className="bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 p-5 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-600 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {language === 'ar' ? 'قطع قريبة من النفاد' : 'Low Stock Items Warning'}
              </h4>
              <p className="text-xs text-slate-500">
                {lowStockProducts.length} {language === 'ar' ? 'قطع وصلت الحد الأدنى' : 'items reached reorder point'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModule('inventory')}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all"
          >
            {language === 'ar' ? 'معاينة المخزون' : 'View Stock'}
          </button>
        </div>

        {/* Out of Stock Box */}
        <div className="bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 p-5 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-500/20 text-rose-600 rounded-xl">
              <PackageX className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {language === 'ar' ? 'قطع نافدة بالكامل' : 'Out of Stock Items'}
              </h4>
              <p className="text-xs text-slate-500">
                {outOfStockProducts.length} {language === 'ar' ? 'قطع غير متوفرة' : 'items completely depleted'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModule('purchases')}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all"
          >
            {language === 'ar' ? 'طلب توريد PO' : 'Reorder PO'}
          </button>
        </div>
      </div>

      {/* Main Content Split: Recent Invoices & Fast Moving Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Invoices */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              <span>{language === 'ar' ? 'أحدث الفواتير الصادرة' : 'Recent Invoices'}</span>
            </h3>
            <button
              onClick={() => setActiveModule('sales')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>{language === 'ar' ? 'عرض الكل' : 'View All'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 overflow-x-auto">
            {invoices.slice(0, 5).map(inv => (
              <div key={inv.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-xs text-indigo-600">
                    #{inv.invoiceNumber.slice(-4)}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      {language === 'ar' ? (customers.find(c => c.id === inv.customerId)?.nameAr || inv.customerName) : inv.customerName}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {new Date(inv.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {inv.items.length} {language === 'ar' ? 'اصناف' : 'items'}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-xs text-slate-900 dark:text-white">
                    {inv.grandTotal.toFixed(2)} {settings.currency}
                  </div>
                  <Badge variant={inv.paymentStatus === 'paid' ? 'success' : 'warning'}>
                    {language === 'ar' ? (inv.paymentStatus === 'paid' ? 'مدفوع' : 'جزئي/آجل') : inv.paymentStatus.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Best Selling Spare Parts */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <span>{language === 'ar' ? 'القطع الأكثر مبيعاً' : 'Best Selling Parts'}</span>
            </h3>
          </div>

          <div className="space-y-3">
            {products.slice(0, 4).map((p, idx) => (
              <div key={p.id} className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 font-extrabold text-xs flex items-center justify-center shrink-0">
                  #{idx + 1}
                </span>
                <img src={p.image} alt={p.nameEn} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {language === 'ar' ? p.nameAr : p.nameEn}
                  </div>
                  <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-semibold">
                    OEM: {p.partNumber}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-extrabold text-xs text-slate-900 dark:text-white">
                    {p.sellingPrice} {settings.currency}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold">{language === 'ar' ? `المخزون: ${p.currentStock}` : `Stock: ${p.currentStock}`}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
