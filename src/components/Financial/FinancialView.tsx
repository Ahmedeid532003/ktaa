import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../Common/Badge';
import { Landmark, DollarSign, Clock, CheckCircle2, ShieldAlert, FileText, X } from 'lucide-react';

export const FinancialView: React.FC = () => {
  const { currentShift, closeCashShift, openNewCashShift, settings, language } = useApp();
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [actualCashCount, setActualCashCount] = useState<number>(currentShift.closingCashSystem);
  const [closingNotes, setClosingNotes] = useState('');

  const bankAccounts = [
    { name: language === 'ar' ? 'مصرف الراجحي - الحساب الرئيسي للشركة' : 'Al Rajhi Bank - Main Corporate', iban: 'SA88 8000 0000 1234 5678 9012', balance: 112400.00 },
    { name: language === 'ar' ? 'البنك الأهلي السعودي SNB - تشغيل المعرض' : 'SNB AlAhli - Showroom Operations', iban: 'SA44 1000 0000 9876 5432 1098', balance: 36100.00 }
  ];

  const handleConfirmCloseShift = () => {
    closeCashShift(actualCashCount, closingNotes);
    setShowCloseModal(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Landmark className="w-6 h-6 text-indigo-600" />
            <span>{language === 'ar' ? 'المالية وإغلاق الصندوق (Z-Report)' : 'Cash Drawer Shift & Banking'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'ar'
              ? 'إقفال الوردية اليومية، مطابقة النقدية، ومتابعة الحسابات البنكية'
              : 'Reconcile physical cash drawer, execute daily Z-closing shifts, and track bank accounts'}
          </p>
        </div>

        {currentShift.status === 'open' ? (
          <button
            onClick={() => {
              setActualCashCount(currentShift.closingCashSystem);
              setShowCloseModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95"
          >
            <Clock className="w-4 h-4" />
            <span>{language === 'ar' ? 'إغلاق الوردية اليومية Z-Report' : 'Execute Shift Z-Closing'}</span>
          </button>
        ) : (
          <button
            onClick={() => openNewCashShift(1000)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{language === 'ar' ? 'فتح وردية صندوق جديدة' : 'Open New Shift'}</span>
          </button>
        )}
      </div>

      {/* Current Shift Summary Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider">
              {language === 'ar' ? 'ملخص الوردية الحالية' : 'Active Shift Summary'}
            </span>
            <h3 className="text-lg font-black mt-0.5">
              {currentShift.cashierName} • {language === 'ar' ? (currentShift.status === 'open' ? 'نشطة / مفتوحة' : 'مغلقة') : currentShift.status.toUpperCase()}
            </h3>
          </div>
          <Badge variant={currentShift.status === 'open' ? 'success' : 'neutral'}>
            {language === 'ar' ? `رقم الوردية: ${currentShift.id}` : `Shift ID: ${currentShift.id}`}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
            <span className="text-[10px] text-slate-300">
              {language === 'ar' ? 'رصيد افتتاح الصندوق' : 'Opening Cash'}
            </span>
            <div className="text-lg font-black">{currentShift.openingCash.toFixed(2)} {settings.currency}</div>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
            <span className="text-[10px] text-slate-300">
              {language === 'ar' ? 'المبيعات النقدية المقبوضة' : 'Cash Sales Collected'}
            </span>
            <div className="text-lg font-black text-emerald-400">+{currentShift.totalSalesCash.toFixed(2)} {settings.currency}</div>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
            <span className="text-[10px] text-slate-300">
              {language === 'ar' ? 'مبيعات الشبكة / مدى' : 'Mada / Card Sales'}
            </span>
            <div className="text-lg font-black text-sky-400">{currentShift.totalSalesCard.toFixed(2)} {settings.currency}</div>
          </div>

          <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl backdrop-blur-md">
            <span className="text-[10px] text-emerald-200 font-bold">
              {language === 'ar' ? 'المتوقع في الصندوق حسب النظام' : 'Expected System Drawer Cash'}
            </span>
            <div className="text-xl font-black text-emerald-300">{currentShift.closingCashSystem.toFixed(2)} {settings.currency}</div>
          </div>
        </div>
      </div>

      {/* Bank Balances */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
          {language === 'ar' ? 'الحسابات البنكية للشركة' : 'Corporate Bank Balances'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bankAccounts.map((b, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{b.name}</h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{b.iban}</p>
              </div>

              <div className="text-right">
                <div className="text-lg font-black text-emerald-600">{b.balance.toFixed(2)} {settings.currency}</div>
                <span className="text-[10px] text-slate-400">{language === 'ar' ? 'الرصيد اللحظي' : 'Live Balance'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CLOSE SHIFT Z-REPORT MODAL */}
      {showCloseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-extrabold text-sm">Z-Report Cash Shift Closing</h3>
              <button onClick={() => setShowCloseModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span>Expected Drawer Cash:</span>
                  <span className="font-bold">{currentShift.closingCashSystem.toFixed(2)} {settings.currency}</span>
                </div>
              </div>

              <div>
                <label className="font-bold">Actual Counted Cash in Drawer *</label>
                <input
                  type="number"
                  value={actualCashCount}
                  onChange={e => setActualCashCount(parseFloat(e.target.value) || 0)}
                  className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border rounded-lg font-black text-base text-emerald-600"
                />
              </div>

              <div>
                <label className="font-bold">Cash Difference:</label>
                <div className={`p-2 rounded-lg font-bold text-center text-sm ${
                  actualCashCount - currentShift.closingCashSystem === 0
                    ? 'bg-emerald-500/10 text-emerald-600'
                    : 'bg-rose-500/10 text-rose-600'
                }`}>
                  {(actualCashCount - currentShift.closingCashSystem).toFixed(2)} {settings.currency}
                </div>
              </div>

              <div>
                <label className="font-bold">Closing Notes / Discrepancy Reason:</label>
                <input
                  type="text"
                  value={closingNotes}
                  onChange={e => setClosingNotes(e.target.value)}
                  placeholder="e.g. Verified and balanced with cashier"
                  className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border rounded-lg text-xs"
                />
              </div>
            </div>

            <button
              onClick={handleConfirmCloseShift}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all mt-4"
            >
              FINALIZE Z-REPORT & CLOSE SHIFT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
