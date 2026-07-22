import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../Common/Badge';
import {
  Boxes,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  AlertTriangle,
  Building2,
  Clock,
  Plus,
  X,
  FileCheck2,
  Trash2
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { products, stockMovements, addStockMovement, settings, language, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'movements' | 'warehouses' | 'low_stock' | 'adjust'>('movements');
  const [showAdjustModal, setShowAdjustModal] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [adjustQty, setAdjustQty] = useState<number>(5);
  const [adjustType, setAdjustType] = useState<'stock_in' | 'stock_out' | 'damage' | 'adjustment'>('stock_in');
  const [adjustReason, setAdjustReason] = useState('Routine Physical Stock Audit');

  const lowStockItems = products.filter(p => p.currentStock <= p.minStock);

  const handleExecuteAdjustment = () => {
    const targetProduct = products.find(p => p.id === selectedProductId);
    if (!targetProduct) return;

    const delta = adjustType === 'stock_in' ? adjustQty : -adjustQty;
    const newStock = Math.max(0, targetProduct.currentStock + delta);

    addStockMovement({
      productId: targetProduct.id,
      productName: language === 'ar' ? targetProduct.nameAr : targetProduct.nameEn,
      partNumber: targetProduct.partNumber,
      type: adjustType,
      quantity: delta,
      previousStock: targetProduct.currentStock,
      newStock,
      referenceNo: `ADJ-${Date.now().toString().slice(-4)}`,
      warehouseFrom: targetProduct.warehouseLocation,
      performedBy: currentUser.name,
      reason: adjustReason
    });

    setShowAdjustModal(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Boxes className="w-6 h-6 text-indigo-600" />
            <span>{language === 'ar' ? 'إدارة المخزون والحركات' : 'Inventory & Warehouse Operations'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'ar'
              ? 'تتبع حركات التوريد، التعديل، التحويل بين المستودعات، والقطع التالفة'
              : 'Track stock-in, stock-out, warehouse transfers, physical counts, and damaged stock'}
          </p>
        </div>

        <button
          onClick={() => setShowAdjustModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ar' ? 'تسجيل حركة مخزنية' : 'Log Stock Movement'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('movements')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'movements'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {language === 'ar' ? 'سجل الحركات' : 'Movement Logs'} ({stockMovements.length})
        </button>

        <button
          onClick={() => setActiveTab('low_stock')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
            activeTab === 'low_stock'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'تنبيهات النقص' : 'Low Stock Alerts'}</span>
          <span className="px-1.5 py-0.5 bg-amber-950/40 text-white text-[9px] rounded-full font-black">
            {lowStockItems.length}
          </span>
        </button>
      </div>

      {activeTab === 'movements' ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-extrabold">
                  <th className="p-3.5">{language === 'ar' ? 'التاريخ والمرجع' : 'Date & Reference'}</th>
                  <th className="p-3.5">{language === 'ar' ? 'اسم قطعة الغيار' : 'Spare Part Name'}</th>
                  <th className="p-3.5">{language === 'ar' ? 'نوع الحركة' : 'Type'}</th>
                  <th className="p-3.5 text-center">{language === 'ar' ? 'مقدار التغيير' : 'Change Qty'}</th>
                  <th className="p-3.5 text-center">{language === 'ar' ? 'المخزون السابق ← الجديد' : 'Prev → New'}</th>
                  <th className="p-3.5">{language === 'ar' ? 'بواسطة' : 'Performed By'}</th>
                  <th className="p-3.5">{language === 'ar' ? 'السبب والبيان' : 'Reason / Notes'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {stockMovements.map(m => {
                  const getMovementLabel = (type: string, qty: number) => {
                    if (language !== 'ar') return type.toUpperCase();
                    if (type === 'stock_in' || qty > 0) return 'توريد / إضافة +';
                    if (type === 'stock_out') return 'صرف / تنزيل -';
                    if (type === 'damage') return 'قطع تالفة -';
                    if (type === 'adjustment') return 'تسوية جردية';
                    return type.toUpperCase();
                  };

                  return (
                    <tr key={m.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">{m.referenceNo}</div>
                        <div className="text-[10px] text-slate-500">
                          {new Date(m.date).toLocaleDateString()} {new Date(m.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {language === 'ar' ? (m.productNameAr || m.productName) : m.productName}
                        </div>
                        <div className="text-[10px] text-indigo-600 font-mono font-semibold">{m.partNumber}</div>
                      </td>

                      <td className="p-3.5">
                        <Badge variant={m.quantity > 0 ? 'success' : 'danger'}>
                          {getMovementLabel(m.type, m.quantity)}
                        </Badge>
                      </td>

                    <td className="p-3.5 text-center font-black text-sm">
                      <span className={m.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                        {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                      </span>
                    </td>

                    <td className="p-3.5 text-center font-semibold text-slate-600 dark:text-slate-300">
                      {m.previousStock} → <span className="font-extrabold text-slate-900 dark:text-white">{m.newStock}</span>
                    </td>

                    <td className="p-3.5 font-bold text-slate-700 dark:text-slate-300">
                      {language === 'ar'
                        ? (m.performedBy === 'Tariq Al-Mansoor' ? 'طارق المنصور' : m.performedBy === 'Fahad Sales' ? 'فهد - مبيعات' : m.performedBy === 'Sultan Warehouse' ? 'سلطان المستودع' : m.performedBy)
                        : m.performedBy}
                    </td>

                    <td className="p-3.5 text-slate-500 text-[11px]">
                      {language === 'ar' ? (m.reasonAr || (m.reason === 'POS Sale' ? 'مبيعات مباشرة من الكاشير' : m.reason === 'New Goods Receiving from Wallan' ? 'استلام شحنة بضاعة جديدة من شركة الوعلان' : m.reason)) : (m.reason || 'N/A')}
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lowStockItems.map(p => (
            <div key={p.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-amber-500/30 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <img src={p.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{language === 'ar' ? p.nameAr : p.nameEn}</h4>
                  <div className="text-[10px] text-indigo-600 font-mono font-bold">OEM: {p.partNumber}</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500">{language === 'ar' ? 'المخزون الحالي:' : 'Current Stock:'}</span>
                  <div className="font-black text-rose-600 text-sm">{p.currentStock} {p.unit}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500">{language === 'ar' ? 'حد الطلب الأدنى:' : 'Min Threshold:'}</span>
                  <div className="font-bold text-slate-700 dark:text-slate-300">{p.minStock} {p.unit}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADJUSTMENT MODAL */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-sm">{language === 'ar' ? 'تسجيل تعديل / حركة مخزنية جديدة' : 'Log Manual Stock Adjustment'}</h3>
              <button onClick={() => setShowAdjustModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold">{language === 'ar' ? 'اختر قطعة الغيار:' : 'Select Spare Part:'}</label>
                <select
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                  className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border rounded-lg font-bold"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {language === 'ar' ? p.nameAr : p.nameEn} ({p.partNumber}) - {language === 'ar' ? `المخزون الحالي: ${p.currentStock}` : `Stock: ${p.currentStock}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold">{language === 'ar' ? 'نوع حركة المخزون:' : 'Movement Type:'}</label>
                <select
                  value={adjustType}
                  onChange={e => setAdjustType(e.target.value as any)}
                  className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border rounded-lg font-bold"
                >
                  <option value="stock_in">{language === 'ar' ? 'إضافة مخزون (توريد +)' : 'Stock In (+ Add Stock)'}</option>
                  <option value="stock_out">{language === 'ar' ? 'صرف مخزون (تنزيل -)' : 'Stock Out (- Remove Stock)'}</option>
                  <option value="damage">{language === 'ar' ? 'قطع تالفة / تالف (-)' : 'Damaged Stock (- Scrap)'}</option>
                  <option value="adjustment">{language === 'ar' ? 'تسوية جردية (تصحيح)' : 'Audit Adjustment (+/- Correction)'}</option>
                </select>
              </div>

              <div>
                <label className="font-bold">{language === 'ar' ? 'الكمية:' : 'Quantity Adjustment:'}</label>
                <input
                  type="number"
                  min="1"
                  value={adjustQty}
                  onChange={e => setAdjustQty(parseInt(e.target.value) || 1)}
                  className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="font-bold">{language === 'ar' ? 'السبب / مرجع التسوية:' : 'Reason / Reference:'}</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                  className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border rounded-lg text-xs"
                />
              </div>
            </div>

            <button
              onClick={handleExecuteAdjustment}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all mt-4"
            >
              {language === 'ar' ? 'تأكيد وحفظ الحركة المخزنية' : 'COMMIT INVENTORY ADJUSTMENT'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
