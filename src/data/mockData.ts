import {
  Product,
  Customer,
  Supplier,
  Invoice,
  PurchaseOrder,
  StockMovement,
  Expense,
  UserProfile,
  CompanySettings,
  SystemNotification,
  CashDrawerShift
} from '../types';

export const initialCompanySettings: CompanySettings = {
  companyNameEn: 'AK Establishment',
  companyNameAr: 'مؤسسة AK',
  taxNumber: '310459820100003',
  crNumber: '1010892341',
  phone: '+966 50 123 4567',
  email: 'sales@ak-autoparts.com',
  addressEn: 'Industrial Area No. 2, Ring Road, Riyadh, Saudi Arabia',
  addressAr: 'المنطقة الصناعية الثانية، طريق الدائري، الرياض، المملكة العربية السعودية',
  logoUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=150&auto=format&fit=crop&q=80',
  currency: 'SAR',
  taxRate: 15,
  enableTax: true,
  printThermalHeader: 'WELCOME TO AK\nOfficial Toyota & OEM Distributor',
  printThermalFooter: 'Thank you for your business!\nNo returns on electrical items after 3 days.\nOriginal VAT Receipt.',
  defaultWarehouse: 'Main Warehouse - Riyadh'
};

export const initialUsers: UserProfile[] = [
  {
    id: 'usr-1',
    name: 'Tariq Al-Mansoor',
    nameAr: 'طارق المنصور',
    email: 'admin@ak.com',
    username: 'admin',
    password: '123456',
    phone: '+966501234567',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    permissions: {
      view: true, add: true, edit: true, delete: true, print: true,
      export: true, discount: true, priceChange: true, returnItem: true, closeDay: true
    },
    modules: [
      'dashboard', 'pos', 'products', 'inventory', 'sales', 'purchases',
      'customers', 'suppliers', 'expenses', 'financial', 'reports',
      'notifications', 'users', 'settings'
    ],
    isActive: true
  },
  {
    id: 'usr-2',
    name: 'Fahad Sales',
    nameAr: 'فهد - مبيعات',
    email: 'fahad@ak.com',
    username: 'fahad',
    password: '123456',
    phone: '+966509876543',
    role: 'cashier',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    permissions: {
      view: true, add: true, edit: false, delete: false, print: true,
      export: false, discount: true, priceChange: false, returnItem: true, closeDay: true
    },
    modules: ['dashboard', 'pos', 'sales', 'customers', 'products', 'notifications', 'financial'],
    isActive: true
  },
  {
    id: 'usr-3',
    name: 'Sultan Warehouse',
    nameAr: 'سلطان المستودع',
    email: 'sultan@ak.com',
    username: 'sultan',
    password: '123456',
    phone: '+966551112233',
    role: 'warehouse',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    permissions: {
      view: true, add: true, edit: true, delete: false, print: true,
      export: true, discount: false, priceChange: false, returnItem: false, closeDay: false
    },
    modules: ['dashboard', 'products', 'inventory', 'purchases', 'suppliers', 'notifications'],
    isActive: true
  }
];

