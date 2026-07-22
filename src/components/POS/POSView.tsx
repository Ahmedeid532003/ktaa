import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, Customer, InvoicePayment } from '../../types';
import { Badge } from '../Common/Badge';
import { getCategoryLabel } from '../Products/ProductsView';
import {
  Search,
  Barcode,
  Grid,
  Heart,
  Plus,
  Minus,
  Trash2,
  UserPlus,
  DollarSign,
  CreditCard,
  Tag,
  PauseCircle,
  PlayCircle,
  RotateCcw,
  Printer,
  Check,
  Percent,
  Edit2,
  X,
  Volume2,
  Car,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export const POSView: React.FC = () => {
  const {
    products,
    customers,
    cart,
    addToCart,
    removeFromCart,
    updateCartQty,
    updateCartItemPrice,
    updateCartItemDiscount,
    clearCart,
    posCustomer,
    setPosCustomer,
    invoiceDiscount,
    invoiceDiscountType,
    setInvoiceDiscount,
    processCheckout,
    holdCurrentInvoice,
    resumeHeldInvoice,
    heldInvoices,
    processReturnInvoice,
    invoices,
    settings,
    currentUser,
    language
  } = useApp();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>(['prod-101', 'prod-103', 'prod-105']);

  // Modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHeldModal, setShowHeldModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  // Payment Form
  const [cashAmount, setCashAmount] = useState<string>('');
  const [cardAmount, setCardAmount] = useState<string>('');
  const [creditAmount, setCreditAmount] = useState<string>('');
  const [paymentNotes, setPaymentNotes] = useState<string>('');

  // Return Form State
  const [selectedReturnInvoiceId, setSelectedReturnInvoiceId] = useState<string>('');
  const [returnQtys, setReturnQtys] = useState<{ [productId: string]: number }>({});

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input on mount
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Filter Categories
  const categories = ['All', 'Brake System', 'Filters & Fluids', 'Ignition System', 'Suspension & Steering'];

  // Filtered Products
  const filteredProducts = products.filter(p => {
    if (onlyFavorites && !favorites.includes(p.id)) return false;
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim();
    const matchesNameEn = p.nameEn.toLowerCase().includes(q);
    const matchesNameAr = p.nameAr.toLowerCase().includes(q);
    const matchesPartNo = p.partNumber.toLowerCase().includes(q);
    const matchesOem = p.oemNumber.toLowerCase().includes(q);
    const matchesBarcode = p.barcode.includes(q);
    const matchesVehicle = p.compatibleVehicles.some(
      v =>
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.years.includes(q)
    );

    return matchesNameEn || matchesNameAr || matchesPartNo || matchesOem || matchesBarcode || matchesVehicle;
  });

  // Calculate totals
  const subtotal = cart.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
  const itemDiscounts = cart.reduce((acc, i) => {
    const disc =
      i.discountType === 'percentage' ? (i.unitPrice * i.quantity * i.discount) / 100 : i.discount * i.quantity;
    return acc + disc;
  }, 0);

  const netSubtotal = subtotal - itemDiscounts;
  const invoiceDiscVal =
    invoiceDiscountType === 'percentage' ? (netSubtotal * invoiceDiscount) / 100 : invoiceDiscount;

  const taxableAmount = Math.max(0, netSubtotal - invoiceDiscVal);
  const taxAmount = settings.enableTax ? (taxableAmount * settings.taxRate) / 100 : 0;
  const grandTotal = taxableAmount + taxAmount;

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => (prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]));
  };

  // Open Checkout Modal
  const handleOpenCheckout = () => {
    if (cart.length === 0) return;
    setCashAmount(grandTotal.toFixed(2));
    setCardAmount('0');
    setCreditAmount('0');
    setShowPaymentModal(true);
  };

  const handleConfirmCheckout = (method: 'cash' | 'card' | 'credit' | 'split') => {
    let payments: InvoicePayment[] = [];

    if (method === 'cash') {
      const paid = parseFloat(cashAmount) || grandTotal;
      payments = [{ method: 'cash', amount: paid }];
    } else if (method === 'card') {
      payments = [{ method: 'card', amount: grandTotal }];
    } else if (method === 'credit') {
      payments = [{ method: 'credit', amount: grandTotal }];
    } else if (method === 'split') {
      const c = parseFloat(cashAmount) || 0;
      const cd = parseFloat(cardAmount) || 0;
      const cr = parseFloat(creditAmount) || 0;
      if (c > 0) payments.push({ method: 'cash', amount: c });
      if (cd > 0) payments.push({ method: 'card', amount: cd });
      if (cr > 0) payments.push({ method: 'credit', amount: cr });
    }

    const created = processCheckout(payments, paymentNotes);
    if (created) {
      setShowPaymentModal(false);
      setPaymentNotes('');
    }
  };

  // Return invoice trigger
  const handleExecuteReturn = () => {
    if (!selectedReturnInvoiceId) return;

    const returnItemsList = Object.entries(returnQtys)
      .filter(([_, qty]) => (qty as number) > 0)
      .map(([productId, qtyToReturn]) => ({ productId, qtyToReturn: qtyToReturn as number }));

    if (returnItemsList.length === 0) return;

    processReturnInvoice(selectedReturnInvoiceId, returnItemsList, 'cash');
    setShowReturnModal(false);
    setSelectedReturnInvoiceId('');
    setReturnQtys({});
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-slate-100 dark:bg-slate-950 flex flex-col md:flex-row overflow-hidden select-none">
      {/* LEFT SECTION: Catalog & Search (60% width) */}
      <div className="flex-1 flex flex-col p-4 border-r border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Search Bar & Barcode Indicator */}
        <div className="space-y-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'ar'
                    ? 'ابحث باسم القطعة، OEM، رقم القطعة، موديل السيارة، أو الباركود...'
                    : 'Search Name, OEM #, Part #, Vehicle (Camry/Land Cruiser), Barcode...'
                }
                className="w-full pl-11 pr-10 py-3 bg-white dark:bg-slate-900 border-2 border-indigo-500/30 focus:border-indigo-600 rounded-2xl text-sm text-slate-900 dark:text-white font-medium shadow-sm focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="px-3 py-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-2xl flex items-center gap-2 text-xs font-bold">
              <Barcode className="w-5 h-5" />
              <span className="hidden lg:inline">{language === 'ar' ? 'الماسح نشط' : 'Scanner Ready'}</span>
            </div>
          </div>

          {/* Categories Bar & Favorite Toggle */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                onlyFavorites
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-white' : 'text-rose-500'}`} />
              <span>{language === 'ar' ? 'المفضلة' : 'Favorites'}</span>
            </button>

            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                {getCategoryLabel(cat, language)}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredProducts.map(product => {
              const isFav = favorites.includes(product.id);
              const isOut = product.currentStock <= 0;

              return (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className={`group relative bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden p-3 flex flex-col justify-between hover:shadow-lg active:scale-98 ${
                    isOut
                      ? 'opacity-60 border-rose-300 dark:border-rose-900'
                      : 'border-slate-200 dark:border-slate-800 hover:border-indigo-500'
                  }`}
                >
                  {/* Top Image & Favorite */}
                  <div className="relative h-28 w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-2">
                    <img
                      src={product.image}
                      alt={product.nameEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={e => toggleFavorite(product.id, e)}
                      className="absolute top-1.5 right-1.5 p-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    <div className="absolute bottom-1.5 left-1.5">
                      <Badge variant={product.isOriginal ? 'primary' : 'neutral'}>
                        {product.isOriginal 
                          ? (language === 'ar' ? 'أصلي OEM' : 'OEM Original') 
                          : (language === 'ar' ? 'تجاري / بديل' : 'Aftermarket')}
                      </Badge>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                      {language === 'ar' ? (product.nameAr || product.nameEn) : product.nameEn}
                    </h4>
                    <p className="text-[10px] font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                      {language === 'ar' ? `رقم القطعة: ${product.partNumber}` : `PART: ${product.partNumber}`}
                    </p>
                    <p className="text-[9px] text-slate-500 truncate flex items-center gap-1">
                      <Car className="w-3 h-3 text-slate-400" />
                      <span>
                        {language === 'ar' && product.compatibleVehicles[0]?.make === 'Toyota' ? 'تويوتا' :
                         language === 'ar' && product.compatibleVehicles[0]?.make === 'Lexus' ? 'لكزس' :
                         language === 'ar' && product.compatibleVehicles[0]?.make === 'Hyundai' ? 'هيونداي' :
                         language === 'ar' && product.compatibleVehicles[0]?.make === 'Kia' ? 'كيا' :
                         language === 'ar' && product.compatibleVehicles[0]?.make === 'Nissan' ? 'نيسان' :
                         language === 'ar' && product.compatibleVehicles[0]?.make === 'Honda' ? 'هوندا' :
                         language === 'ar' && product.compatibleVehicles[0]?.make === 'Ford' ? 'فورد' :
                         product.compatibleVehicles[0]?.make} {product.compatibleVehicles[0]?.model}
                      </span>
                    </p>
                  </div>

                  {/* Price & Add Button */}
                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="text-sm font-black text-slate-900 dark:text-white">
                        {product.sellingPrice.toFixed(2)} <span className="text-[10px] text-slate-400">{settings.currency}</span>
                      </div>
                      <div className="text-[9px] font-semibold text-emerald-600">
                        {language === 'ar' ? `المخزون: ${product.currentStock}` : `Stock: ${product.currentStock}`}
                      </div>
                    </div>

                    <button
                      className={`p-2 rounded-xl transition-all shadow-sm ${
                        isOut
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION: Cart & POS Controls (40% width) */}
      <div className="w-full md:w-[420px] lg:w-[480px] bg-white dark:bg-slate-900 flex flex-col h-full border-l border-slate-200 dark:border-slate-800 shadow-xl">
        {/* Customer Bar */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
              {posCustomer.name.charAt(0)}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{language === 'ar' ? (posCustomer.nameAr || posCustomer.name) : posCustomer.name}</span>
                <Badge variant={posCustomer.type === 'retail' ? 'neutral' : 'primary'}>
                  {language === 'ar'
                    ? (posCustomer.type === 'retail' ? 'أفراد / سفاري' : posCustomer.type === 'workshop' ? 'ورشة' : posCustomer.type === 'fleet' ? 'أسطول' : 'جملة')
                    : posCustomer.type}
                </Badge>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {language === 'ar' ? 'الرصيد: ' : 'Balance: '}<span className={posCustomer.balance > 0 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>{posCustomer.balance.toFixed(2)} {settings.currency}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowCustomerModal(true)}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
          >
            {language === 'ar' ? 'تغيير' : 'Change'}
          </button>
        </div>

        {/* Cart Action Toolbar */}
        <div className="p-2 bg-slate-100 dark:bg-slate-950 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={holdCurrentInvoice}
              disabled={cart.length === 0}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 rounded-lg font-bold disabled:opacity-40"
            >
              <PauseCircle className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تعليق' : 'Hold'}</span>
            </button>

            <button
              onClick={() => setShowHeldModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-500/20 rounded-lg font-bold"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>
                {language === 'ar' ? 'المعلقة' : 'Held'} ({heldInvoices.length})
              </span>
            </button>

            <button
              onClick={() => setShowReturnModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-500/10 text-rose-700 dark:text-rose-400 hover:bg-rose-500/20 rounded-lg font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'مرتجع' : 'Return'}</span>
            </button>
          </div>

          <button
            onClick={clearCart}
            disabled={cart.length === 0}
            className="text-slate-400 hover:text-rose-600 p-1 rounded disabled:opacity-30"
            title="Clear Cart"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Sparkles className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-2 stroke-1" />
              <p className="text-xs font-bold text-slate-500">{language === 'ar' ? 'السلة فارغة حالياً' : 'Cart is Empty'}</p>
              <p className="text-[10px] text-slate-400 mt-1">
                {language === 'ar' ? 'انقر على المنتجات لإضافتها مباشرة' : 'Click products on the left or scan barcode to add'}
              </p>
            </div>
          ) : (
            cart.map(item => (
              <div
                key={item.product.id}
                className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <img src={item.product.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                        {language === 'ar' ? item.product.nameAr : item.product.nameEn}
                      </div>
                      <div className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                        {item.product.partNumber}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quantity & Unit Price controls */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5">
                    <button
                      onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                    >
                      <Minus className="w-3 h-3 text-slate-600 dark:text-slate-300" />
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={e => updateCartQty(item.product.id, parseInt(e.target.value) || 1)}
                      className="w-8 text-center font-bold text-xs bg-transparent text-slate-900 dark:text-white focus:outline-none"
                    />
                    <button
                      onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                    >
                      <Plus className="w-3 h-3 text-slate-600 dark:text-slate-300" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-[11px] text-slate-500">
                      @{item.unitPrice.toFixed(2)}
                    </div>
                    <div className="font-black text-xs text-slate-900 dark:text-white">
                      {item.total.toFixed(2)} {settings.currency}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Calculation */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>{language === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
              <span className="font-semibold">{subtotal.toFixed(2)} {settings.currency}</span>
            </div>

            {/* Invoice Discount Field */}
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                <span>{language === 'ar' ? 'خصم الفاتورة:' : 'Invoice Discount:'}</span>
              </span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={invoiceDiscount || ''}
                  onChange={e => setInvoiceDiscount(parseFloat(e.target.value) || 0, invoiceDiscountType)}
                  placeholder="0"
                  className="w-16 px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-right font-bold text-xs"
                />
                <button
                  onClick={() =>
                    setInvoiceDiscount(invoiceDiscount, invoiceDiscountType === 'fixed' ? 'percentage' : 'fixed')
                  }
                  className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-bold text-[10px]"
                >
                  {invoiceDiscountType === 'fixed' ? settings.currency : '%'}
                </button>
              </div>
            </div>

            {settings.enableTax && (
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{language === 'ar' ? `ضريبة القيمة المضافة (${settings.taxRate}%):` : `VAT (${settings.taxRate}%):`}</span>
                <span>{taxAmount.toFixed(2)} {settings.currency}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
              <span className="font-extrabold text-sm">{language === 'ar' ? 'الإجمالي النهائي المستحق:' : 'TOTAL PAYABLE:'}</span>
              <span className="font-black text-xl text-indigo-600 dark:text-indigo-400">
                {grandTotal.toFixed(2)} <span className="text-xs font-normal">{settings.currency}</span>
              </span>
            </div>
          </div>

          {/* Big Checkout Button */}
          <button
            onClick={handleOpenCheckout}
            disabled={cart.length === 0}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-600/30 transition-all transform active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            <span>{language === 'ar' ? 'الدفع وإصدار الفاتورة' : 'COMPLETE CHECKOUT'}</span>
          </button>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-500" />
                <span>{language === 'ar' ? 'طريقة الدفع' : 'Select Payment Method'}</span>
              </h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <span className="text-xs text-slate-500">Amount Due</span>
              <div className="text-2xl font-black text-emerald-600">
                {grandTotal.toFixed(2)} {settings.currency}
              </div>
            </div>

            {/* Payment Mode Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleConfirmCheckout('cash')}
                className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 rounded-xl text-center hover:bg-emerald-100 transition-all"
              >
                <DollarSign className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <span className="block text-xs font-bold text-emerald-800 dark:text-emerald-300">CASH</span>
              </button>

              <button
                onClick={() => handleConfirmCheckout('card')}
                className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border-2 border-indigo-500 rounded-xl text-center hover:bg-indigo-100 transition-all"
              >
                <CreditCard className="w-6 h-6 text-indigo-600 mx-auto mb-1" />
                <span className="block text-xs font-bold text-indigo-800 dark:text-indigo-300">MADA / CARD</span>
              </button>

              <button
                onClick={() => handleConfirmCheckout('credit')}
                className="p-3 bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-500 rounded-xl text-center hover:bg-amber-100 transition-all"
              >
                <ShieldAlert className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                <span className="block text-xs font-bold text-amber-800 dark:text-amber-300">CREDIT SALE</span>
              </button>
            </div>

            {/* Split Amount Inputs */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Custom Split Amounts:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500">Cash Paid</span>
                  <input
                    type="number"
                    value={cashAmount}
                    onChange={e => setCashAmount(e.target.value)}
                    className="w-full p-2 bg-slate-100 dark:bg-slate-800 border rounded-lg font-bold"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500">Card Paid</span>
                  <input
                    type="number"
                    value={cardAmount}
                    onChange={e => setCardAmount(e.target.value)}
                    className="w-full p-2 bg-slate-100 dark:bg-slate-800 border rounded-lg font-bold"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Invoice Note / Vehicle Plate:</label>
              <input
                type="text"
                value={paymentNotes}
                onChange={e => setPaymentNotes(e.target.value)}
                placeholder="e.g. Camry 2021 Plate A B C 1234"
                className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border rounded-lg text-xs"
              />
            </div>

            <button
              onClick={() => handleConfirmCheckout('split')}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              CONFIRM SPLIT / CUSTOM PAYMENT
            </button>
          </div>
        </div>
      )}

      {/* CUSTOMER SELECTION MODAL */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Select Customer Account</h3>
              <button onClick={() => setShowCustomerModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {customers.map(c => (
                <div
                  key={c.id}
                  onClick={() => {
                    setPosCustomer(c);
                    setShowCustomerModal(false);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                    c.id === posCustomer.id
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">{c.name}</div>
                    <div className="text-[10px] text-slate-500">{c.phone} • {c.vehicles.length} Vehicles</div>
                  </div>
                  {c.id === posCustomer.id && <Check className="w-4 h-4 text-indigo-600" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* HELD INVOICES MODAL */}
      {showHeldModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Suspended Invoices</h3>
              <button onClick={() => setShowHeldModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            {heldInvoices.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No held invoices currently on hold.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {heldInvoices.map(h => (
                  <div key={h.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs">{h.invoiceNumber} • {h.customerName}</div>
                      <div className="text-[10px] text-slate-500">{h.items.length} items • Total: {h.subtotal.toFixed(2)} {settings.currency}</div>
                    </div>
                    <button
                      onClick={() => {
                        resumeHeldInvoice(h.id);
                        setShowHeldModal(false);
                      }}
                      className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-lg"
                    >
                      Resume
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* RETURN MODAL */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Customer Return & Exchange</h3>
              <button onClick={() => setShowReturnModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Original Invoice:</label>
              <select
                value={selectedReturnInvoiceId}
                onChange={e => {
                  setSelectedReturnInvoiceId(e.target.value);
                  setReturnQtys({});
                }}
                className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border rounded-lg text-xs font-bold"
              >
                <option value="">-- Choose Invoice --</option>
                {invoices.filter(i => i.type === 'pos_sale').map(i => (
                  <option key={i.id} value={i.id}>
                    {i.invoiceNumber} - {i.customerName} ({i.grandTotal.toFixed(2)} {settings.currency})
                  </option>
                ))}
              </select>
            </div>

            {selectedReturnInvoiceId && (
              <div className="space-y-2 border-t pt-3">
                <span className="text-xs font-bold">Select quantities to return:</span>
                {invoices
                  .find(i => i.id === selectedReturnInvoiceId)
                  ?.items.map(item => (
                    <div key={item.product.id} className="flex items-center justify-between text-xs p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div>
                        <div className="font-bold">{item.product.nameEn}</div>
                        <div className="text-[10px] text-slate-500">Purchased Qty: {item.quantity}</div>
                      </div>
                      <input
                        type="number"
                        min="0"
                        max={item.quantity}
                        value={returnQtys[item.product.id] || 0}
                        onChange={e =>
                          setReturnQtys({
                            ...returnQtys,
                            [item.product.id]: Math.min(item.quantity, parseInt(e.target.value) || 0)
                          })
                        }
                        className="w-12 text-center border rounded p-1 font-bold"
                      />
                    </div>
                  ))}

                <button
                  onClick={handleExecuteReturn}
                  className="w-full mt-3 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  PROCESS RETURN & REFUND CASH
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
