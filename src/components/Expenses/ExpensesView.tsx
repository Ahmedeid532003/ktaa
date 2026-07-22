import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../Common/Badge';
import { DollarSign, Plus, Calendar, FileText, CheckCircle, X } from 'lucide-react';

export const ExpensesView: React.FC = () => {
  const { expenses, addExpense, settings, language, currentUser } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    category: 'Rent' as 'Rent' | 'Salaries' | 'Electricity' | 'Internet' | 'Transportation' | 'Maintenance' | 'Customs' | 'Misc',
    amount: 500,
    paymentMethod: 'cash' as 'cash' | 'bank_transfer' | 'card',
    description: 'Showroom electricity utility bill payment',
    receiptNumber: `REC-${Math.floor(1000 + Math.random() * 9000)}`
  });

  const totalExpense = expenses.reduce((acc, e) => acc + e.amount, 0);

  const handleSave = () => {
    addExpense({
      date: new Date().toISOString().split('T')[0],
      category: formData.category,
      amount: Number(formData.amount) || 0,
      paymentMethod: formData.paymentMethod,
      description: formData.description,
      approvedBy: currentUser.name,
      receiptNumber: formData.receiptNumber
    });
    setShowAddModal(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-indigo-600" />
            <span>{language === 'ar' ? 'المصروفات التشغيلية' : 'Operating Expenses & Bills'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'ar'
              ? 'تسجيل مصروفات الإيجار، الرواتب، الكهرباء، والجمارك'
              : 'Log store rent, staff salaries, electricity bills, and customs clearance fees'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ar' ? 'تسجيل مصروف جديد' : 'Log New Expense'}</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 font-bold">
            {language === 'ar' ? 'إجمالي المصروفات التشغيلية المسجلة' : 'Total Recorded Operating Expenses'}
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {totalExpense.toFixed(2)} {settings.currency}
          </div>
        </div>
        <Badge variant="danger">
          {language === 'ar' ? `${expenses.length} مصروف` : `${expenses.length} Entries`}
        </Badge>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b text-slate-500 uppercase font-extrabold">
                <th className="p-3.5">{language === 'ar' ? 'التاريخ والسند' : 'Date & Ref'}</th>
                <th className="p-3.5">{language === 'ar' ? 'بند المصروف' : 'Category'}</th>
                <th className="p-3.5">{language === 'ar' ? 'البيان والتفاصيل' : 'Description'}</th>
                <th className="p-3.5">{language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</th>
                <th className="p-3.5">{language === 'ar' ? 'اعتمد بواسطة' : 'Approved By'}</th>
                <th className="p-3.5 text-right">{language === 'ar' ? 'المبلغ' : 'Amount'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {expenses.map(exp => (
                <tr key={exp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-bold">
                    <div>{exp.date}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{exp.receiptNumber || 'N/A'}</div>
                  </td>

                  <td className="p-3.5">
                    <Badge variant="primary">
                      {language === 'ar'
                        ? (exp.categoryAr || (exp.category === 'Rent' ? 'إيجار المقر' : exp.category === 'Electricity' ? 'كهرباء ومرافق' : exp.category === 'Transportation' ? 'مواصلات ونقل' : exp.category === 'Salaries' ? 'رواتب وأجور' : exp.category === 'Internet' ? 'إنترنت واتصالات' : exp.category === 'Maintenance' ? 'صيانة وتجهيزات' : exp.category === 'Customs' ? 'جمارك وتخليص' : 'مصروفات متنوعة'))
                        : exp.category}
                    </Badge>
                  </td>

                  <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">
                    {language === 'ar' ? (exp.descriptionAr || exp.description) : exp.description}
                  </td>

                  <td className="p-3.5 capitalize font-bold text-slate-600 dark:text-slate-400">
                    {language === 'ar'
                      ? (exp.paymentMethod === 'cash' ? 'نقداً' : exp.paymentMethod === 'card' ? 'بطاقة / مدى' : 'تحويل بنكي')
                      : exp.paymentMethod.replace('_', ' ')}
                  </td>

                  <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">
                    {language === 'ar'
                      ? (exp.approvedBy === 'Tariq Al-Mansoor' ? 'طارق المنصور' : exp.approvedBy === 'Fahad Sales' ? 'فهد - مبيعات' : exp.approvedBy === 'Sultan Warehouse' ? 'سلطان المستودع' : exp.approvedBy)
                      : exp.approvedBy}
                  </td>

                  <td className="p-3.5 text-right font-black text-rose-600 text-sm">
                    {exp.amount.toFixed(2)} {settings.currency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {language === 'ar' ? 'تسجيل سند مصروف جديد' : 'Log Operating Expense'}
              </h3>
              <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold">{language === 'ar' ? 'بند / نوع المصروف:' : 'Expense Category:'}</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border rounded-lg font-bold"
                >
                  <option value="Rent">{language === 'ar' ? 'إيجار المعرض والمستودع' : 'Showroom & Warehouse Rent'}</option>
                  <option value="Salaries">{language === 'ar' ? 'رواتب الموظفين والبدلات' : 'Staff Salaries & Allowances'}</option>
                  <option value="Electricity">{language === 'ar' ? 'فاتورة الكهرباء' : 'SEC Electricity Utility'}</option>
                  <option value="Internet">{language === 'ar' ? 'الاتصالات والإنترنت' : 'STC Telecom & Internet'}</option>
                  <option value="Transportation">{language === 'ar' ? 'مصاريف الشحن والنقل' : 'Courier & Logistics'}</option>
                  <option value="Maintenance">{language === 'ar' ? 'صيانة التجهيزات والمعدات' : 'Equipment & Facility Maintenance'}</option>
                  <option value="Customs">{language === 'ar' ? 'الرسوم التخليصية والجمارك' : 'Customs Duty & Clearance'}</option>
                  <option value="Misc">{language === 'ar' ? 'مصروفات نثرية متفرقة' : 'Miscellaneous Expenses'}</option>
                </select>
              </div>

              <div>
                <label className="font-bold">{language === 'ar' ? 'المبلغ المطلوب *' : 'Amount *'} ({settings.currency})</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border rounded-lg font-bold text-rose-600 text-base"
                />
              </div>

              <div>
                <label className="font-bold">{language === 'ar' ? 'طريقة الدفع:' : 'Payment Method:'}</label>
                <select
                  value={formData.paymentMethod}
                  onChange={e => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                  className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border rounded-lg font-bold"
                >
                  <option value="cash">{language === 'ar' ? 'من الخزينة النقدية (الصندوق)' : 'Cash Box'}</option>
                  <option value="bank_transfer">{language === 'ar' ? 'تحويل بنكي من حساب الشركة' : 'Bank Transfer'}</option>
                  <option value="card">{language === 'ar' ? 'بطاقة مدى / ائتمان المؤسسة' : 'Company Debit Card'}</option>
                </select>
              </div>

              <div>
                <label className="font-bold">{language === 'ar' ? 'البيان والتفاصيل:' : 'Description / Details:'}</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder={language === 'ar' ? 'مثال: سداد فاتورة كهرباء شهر يوليو' : 'e.g. Showroom electricity bill'}
                  className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border rounded-lg"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all mt-4"
            >
              {language === 'ar' ? 'حفظ سند المصروف' : 'SAVE EXPENSE RECORD'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