export const initialProducts: Product[] = [
  {
    id: 'prod-101',
    image: 'https://images.unsplash.com/photo-1600706432522-120025f190e2?w=400&auto=format&fit=crop&q=80',
    nameEn: 'Toyota Front Ceramic Brake Pads',
    nameAr: 'فحمات فرامل أمامية سيراميك تويوتا',
    partNumber: '04465-06100',
    oemNumber: '04465-33470',
    alternativeNumber: 'D1222-8331',
    barcode: '6291001001018',
    qrCode: 'QR-TOY-04465-06100',
    brand: 'Toyota Genuine Parts',
    category: 'Brake System',
    subcategory: 'Brake Pads',
    supplierId: 'sup-1',
    supplierName: 'Abdul Latif Jameel Auto Parts',
    countryOfOrigin: 'Japan',
    isOriginal: true,
    compatibleVehicles: [
      { make: 'Toyota', model: 'Camry', years: '2018-2024', engine: '2.5L 4-Cyl', transmission: 'Automatic', fuelType: 'Gasoline / Hybrid' },
      { make: 'Toyota', model: 'Avalon', years: '2019-2023', engine: '3.5L V6', transmission: 'Automatic', fuelType: 'Gasoline' },
      { make: 'Lexus', model: 'ES350 / ES300h', years: '2019-2024', engine: '2.5L / 3.5L', transmission: 'Automatic', fuelType: 'Hybrid' }
    ],
    costPrice: 165.00,
    sellingPrice: 245.00,
    wholesalePrice: 210.00,
    minPrice: 200.00,
    taxRate: 15,
    currentStock: 48,
    minStock: 10,
    maxStock: 120,
    warehouseLocation: 'Main Warehouse',
    rackLocation: 'Rack A-02',
    shelfLocation: 'Shelf 3',
    unit: 'Set',
    status: 'active',
    notes: 'Includes stainless steel anti-squeal shims and sensor wires.'
  },
  {
    id: 'prod-102',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80',
    nameEn: 'Denso Iridium Power Spark Plug (Set of 4)',
    nameAr: 'بواجي ايريديوم دينسو (طقم 4 قطع)',
    partNumber: 'SK20R11',
    oemNumber: '90919-01210',
    alternativeNumber: 'NGK-BKR6EIX',
    barcode: '6291001001025',
    qrCode: 'QR-DEN-SK20R11',
    brand: 'Denso',
    category: 'Ignition System',
    subcategory: 'Spark Plugs',
    supplierId: 'sup-2',
    supplierName: 'Denso Middle East FZE',
    countryOfOrigin: 'Japan',
    isOriginal: true,
    compatibleVehicles: [
      { make: 'Toyota', model: 'Land Cruiser / Prado', years: '2010-2022', engine: '4.0L V6 / 4.6L V8', transmission: 'Automatic', fuelType: 'Gasoline' },
      { make: 'Toyota', model: 'Hilux / Fortuner', years: '2012-2023', engine: '2.7L 4-Cyl', transmission: 'Manual / Auto', fuelType: 'Gasoline' }
    ],
    costPrice: 95.00,
    sellingPrice: 150.00,
    wholesalePrice: 130.00,
    minPrice: 120.00,
    taxRate: 15,
    currentStock: 85,
    minStock: 15,
    maxStock: 200,
    warehouseLocation: 'Main Warehouse',
    rackLocation: 'Rack B-01',
    shelfLocation: 'Shelf 1',
    unit: 'Set',
    status: 'active',
    notes: 'Long life 100,000 km replacement interval.'
  },
  {
    id: 'prod-103',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&auto=format&fit=crop&q=80',
    nameEn: 'Hyundai Accent / Elantra Engine Oil Filter',
    nameAr: 'فلتر زيت محرك هيونداي أكسنت / إلانترا',
    partNumber: '26300-35505',
    oemNumber: '26300-35504',
    alternativeNumber: 'W811/80',
    barcode: '6291001001032',
    qrCode: 'QR-HYU-26300',
    brand: 'Mobis / Hyundai Genuine',
    category: 'Filters & Fluids',
    subcategory: 'Oil Filters',
    supplierId: 'sup-3',
    supplierName: 'Wallan Trading Company',
    countryOfOrigin: 'South Korea',
    isOriginal: true,
    compatibleVehicles: [
      { make: 'Hyundai', model: 'Elantra', years: '2016-2024', engine: '1.6L / 2.0L', transmission: 'Automatic', fuelType: 'Gasoline' },
      { make: 'Hyundai', model: 'Accent', years: '2014-2023', engine: '1.4L / 1.6L', transmission: 'Automatic', fuelType: 'Gasoline' },
      { make: 'Kia', model: 'Cerato / Rio', years: '2015-2023', engine: '1.6L', transmission: 'Automatic', fuelType: 'Gasoline' }
    ],
    costPrice: 14.00,
    sellingPrice: 28.00,
    wholesalePrice: 22.00,
    minPrice: 20.00,
    taxRate: 15,
    currentStock: 180,
    minStock: 30,
    maxStock: 500,
    warehouseLocation: 'Main Warehouse',
    rackLocation: 'Rack A-01',
    shelfLocation: 'Shelf 5',
    unit: 'Pcs',
    status: 'active',
    notes: 'Includes anti-drainback valve and O-ring seal.'
  },
  {
    id: 'prod-104',
    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=400&auto=format&fit=crop&q=80',
    nameEn: 'Bosch Performance Air Filter - Nissan Patrol',
    nameAr: 'فلتر هواء بوش نيسان باترول بطل المعارف',
    partNumber: '16546-1S700',
    oemNumber: 'AY120-NS001',
    alternativeNumber: 'A-243',
    barcode: '6291001001049',
    qrCode: 'QR-BOS-16546',
    brand: 'Bosch',
    category: 'Filters & Fluids',
    subcategory: 'Air Filters',
    supplierId: 'sup-4',
    supplierName: 'Bosch Saudi Arabia',
    countryOfOrigin: 'Germany',
    isOriginal: false,
    compatibleVehicles: [
      { make: 'Nissan', model: 'Patrol Y61 / Y62', years: '2010-2024', engine: '4.8L / 5.6L V8', transmission: 'Automatic', fuelType: 'Gasoline' }
    ],
    costPrice: 38.00,
    sellingPrice: 75.00,
    wholesalePrice: 60.00,
    minPrice: 55.00,
    taxRate: 15,
    currentStock: 6, // Low Stock!
    minStock: 12,
    maxStock: 80,
    warehouseLocation: 'Main Warehouse',
    rackLocation: 'Rack C-03',
    shelfLocation: 'Shelf 2',
    unit: 'Pcs',
    status: 'low_stock',
    notes: 'Heavy duty filtration paper suited for Middle East desert climate.'
  },
  {
    id: 'prod-105',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400&auto=format&fit=crop&q=80',
    nameEn: 'Mobil 1 Fully Synthetic Engine Oil 5W-30 (4 Liters)',
    nameAr: 'زيت محرك تخليقي بالكامل موبيل 1 سعة 4 لتر',
    partNumber: 'MOB-5W30-4L',
    oemNumber: 'MOBIL-1-5W30',
    barcode: '6291001001056',
    brand: 'Mobil 1',
    category: 'Filters & Fluids',
    subcategory: 'Engine Oils',
    supplierId: 'sup-5',
    supplierName: 'Arabian Petroleum Supply Co. (APSCO)',
    countryOfOrigin: 'USA',
    isOriginal: true,
    compatibleVehicles: [
      { make: 'Universal', model: 'All Modern Engines', years: '2015-2024', engine: 'Multi-cylinder', transmission: 'Universal', fuelType: 'Gasoline / Turbo' }
    ],
    costPrice: 110.00,
    sellingPrice: 165.00,
    wholesalePrice: 145.00,
    minPrice: 135.00,
    taxRate: 15,
    currentStock: 92,
    minStock: 20,
    maxStock: 300,
    warehouseLocation: 'Main Warehouse',
    rackLocation: 'Rack D-01',
    shelfLocation: 'Shelf 1',
    unit: 'Container',
    status: 'active',
    notes: '10,000 KM protection standard.'
  },
  {
    id: 'prod-106',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&auto=format&fit=crop&q=80',
    nameEn: 'KYB Excel-G Gas Shock Absorber Rear - Honda Accord',
    nameAr: 'مساعدات خلفية كي واي بي هواندا أكورد',
    partNumber: '340028',
    oemNumber: '52611-T2A-A01',
    barcode: '6291001001063',
    brand: 'KYB',
    category: 'Suspension & Steering',
    subcategory: 'Shock Absorbers',
    supplierId: 'sup-2',
    supplierName: 'Denso Middle East FZE',
    countryOfOrigin: 'Japan',
    isOriginal: false,
    compatibleVehicles: [
      { make: 'Honda', model: 'Accord', years: '2013-2021', engine: '2.4L / 1.5L Turbo', transmission: 'CVT / Auto', fuelType: 'Gasoline' }
    ],
    costPrice: 180.00,
    sellingPrice: 285.00,
    wholesalePrice: 240.00,
    minPrice: 220.00,
    taxRate: 15,
    currentStock: 0, // Out of stock!
    minStock: 8,
    maxStock: 50,
    warehouseLocation: 'Branch 2 Warehouse',
    rackLocation: 'Rack S-01',
    shelfLocation: 'Shelf 4',
    unit: 'Pair',
    status: 'out_of_stock',
    notes: 'Nitrogen gas filled twin-tube design.'
  },
  {
    id: 'prod-107',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&auto=format&fit=crop&q=80',
    nameEn: 'Brembo Vented Brake Disc Rotor Front (Pair) - Ford F-150',
    nameAr: 'هوبات فرامل ألماني بريمبو فورد F-150 (طقم زوج)',
    partNumber: '09.A109.11',
    oemNumber: 'FL3Z-1125-A',
    barcode: '6291001001070',
    brand: 'Brembo',
    category: 'Brake System',
    subcategory: 'Brake Rotors',
    supplierId: 'sup-4',
    supplierName: 'Bosch Saudi Arabia',
    countryOfOrigin: 'Italy',
    isOriginal: false,
    compatibleVehicles: [
      { make: 'Ford', model: 'F-150 / Expedition', years: '2015-2023', engine: '3.5L EcoBoost / 5.0L V8', transmission: '10-Speed Auto', fuelType: 'Gasoline' }
    ],
    costPrice: 420.00,
    sellingPrice: 650.00,
    wholesalePrice: 560.00,
    minPrice: 520.00,
    taxRate: 15,
    currentStock: 14,
    minStock: 4,
    maxStock: 30,
    warehouseLocation: 'Main Warehouse',
    rackLocation: 'Rack A-05',
    shelfLocation: 'Shelf 1',
    unit: 'Pair',
    status: 'active',
    notes: 'High carbon UV coated corrosion resistant rotors.'
  },
  {
    id: 'prod-108',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&auto=format&fit=crop&q=80',
    nameEn: 'NGK Platinum Ignition Coil Pack - Lexus LS460 / LX570',
    nameAr: 'كويل إشعال ان جي كي ليكسس 570 / 460',
    partNumber: 'U5065',
    oemNumber: '90919-02250',
    barcode: '6291001001087',
    brand: 'NGK',
    category: 'Ignition System',
    subcategory: 'Ignition Coils',
    supplierId: 'sup-1',
    supplierName: 'Abdul Latif Jameel Auto Parts',
    countryOfOrigin: 'Japan',
    isOriginal: true,
    compatibleVehicles: [
      { make: 'Lexus', model: 'LX570 / LS460', years: '2008-2021', engine: '5.7L V8 / 4.6L V8', transmission: 'Automatic', fuelType: 'Gasoline' },
      { make: 'Toyota', model: 'Land Cruiser 5.7', years: '2008-2021', engine: '5.7L V8 3UR-FE', transmission: 'Automatic', fuelType: 'Gasoline' }
    ],
    costPrice: 125.00,
    sellingPrice: 195.00,
    wholesalePrice: 170.00,
    minPrice: 160.00,
    taxRate: 15,
    currentStock: 32,
    minStock: 8,
    maxStock: 100,
    warehouseLocation: 'Main Warehouse',
    rackLocation: 'Rack B-03',
    shelfLocation: 'Shelf 2',
    unit: 'Pcs',
    status: 'active',
    notes: 'Direct fit plug-and-play coil pencil type.'
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Walk-in Customer (Cash)',
    nameAr: 'عميل نقدي (مباشر)',
    phone: '+966 50 000 0000',
    address: 'Counter Direct Sale',
    addressAr: 'مبيعات المعرض الكاونتر',
    type: 'retail',
    balance: 0,
    creditLimit: 0,
    discountLevel: 'standard',
    vehicles: [],
    createdAt: '2025-01-01'
  },
  {
    id: 'cust-2',
    name: 'Al-Khobar Motors Workshop',
    nameAr: 'ورشة محركات الخبر للصيانة',
    phone: '+966 55 432 1098',
    whatsapp: '966554321098',
    taxNumber: '300129481200003',
    address: 'Industrial Zone St. 14, Dammam',
    addressAr: 'المنطقة الصناعية شارع 14، الدمام',
    type: 'workshop',
    balance: 1450.00, // owes us SAR 1450
    creditLimit: 10000.00,
    discountLevel: 'gold',
    vehicles: [
      { id: 'v-1', make: 'Toyota', model: 'Camry', year: 2021, plateNumber: 'أ ب ج 1234', vinNumber: 'JTDKN3DU0M2190341' },
      { id: 'v-2', make: 'Hyundai', model: 'Sonata', year: 2020, plateNumber: 'ح خ د 8899', vinNumber: 'KMHEC41CBHA982310' }
    ],
    notes: 'Premium commercial garage account. Monthly bill payment on 28th.',
    createdAt: '2025-02-10'
  },
  {
    id: 'cust-3',
    name: 'Sultan Al-Otaibi (Individual)',
    nameAr: 'سلطان العتيبي (أفراد)',
    phone: '+966 56 789 0123',
    whatsapp: '966567890123',
    address: 'Al-Malaz District, Riyadh',
    addressAr: 'حي الملز، الرياض',
    type: 'retail',
    balance: 0,
    creditLimit: 2000.00,
    discountLevel: 'silver',
    vehicles: [
      { id: 'v-3', make: 'Nissan', model: 'Patrol Y62', year: 2022, plateNumber: 'ر س ل 9012', vinNumber: 'JN8AY2NC0M9231045' }
    ],
    notes: 'Regular customer for Nissan Patrol original upgrades.',
    createdAt: '2025-03-15'
  },
  {
    id: 'cust-4',
    name: 'Al-Safwa Transport Fleet',
    nameAr: 'شركة أسطول الصفوة للنقليات',
    phone: '+966 54 112 2334',
    whatsapp: '966541122334',
    taxNumber: '311092834100003',
    address: 'Khurais Road Exit 13, Riyadh',
    addressAr: 'طريق خريص مخرج 13، الرياض',
    type: 'fleet',
    balance: 4800.00, // owes money
    creditLimit: 25000.00,
    discountLevel: 'vip',
    vehicles: [
      { id: 'v-4', make: 'Ford', model: 'F-150', year: 2021, plateNumber: 'ط ي ب 4455', vinNumber: '1FTFW1ED4MF982019' }
    ],
    notes: 'Fleet contract for oil filters and brake pads.',
    createdAt: '2025-01-20'
  }
];

