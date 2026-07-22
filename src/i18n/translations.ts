export const translations = {
  ar: {
    // Common / العامة
    common: {
      search: 'بحث...',
      add: 'إضافة',
      edit: 'تعديل',
      delete: 'حذف',
      save: 'حفظ',
      cancel: 'إلغاء',
      close: 'إغلاق',
      print: 'طباعة',
      export: 'تصدير',
      actions: 'الإجراءات',
      status: 'الحالة',
      date: 'التاريخ',
      total: 'الإجمالي',
      phone: 'رقم الهاتف',
      email: 'البريد الإلكتروني',
      name: 'الاسم',
      notes: 'ملاحظات',
      currency: 'ر.س',
      warehouse: 'المستودع',
      rack: 'الرف',
      minStock: 'الحد الأدنى',
      currentStock: 'المخزون الحالي',
      costPrice: 'سعر التكلفة',
      sellingPrice: 'سعر البيع',
      partNumber: 'رقم القطعة (Part No)',
      brand: 'الماركة / المصنع',
      origin: 'بلد الصنع',
      active: 'نشط',
      inactive: 'غير نشط',
      outOfStock: 'نفد المخزون',
      lowStock: 'مخزون منخفض',
      confirm: 'تأكيد',
      all: 'الكل',
      filter: 'تصفية',
      viewDetails: 'عرض التفاصيل',
      unit: 'الوحدة',
      set: 'طقم',
      pcs: 'قطعة',
      pair: 'جوز',
      liter: 'لتر'
    },

    // Navigation / القائمة الجانبية
    nav: {
      dashboard: 'لوحة التحكم',
      pos: 'نقطة البيع (POS)',
      products: 'كتالوج قطع الغيار',
      inventory: 'إدارة المخزون والحركات',
      sales: 'سجل فواتير المبيعات',
      purchases: 'أوامر الشراء والتوريد',
      customers: 'سجل العملاء والورش',
      suppliers: 'سجل الموردين والشركات',
      expenses: 'سندات المصروفات',
      financial: 'الدرج والمقبوضات',
      reports: 'التقارير التحليلية',
      notifications: 'التنبيهات الإدارية',
      users: 'المستخدمون والصلاحيات',
      settings: 'إعدادات النظام والضريبة'
    },

    // Products / كتالوج قطع الغيار
    products: {
      title: 'كتالوج قطع غيار السيارات',
      subtitle: 'إدارة وتصفح جميع القطع والأصناف المخزنة بالنظام',
      addNewProduct: 'إضافة قطعة جديدة',
      searchPlaceholder: 'البحث برقم القطعة، الاسم بالعربي، الماركة، أو رقم OEM...',
      filterCategory: 'جميع الأقسام',
      filterBrand: 'جميع الماركات',
      filterOrigin: 'جميع دول الصنع',
      partNumber: 'رقم القطعة',
      productName: 'اسم القطعة',
      category: 'القسم الرئيسي',
      compatibility: 'السيارات المتوافقة',
      oemNumber: 'رقم OEM الأصلي',
      brandManufacturer: 'المصنع / الماركة',
      countryOfOrigin: 'بلد المنشأ',
      warehouseLocation: 'مكان التخزين',
      rackNumber: 'رقم الرف',
      stockQty: 'الكمية بالمخزن',
      cost: 'التكلفة',
      price: 'سعر البيع',
      profitMargin: 'هامش الربح',
      actions: 'العمليات',
      noProductsFound: 'لم يتم العثور على قطع غيار تطابق البحث',
      quickAddCategory: 'إضافة قسم جديد',
      categoryName: 'اسم القسم'
    },

    // Inventory / إدارة المخزون
    inventory: {
      title: 'إدارة حركة وتعديل المخزون',
      subtitle: 'متابعة الوارد والصادر وتعديلات الكميات وسجل الحركات الحية',
      totalAssetsValue: 'إجمالي قيمة أصول المخزون',
      totalUniqueItems: 'عدد الأصناف المسجلة',
      lowStockCount: 'تنبيهات المخزون المنخفض',
      outOfStockCount: 'قطعة نفدت بالكامل',
      adjustStockBtn: 'تعديل كمية / تسوية مخزون',
      movementsHistory: 'سجل حركات المخزون',
      movementType: 'نوع الحركة',
      productDetails: 'تفاصيل القطعة',
      quantityChange: 'الفرق / الكمية',
      previousStock: 'المخزون السابق',
      newStock: 'المخزون الجديد',
      referenceNumber: 'رقم المرجع / الفاتورة',
      performedBy: 'المسؤول / الموظف',
      reason: 'السبب / التفاصيل',
      typeIn: 'توريد جديد (+)',
      typeOut: 'صرف مبيعات (-)',
      typeReturn: 'مرتجع عميل (+)',
      typeAdjustment: 'تسوية جردية (±)'
    },

    // Sales / فواتير المبيعات
    sales: {
      title: 'سجل فواتير المبيعات',
      subtitle: 'عرض وتصفية وطباعة الفواتير الصادرة ومرتجعات العملاء',
      invoiceNumber: 'رقم الفاتورة',
      customerName: 'اسم العميل / الورشة',
      itemsCount: 'عدد الأصناف',
      totalAmount: 'إجمالي المبلغ',
      paidAmount: 'المبلغ المدفوع',
      remainingAmount: 'المتبقي (آجل)',
      paymentStatus: 'حالة السداد',
      cashier: 'الكاشير / الموظف',
      branch: 'الفرع / المستودع',
      paid: 'مدفوع بالكامل',
      partial: 'مدفوع جزئياً',
      unpaid: 'آجل / غير مدفوع',
      credit: 'حساب آجل (ذمم)',
      viewReceipt: 'عرض / طباعة الفاتورة',
      processReturn: 'عمل فاتورة مرتجع',
      searchPlaceholder: 'البحث برقم الفاتورة أو اسم العميل...'
    },

    // Purchases / أوامر الشراء
    purchases: {
      title: 'أوامر الشراء والتوريد',
      subtitle: 'إدارة الطلبيات الصادرة للموردين واستلام شحنات البضاعة',
      createPO: 'إنشاء أمر شراء جديد',
      poNumber: 'رقم أمر الشراء',
      supplierName: 'اسم المورد / الشركة',
      orderDate: 'تاريخ الطلب',
      itemsCount: 'الأصناف المطلوبة',
      totalCost: 'إجمالي التكلفة',
      status: 'حالة الشحنة',
      statusPending: 'قيد الانتظار / بالطريق',
      statusReceived: 'تم الاستلام والمصادقة',
      receiveAction: 'استلام البضاعة للمخزن',
      searchPlaceholder: 'البحث برقم الطلب أو اسم المورد...'
    }
  },

  en: {
    // Common
    common: {
      search: 'Search...',
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      print: 'Print',
      export: 'Export',
      actions: 'Actions',
      status: 'Status',
      date: 'Date',
      total: 'Total',
      phone: 'Phone',
      email: 'Email',
      name: 'Name',
      notes: 'Notes',
      currency: 'SAR',
      warehouse: 'Warehouse',
      rack: 'Rack',
      minStock: 'Min Stock',
      currentStock: 'Current Stock',
      costPrice: 'Cost Price',
      sellingPrice: 'Selling Price',
      partNumber: 'Part Number',
      brand: 'Brand / Mfr',
      origin: 'Origin',
      active: 'Active',
      inactive: 'Inactive',
      outOfStock: 'Out of Stock',
      lowStock: 'Low Stock',
      confirm: 'Confirm',
      all: 'All',
      filter: 'Filter',
      viewDetails: 'View Details',
      unit: 'Unit',
      set: 'Set',
      pcs: 'Pcs',
      pair: 'Pair',
      liter: 'Liter'
    },

    // Navigation
    nav: {
      dashboard: 'Dashboard',
      pos: 'Point of Sale (POS)',
      products: 'Parts Catalog',
      inventory: 'Inventory & Stock',
      sales: 'Sales Invoices',
      purchases: 'Purchase Orders',
      customers: 'Customers & Garages',
      suppliers: 'Suppliers & Vendors',
      expenses: 'Expenses Log',
      financial: 'Cash Drawer & Registers',
      reports: 'Analytical Reports',
      notifications: 'System Alerts',
      users: 'Users & Permissions',
      settings: 'Settings & VAT'
    },

    // Products
    products: {
      title: 'Auto Parts Catalog',
      subtitle: 'Manage and browse all spare parts stored in system',
      addNewProduct: 'Add New Part',
      searchPlaceholder: 'Search by part number, name, brand, or OEM...',
      filterCategory: 'All Categories',
      filterBrand: 'All Brands',
      filterOrigin: 'All Origins',
      partNumber: 'Part Number',
      productName: 'Part Name',
      category: 'Category',
      compatibility: 'Compatible Vehicles',
      oemNumber: 'OEM Part Number',
      brandManufacturer: 'Manufacturer / Brand',
      countryOfOrigin: 'Country of Origin',
      warehouseLocation: 'Location',
      rackNumber: 'Rack No.',
      stockQty: 'Stock Qty',
      cost: 'Cost',
      price: 'Selling Price',
      profitMargin: 'Profit Margin',
      actions: 'Actions',
      noProductsFound: 'No spare parts found matching search',
      quickAddCategory: 'Add Category',
      categoryName: 'Category Name'
    },

    // Inventory
    inventory: {
      title: 'Inventory & Stock Movements',
      subtitle: 'Track incoming, outgoing, adjustments, and live stock log',
      totalAssetsValue: 'Total Asset Value',
      totalUniqueItems: 'Total Unique Items',
      lowStockCount: 'Low Stock Alerts',
      outOfStockCount: 'Out of Stock Items',
      adjustStockBtn: 'Adjust Stock Level',
      movementsHistory: 'Stock Movement Logs',
      movementType: 'Movement Type',
      productDetails: 'Part Details',
      quantityChange: 'Qty Change',
      previousStock: 'Prev Stock',
      newStock: 'New Stock',
      referenceNumber: 'Ref / Invoice #',
      performedBy: 'Performed By',
      reason: 'Reason / Details',
      typeIn: 'Stock In (+)',
      typeOut: 'POS Sale (-)',
      typeReturn: 'Customer Return (+)',
      typeAdjustment: 'Audit Adjustment (±)'
    },

    // Sales
    sales: {
      title: 'Sales Invoices Log',
      subtitle: 'View, filter, and print issued sales invoices and returns',
      invoiceNumber: 'Invoice #',
      customerName: 'Customer / Workshop',
      itemsCount: 'Items',
      totalAmount: 'Total Amount',
      paidAmount: 'Paid',
      remainingAmount: 'Remaining',
      paymentStatus: 'Payment Status',
      cashier: 'Cashier',
      branch: 'Branch / Location',
      paid: 'Paid in Full',
      partial: 'Partial Payment',
      unpaid: 'Unpaid / Credit',
      credit: 'Credit Account',
      viewReceipt: 'View / Print Invoice',
      processReturn: 'Process Return',
      searchPlaceholder: 'Search invoice # or customer name...'
    },

    // Purchases
    purchases: {
      title: 'Purchase Orders & Supply',
      subtitle: 'Manage purchase orders to suppliers and stock receiving',
      createPO: 'Create New PO',
      poNumber: 'PO Number',
      supplierName: 'Supplier Name',
      orderDate: 'Order Date',
      itemsCount: 'Items Ordered',
      totalCost: 'Total Cost',
      status: 'Status',
      statusPending: 'Pending / In Transit',
      statusReceived: 'Received & Verified',
      receiveAction: 'Receive Stock',
      searchPlaceholder: 'Search PO # or supplier name...'
    }
  }
};

export type Language = 'ar' | 'en';

export function getTranslation(lang: Language, path: string): string {
  const keys = path.split('.');
  let current: any = translations[lang] || translations.ar;

  for (const k of keys) {
    if (current && current[k] !== undefined) {
      current = current[k];
    } else {
      // Fallback to Arabic or English
      let fallback: any = translations.ar;
      for (const fk of keys) {
        if (fallback && fallback[fk] !== undefined) {
          fallback = fallback[fk];
        } else {
          return path;
        }
      }
      return typeof fallback === 'string' ? fallback : path;
    }
  }

  return typeof current === 'string' ? current : path;
}
