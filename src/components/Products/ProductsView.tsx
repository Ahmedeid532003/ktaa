import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { Badge } from '../Common/Badge';
import {
  Search,
  Plus,
  Download,
  Edit2,
  Trash2,
  Building2,
  Car,
  X,
  Package,
  FolderPlus,
  Layers,
  Tag,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const getCategoryLabel = (category: string, lang: 'en' | 'ar') => {
  if (lang !== 'ar') return category;
  switch (category) {
    case 'All': return 'جميع الأقسام';
    case 'Brake System': return 'نظام الفرامل والقماشات';
    case 'Filters & Fluids': return 'الفلاتر والزيوت';
    case 'Ignition System': return 'نظام الإشعال والبواجي';
    case 'Suspension & Steering': return 'المساعدين والمقصات';
    case 'Electrical': return 'الكهرباء والحساسات';
    case 'Engine Parts': return 'أجزاء المحرك والسيور';
    case 'Body & Accessories': return 'البودي والإكسسوارات';
    default: return category;
  }
};

export const getBrandLabel = (brand: string, lang: 'en' | 'ar') => {
  if (lang !== 'ar') return brand;
  switch (brand) {
    case 'All': return 'جميع الماركات';
    case 'Toyota Genuine Parts': return 'تويوتا أصلي (Toyota)';
    case 'Denso': return 'دينسو اليابانية (Denso)';
    case 'Bosch': return 'بوش الألمانية (Bosch)';
    case 'Mobis / Hyundai Genuine': return 'موبيس / هيونداي أصلي';
    case 'Brembo': return 'بريمبو (Brembo)';
    case 'KYB': return 'كايا أيه (KYB)';
    case 'Mobil 1': return 'موبيل 1 (Mobil 1)';
    default: return brand;
  }
};

export const ProductsView: React.FC = () => {
  const {
    products,
    categories,
    addCategory,
    deleteCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    suppliers,
    settings,
    language,
    quickSearchQuery,
    setQuickSearchQuery
  } = useApp();

  const [search, setSearch] = useState(quickSearchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedProductForDetails, setSelectedProductForDetails] = useState<Product | null>(null);

  // Modal State for Products
  const [showAddEditModal, setShowAddEditModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Modal State for Categories
  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');

  // Single Item Name input state for form
  const [singleItemName, setSingleItemName] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    nameEn: '',
    nameAr: '',
    partNumber: '',
    oemNumber: '',
    alternativeNumber: '',
    barcode: '',
    brand: 'Toyota Genuine Parts',
    category: categories[0] || 'Brake System',
    subcategory: '',
    supplierId: suppliers[0]?.id || 'sup-1',
    supplierName: suppliers[0]?.companyName || 'Supplier',
    countryOfOrigin: 'Japan',
    isOriginal: true,
    costPrice: 100,
    sellingPrice: 150,
    wholesalePrice: 130,
    minPrice: 120,
    currentStock: 20,
    minStock: 5,
    maxStock: 100,
    warehouseLocation: 'Main Warehouse',
    rackLocation: 'Rack A-01',
    shelfLocation: 'Shelf 1',
    unit: 'Pcs',
    image: 'https://images.unsplash.com/photo-1600706432522-120025f190e2?w=400&auto=format&fit=crop&q=80',
    compatibleVehicles: [{ make: 'Toyota', model: 'Camry', years: '2018-2024' }],
    status: 'active'
  });

  const brands = ['All', 'Toyota Genuine Parts', 'Denso', 'Bosch', 'Mobis / Hyundai Genuine', 'Brembo', 'KYB', 'Mobil 1'];

  // Filtered list
  const filteredProducts = products.filter(p => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (selectedBrand !== 'All' && p.brand !== selectedBrand) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    const itemName = (p.nameAr || p.nameEn).toLowerCase();
    return (
      itemName.includes(q) ||
      p.partNumber.toLowerCase().includes(q) ||
      p.oemNumber.toLowerCase().includes(q) ||
      p.barcode.includes(q) ||
      p.compatibleVehicles.some(v => v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q))
    );
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setSingleItemName('');
    setFormData({
      nameEn: '',
      nameAr: '',
      partNumber: `PART-${Math.floor(1000 + Math.random() * 9000)}`,
      oemNumber: `OEM-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: `629100${Math.floor(1000000 + Math.random() * 9000000)}`,
      brand: 'Toyota Genuine Parts',
      category: categories[0] || 'Brake System',
      supplierId: suppliers[0]?.id || 'sup-1',
      supplierName: suppliers[0]?.companyName || 'Supplier',
      countryOfOrigin: 'Japan',
      isOriginal: true,
      costPrice: 50,
      sellingPrice: 85,
      wholesalePrice: 70,
      minPrice: 65,
      currentStock: 25,
      minStock: 5,
      maxStock: 100,
      warehouseLocation: 'Main Warehouse',
      rackLocation: 'Rack A-01',
      shelfLocation: 'Shelf 1',
      unit: 'Pcs',
      image: 'https://images.unsplash.com/photo-1600706432522-120025f190e2?w=400&auto=format&fit=crop&q=80',
      compatibleVehicles: [{ make: 'Toyota', model: 'Camry', years: '2018-2024' }],
      status: 'active'
    });
    setShowAddEditModal(true);
  };

  const handleOpenEdit = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProduct(p);
    setSingleItemName(p.nameAr || p.nameEn);
    setFormData({ ...p });
    setShowAddEditModal(true);
  };

  const handleSaveProduct = () => {
    const finalName = singleItemName.trim() || formData.nameAr || formData.nameEn || 'قطعة غيار';
    if (!formData.partNumber) return;

    const payload = {
      ...formData,
      nameAr: finalName,
      nameEn: finalName,
      category: formData.category || categories[0] || 'General'
    };

    if (editingProduct) {
      updateProduct({ ...editingProduct, ...payload } as Product);
    } else {
      addProduct({
        nameEn: finalName,
        nameAr: finalName,
        partNumber: formData.partNumber || 'PART-001',
        oemNumber: formData.oemNumber || 'OEM-001',
        alternativeNumber: formData.alternativeNumber || '',
        barcode: formData.barcode || '123456789',
        brand: formData.brand || 'Generic',
        category: formData.category || categories[0] || 'General',
        subcategory: formData.subcategory || '',
        supplierId: formData.supplierId || 'sup-1',
        supplierName: formData.supplierName || 'Supplier',
        countryOfOrigin: formData.countryOfOrigin || 'Japan',
        isOriginal: formData.isOriginal ?? true,
        costPrice: Number(formData.costPrice) || 0,
        sellingPrice: Number(formData.sellingPrice) || 0,
        wholesalePrice: Number(formData.wholesalePrice) || 0,
        minPrice: Number(formData.minPrice) || 0,
        taxRate: settings.taxRate,
        currentStock: Number(formData.currentStock) || 0,
        minStock: Number(formData.minStock) || 5,
        maxStock: Number(formData.maxStock) || 100,
        warehouseLocation: formData.warehouseLocation || 'Main Warehouse',
        rackLocation: formData.rackLocation || 'A-1',
        shelfLocation: formData.shelfLocation || 'S-1',
        unit: formData.unit || 'Pcs',
        image: formData.image || 'https://images.unsplash.com/photo-1600706432522-120025f190e2?w=400&auto=format&fit=crop&q=80',
        compatibleVehicles: formData.compatibleVehicles || [{ make: 'Toyota', model: 'Camry', years: '2018-2024' }],
        status: (Number(formData.currentStock) || 0) <= 0 ? 'out_of_stock' : (Number(formData.currentStock) || 0) <= (Number(formData.minStock) || 5) ? 'low_stock' : 'active'
      });
    }

    setShowAddEditModal(false);
  };

  const handleCreateCategorySubmit = () => {
    if (!newCategoryName.trim()) return;
    addCategory(newCategoryName.trim());
    setSelectedCategory(newCategoryName.trim());
    setNewCategoryName('');
    setShowAddCategoryModal(false);
  };

  const handleExportCSV = () => {
    const headers = 'ID,Name,PartNumber,OEMNumber,Brand,Category,Cost,Price,Stock,Warehouse\n';
    const rows = filteredProducts
      .map(
        p =>
          `"${p.id}","${p.nameAr || p.nameEn}","${p.partNumber}","${p.oemNumber}","${p.brand}","${p.category}",${p.costPrice},${p.sellingPrice},${p.currentStock},"${p.warehouseLocation}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autoparts_catalog_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-300">
      {/* Header Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-600" />
            <span>{language === 'ar' ? 'دليل قطع الغيار والمنتجات' : 'Spare Parts & Inventory Catalog'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'ar'
              ? 'إدارة الأقسام والتصنيفات، الأرقام الأصلية OEM، ومواقع الأرفف بشكل منظم'
              : 'Organize parts by category, manage OEM numbers, pricing, and bin locations'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setShowAddCategoryModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-xs rounded-xl transition-all shadow-sm"
          >
            <FolderPlus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>{language === 'ar' ? '+ إضافة قسم جديد' : '+ Add Category'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl shadow-sm transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>{language === 'ar' ? 'تصدير اكسل CSV' : 'Export CSV'}</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'ar' ? 'إضافة قطعة جديدة' : 'Add New Part'}</span>
          </button>
        </div>
      </div>

      {/* ORGANIZED CATEGORY GRID / BAR */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-black text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>{language === 'ar' ? 'تصفح الأصناف حسب القسم' : 'Browse by Category'}</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            {language === 'ar' ? `إجمالي الأقسام (${categories.length})` : `Total Categories (${categories.length})`}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {/* ALL CATEGORIES CARD */}
          <button
            onClick={() => setSelectedCategory('All')}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap shrink-0 border ${
              selectedCategory === 'All'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30 ring-2 ring-indigo-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>{language === 'ar' ? 'جميع الأقسام' : 'All Categories'}</span>
            <span
              className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
                selectedCategory === 'All' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {products.length}
            </span>
          </button>

          {/* INDIVIDUAL CATEGORY CARDS */}
          {categories.map(cat => {
            const count = products.filter(p => p.category === cat).length;
            const isSel = selectedCategory === cat;
            return (
              <div key={cat} className="relative group shrink-0">
                <button
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border ${
                    isSel
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30 ring-2 ring-indigo-500/20'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <span>{getCategoryLabel(cat, language)}</span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
                      isSel ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              </div>
            );
          })}

          {/* QUICK ADD CATEGORY BUTTON IN BAR */}
          <button
            onClick={() => setShowAddCategoryModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:text-indigo-600 hover:border-indigo-500 transition-all shrink-0 bg-slate-50/50 dark:bg-slate-900/50"
          >
            <FolderPlus className="w-3.5 h-3.5 text-indigo-500" />
            <span>{language === 'ar' ? '+ قسم جديد' : '+ New Category'}</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setQuickSearchQuery(e.target.value);
              }}
              placeholder={
                language === 'ar'
                  ? 'بحث باسم القطعة، OEM، رقم الكود، الشركة الصانعة...'
                  : 'Filter by Part Name, OEM, Part #, Brand...'
              }
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category Dropdown Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full md:w-52 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200"
          >
            <option value="All">{language === 'ar' ? 'جميع الأقسام' : 'All Categories'}</option>
            {categories.map(c => (
              <option key={c} value={c}>{getCategoryLabel(c, language)}</option>
            ))}
          </select>

          {/* Brand Dropdown */}
          <select
            value={selectedBrand}
            onChange={e => setSelectedBrand(e.target.value)}
            className="w-full md:w-48 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200"
          >
            {brands.map(b => (
              <option key={b} value={b}>{getBrandLabel(b, language)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-extrabold tracking-wider">
                <th className="p-3.5">{language === 'ar' ? 'صورة واسم القطعة' : 'Spare Part Name'}</th>
                <th className="p-3.5">{language === 'ar' ? 'رقم القطعة OEM / Part #' : 'Part # / OEM'}</th>
                <th className="p-3.5">{language === 'ar' ? 'القسم والماركة' : 'Category & Brand'}</th>
                <th className="p-3.5">{language === 'ar' ? 'السيارة المتوافقة' : 'Compatible Vehicle'}</th>
                <th className="p-3.5 text-right">{language === 'ar' ? 'سعر التكلفة' : 'Cost Price'}</th>
                <th className="p-3.5 text-right">{language === 'ar' ? 'سعر البيع' : 'Selling Price'}</th>
                <th className="p-3.5 text-center">{language === 'ar' ? 'المخزون والرف' : 'Stock / Location'}</th>
                <th className="p-3.5 text-center">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProducts.map(product => (
                <tr
                  key={product.id}
                  onClick={() => setSelectedProductForDetails(product)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt=""
                        className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                      <div>
                        {/* SINGLE CLEAN ITEM NAME */}
                        <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                          {product.nameAr || product.nameEn}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <Badge variant={product.isOriginal ? 'primary' : 'neutral'}>
                            {product.isOriginal 
                              ? (language === 'ar' ? 'أصلي OEM' : 'OEM Genuine') 
                              : (language === 'ar' ? 'تجاري / بديل' : 'Aftermarket')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5 font-mono">
                    <div className="font-extrabold text-indigo-600 dark:text-indigo-400">{product.partNumber}</div>
                    <div className="text-[10px] text-slate-500 font-semibold">OEM: {product.oemNumber}</div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {getCategoryLabel(product.category, language)}
                    </div>
                    <div className="text-[10px] text-slate-500">{getBrandLabel(product.brand, language)}</div>
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                      <Car className="w-3.5 h-3.5 text-slate-400" />
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
                    </div>
                    <div className="text-[10px] text-slate-400">{product.compatibleVehicles[0]?.years}</div>
                  </td>

                  <td className="p-3.5 text-right font-medium text-slate-500">
                    {product.costPrice.toFixed(2)} {settings.currency}
                  </td>

                  <td className="p-3.5 text-right font-black text-slate-900 dark:text-white">
                    {product.sellingPrice.toFixed(2)} {settings.currency}
                  </td>

                  <td className="p-3.5 text-center">
                    <div className="font-bold">
                      <Badge
                        variant={
                          product.currentStock <= 0
                            ? 'danger'
                            : product.currentStock <= product.minStock
                            ? 'warning'
                            : 'success'
                        }
                      >
                        {product.currentStock} {language === 'ar' ? (product.unit === 'Set' ? 'طقم' : product.unit === 'Pcs' ? 'قطعة' : product.unit === 'Pair' ? 'زوج' : product.unit === 'Container' ? 'عبوة' : product.unit) : product.unit}
                      </Badge>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-center gap-1">
                      <Building2 className="w-3 h-3" />
                      <span>
                        {language === 'ar'
                          ? `${product.rackLocation.replace('Rack', 'الرف')} • ${product.shelfLocation.replace('Shelf', 'الرف')}`
                          : `${product.rackLocation} • ${product.shelfLocation}`}
                      </span>
                    </div>
                  </td>

                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={e => handleOpenEdit(product, e)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          deleteProduct(product.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL DRAWER / MODAL */}
      {selectedProductForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-4">
                <img src={selectedProductForDetails.image} alt="" className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/20" />
                <div>
                  {/* SINGLE ITEM NAME IN DETAILS */}
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {selectedProductForDetails.nameAr || selectedProductForDetails.nameEn}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="primary">{getCategoryLabel(selectedProductForDetails.category, language)}</Badge>
                    <Badge variant="neutral">{getBrandLabel(selectedProductForDetails.brand, language)}</Badge>
                  </div>
                </div>
              </div>

              <button onClick={() => setSelectedProductForDetails(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Numbers Grid */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 text-[10px]">{language === 'ar' ? 'رقم القطعة' : 'Part Number'}</span>
                <div className="font-extrabold text-indigo-600">{selectedProductForDetails.partNumber}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">{language === 'ar' ? 'رقم OEM الأصلي' : 'OEM Number'}</span>
                <div className="font-extrabold text-slate-800 dark:text-slate-200">{selectedProductForDetails.oemNumber}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">{language === 'ar' ? 'الباركود' : 'Barcode'}</span>
                <div className="font-mono text-slate-800 dark:text-slate-200">{selectedProductForDetails.barcode}</div>
              </div>
            </div>

            {/* Compatible Vehicles */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Car className="w-4 h-4 text-indigo-500" />
                <span>{language === 'ar' ? 'السيارات المتوافقة' : 'Compatible Vehicles'}</span>
              </h4>
              <div className="space-y-1.5">
                {selectedProductForDetails.compatibleVehicles.map((v, i) => (
                  <div key={i} className="p-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs flex justify-between">
                    <span className="font-bold">{v.make} {v.model} ({v.years})</span>
                    <span className="text-slate-500">{v.engine} • {v.fuelType}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prices & Bin Location */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold">{language === 'ar' ? 'سعر البيع' : 'Selling Price'}</span>
                <div className="font-black text-emerald-700 text-base">{selectedProductForDetails.sellingPrice} {settings.currency}</div>
              </div>

              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <span className="text-[10px] text-indigo-800 dark:text-indigo-300 font-bold">{language === 'ar' ? 'سعر الجملة' : 'Wholesale Price'}</span>
                <div className="font-black text-indigo-700 text-base">{selectedProductForDetails.wholesalePrice} {settings.currency}</div>
              </div>

              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold">{language === 'ar' ? 'المخزون الحالي' : 'Current Stock'}</span>
                <div className="font-black text-slate-900 dark:text-white text-base">{selectedProductForDetails.currentStock} {selectedProductForDetails.unit}</div>
              </div>

              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold">{language === 'ar' ? 'موقع الرف والمستودع' : 'Rack / Shelf Location'}</span>
                <div className="font-bold text-slate-900 dark:text-white text-sm">{selectedProductForDetails.rackLocation} - {selectedProductForDetails.shelfLocation}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW CATEGORY MODAL */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-indigo-600" />
                <span>{language === 'ar' ? 'إضافة قسم / تصنيف جديد' : 'Add New Category'}</span>
              </h3>
              <button onClick={() => setShowAddCategoryModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  {language === 'ar' ? 'اسم القسم الجديد *' : 'Category Name *'}
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: نظام التكييف والتبريد، أنظمة العادم...' : 'e.g. Exhaust System'}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {categories.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] text-slate-400 font-medium block mb-1.5">
                    {language === 'ar' ? 'الأقسام المتاحة حالياً:' : 'Existing Categories:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                    {categories.map(c => (
                      <span key={c} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold">
                        {getCategoryLabel(c, language)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleCreateCategorySubmit}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all mt-2"
            >
              {language === 'ar' ? 'حفظ وإضافة القسم' : 'SAVE CATEGORY'}
            </button>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {showAddEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {editingProduct 
                  ? (language === 'ar' ? 'تعديل قطعة الغيار' : 'Edit Spare Part') 
                  : (language === 'ar' ? 'إضافة قطعة غيار جديدة' : 'Add New Spare Part')}
              </h3>
              <button onClick={() => setShowAddEditModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* SINGLE ITEM NAME FIELD */}
              <div className="md:col-span-2">
                <label className="font-extrabold text-slate-800 dark:text-slate-200">
                  {language === 'ar' ? 'اسم قطعة الغيار *' : 'Spare Part Name *'}
                </label>
                <input
                  type="text"
                  value={singleItemName}
                  onChange={e => {
                    setSingleItemName(e.target.value);
                    setFormData({ ...formData, nameAr: e.target.value, nameEn: e.target.value });
                  }}
                  placeholder={language === 'ar' ? 'مثال: قماشات فرامل أمامي كامري 2020' : 'e.g. Front Brake Pads Camry 2020'}
                  className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold">{language === 'ar' ? 'القسم / التصنيف *' : 'Category *'}</label>
                <div className="flex gap-1 mt-1">
                  <select
                    value={formData.category || categories[0]}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{getCategoryLabel(c, language)}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowAddCategoryModal(true)}
                    className="p-2 bg-slate-200 dark:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors"
                    title={language === 'ar' ? 'إضافة قسم جديد' : 'Add Category'}
                  >
                    <FolderPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold">{language === 'ar' ? 'رقم القطعة الكود *' : 'Part Number *'}</label>
                <input
                  type="text"
                  value={formData.partNumber || ''}
                  onChange={e => setFormData({ ...formData, partNumber: e.target.value })}
                  className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold">{language === 'ar' ? 'رقم OEM الأصلي' : 'OEM Number'}</label>
                <input
                  type="text"
                  value={formData.oemNumber || ''}
                  onChange={e => setFormData({ ...formData, oemNumber: e.target.value })}
                  className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="font-bold">{language === 'ar' ? 'الماركة / الشركة الصانعة' : 'Brand'}</label>
                <input
                  type="text"
                  value={formData.brand || ''}
                  onChange={e => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold">{language === 'ar' ? `سعر التكلفة (${settings.currency})` : `Cost Price (${settings.currency})`}</label>
                <input
                  type="number"
                  value={formData.costPrice || 0}
                  onChange={e => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="font-bold">{language === 'ar' ? `سعر البيع النهائي (${settings.currency})` : `Selling Price (${settings.currency})`}</label>
                <input
                  type="number"
                  value={formData.sellingPrice || 0}
                  onChange={e => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-emerald-600"
                />
              </div>

              <div>
                <label className="font-bold">{language === 'ar' ? 'الكمية الأولية للمخزون' : 'Current Stock Qty'}</label>
                <input
                  type="number"
                  value={formData.currentStock || 0}
                  onChange={e => setFormData({ ...formData, currentStock: parseInt(e.target.value) || 0 })}
                  className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="font-bold">{language === 'ar' ? 'موقع الرف / المستودع' : 'Rack / Bin Location'}</label>
                <input
                  type="text"
                  value={formData.rackLocation || ''}
                  onChange={e => setFormData({ ...formData, rackLocation: e.target.value })}
                  placeholder={language === 'ar' ? 'مثال: رف A-04' : 'e.g. Rack A-04'}
                  className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>
            </div>

            <button
              onClick={handleSaveProduct}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all mt-4"
            >
              {language === 'ar' ? 'حفظ قطعة الغيار في الدليل' : 'SAVE PRODUCT TO CATALOG'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