export const initialSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    companyName: 'Abdul Latif Jameel Auto Parts',
    companyNameAr: 'شركة عبد اللطيف جميل لقطع الغيار',
    contactPerson: 'Eng. Hisham Al-Ghamdi',
    phone: '+966 12 600 0000',
    email: 'parts-orders@alj.com',
    taxNumber: '300010293800003',
    address: 'Jeddah Highway Km 14, Saudi Arabia',
    balance: 12500.00, // We owe them SAR 12,500
    country: 'Saudi Arabia',
    notes: 'Official Toyota and Lexus genuine components distributor.'
  },
  {
    id: 'sup-2',
    companyName: 'Denso Middle East FZE',
    companyNameAr: 'دينسو الشرق الأوسط',
    contactPerson: 'Mr. Kenji Sato / Ahmad',
    phone: '+971 4 881 5000',
    email: 'sales@denso-me.ae',
    taxNumber: '100293848100003',
    address: 'Jebel Ali Free Zone, Dubai, UAE',
    balance: 0,
    country: 'United Arab Emirates',
    notes: 'Spark plugs, compressors, oxygen sensors.'
  },
  {
    id: 'sup-3',
    companyName: 'Wallan Trading Company',
    companyNameAr: 'شركة الوعلان للتجارة',
    contactPerson: 'Saleh Al-Wallan',
    phone: '+966 11 491 1111',
    email: 'hyundai-parts@wallan.com',
    taxNumber: '300482019200003',
    address: 'Northern Ring Road, Riyadh',
    balance: 3200.00,
    country: 'Saudi Arabia',
    notes: 'Hyundai Mobis original parts supply.'
  },
  {
    id: 'sup-4',
    companyName: 'Bosch Saudi Arabia Distributor',
    companyNameAr: 'موزع بوش السعودية',
    contactPerson: 'Michael Weber',
    phone: '+966 11 265 4400',
    email: 'info@bosch-parts.sa',
    taxNumber: '310293849100003',
    address: 'Second Industrial City, Riyadh',
    balance: 0,
    country: 'Germany / KSA',
    notes: 'Brake pads, wiper blades, sensors, starters.'
  },
  {
    id: 'sup-5',
    companyName: 'Arabian Petroleum Supply Co. (APSCO)',
    companyNameAr: 'شركة ابسكو للزيوت والتشحيم',
    contactPerson: 'Yasser Reda',
    phone: '+966 12 651 8888',
    email: 'mobil1-ksa@apsco.com.sa',
    taxNumber: '300091823400003',
    address: 'Madinah Road, Jeddah',
    balance: 5400.00,
    country: 'Saudi Arabia',
    notes: 'Official Mobil 1 Lubricants authorized distributor.'
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'inv-1001',
    invoiceNumber: 'INV-2026-0891',
    type: 'pos_sale',
    date: '2026-07-21T14:30:00.000Z',
    customerId: 'cust-2',
    customerName: 'ورشة محركات الخبر للصيانة',
    customerPhone: '+966 55 432 1098',
    items: [
      {
        product: initialProducts[0], // Toyota Brake Pads
        quantity: 2,
        unitPrice: 245.00,
        discount: 0,
        discountType: 'fixed',
        total: 490.00
      },
      {
        product: initialProducts[2], // Hyundai Oil Filter
        quantity: 5,
        unitPrice: 28.00,
        discount: 0,
        discountType: 'fixed',
        total: 140.00
      }
    ],
    subtotal: 630.00,
    itemDiscountTotal: 0,
    invoiceDiscount: 30.00,
    invoiceDiscountType: 'fixed',
    taxAmount: 90.00, // 15% VAT on (630 - 30 = 600)
    grandTotal: 690.00,
    paidAmount: 690.00,
    changeDue: 0,
    paymentStatus: 'paid',
    payments: [{ method: 'card', amount: 690.00, reference: 'MADA-778219' }],
    cashierName: 'طارق المنصور',
    branchName: 'المعرض الرئيسي - الرياض'
  },
  {
    id: 'inv-1002',
    invoiceNumber: 'INV-2026-0892',
    type: 'pos_sale',
    date: '2026-07-21T15:15:00.000Z',
    customerId: 'cust-1',
    customerName: 'عميل نقدي (مباشر)',
    items: [
      {
        product: initialProducts[1], // Denso Spark Plug Set
        quantity: 1,
        unitPrice: 150.00,
        discount: 0,
        discountType: 'fixed',
        total: 150.00
      },
      {
        product: initialProducts[4], // Mobil 1 Oil
        quantity: 1,
        unitPrice: 165.00,
        discount: 0,
        discountType: 'fixed',
        total: 165.00
      }
    ],
    subtotal: 315.00,
    itemDiscountTotal: 0,
    invoiceDiscount: 0,
    invoiceDiscountType: 'fixed',
    taxAmount: 47.25,
    grandTotal: 362.25,
    paidAmount: 400.00,
    changeDue: 37.75,
    paymentStatus: 'paid',
    payments: [{ method: 'cash', amount: 400.00 }],
    cashierName: 'فهد - مبيعات',
    branchName: 'المعرض الرئيسي - الرياض'
  },
  {
    id: 'inv-1003',
    invoiceNumber: 'INV-2026-0893',
    type: 'pos_sale',
    date: '2026-07-21T16:00:00.000Z',
    customerId: 'cust-4',
    customerName: 'شركة أسطول الصفوة للنقليات',
    items: [
      {
        product: initialProducts[6], // Brembo Rotors
        quantity: 2,
        unitPrice: 650.00,
        discount: 50.00,
        discountType: 'fixed',
        total: 1250.00
      }
    ],
    subtotal: 1250.00,
    itemDiscountTotal: 100.00,
    invoiceDiscount: 50.00,
    invoiceDiscountType: 'fixed',
    taxAmount: 180.00,
    grandTotal: 1380.00,
    paidAmount: 0,
    changeDue: 0,
    paymentStatus: 'credit',
    payments: [{ method: 'credit', amount: 1380.00 }],
    cashierName: 'طارق المنصور',
    branchName: 'المعرض الرئيسي - الرياض'
  }
];

