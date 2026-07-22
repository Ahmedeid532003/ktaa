import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import {
  Product,
  Customer,
  Supplier,
  Invoice,
  PurchaseOrder,
  StockMovement,
  Expense,
  UserProfile,
  UserPermission,
  CompanySettings,
  SystemNotification,
  CashDrawerShift,
  CartItem,
  InvoicePayment
} from '../types';
import {
  initialCompanySettings,
  initialUsers,
  initialProducts,
  initialCustomers,
  initialSuppliers,
  initialInvoices,
  initialPurchaseOrders,
  initialStockMovements,
  initialExpenses,
  initialCashShift,
  initialNotifications
} from '../data/mockData';
import { api, type AppBootstrap } from '../api/client';
import { soundFX } from '../utils/audio';
import { getTranslation } from '../i18n/translations';
import {
  canAccessModule,
  DEFAULT_ROLE_MODULES,
  DEFAULT_ROLE_PERMISSIONS,
  normalizeUser,
  type ModuleType,
} from '../utils/permissions';

export type { ModuleType };
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  isBackendReady: boolean;
  backendError: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  registerAccount: (user: Omit<UserProfile, 'id'>) => Promise<{ ok: boolean; error?: string }>;
  canAccess: (module: ModuleType) => boolean;
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  t: (path: string) => string;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  soundEnabled: boolean;
  toggleSound: () => void;

  // Settings & User
  settings: CompanySettings;
  updateSettings: (newSettings: CompanySettings) => void;
  users: UserProfile[];
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  addUser: (user: Omit<UserProfile, 'id'>) => void;
  updateUser: (user: UserProfile) => void;
  deleteUser: (userId: string) => void;
  toggleUserPermission: (userId: string, key: keyof UserPermission) => void;

  // Data Collections
  products: Product[];
  categories: string[];
  addCategory: (catName: string) => void;
  deleteCategory: (catName: string) => void;
  customers: Customer[];
  suppliers: Supplier[];
  invoices: Invoice[];
  purchaseOrders: PurchaseOrder[];
  stockMovements: StockMovement[];
  expenses: Expense[];
  notifications: SystemNotification[];
  currentShift: CashDrawerShift;

  // POS State & Actions
  cart: CartItem[];
  posCustomer: Customer;
  setPosCustomer: (customer: Customer) => void;
  invoiceDiscount: number;
  invoiceDiscountType: 'fixed' | 'percentage';
  setInvoiceDiscount: (val: number, type: 'fixed' | 'percentage') => void;
  heldInvoices: Invoice[];

  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, newQty: number) => void;
  updateCartItemPrice: (productId: string, newPrice: number) => void;
  updateCartItemDiscount: (productId: string, discount: number, type: 'fixed' | 'percentage') => void;
  clearCart: () => void;
  processCheckout: (payments: InvoicePayment[], notes?: string) => Invoice | null;
  holdCurrentInvoice: () => void;
  resumeHeldInvoice: (invoiceId: string) => void;
  processReturnInvoice: (originalInvoiceId: string, returnItems: { productId: string; qtyToReturn: number }[], refundMethod: 'cash' | 'credit') => Invoice | null;

  // CRUD & Transactions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;

  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomer: (customer: Customer) => void;

  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (supplier: Supplier) => void;

  addExpense: (expense: Omit<Expense, 'id'>) => void;
  addStockMovement: (movement: Omit<StockMovement, 'id' | 'date'>) => void;
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id'>) => void;
  receivePurchaseOrder: (poId: string) => void;

  closeCashShift: (actualCash: number, notes?: string) => void;
  openNewCashShift: (openingCash: number) => void;

  // Receipt Modal State
  receiptInvoice: Invoice | null;
  openReceiptModal: (invoice: Invoice) => void;
  closeReceiptModal: () => void;

  // Toast System
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Quick Action Launcher
  quickSearchQuery: string;
  setQuickSearchQuery: (q: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isBackendReady, setIsBackendReady] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const skipNextSync = useRef(true);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [activeModule, setActiveModuleRaw] = useState<ModuleType>('dashboard');
  const [language, setLanguage] = useState<'en' | 'ar'>(() => {
    const savedLang = localStorage.getItem('autoparts_lang');
    return (savedLang === 'en' || savedLang === 'ar') ? savedLang : 'ar';
  });
  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem('autoparts_theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('autoparts_sound') !== 'off';
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('autoparts_session') === '1';
  });
  const [sessionUserId, setSessionUserId] = useState<string | null>(() => {
    return localStorage.getItem('autoparts_user_id');
  });

  useEffect(() => {
    localStorage.setItem('autoparts_lang', language);
  }, [language]);

  const setDarkMode = (val: boolean) => {
    setDarkModeState(val);
    localStorage.setItem('autoparts_theme', val ? 'dark' : 'light');
  };

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('autoparts_sound', soundEnabled ? 'on' : 'off');
    soundFX.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Settings & Users — seed until backend bootstrap arrives
  const [settings, setSettings] = useState<CompanySettings>(initialCompanySettings);
  const [users, setUsers] = useState<UserProfile[]>(initialUsers.map(normalizeUser));
  const [currentUser, setCurrentUser] = useState<UserProfile>(normalizeUser(initialUsers[0]));

  // Main Collections
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<string[]>([
    'Brake System', 'Filters & Fluids', 'Ignition System', 'Suspension & Steering',
    'Electrical', 'Engine Parts', 'Body & Accessories'
  ]);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(initialStockMovements);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [notifications, setNotifications] = useState<SystemNotification[]>(initialNotifications);
  const [currentShift, setCurrentShift] = useState<CashDrawerShift>(initialCashShift);

  // POS state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [posCustomer, setPosCustomer] = useState<Customer>(initialCustomers[0]);
  const [invoiceDiscount, setInvoiceDiscountValue] = useState<number>(0);
  const [invoiceDiscountType, setInvoiceDiscountType] = useState<'fixed' | 'percentage'>('fixed');
  const [heldInvoices, setHeldInvoices] = useState<Invoice[]>([]);

  // Modal & Toast
  const [receiptInvoice, setReceiptInvoice] = useState<Invoice | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [quickSearchQuery, setQuickSearchQuery] = useState<string>('');

  const applyStore = (store: AppBootstrap, preferUserId?: string) => {
    const normalizedUsers = (store.users || []).map(normalizeUser);
    setSettings(store.settings);
    setUsers(normalizedUsers);
    setCurrentUser((prev) => {
      const preferredId = preferUserId || sessionUserId || prev.id;
      return normalizedUsers.find((u) => u.id === preferredId) || normalizedUsers[0] || normalizeUser(initialUsers[0]);
    });
    setProducts(store.products);
    setCategories(store.categories);
    setCustomers(store.customers);
    setSuppliers(store.suppliers);
    setInvoices(store.invoices);
    setPurchaseOrders(store.purchaseOrders);
    setStockMovements(store.stockMovements);
    setExpenses(store.expenses);
    setNotifications(store.notifications);
    setCurrentShift(store.currentShift);
    setHeldInvoices(store.heldInvoices || []);
    setPosCustomer((prev) => store.customers.find((c) => c.id === prev.id) || store.customers[0] || prev);
  };

  // Load from Express backend
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const store = await api.bootstrap();
        if (cancelled) return;
        skipNextSync.current = true;
        applyStore(store);
        setBackendError(null);
        setIsBackendReady(true);
      } catch (err) {
        if (cancelled) return;
        setBackendError(err instanceof Error ? err.message : 'Backend unavailable');
        setIsBackendReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist collections to backend (debounced)
  useEffect(() => {
    if (!isBackendReady || backendError) return;
    if (skipNextSync.current) {
      skipNextSync.current = false;
      return;
    }
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      api.saveState({
        settings,
        users,
        products,
        categories,
        customers,
        suppliers,
        invoices,
        purchaseOrders,
        stockMovements,
        expenses,
        notifications,
        currentShift,
        heldInvoices,
      }).catch((err) => {
        console.error('Backend sync failed:', err);
      });
    }, 500);
    return () => {
      if (syncTimer.current) clearTimeout(syncTimer.current);
    };
  }, [
    isBackendReady, backendError, settings, users, products, categories, customers,
    suppliers, invoices, purchaseOrders, stockMovements, expenses, notifications,
    currentShift, heldInvoices
  ]);

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const canAccess = (module: ModuleType) => canAccessModule(currentUser, module);

  const setActiveModule = (module: ModuleType) => {
    if (!canAccessModule(currentUser, module)) {
      showToast(
        language === 'ar' ? 'ليس لديك صلاحية لفتح هذا القسم' : 'You do not have access to this module',
        'error'
      );
      return;
    }
    setActiveModuleRaw(module);
  };

  const login = async (usernameOrEmail: string, password: string): Promise<boolean> => {
    const key = usernameOrEmail.trim().toLowerCase();
    const user = users
      .map(normalizeUser)
      .find(
        (u) =>
          u.isActive !== false &&
          (u.username?.toLowerCase() === key || u.email.toLowerCase() === key) &&
          (u.password || '123456') === password
      );
    if (!user) return false;
    setCurrentUser(user);
    setIsAuthenticated(true);
    setSessionUserId(user.id);
    localStorage.setItem('autoparts_session', '1');
    localStorage.setItem('autoparts_user_id', user.id);
    const firstModule = (user.modules || DEFAULT_ROLE_MODULES[user.role] || ['dashboard']).find((m) =>
      canAccessModule(user, m)
    ) || 'dashboard';
    setActiveModuleRaw(firstModule === 'users' ? 'dashboard' : firstModule);
    soundFX.playSuccessSound();
    showToast(
      language === 'ar'
        ? `مرحباً ${user.nameAr || user.name}`
        : `Welcome, ${user.name}`,
      'success'
    );
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setSessionUserId(null);
    localStorage.removeItem('autoparts_session');
    localStorage.removeItem('autoparts_user_id');
    setCart([]);
    setInvoiceDiscountValue(0);
    setActiveModuleRaw('dashboard');
    showToast(language === 'ar' ? 'تم تسجيل الخروج' : 'Signed out', 'info');
  };

  const registerAccount = async (
    userData: Omit<UserProfile, 'id'>
  ): Promise<{ ok: boolean; error?: string }> => {
    const username = (userData.username || '').trim().toLowerCase();
    if (!username) return { ok: false, error: language === 'ar' ? 'اسم المستخدم مطلوب' : 'Username required' };
    const exists = users.some(
      (u) =>
        u.username?.toLowerCase() === username ||
        u.email.toLowerCase() === (userData.email || '').toLowerCase()
    );
    if (exists) {
      return {
        ok: false,
        error: language === 'ar' ? 'اسم المستخدم أو الإيميل مستخدم مسبقاً' : 'Username or email already exists',
      };
    }
    const role = userData.role || 'cashier';
    const newUser: UserProfile = normalizeUser({
      ...userData,
      id: `usr-${Date.now()}`,
      username,
      password: userData.password || '123456',
      role,
      permissions: userData.permissions || { ...DEFAULT_ROLE_PERMISSIONS[role] },
      modules: userData.modules?.length ? userData.modules : [...DEFAULT_ROLE_MODULES[role]],
      isActive: true,
      createdAt: new Date().toISOString(),
    });
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    setSessionUserId(newUser.id);
    localStorage.setItem('autoparts_session', '1');
    localStorage.setItem('autoparts_user_id', newUser.id);
    setActiveModuleRaw('dashboard');
    showToast(
      language === 'ar' ? 'تم إنشاء الحساب بنجاح' : 'Account created successfully',
      'success'
    );
    return { ok: true };
  };

  // Keep user on an allowed module if role/modules change
  useEffect(() => {
    if (!isAuthenticated) return;
    if (!canAccessModule(currentUser, activeModule)) {
      setActiveModuleRaw('dashboard');
    }
  }, [currentUser, activeModule, isAuthenticated]);

  // POS Actions
  const addToCart = (product: Product, qty: number = 1) => {
    if (product.currentStock <= 0) {
      soundFX.playErrorSound();
      showToast(
        language === 'ar'
          ? `المنتج (${product.partNumber}) غير متوفر في المخزون!`
          : `Product (${product.partNumber}) is out of stock!`,
        'error'
      );
      return;
    }

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + qty;
        if (newQty > product.currentStock) {
          soundFX.playErrorSound();
          showToast(
            language === 'ar'
              ? `عذراً، الكمية المطلوبة تتجاوز المخزون المتاح (${product.currentStock})`
              : `Requested quantity exceeds available stock (${product.currentStock})`,
            'error'
          );
          return prevCart;
        }
        const unitPrice = updated[existingIndex].unitPrice;
        const discount = updated[existingIndex].discount;
        const discAmount = updated[existingIndex].discountType === 'percentage'
          ? (unitPrice * newQty * discount) / 100
          : discount * newQty;
        
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          total: (unitPrice * newQty) - discAmount
        };
        soundFX.playAddItemSound();
        return updated;
      } else {
        const unitPrice = product.sellingPrice;
        soundFX.playAddItemSound();
        return [
          ...prevCart,
          {
            product,
            quantity: qty,
            unitPrice,
            discount: 0,
            discountType: 'fixed',
            total: unitPrice * qty
          }
        ];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
    soundFX.playAddItemSound();
  };

  const updateCartQty = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          if (newQty > item.product.currentStock) {
            soundFX.playErrorSound();
            showToast(`Max stock reached (${item.product.currentStock})`, 'error');
            return item;
          }
          const discAmount = item.discountType === 'percentage'
            ? (item.unitPrice * newQty * item.discount) / 100
            : item.discount * newQty;
          return {
            ...item,
            quantity: newQty,
            total: (item.unitPrice * newQty) - discAmount
          };
        }
        return item;
      })
    );
  };

  const updateCartItemPrice = (productId: string, newPrice: number) => {
    if (!currentUser.permissions.priceChange) {
      soundFX.playErrorSound();
      showToast(
        language === 'ar' ? 'ليس لديك صلاحية تعديل السعر' : 'Permission denied: Price edit not allowed',
        'error'
      );
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const discAmount = item.discountType === 'percentage'
            ? (newPrice * item.quantity * item.discount) / 100
            : item.discount * item.quantity;
          return {
            ...item,
            unitPrice: newPrice,
            total: (newPrice * item.quantity) - discAmount
          };
        }
        return item;
      })
    );
  };

  const updateCartItemDiscount = (productId: string, discount: number, type: 'fixed' | 'percentage') => {
    if (!currentUser.permissions.discount) {
      soundFX.playErrorSound();
      showToast(language === 'ar' ? 'ليس لديك صلاحية الخصم' : 'Permission denied: Discounting disabled', 'error');
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const discAmount = type === 'percentage'
            ? (item.unitPrice * item.quantity * discount) / 100
            : discount * item.quantity;
          return {
            ...item,
            discount,
            discountType: type,
            total: Math.max(0, (item.unitPrice * item.quantity) - discAmount)
          };
        }
        return item;
      })
    );
  };

  const setInvoiceDiscount = (val: number, type: 'fixed' | 'percentage') => {
    if (!currentUser.permissions.discount && val > 0) {
      soundFX.playErrorSound();
      showToast('Permission denied for invoice discount', 'error');
      return;
    }
    setInvoiceDiscountValue(val);
    setInvoiceDiscountType(type);
  };

  const clearCart = () => {
    setCart([]);
    setInvoiceDiscountValue(0);
    setPosCustomer(customers[0]);
  };

  const processCheckout = (payments: InvoicePayment[], notes?: string): Invoice | null => {
    if (cart.length === 0) {
      soundFX.playErrorSound();
      showToast(language === 'ar' ? 'السلة فارغة' : 'Cart is empty', 'error');
      return null;
    }

    const subtotal = cart.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
    const itemDiscountTotal = cart.reduce((acc, item) => {
      const disc = item.discountType === 'percentage'
        ? (item.unitPrice * item.quantity * item.discount) / 100
        : item.discount * item.quantity;
      return acc + disc;
    }, 0);

    const netSubtotal = subtotal - itemDiscountTotal;
    const invDiscountVal = invoiceDiscountType === 'percentage'
      ? (netSubtotal * invoiceDiscount) / 100
      : invoiceDiscount;

    const taxableAmount = Math.max(0, netSubtotal - invDiscountVal);
    const taxAmount = settings.enableTax ? (taxableAmount * settings.taxRate) / 100 : 0;
    const grandTotal = taxableAmount + taxAmount;

    const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0);
    const isCredit = payments.some(p => p.method === 'credit');

    let paymentStatus: 'paid' | 'partial' | 'unpaid' | 'credit' = 'paid';
    if (isCredit) {
      paymentStatus = 'credit';
    } else if (totalPaid < grandTotal) {
      paymentStatus = 'partial';
    }

    const newInvoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: newInvoiceNumber,
      type: 'pos_sale',
      date: new Date().toISOString(),
      customerId: posCustomer.id,
      customerName: posCustomer.name,
      customerPhone: posCustomer.phone,
      items: [...cart],
      subtotal,
      itemDiscountTotal,
      invoiceDiscount: invDiscountVal,
      invoiceDiscountType,
      taxAmount,
      grandTotal,
      paidAmount: totalPaid,
      changeDue: Math.max(0, totalPaid - grandTotal),
      paymentStatus,
      payments,
      cashierName: currentUser.name,
      branchName: settings.defaultWarehouse,
      notes
    };

    // Update product stocks & stock movements
    const newMovements: StockMovement[] = [];
    setProducts(prevProducts =>
      prevProducts.map(prod => {
        const cartMatch = cart.find(item => item.product.id === prod.id);
        if (cartMatch) {
          const newQty = prod.currentStock - cartMatch.quantity;
          const status = newQty <= 0 ? 'out_of_stock' : newQty <= prod.minStock ? 'low_stock' : 'active';
          
          newMovements.push({
            id: `sm-${Date.now()}-${prod.id}`,
            date: new Date().toISOString(),
            productId: prod.id,
            productName: prod.nameEn,
            partNumber: prod.partNumber,
            type: 'sale',
            quantity: -cartMatch.quantity,
            previousStock: prod.currentStock,
            newStock: newQty,
            referenceNo: newInvoiceNumber,
            warehouseFrom: prod.warehouseLocation,
            performedBy: currentUser.name,
            reason: 'POS Invoice Checkout'
          });

          return {
            ...prod,
            currentStock: Math.max(0, newQty),
            status
          };
        }
        return prod;
      })
    );

    setStockMovements(prev => [...newMovements, ...prev]);
    setInvoices(prev => [newInvoice, ...prev]);

    // Update Customer Balance if credit or partial payment
    if (posCustomer.id !== 'cust-1' && (isCredit || totalPaid < grandTotal)) {
      const unpaidDifference = grandTotal - totalPaid;
      setCustomers(prev =>
        prev.map(c => c.id === posCustomer.id ? { ...c, balance: c.balance + unpaidDifference } : c)
      );
    }

    // Update Shift stats
    const cashPaid = payments.filter(p => p.method === 'cash').reduce((a, b) => a + b.amount, 0);
    const cardPaid = payments.filter(p => p.method === 'card' || p.method === 'bank_transfer').reduce((a, b) => a + b.amount, 0);
    const creditPaid = payments.filter(p => p.method === 'credit').reduce((a, b) => a + b.amount, 0);

    setCurrentShift(prev => ({
      ...prev,
      closingCashSystem: prev.closingCashSystem + cashPaid,
      totalSalesCash: prev.totalSalesCash + cashPaid,
      totalSalesCard: prev.totalSalesCard + cardPaid,
      totalSalesCredit: prev.totalSalesCredit + creditPaid
    }));

    soundFX.playSuccessSound();
    showToast(
      language === 'ar' ? `تم إصدار الفاتورة (${newInvoiceNumber}) بنجاح!` : `Invoice (${newInvoiceNumber}) completed!`,
      'success'
    );

    clearCart();
    setReceiptInvoice(newInvoice);
    return newInvoice;
  };

  const holdCurrentInvoice = () => {
    if (cart.length === 0) return;
    const held: Invoice = {
      id: `hold-${Date.now()}`,
      invoiceNumber: `HOLD-${Math.floor(100 + Math.random() * 900)}`,
      type: 'pos_sale',
      date: new Date().toISOString(),
      customerId: posCustomer.id,
      customerName: posCustomer.name,
      items: [...cart],
      subtotal: cart.reduce((a, c) => a + c.total, 0),
      itemDiscountTotal: 0,
      invoiceDiscount,
      invoiceDiscountType,
      taxAmount: 0,
      grandTotal: cart.reduce((a, c) => a + c.total, 0),
      paidAmount: 0,
      changeDue: 0,
      paymentStatus: 'unpaid',
      payments: [],
      cashierName: currentUser.name,
      branchName: settings.defaultWarehouse,
      isSuspended: true
    };
    setHeldInvoices(prev => [held, ...prev]);
    clearCart();
    showToast(language === 'ar' ? 'تم تعليق الفاتورة' : 'Invoice put on hold', 'info');
  };

  const resumeHeldInvoice = (invoiceId: string) => {
    const target = heldInvoices.find(h => h.id === invoiceId);
    if (!target) return;
    setCart(target.items);
    setInvoiceDiscountValue(target.invoiceDiscount);
    setInvoiceDiscountType(target.invoiceDiscountType);
    const cust = customers.find(c => c.id === target.customerId) || customers[0];
    setPosCustomer(cust);
    setHeldInvoices(prev => prev.filter(h => h.id !== invoiceId));
    showToast(language === 'ar' ? 'تم استرجاع الفاتورة المعلقة' : 'Resumed suspended invoice', 'success');
  };

  const processReturnInvoice = (
    originalInvoiceId: string,
    returnItems: { productId: string; qtyToReturn: number }[],
    refundMethod: 'cash' | 'credit'
  ): Invoice | null => {
    if (!currentUser.permissions.returnItem) {
      soundFX.playErrorSound();
      showToast('Permission denied for customer returns', 'error');
      return null;
    }

    const origInv = invoices.find(i => i.id === originalInvoiceId);
    if (!origInv) return null;

    let totalRefundAmount = 0;
    const returnedCartItems: CartItem[] = [];

    returnItems.forEach(ret => {
      const matched = origInv.items.find(i => i.product.id === ret.productId);
      if (matched && ret.qtyToReturn > 0) {
        const itemUnitPrice = matched.unitPrice;
        const itemRefund = itemUnitPrice * ret.qtyToReturn;
        totalRefundAmount += itemRefund;

        returnedCartItems.push({
          ...matched,
          quantity: ret.qtyToReturn,
          total: itemRefund
        });

        // Restore stock
        setProducts(prev =>
          prev.map(p => {
            if (p.id === ret.productId) {
              const newQty = p.currentStock + ret.qtyToReturn;
              return {
                ...p,
                currentStock: newQty,
                status: newQty > p.minStock ? 'active' : 'low_stock'
              };
            }
            return p;
          })
        );

        // Record stock movement
        const newMove: StockMovement = {
          id: `sm-return-${Date.now()}-${ret.productId}`,
          date: new Date().toISOString(),
          productId: ret.productId,
          productName: matched.product.nameEn,
          partNumber: matched.product.partNumber,
          type: 'return',
          quantity: ret.qtyToReturn,
          previousStock: matched.product.currentStock,
          newStock: matched.product.currentStock + ret.qtyToReturn,
          referenceNo: `RET-${origInv.invoiceNumber}`,
          performedBy: currentUser.name,
          reason: 'Customer Part Return'
        };
        setStockMovements(prev => [newMove, ...prev]);
      }
    });

    const returnInvoiceNumber = `RET-${origInv.invoiceNumber}`;
    const taxRefund = settings.enableTax ? (totalRefundAmount * settings.taxRate) / 100 : 0;
    const totalRefundWithTax = totalRefundAmount + taxRefund;

    const returnInvoice: Invoice = {
      id: `inv-ret-${Date.now()}`,
      invoiceNumber: returnInvoiceNumber,
      type: 'customer_return',
      date: new Date().toISOString(),
      customerId: origInv.customerId,
      customerName: origInv.customerName,
      items: returnedCartItems,
      subtotal: totalRefundAmount,
      itemDiscountTotal: 0,
      invoiceDiscount: 0,
      invoiceDiscountType: 'fixed',
      taxAmount: taxRefund,
      grandTotal: totalRefundWithTax,
      paidAmount: totalRefundWithTax,
      changeDue: 0,
      paymentStatus: 'paid',
      payments: [{ method: refundMethod, amount: totalRefundWithTax }],
      cashierName: currentUser.name,
      branchName: settings.defaultWarehouse,
      notes: `Returned items from ${origInv.invoiceNumber}`
    };

    setInvoices(prev => [returnInvoice, ...prev]);

    if (refundMethod === 'credit' && origInv.customerId !== 'cust-1') {
      setCustomers(prev =>
        prev.map(c => c.id === origInv.customerId ? { ...c, balance: c.balance - totalRefundWithTax } : c)
      );
    }

    soundFX.playSuccessSound();
    showToast(
      language === 'ar' ? `تم تسجيل مرتجع بقيمة ${totalRefundWithTax.toFixed(2)}` : `Return invoice processed for ${totalRefundWithTax.toFixed(2)}`,
      'success'
    );

    setReceiptInvoice(returnInvoice);
    return returnInvoice;
  };

  // Product CRUD
  const addProduct = (pData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...pData,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [newProd, ...prev]);
    showToast(language === 'ar' ? 'تم إضافة القطعة بنجاح' : 'Product added successfully', 'success');
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    showToast(language === 'ar' ? 'تم تعديل بيانات القطعة' : 'Product updated', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast(language === 'ar' ? 'تم حذف القطعة' : 'Product deleted', 'info');
  };

  const addCategory = (catName: string) => {
    const trimmed = catName.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      showToast(language === 'ar' ? 'القسم موجود بالفعل' : 'Category already exists', 'error');
      return;
    }
    setCategories(prev => [...prev, trimmed]);
    showToast(language === 'ar' ? `تم إضافة قسم جديد: ${trimmed}` : `New category added: ${trimmed}`, 'success');
  };

  const deleteCategory = (catName: string) => {
    setCategories(prev => prev.filter(c => c !== catName));
    showToast(language === 'ar' ? 'تم حذف القسم' : 'Category deleted', 'info');
  };

  // Customers & Suppliers
  const addCustomer = (cData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCust: Customer = {
      ...cData,
      id: `cust-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setCustomers(prev => [newCust, ...prev]);
    showToast(language === 'ar' ? 'تم إضافة العميل بنجاح' : 'Customer added', 'success');
  };

  const updateCustomer = (updated: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
    showToast('Customer record updated', 'success');
  };

  const addSupplier = (sData: Omit<Supplier, 'id'>) => {
    const newSup: Supplier = {
      ...sData,
      id: `sup-${Date.now()}`
    };
    setSuppliers(prev => [newSup, ...prev]);
    showToast('Supplier added successfully', 'success');
  };

  const updateSupplier = (updated: Supplier) => {
    setSuppliers(prev => prev.map(s => s.id === updated.id ? updated : s));
    showToast('Supplier record updated', 'success');
  };

  // Expenses & Stock Movements & PO
  const addExpense = (eData: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...eData,
      id: `exp-${Date.now()}`
    };
    setExpenses(prev => [newExp, ...prev]);
    showToast('Expense recorded', 'success');
  };

  const addStockMovement = (m: Omit<StockMovement, 'id' | 'date'>) => {
    const newMove: StockMovement = {
      ...m,
      id: `sm-${Date.now()}`,
      date: new Date().toISOString()
    };

    setStockMovements(prev => [newMove, ...prev]);

    // Update product stock directly
    setProducts(prev =>
      prev.map(p => {
        if (p.id === m.productId) {
          const newQty = m.newStock;
          const status = newQty <= 0 ? 'out_of_stock' : newQty <= p.minStock ? 'low_stock' : 'active';
          return { ...p, currentStock: newQty, status };
        }
        return p;
      })
    );
    showToast('Stock movement logged', 'success');
  };

  const addPurchaseOrder = (poData: Omit<PurchaseOrder, 'id'>) => {
    const newPo: PurchaseOrder = {
      ...poData,
      id: `po-${Date.now()}`
    };
    setPurchaseOrders(prev => [newPo, ...prev]);
    showToast(language === 'ar' ? 'تم إنشاء أمر الشراء بنجاح' : 'Purchase Order created', 'success');
  };

  const receivePurchaseOrder = (poId: string) => {
    const targetPo = purchaseOrders.find(p => p.id === poId);
    if (!targetPo) return;
    if (targetPo.status === 'received') {
      showToast(language === 'ar' ? 'تم استلام هذا الطلب بالفعل' : 'PO already received', 'info');
      return;
    }

    // Mark PO as received
    setPurchaseOrders(prev =>
      prev.map(p => (p.id === poId ? { ...p, status: 'received' } : p))
    );

    // Update products stock & add stock movements
    targetPo.items.forEach(item => {
      setProducts(prevProds =>
        prevProds.map(prod => {
          if (prod.id === item.productId) {
            const newQty = prod.currentStock + item.quantity;
            return {
              ...prod,
              currentStock: newQty,
              status: newQty <= 0 ? 'out_of_stock' : newQty <= prod.minStock ? 'low_stock' : 'active'
            };
          }
          return prod;
        })
      );

      const targetProd = products.find(p => p.id === item.productId);
      const prevStock = targetProd ? targetProd.currentStock : 0;

      const newMove: StockMovement = {
        id: `sm-po-${Date.now()}-${item.productId}`,
        date: new Date().toISOString(),
        productId: item.productId,
        productName: item.productName,
        partNumber: item.partNumber,
        type: 'stock_in',
        quantity: item.quantity,
        previousStock: prevStock,
        newStock: prevStock + item.quantity,
        referenceNo: targetPo.poNumber,
        performedBy: currentUser.name,
        reason: `PO Goods Receipt (${targetPo.supplierName})`
      };

      setStockMovements(prev => [newMove, ...prev]);
    });

    soundFX.playSuccessSound();
    showToast(
      language === 'ar'
        ? `تم استلام البضاعة (${targetPo.poNumber}) وتحديث مخزون قطع الغيار تلقائياً!`
        : `Shipment received and inventory updated for ${targetPo.poNumber}`,
      'success'
    );
  };

  // Shift Actions
  const closeCashShift = (actualCash: number, notes?: string) => {
    if (!currentUser.permissions.closeDay && currentUser.role !== 'super_admin' && currentUser.role !== 'owner') {
      soundFX.playErrorSound();
      showToast(language === 'ar' ? 'ليس لديك صلاحية إغلاق الوردية' : 'No permission to close shift', 'error');
      return;
    }
    const diff = actualCash - currentShift.closingCashSystem;
    setCurrentShift(prev => ({
      ...prev,
      closingCashActual: actualCash,
      difference: diff,
      closedAt: new Date().toISOString(),
      status: 'closed',
      notes
    }));
    soundFX.playSuccessSound();
    showToast(
      language === 'ar'
        ? `تم إغلاق وردية الصندوق. الفارق: ${diff.toFixed(2)}`
        : `Shift closed. Difference: ${diff.toFixed(2)}`,
      diff === 0 ? 'success' : 'info'
    );
  };

  const openNewCashShift = (openingCash: number) => {
    const newShift: CashDrawerShift = {
      id: `shift-${Date.now()}`,
      openedAt: new Date().toISOString(),
      cashierName: currentUser.name,
      openingCash,
      closingCashSystem: openingCash,
      totalSalesCash: 0,
      totalSalesCard: 0,
      totalSalesCredit: 0,
      totalExpensesCash: 0,
      status: 'open'
    };
    setCurrentShift(newShift);
    showToast('New cash drawer shift opened', 'success');
  };

  const addUser = (userData: Omit<UserProfile, 'id'>) => {
    const role = userData.role || 'cashier';
    const newUser: UserProfile = normalizeUser({
      ...userData,
      id: `usr-${Date.now()}`,
      username: userData.username || `emp_${Date.now().toString().slice(-4)}`,
      password: userData.password || '123456',
      permissions: userData.permissions || { ...DEFAULT_ROLE_PERMISSIONS[role] },
      modules: userData.modules?.length ? userData.modules : [...DEFAULT_ROLE_MODULES[role]],
      isActive: userData.isActive !== undefined ? userData.isActive : true,
      createdAt: new Date().toISOString()
    });
    setUsers(prev => [...prev, newUser]);
    showToast(
      language === 'ar' ? `تم إضافة الحساب للموظف ${newUser.nameAr || newUser.name} بنجاح` : `User account created for ${newUser.name}`,
      'success'
    );
  };

  const updateUser = (userData: UserProfile) => {
    setUsers(prev => prev.map(u => u.id === userData.id ? userData : u));
    if (currentUser.id === userData.id) {
      setCurrentUser(userData);
    }
    showToast(
      language === 'ar' ? 'تم تحديث بيانات وحساب الموظف بنجاح' : 'User profile updated',
      'success'
    );
  };

  const deleteUser = (userId: string) => {
    if (users.length <= 1) {
      showToast(language === 'ar' ? 'لا يمكن حذف الحساب الوحيد في النظام' : 'Cannot delete the only user', 'error');
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== userId));
    if (currentUser.id === userId) {
      const remaining = users.filter(u => u.id !== userId);
      if (remaining.length > 0) setCurrentUser(remaining[0]);
    }
    showToast(language === 'ar' ? 'تم حذف حساب الموظف' : 'User account deleted', 'info');
  };

  const toggleUserPermission = (userId: string, key: keyof UserPermission) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updatedPerms = { ...u.permissions, [key]: !u.permissions[key] };
        const updatedUser = { ...u, permissions: updatedPerms };
        if (currentUser.id === userId) {
          setCurrentUser(updatedUser);
        }
        return updatedUser;
      }
      return u;
    }));
    showToast(language === 'ar' ? 'تم تحديث الصلاحية' : 'Permission updated', 'success');
  };

  const updateSettings = (newSettings: CompanySettings) => {
    setSettings(newSettings);
    showToast('Settings saved successfully', 'success');
  };

  const openReceiptModal = (invoice: Invoice) => {
    setReceiptInvoice(invoice);
  };

  const closeReceiptModal = () => {
    setReceiptInvoice(null);
  };

  return (
    <AppContext.Provider
      value={{
        isBackendReady,
        backendError,
        isAuthenticated,
        login,
        logout,
        registerAccount,
        canAccess,
        activeModule,
        setActiveModule,
        language,
        setLanguage,
        t: (path: string) => getTranslation(language, path),
        darkMode,
        setDarkMode,
        soundEnabled,
        toggleSound,

        settings,
        updateSettings,
        users,
        currentUser,
        setCurrentUser,
        addUser,
        updateUser,
        deleteUser,
        toggleUserPermission,

        products,
        categories,
        addCategory,
        deleteCategory,
        customers,
        suppliers,
        invoices,
        purchaseOrders,
        stockMovements,
        expenses,
        notifications,
        currentShift,

        cart,
        posCustomer,
        setPosCustomer,
        invoiceDiscount,
        invoiceDiscountType,
        setInvoiceDiscount,
        heldInvoices,

        addToCart,
        removeFromCart,
        updateCartQty,
        updateCartItemPrice,
        updateCartItemDiscount,
        clearCart,
        processCheckout,
        holdCurrentInvoice,
        resumeHeldInvoice,
        processReturnInvoice,

        addProduct,
        updateProduct,
        deleteProduct,

        addCustomer,
        updateCustomer,

        addSupplier,
        updateSupplier,

        addExpense,
        addStockMovement,
        addPurchaseOrder,
        receivePurchaseOrder,

        closeCashShift,
        openNewCashShift,

        receiptInvoice,
        openReceiptModal,
        closeReceiptModal,

        toasts,
        showToast,
        removeToast,

        quickSearchQuery,
        setQuickSearchQuery
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
