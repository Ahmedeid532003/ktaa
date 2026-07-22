export type RoleType = 'super_admin' | 'owner' | 'manager' | 'cashier' | 'sales' | 'warehouse' | 'accountant';

export interface UserPermission {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
  print: boolean;
  export: boolean;
  discount: boolean;
  priceChange: boolean;
  returnItem: boolean;
  closeDay: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  nameAr?: string;
  email: string;
  phone?: string;
  username?: string;
  password?: string;
  role: RoleType;
  avatar: string;
  permissions: UserPermission;
  modules?: Array<
    | 'dashboard'
    | 'pos'
    | 'products'
    | 'inventory'
    | 'sales'
    | 'purchases'
    | 'customers'
    | 'suppliers'
    | 'expenses'
    | 'financial'
    | 'reports'
    | 'notifications'
    | 'users'
    | 'settings'
  >;
  isActive?: boolean;
  createdAt?: string;
}

export interface CompatibleVehicle {
  make: string;      // e.g. Toyota
  model: string;     // e.g. Camry
  years: string;     // e.g. 2018-2023
  engine?: string;   // e.g. 2.5L 4-Cyl
  transmission?: string; // Automatic / Manual
  fuelType?: string; // Gasoline / Hybrid / Diesel
}

export interface Product {
  id: string;
  image: string;
  images?: string[];
  nameEn: string;
  nameAr: string;
  partNumber: string;
  oemNumber: string;
  alternativeNumber?: string;
  barcode: string;
  qrCode?: string;
  brand: string;            // e.g. Denso, Bosch, Toyota Genuine
  category: string;         // e.g. Engine Parts, Brake System
  subcategory?: string;     // e.g. Brake Pads, Filters
  supplierId: string;
  supplierName: string;
  countryOfOrigin: string;  // e.g. Japan, Germany
  isOriginal: boolean;      // True = Original OEM, False = Aftermarket
  compatibleVehicles: CompatibleVehicle[];
  alternativeProductIds?: string[];
  replacementProductIds?: string[];
  costPrice: number;
  sellingPrice: number;
  wholesalePrice: number;
  minPrice: number;
  taxRate: number;          // e.g. 15 for 15% VAT
  currentStock: number;
  minStock: number;
  maxStock: number;
  warehouseLocation: string;// e.g. WH-1
  rackLocation: string;     // e.g. R-04
  shelfLocation: string;    // e.g. S-02
  unit: string;             // Pcs, Set, Box, Pair, Kit
  notes?: string;
  status: 'active' | 'low_stock' | 'out_of_stock' | 'discontinued';
}

export interface CustomerVehicle {
  id: string;
  plateNumber: string;
  vinNumber: string;
  make: string;
  model: string;
  year: number;
  color?: string;
}

export interface Customer {
  id: string;
  name: string;
  nameAr?: string;
  phone: string;
  email?: string;
  whatsapp?: string;
  taxNumber?: string;
  address: string;
  addressAr?: string;
  type: 'retail' | 'wholesale' | 'workshop' | 'fleet';
  balance: number;       // Positive = customer owes money, Negative = store credit
  creditLimit: number;
  discountLevel: 'standard' | 'bronze' | 'silver' | 'gold' | 'vip';
  vehicles: CustomerVehicle[];
  notes?: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  companyName: string;
  companyNameAr?: string;
  contactPerson: string;
  phone: string;
  email?: string;
  taxNumber?: string;
  address: string;
  balance: number;       // Positive = we owe supplier, Negative = supplier credit
  country: string;
  notes?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;     // Allow price edit if permitted
  discount: number;      // Per-item fixed or percentage
  discountType: 'fixed' | 'percentage';
  total: number;
}

export interface InvoicePayment {
  method: 'cash' | 'card' | 'bank_transfer' | 'credit' | 'split';
  amount: number;
  reference?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: 'pos_sale' | 'sales_order' | 'quotation' | 'customer_return';
  date: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  items: CartItem[];
  subtotal: number;
  itemDiscountTotal: number;
  invoiceDiscount: number;
  invoiceDiscountType: 'fixed' | 'percentage';
  taxAmount: number;
  grandTotal: number;
  paidAmount: number;
  changeDue: number;
  paymentStatus: 'paid' | 'partial' | 'unpaid' | 'credit';
  payments: InvoicePayment[];
  cashierName: string;
  branchName: string;
  notes?: string;
  suspendedAt?: string;
  isSuspended?: boolean;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  partNumber: string;
  quantity: number;
  costPrice: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  date: string;
  status: 'draft' | 'ordered' | 'received' | 'partially_received' | 'cancelled';
  items: PurchaseItem[];
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
  paidAmount: number;
  notes?: string;
}

export interface StockMovement {
  id: string;
  date: string;
  productId: string;
  productName: string;
  productNameAr?: string;
  partNumber: string;
  type: 'stock_in' | 'stock_out' | 'transfer' | 'adjustment' | 'damage' | 'sale' | 'return';
  quantity: number;      // Positive or negative
  previousStock: number;
  newStock: number;
  referenceNo: string;   // PO or Invoice or Adjustment #
  warehouseFrom?: string;
  warehouseTo?: string;
  performedBy: string;
  reason?: string;
  reasonAr?: string;
}

export interface Expense {
  id: string;
  date: string;
  category: 'Rent' | 'Salaries' | 'Electricity' | 'Internet' | 'Transportation' | 'Maintenance' | 'Customs' | 'Misc';
  categoryAr?: string;
  amount: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'card';
  description: string;
  descriptionAr?: string;
  approvedBy: string;
  receiptNumber?: string;
}

export interface CashDrawerShift {
  id: string;
  openedAt: string;
  closedAt?: string;
  cashierName: string;
  openingCash: number;
  closingCashSystem: number;
  closingCashActual?: number;
  difference?: number;
  totalSalesCash: number;
  totalSalesCard: number;
  totalSalesCredit: number;
  totalExpensesCash: number;
  status: 'open' | 'closed';
  notes?: string;
}

export interface SystemNotification {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'new_sale' | 'new_purchase' | 'due_payment' | 'closing_reminder';
  title: string;
  titleAr?: string;
  message: string;
  messageAr?: string;
  time: string;
  read: boolean;
  severity: 'info' | 'warning' | 'danger' | 'success';
}

export interface CompanySettings {
  companyNameEn: string;
  companyNameAr: string;
  taxNumber: string;
  crNumber: string;       // Commercial Registration
  phone: string;
  email: string;
  addressEn: string;
  addressAr: string;
  logoUrl: string;
  currency: string;       // SAR / AED / QAR / KWD / BHD / OMR
  taxRate: number;        // e.g., 15
  enableTax: boolean;
  printThermalHeader: string;
  printThermalFooter: string;
  defaultWarehouse: string;
}