export const initialPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-501',
    poNumber: 'PO-2026-0041',
    supplierId: 'sup-1',
    supplierName: 'شركة عبد اللطيف جميل لقطع الغيار',
    date: '2026-07-18',
    status: 'received',
    items: [
      {
        productId: 'prod-101',
        productName: 'فحمات فرامل أمامية سيراميك تويوتا',
        partNumber: '04465-06100',
        quantity: 30,
        costPrice: 165.00,
        total: 4950.00
      }
    ],
    subtotal: 4950.00,
    taxAmount: 742.50,
    grandTotal: 5692.50,
    paidAmount: 5692.50,
    notes: 'توصيل مباشر إلى المستودع الرئيسي.'
  },
  {
    id: 'po-502',
    poNumber: 'PO-2026-0042',
    supplierId: 'sup-2',
    supplierName: 'دينسو الشرق الأوسط',
    date: '2026-07-20',
    status: 'ordered',
    items: [
      {
        productId: 'prod-106',
        productName: 'مساعدات خلفية كي واي بي هوندا أكورد',
        partNumber: '340028',
        quantity: 20,
        costPrice: 180.00,
        total: 3600.00
      }
    ],
    subtotal: 3600.00,
    taxAmount: 540.00,
    grandTotal: 4140.00,
    paidAmount: 1000.00,
    notes: 'أمر إعادة طلب لمساعدات هوندا أكورد.'
  }
];

