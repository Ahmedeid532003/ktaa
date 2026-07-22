import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../Common/Badge';
import {
  ShoppingBag,
  Plus,
  Search,
  Truck,
  FileCheck,
  CheckCircle2,
  X
} from 'lucide-react';

export const PurchasesView: React.FC = () => {
  const { purchaseOrders, suppliers, products, addPurchaseOrder, receivePurchaseOrder, settings, language } = useApp();
  const [showPoModal, setShowPoModal] = useState(false);

  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [orderQty, setOrderQty] = useState(20);
  const [orderCost, setOrderCost] = useState(100);

  const handleCreatePO = () => {
    const supp = suppliers.find(s => s.id === selectedSupplierId);
    const prod = products.find(p => p.id === selectedProductId);
    if (!supp || !prod) return;

    const subtotal = orderQty * orderCost;
    const taxAmount = (subtotal * settings.taxRate) / 100;
    const grandTotal = subtotal + taxAmount;

    addPurchaseOrder({
      poNumber: `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      supplierId: supp.id,
      supplierName: supp.companyName,
      date: new Date().toISOString().split('T')[0],
      status: 'ordered',
      items: [
        {
          productId: prod.id,
          productName: language === 'ar' ? prod.nameAr : prod.nameEn,
          partNumber: prod.partNumber,
          quantity: orderQty,
          costPrice: orderCost,
          total: subtotal
        }
      ],
      subtotal,
      taxAmount,
      grandTotal,
      paidAmount: 0
    });

    setShowPoModal(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-indigo-600" />
            <span>{language === 'ar' ? 'أوامر الشراء والتوريد' : 'Purchase Orders & Goods Receiving'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'ar'
              ? 'إدارة طلبيات قطع الغيار من الموردين، استلام البضائع، ومتابعة الفواتير'
              : 'Manage supplier restocking orders, goods receipt notes (GRN), and supplier payables'}
          </p>
        </div>

        <button
          onClick={() => setShowPoModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ar' ? 'إنشاء أمر شراء PO' : 'New Purchase Order'}</span>
        </button>
      </div>

      {/* PO Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b text-slate-500 uppercase font-extrabold">
                <th className="p-3.5">{language === 'ar' ? 'رقم الطلب PO' : 'PO Number'}</th>
                <th className="p-3.5">{language === 'ar' ? 'المورد' : 'Supplier'}</th>
                <th className="p-3.5">{language === 'ar' ? 'تاريخ الطلب' : 'Order Date'}</th>
                <th className="p-3.5">{language === 'ar' ? 'تفاصيل الأصناف' : 'Items Summary'}</th>
                <th className="p-3.5 text-right">{language === 'ar' ? 'الإجمالي الكلي' : 'Grand Total'}</th>
                <th className="p-3.5 text-center">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                <th className="p-3.5 text-center">{language === 'ar' ? 'الإجراء' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {purchaseOrders.map(po => (
                <tr key={po.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-mono font-extrabold text-indigo-600">
                    {po.poNumber}
                  </td>

                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                    {language === 'ar'
                      ? (suppliers.find(s => s.id === po.supplierId)?.companyNameAr || po.supplierName)
                      : po.supplierName}
                  </td>

                  <td className="p-3.5 text-slate-500">
                    {po.date}
                  </td>

                  <td className="p-3.5">
                    {po.items.map((it, idx) => {
                      const prod = products.find(p => p.id === it.productId);
                      const pName = language === 'ar' ? (prod?.nameAr || it.productName) : it.productName;
                      return (
                        <div key={idx} className="font-medium text-slate-700 dark:text-slate-300">
                          {pName} ({it.quantity} x {it.costPrice} {settings.currency})
                        </div>
                      );
                    })}
                  </td>

                  <td className="p-3.5 text-right font-black text-slate-900 dark:text-white">
                    {po.grandTotal.toFixed(2)} {settings.currency}
                  </td>

                  <td className="p-3.5 text-center">
                    <Badge variant={po.status === 'received' ? 'success' : 'warning'}>
                      {language === 'ar' ? (po.status === 'received' ? 'تم الاستلام بالكامل' : 'قيد التوريد') : po.status.toUpperCase()}
                    </Badge>
                  </td>

                  <td className="p-3.5 text-center">
                    {po.status !== 'received' ? (
                      <button
                        onClick={() => receivePurchaseOrder(po.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-sm transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'استلام وتحديث المخزون' : 'Receive Goods'}</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
                        {language === 'ar' ? 'مكتمل' : 'Received'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE PO MODAL */}
      {showPoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-sm">{language === 'ar' ? 'إنشاء امر شراء توريد جديد' : 'Create New Purchase Order'}</h3>
              <button onClick={() => setShowPoModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold">{language === 'ar' ? 'المورد:' : 'Supplier:'}</label>
                <select
                  value={selectedSupplierId}
                  onChange={e => setSelectedSupplierId(e.target.value)}
                  className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border rounded-lg font-bold"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>
                      {language === 'ar' ? (s.companyNameAr || s.companyName) : s.companyName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold">{language === 'ar' ? 'القطعة المطلوبة:' : 'Product to Order:'}</label>
                <select
                  value={selectedProductId}
                  onChange={e => {
                    setSelectedProductId(e.target.value);
                    const matched = products.find(p => p.id === e.target.value);
                    if (matched) setOrderCost(matched.costPrice);
                  }}
                  className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border rounded-lg font-bold"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{language === 'ar' ? p.nameAr : p.nameEn} ({p.partNumber})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold">{language === 'ar' ? 'الكمية:' : 'Quantity:'}</label>
                <input
                  type="number"
                  min="1"
                  value={orderQty}
                  onChange={e => setOrderQty(parseInt(e.target.value) || 1)}
                  className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="font-bold">{language === 'ar' ? `سعر تكلفة القطعة (${settings.currency}):` : `Unit Cost Price (${settings.currency}):`}</label>
                <input
                  type="number"
                  value={orderCost}
                  onChange={e => setOrderCost(parseFloat(e.target.value) || 0)}
                  className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border rounded-lg font-bold"
                />
              </div>
            </div>

            <button
              onClick={handleCreatePO}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all mt-4"
            >
              {language === 'ar' ? 'تأكيد وإرسال أمر الشراء' : 'CREATE & SEND PURCHASE ORDER'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
