import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../Common/Badge';
import {
  Receipt,
  Search,
  Printer,
  Eye,
  FileText,
  DollarSign,
  Download,
  Calendar,
  UserCheck
} from 'lucide-react';

export const SalesView: React.FC = () => {
  const { invoices, customers, openReceiptModal, settings, language } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredInvoices = invoices.filter(inv => {
    if (statusFilter !== 'All' && inv.paymentStatus !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.customerName.toLowerCase().includes(q) ||
      inv.cashierName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-indigo-600" />
            <span>{language === 'ar' ? 'فواتير المبيعات وسجل العمليات' : 'Sales Invoices & Transactions'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'ar'
              ? 'مراجعة كافة فواتير البيع، المرتجعات، والطباعة الضريبية الرسمية'
              : 'Review official tax invoices, payment statuses, and printable receipts'}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={
              language === 'ar'
                ? 'بحث برقم الفاتورة، اسم العميل، الكاشير...'
                : 'Search Invoice #, Customer Name, Cashier...'
            }
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold"
        >
          <option value="All">{language === 'ar' ? 'جميع الحالات' : 'All Statuses'}</option>
          <option value="paid">{language === 'ar' ? 'مدفوع نقدًا' : 'Paid'}</option>
          <option value="credit">{language === 'ar' ? 'آجل / ذمم' : 'Credit Sale'}</option>
          <option value="partial">{language === 'ar' ? 'دفعة جزئية' : 'Partial'}</option>
        </select>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b text-slate-500 uppercase font-extrabold">
                <th className="p-3.5">{language === 'ar' ? 'رقم الفاتورة' : 'Invoice #'}</th>
                <th className="p-3.5">{language === 'ar' ? 'التاريخ والوقت' : 'Date & Time'}</th>
                <th className="p-3.5">{language === 'ar' ? 'اسم العميل' : 'Customer Name'}</th>
                <th className="p-3.5">{language === 'ar' ? 'نوع العملية' : 'Type'}</th>
                <th className="p-3.5 text-right">{language === 'ar' ? 'الإجمالي الكلي' : 'Grand Total'}</th>
                <th className="p-3.5 text-center">{language === 'ar' ? 'حالة الدفع' : 'Payment Status'}</th>
                <th className="p-3.5 text-center">{language === 'ar' ? 'الموظف / الكاشير' : 'Cashier'}</th>
                <th className="p-3.5 text-center">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-mono font-extrabold text-indigo-600">
                    {inv.invoiceNumber}
                  </td>

                  <td className="p-3.5 text-slate-500">
                    {new Date(inv.date).toLocaleDateString()} {new Date(inv.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>

                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                    {language === 'ar'
                      ? (customers.find(c => c.id === inv.customerId)?.nameAr || inv.customerName)
                      : inv.customerName}
                  </td>

                  <td className="p-3.5">
                    <Badge variant={inv.type === 'customer_return' ? 'danger' : 'primary'}>
                      {language === 'ar' 
                        ? (inv.type === 'customer_return' ? 'مرتجع مبيعات' : 'فاتورة مبيعات') 
                        : inv.type.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </td>

                  <td className="p-3.5 text-right font-black text-sm text-slate-900 dark:text-white">
                    {inv.grandTotal.toFixed(2)} {settings.currency}
                  </td>

                  <td className="p-3.5 text-center">
                    <Badge
                      variant={
                        inv.paymentStatus === 'paid'
                          ? 'success'
                          : inv.paymentStatus === 'credit'
                          ? 'warning'
                          : 'neutral'
                      }
                    >
                      {language === 'ar'
                        ? (inv.paymentStatus === 'paid' ? 'مدفوع' : inv.paymentStatus === 'credit' ? 'آجل' : 'جزئي')
                        : inv.paymentStatus.toUpperCase()}
                    </Badge>
                  </td>

                  <td className="p-3.5 text-center font-medium text-slate-600 dark:text-slate-300">
                    {language === 'ar'
                      ? (inv.cashierName === 'Tariq Al-Mansoor' ? 'طارق المنصور' : inv.cashierName === 'Fahad Sales' ? 'فهد - مبيعات' : inv.cashierName === 'Sultan Warehouse' ? 'سلطان المستودع' : inv.cashierName)
                      : inv.cashierName}
                  </td>

                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => openReceiptModal(inv)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors font-bold text-xs flex items-center gap-1 mx-auto"
                    >
                      <Printer className="w-4 h-4" />
                      <span>{language === 'ar' ? 'طباعة الفاتورة الضريبية' : 'Print Tax Invoice'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