export const initialStockMovements: StockMovement[] = [
  {
    id: 'sm-1',
    date: '2026-07-21T14:30:00.000Z',
    productId: 'prod-101',
    productName: 'Toyota Front Ceramic Brake Pads',
    productNameAr: 'فحمات فرامل أمامية سيراميك تويوتا',
    partNumber: '04465-06100',
    type: 'sale',
    quantity: -2,
    previousStock: 50,
    newStock: 48,
    referenceNo: 'INV-2026-0891',
    warehouseFrom: 'Main Warehouse',
    performedBy: 'Tariq Al-Mansoor',
    reason: 'POS Sale',
    reasonAr: 'مبيعات الكاونتر (فاتورة INV-2026-0891)'
  },
  {
    id: 'sm-2',
    date: '2026-07-21T15:15:00.000Z',
    productId: 'prod-103',
    productName: 'Hyundai Accent / Elantra Engine Oil Filter',
    productNameAr: 'فلتر زيت محرك هيونداي أكسنت / إلانترا',
    partNumber: '26300-35505',
    type: 'stock_in',
    quantity: 50,
    previousStock: 130,
    newStock: 180,
    referenceNo: 'GRN-9982',
    warehouseTo: 'Main Warehouse',
    performedBy: 'Sultan Warehouse',
    reason: 'New Goods Receiving from Wallan',
    reasonAr: 'استلام بضاعة جديدة توريد من شركة الوعلان'
  }
];

