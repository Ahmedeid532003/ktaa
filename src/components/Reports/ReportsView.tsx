import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, Download, Printer, Search, Calendar, FileText, TrendingUp, AlertTriangle } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { invoices, purchaseOrders, products, customers, suppliers, expenses, settings, language } = useApp();

  const [activeReport, setActiveReport] = useState<'sales' | 'inventory' | 'profit' | 'customers'>('sales');
  const [dateRange, setDateRange] = useState('month');

  // Summary stats for reports
  const totalSalesAmount = invoices.reduce((a, b) => a + b.grandTotal, 0);
  const totalPurchasesAmount = purchaseOrders.reduce((a, b) => a + b.grandTotal, 0);

  const inventoryValueAtCost = products.reduce((a, b) => a + (b.costPrice * b.currentStock), 0);
  const inventoryValueAtRetail = products.reduce((a, b) => a + (b.sellingPrice * b.currentStock), 0);

  const totalCustomerReceivables = customers.reduce((a, b) => a + b.balance, 0);
  const totalSupplierPayables = suppliers.reduce((a, b) => a + b.balance, 0);

  const handleExportExcel = () => {
    let csvData = '';
    if (activeReport === 'sales') {
      csvData = 'Invoice#,Date,Customer,Total,Status\n' + invoices.map(i => `${i.invoiceNumber},${i.date},"${i.customerName}",${i.grandTotal},${i.paymentStatus}`).join('\n');
    } else if (activeReport === 'inventory') {
      csvData = 'Part#,Name,OEM,Stock,Cost,SellingPrice\n' + products.map(p => `${p.partNumber},"${p.nameEn}",${p.oemNumber},${p.currentStock},${p.costPrice},${p.sellingPrice}`).join('\n');
    } else {
      csvData = 'Customer,Phone,Balance,CreditLimit\n' + customers.map(c => `"${c.name}",${c.phone},${c.balance},${c.creditLimit}`).join('\n');
    }

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${activeReport}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <span>{language === 'ar' ? 'التقارير التحليلية والمالية' : 'Comprehensive Reports & Analytics'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'ar'
              ? 'تقارير الأرباح والخسائر، تقييم المخزون، والمنتجات الأكثر مبيعاً'
              : 'Detailed Profit & Loss, inventory valuation, receivables ledger, and fast/dead stock analysis'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl shadow-sm transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>{language === 'ar' ? 'تصدير اكسل CSV' : 'Export Excel'}</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'ar' ? 'طباعة التقرير' : 'Print Report'}</span>
          </button>
        </div>
      </div>

      {/* Report Switcher Tabs */}
      <div className="flex items-center gap-2 border-b pb-2 overflow-x-auto scrollbar-thin">
        <button
          onClick={() => setActiveReport('sales')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeReport === 'sales' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {language === 'ar' ? 'تقرير المبيعات والإيرادات' : 'Sales & Revenue Report'}
        </button>

        <button
          onClick={() => setActiveReport('inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeReport === 'inventory' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {language === 'ar' ? 'تقييم المخزون والراكد' : 'Inventory Valuation & Dead Stock'}
        </button>

        <button
          onClick={() => setActiveReport('profit')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeReport === 'profit' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {language === 'ar' ? 'الأرباح والخسائر P&L' : 'Profit & Loss Overview'}
        </button>

        <button
          onClick={() => setActiveReport('customers')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeReport === 'customers' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {language === 'ar' ? 'ذمم وديون العملاء' : 'Customer Receivables'}
        </button>
      </div>

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border shadow-sm">
          <span className="text-xs text-slate-500 font-bold">
            {language === 'ar' ? 'إجمالي المبيعات' : 'Total Sales'}
          </span>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {totalSalesAmount.toFixed(2)} {settings.currency}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border shadow-sm">
          <span className="text-xs text-slate-500 font-bold">
            {language === 'ar' ? 'قيمة المخزون (بالتكلفة)' : 'Inventory Valuation (Cost)'}
          </span>
          <div className="text-xl font-black text-indigo-600 mt-1">
            {inventoryValueAtCost.toFixed(2)} {settings.currency}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border shadow-sm">
          <span className="text-xs text-slate-500 font-bold">
            {language === 'ar' ? 'ديون مستحقة على العملاء' : 'Customer Outstanding Due'}
          </span>
          <div className="text-xl font-black text-rose-600 mt-1">
            {totalCustomerReceivables.toFixed(2)} {settings.currency}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border shadow-sm">
          <span className="text-xs text-slate-500 font-bold">
            {language === 'ar' ? 'مستحقات واجبة للموردين' : 'Supplier Payables Due'}
          </span>
          <div className="text-xl font-black text-amber-600 mt-1">
            {totalSupplierPayables.toFixed(2)} {settings.currency}
          </div>
        </div>
      </div>

      {/* Report Table View */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
        <h3 className="font-extrabold text-sm uppercase text-slate-500">
          {language === 'ar' ? `تفاصيل التقرير - ${activeReport === 'sales' ? 'المبيعات' : activeReport === 'inventory' ? 'المخزون' : activeReport === 'customers' ? 'العملاء' : 'الأرباح والخسائر'}` : `Report Details - ${activeReport.toUpperCase()}`}
        </h3>

        {activeReport === 'sales' && (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {invoices.map(i => (
              <div key={i.id} className="py-2.5 flex justify-between items-center">
                <div>
                  <div className="font-bold">
                    {i.invoiceNumber} • {language === 'ar' ? (customers.find(c => c.id === i.customerId)?.nameAr || i.customerName) : i.customerName}
                  </div>
                  <div className="text-[10px] text-slate-400">{i.date}</div>
                </div>
                <div className="font-black text-emerald-600">{i.grandTotal.toFixed(2)} {settings.currency}</div>
              </div>
            ))}
          </div>
        )}

        {activeReport === 'inventory' && (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {products.map(p => (
              <div key={p.id} className="py-2.5 flex justify-between items-center">
                <div>
                  <div className="font-bold">
                    {language === 'ar' ? (p.nameAr || p.nameEn) : p.nameEn} ({p.partNumber})
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {language === 'ar' ? `المستودع: الرئيسي • الرف: ${p.rackLocation.replace('Rack', 'رف')}` : `Warehouse: ${p.warehouseLocation} • Rack: ${p.rackLocation}`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {language === 'ar' ? 'الكمية: ' : 'Qty: '}{p.currentStock} {language === 'ar' ? (p.unit === 'Set' ? 'طقم' : p.unit === 'Pcs' ? 'قطعة' : p.unit) : p.unit}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {language === 'ar' ? 'قيمة الأصول: ' : 'Asset Value: '}{(p.costPrice * p.currentStock).toFixed(2)} {settings.currency}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeReport === 'customers' && (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {customers.map(c => (
              <div key={c.id} className="py-2.5 flex justify-between items-center">
                <div>
                  <div className="font-bold">
                    {language === 'ar' ? (c.nameAr || c.name) : c.name} ({language === 'ar' ? (c.type === 'retail' ? 'أفراد' : c.type === 'workshop' ? 'ورشة' : c.type === 'fleet' ? 'أسطول' : 'جملة') : c.type})
                  </div>
                  <div className="text-[10px] text-slate-400">{language === 'ar' ? 'الهاتف:' : 'Tel:'} {c.phone}</div>
                </div>
                <div className="font-black text-rose-600">{c.balance.toFixed(2)} {settings.currency}</div>
              </div>
            ))}
          </div>
        )}

        {activeReport === 'profit' && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between font-bold">
              <span>{language === 'ar' ? 'إجمالي إيرادات المبيعات:' : 'Gross Revenues from Sales:'}</span>
              <span className="text-emerald-600">+{totalSalesAmount.toFixed(2)} {settings.currency}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>{language === 'ar' ? 'تكلفة المشتريات والقطع:' : 'Cost of Goods Purchased:'}</span>
              <span className="text-rose-600">-{totalPurchasesAmount.toFixed(2)} {settings.currency}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2 text-sm">
              <span>{language === 'ar' ? 'صافي الهامش التقديري:' : 'Estimated Net Margin:'}</span>
              <span className="text-indigo-600">{(totalSalesAmount - totalPurchasesAmount).toFixed(2)} {settings.currency}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
