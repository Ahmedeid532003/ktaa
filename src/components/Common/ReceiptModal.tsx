import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Printer, X, Download, Share2, FileText, CheckCircle } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { receiptInvoice, customers, closeReceiptModal, settings, language } = useApp();
  const [printFormat, setPrintFormat] = useState<'thermal' | 'a4'>('thermal');

  if (!receiptInvoice) return null;

  const inv = receiptInvoice;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden my-8">
        {/* Header Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {language === 'ar' ? 'فاتورة ضريبية' : 'Tax Invoice'} #{inv.invoiceNumber}
              </h3>
              <p className="text-xs text-slate-500">
                {new Date(inv.date).toLocaleString()} • {inv.branchName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-200 dark:bg-slate-700 p-1 rounded-lg text-xs font-medium">
              <button
                onClick={() => setPrintFormat('thermal')}
                className={`px-3 py-1 rounded-md transition-all ${
                  printFormat === 'thermal'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {language === 'ar' ? 'حراري (80mm)' : 'Thermal (80mm)'}
              </button>
              <button
                onClick={() => setPrintFormat('a4')}
                className={`px-3 py-1 rounded-md transition-all ${
                  printFormat === 'a4'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {language === 'ar' ? 'ورق A4' : 'A4 Sheet'}
              </button>
            </div>

            <button
              onClick={closeReceiptModal}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Preview Sheet */}
        <div className="p-6 bg-slate-100 dark:bg-slate-950 max-h-[70vh] overflow-y-auto">
          {printFormat === 'thermal' ? (
            /* Thermal Receipt 80mm Layout */
            <div className="max-w-[340px] mx-auto bg-white text-slate-900 p-5 rounded-lg shadow-md font-mono text-xs border border-slate-300 leading-tight">
              <div className="text-center pb-3 border-b border-dashed border-slate-400 mb-3">
                <h2 className="font-bold text-sm tracking-tight">{settings.companyNameAr}</h2>
                <h3 className="font-bold text-xs text-slate-700">{settings.companyNameEn}</h3>
                <p className="text-[10px] text-slate-600 mt-1">{settings.addressAr}</p>
                <p className="text-[10px] text-slate-600">Tel: {settings.phone}</p>
                <p className="text-[10px] font-bold mt-1 text-indigo-900">VAT: {settings.taxNumber}</p>
                <p className="text-[10px] mt-0.5">CR: {settings.crNumber}</p>
              </div>

              <div className="py-2 border-b border-dashed border-slate-400 mb-3 space-y-1">
                <div className="flex justify-between">
                  <span>Invoice #:</span>
                  <span className="font-bold">{inv.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{new Date(inv.date).toLocaleDateString()} {new Date(inv.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cashier:</span>
                  <span>{inv.cashierName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-semibold">
                    {language === 'ar' ? (customers.find(c => c.id === inv.customerId)?.nameAr || inv.customerName) : inv.customerName}
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left mb-3">
                <thead>
                  <tr className="border-b border-slate-400 text-[10px] uppercase">
                    <th className="py-1">Item / Part#</th>
                    <th className="py-1 text-center">Qty</th>
                    <th className="py-1 text-right">Price</th>
                    <th className="py-1 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {inv.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-1.5 pr-1">
                        <div className="font-bold text-[11px] leading-tight">
                          {language === 'ar' ? (item.product.nameAr || item.product.nameEn) : item.product.nameEn}
                        </div>
                        <div className="text-[9px] text-slate-600 font-semibold">{item.product.partNumber}</div>
                      </td>
                      <td className="py-1.5 text-center font-bold">{item.quantity}</td>
                      <td className="py-1.5 text-right">{item.unitPrice.toFixed(2)}</td>
                      <td className="py-1.5 text-right font-bold">{item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary */}
              <div className="border-t border-dashed border-slate-400 pt-2 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{inv.subtotal.toFixed(2)} {settings.currency}</span>
                </div>
                {inv.invoiceDiscount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Discount:</span>
                    <span>-{inv.invoiceDiscount.toFixed(2)} {settings.currency}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>VAT ({settings.taxRate}%):</span>
                  <span>{inv.taxAmount.toFixed(2)} {settings.currency}</span>
                </div>
                <div className="flex justify-between font-bold text-sm border-t border-slate-800 pt-1 text-slate-900">
                  <span>GRAND TOTAL:</span>
                  <span>{inv.grandTotal.toFixed(2)} {settings.currency}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-600 pt-1">
                  <span>Paid ({inv.payments.map(p => p.method).join(', ')}):</span>
                  <span>{inv.paidAmount.toFixed(2)} {settings.currency}</span>
                </div>
                {inv.changeDue > 0 && (
                  <div className="flex justify-between text-[10px] text-emerald-700 font-bold">
                    <span>Change Returned:</span>
                    <span>{inv.changeDue.toFixed(2)} {settings.currency}</span>
                  </div>
                )}
              </div>

              {/* QR Code Placeholder */}
              <div className="mt-4 pt-3 border-t border-dashed border-slate-400 text-center">
                <div className="w-24 h-24 bg-slate-900 text-white mx-auto flex items-center justify-center rounded p-2 text-[8px] tracking-widest text-center leading-3">
                  [ZATCA VAT QR CODE]
                </div>
                <p className="text-[9px] text-slate-500 mt-2 whitespace-pre-line">{settings.printThermalFooter}</p>
              </div>
            </div>
          ) : (
            /* Standard A4 Tax Invoice Format */
            <div className="bg-white text-slate-900 p-8 rounded-lg shadow-md border border-slate-300 text-sm">
              <div className="flex justify-between items-start border-b-2 border-indigo-600 pb-6 mb-6">
                <div>
                  <h1 className="text-xl font-bold text-indigo-950">{settings.companyNameAr}</h1>
                  <h2 className="text-base font-semibold text-slate-700">{settings.companyNameEn}</h2>
                  <p className="text-xs text-slate-600 mt-1">{settings.addressAr} • Tel: {settings.phone}</p>
                  <p className="text-xs font-semibold text-slate-800">VAT Reg No: {settings.taxNumber}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-900 font-bold text-xs rounded uppercase mb-2">
                    Official Tax Invoice
                  </span>
                  <div className="text-base font-bold text-slate-900">Invoice: #{inv.invoiceNumber}</div>
                  <div className="text-xs text-slate-600">Date: {new Date(inv.date).toLocaleDateString()}</div>
                  <div className="text-xs text-slate-600">Status: <span className="font-bold text-emerald-600 uppercase">{inv.paymentStatus}</span></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg mb-6 border border-slate-200 text-xs">
                <div>
                  <h4 className="font-bold text-slate-700 uppercase mb-1">Customer Info / بيانات العميل</h4>
                  <p className="font-bold text-slate-900">
                    {language === 'ar' ? (customers.find(c => c.id === inv.customerId)?.nameAr || inv.customerName) : inv.customerName}
                  </p>
                  <p className="text-slate-600">Phone: {inv.customerPhone || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-700 uppercase mb-1">Sale Details / تفاصيل العملية</h4>
                  <p className="text-slate-600">Cashier: {inv.cashierName}</p>
                  <p className="text-slate-600">Branch: {inv.branchName}</p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left border-collapse mb-6 text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 uppercase font-bold">
                    <th className="p-2.5">Part #</th>
                    <th className="p-2.5">Description</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Unit Price</th>
                    <th className="p-2.5 text-right">Tax ({settings.taxRate}%)</th>
                    <th className="p-2.5 text-right">Total ({settings.currency})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {inv.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-mono font-bold text-indigo-900">{item.product.partNumber}</td>
                      <td className="p-2.5">
                        <div className="font-semibold text-slate-900">
                          {language === 'ar' ? (item.product.nameAr || item.product.nameEn) : item.product.nameEn}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {language === 'ar' ? item.product.nameEn : item.product.nameAr}
                        </div>
                      </td>
                      <td className="p-2.5 text-center font-bold">{item.quantity}</td>
                      <td className="p-2.5 text-right">{item.unitPrice.toFixed(2)}</td>
                      <td className="p-2.5 text-right">{((item.total * settings.taxRate) / 100).toFixed(2)}</td>
                      <td className="p-2.5 text-right font-bold">{item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-end border-t border-slate-200 pt-4">
                <div className="text-xs text-slate-500 max-w-sm">
                  <p className="font-bold text-slate-700">Terms & Conditions:</p>
                  <p>1. Please verify spare parts before installation.</p>
                  <p>2. Electrical parts are non-refundable once opened.</p>
                </div>

                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold">{inv.subtotal.toFixed(2)} {settings.currency}</span>
                  </div>
                  {inv.invoiceDiscount > 0 && (
                    <div className="flex justify-between text-rose-600">
                      <span>Discount:</span>
                      <span>-{inv.invoiceDiscount.toFixed(2)} {settings.currency}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>VAT ({settings.taxRate}%):</span>
                    <span>{inv.taxAmount.toFixed(2)} {settings.currency}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t border-slate-300 pt-2 text-indigo-950">
                    <span>Grand Total:</span>
                    <span>{inv.grandTotal.toFixed(2)} {settings.currency}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle className="w-4 h-4" />
            <span>Ready to Print / Saved to Database</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={closeReceiptModal}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {language === 'ar' ? 'إغلاق' : 'Close'}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all transform active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'ar' ? 'طباعة الفاتورة' : 'Print Invoice'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