export const initialExpenses: Expense[] = [
  {
    id: 'exp-1',
    date: '2026-07-01',
    category: 'Rent',
    categoryAr: 'إيجار المقر',
    amount: 12500.00,
    paymentMethod: 'bank_transfer',
    description: 'Main Showroom & Warehouse Monthly Rent - Q3',
    descriptionAr: 'إيجار المعرض والمستودع الرئيسي - الربع الثالث',
    approvedBy: 'طارق المنصور',
    receiptNumber: 'RENT-Q3-882'
  },
  {
    id: 'exp-2',
    date: '2026-07-15',
    category: 'Electricity',
    categoryAr: 'كهرباء ومرافق',
    amount: 1850.00,
    paymentMethod: 'bank_transfer',
    description: 'SEC Electricity Bill - Showroom A/C & Warehouse',
    descriptionAr: 'فاتورة الكهرباء شركة السعودية للكهرباء - المعرض والمستودع',
    approvedBy: 'طارق المنصور',
    receiptNumber: 'SEC-9023812'
  },
  {
    id: 'exp-3',
    date: '2026-07-20',
    category: 'Transportation',
    categoryAr: 'مواصلات ونقل',
    amount: 320.00,
    paymentMethod: 'cash',
    description: 'Local courier delivery of urgent Lexus parts from Jeddah',
    descriptionAr: 'رسوم شحن سريع لطلب أجزاء لكزس عاجلة من جدة',
    approvedBy: 'فهد - مبيعات',
    receiptNumber: 'SMSA-00921'
  }
];

export const initialCashShift: CashDrawerShift = {
  id: 'shift-101',
  openedAt: '2026-07-21T08:00:00.000Z',
  cashierName: 'Tariq Al-Mansoor',
  openingCash: 1000.00,
  closingCashSystem: 1400.00,
  totalSalesCash: 400.00,
  totalSalesCard: 690.00,
  totalSalesCredit: 1380.00,
  totalExpensesCash: 0,
  status: 'open'
};

export const initialNotifications: SystemNotification[] = [
  {
    id: 'notif-1',
    type: 'low_stock',
    title: 'Low Stock Alert',
    titleAr: 'تنبيه مخزون منخفض',
    message: 'Bosch Performance Air Filter (16546-1S700) is down to 6 units.',
    messageAr: 'فلتر هواء بوش (16546-1S700) وصل إلى 6 قطع فقط.',
    time: '10 mins ago',
    read: false,
    severity: 'warning'
  },
  {
    id: 'notif-2',
    type: 'out_of_stock',
    title: 'Out of Stock Alert',
    titleAr: 'تنبيه نفاد المخزون',
    message: 'KYB Rear Shock Absorber Honda Accord (340028) is OUT OF STOCK.',
    messageAr: 'مساعدات خلفية كي واي بي هوندا أكورد (340028) نفذت بالكامل.',
    time: '1 hour ago',
    read: false,
    severity: 'danger'
  },
  {
    id: 'notif-3',
    type: 'new_sale',
    title: 'High Value Credit Sale',
    titleAr: 'عملية بيع آجل بقيمة عالية',
    message: 'Al-Safwa Transport Fleet created credit invoice INV-2026-0893 for SAR 1,380.00',
    messageAr: 'تم إصدار فاتورة آجل لمؤسسة الصفوة للنقليات بقيمة 1,380.00 ريال',
    time: '25 mins ago',
    read: true,
    severity: 'info'
  }
];
