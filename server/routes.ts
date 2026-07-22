import { Router, type Request, type Response } from 'express';
import { patchStore, readStore, resetStore, writeStore, type AppStore } from './store.ts';
import { lookupPart } from './ai.ts';
import type {
  Product,
  Customer,
  Supplier,
  Invoice,
  PurchaseOrder,
  StockMovement,
  Expense,
  UserProfile,
  CompanySettings,
  CashDrawerShift,
  InvoicePayment,
  CartItem,
} from '../src/types/index.ts';

const router = Router();

router.get('/health', async (_req, res) => {
  try {
    await readStore();
    res.json({ ok: true, service: 'autoparts-api', db: true, time: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'DB error',
      time: new Date().toISOString(),
    });
  }
});

router.get('/bootstrap', async (_req, res) => {
  res.json(await readStore());
});

router.put('/state', async (req: Request, res: Response) => {
  const body = req.body as Partial<AppStore>;
  if (!body || typeof body !== 'object') {
    res.status(400).json({ error: 'Invalid state payload' });
    return;
  }
  const current = await readStore();
  const next = await writeStore({ ...current, ...body });
  res.json(next);
});

router.post('/reset', async (_req, res) => {
  res.json(await resetStore());
});

router.get('/settings', async (_req, res) => res.json((await readStore()).settings));
router.put('/settings', async (req, res) => {
  const settings = req.body as CompanySettings;
  res.json((await patchStore({ settings })).settings);
});

function listRoute<K extends keyof AppStore>(key: K) {
  router.get(`/${String(key)}`, async (_req, res) => res.json((await readStore())[key]));
}

function replaceRoute<K extends keyof AppStore>(key: K) {
  router.put(`/${String(key)}`, async (req, res) => {
    const next = await patchStore({ [key]: req.body } as Partial<AppStore>);
    res.json(next[key]);
  });
}

listRoute('products');
listRoute('customers');
listRoute('suppliers');
listRoute('invoices');
listRoute('purchaseOrders');
listRoute('stockMovements');
listRoute('expenses');
listRoute('users');
listRoute('categories');
listRoute('notifications');
listRoute('heldInvoices');

replaceRoute('products');
replaceRoute('customers');
replaceRoute('suppliers');
replaceRoute('invoices');
replaceRoute('purchaseOrders');
replaceRoute('stockMovements');
replaceRoute('expenses');
replaceRoute('users');
replaceRoute('categories');
replaceRoute('notifications');
replaceRoute('heldInvoices');

router.get('/shift', async (_req, res) => res.json((await readStore()).currentShift));
router.put('/shift', async (req, res) => {
  res.json((await patchStore({ currentShift: req.body as CashDrawerShift })).currentShift);
});

router.post('/products', async (req, res) => {
  const store = await readStore();
  const product: Product = { ...(req.body as Omit<Product, 'id'>), id: `prod-${Date.now()}` };
  await patchStore({ products: [product, ...store.products] });
  res.status(201).json(product);
});

router.put('/products/:id', async (req, res) => {
  const store = await readStore();
  const id = req.params.id;
  const products = store.products.map((p) => (p.id === id ? ({ ...p, ...req.body, id } as Product) : p));
  await patchStore({ products });
  const updated = products.find((p) => p.id === id);
  if (!updated) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(updated);
});

router.delete('/products/:id', async (req, res) => {
  const store = await readStore();
  await patchStore({ products: store.products.filter((p) => p.id !== req.params.id) });
  res.json({ ok: true });
});

router.post('/customers', async (req, res) => {
  const store = await readStore();
  const customer: Customer = {
    ...(req.body as Omit<Customer, 'id' | 'createdAt'>),
    id: `cust-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  await patchStore({ customers: [customer, ...store.customers] });
  res.status(201).json(customer);
});

router.put('/customers/:id', async (req, res) => {
  const store = await readStore();
  const customers = store.customers.map((c) =>
    c.id === req.params.id ? ({ ...c, ...req.body, id: req.params.id } as Customer) : c
  );
  await patchStore({ customers });
  const updated = customers.find((c) => c.id === req.params.id);
  if (!updated) {
    res.status(404).json({ error: 'Customer not found' });
    return;
  }
  res.json(updated);
});

router.post('/suppliers', async (req, res) => {
  const store = await readStore();
  const supplier: Supplier = { ...(req.body as Omit<Supplier, 'id'>), id: `sup-${Date.now()}` };
  await patchStore({ suppliers: [supplier, ...store.suppliers] });
  res.status(201).json(supplier);
});

router.put('/suppliers/:id', async (req, res) => {
  const store = await readStore();
  const suppliers = store.suppliers.map((s) =>
    s.id === req.params.id ? ({ ...s, ...req.body, id: req.params.id } as Supplier) : s
  );
  await patchStore({ suppliers });
  const updated = suppliers.find((s) => s.id === req.params.id);
  if (!updated) {
    res.status(404).json({ error: 'Supplier not found' });
    return;
  }
  res.json(updated);
});

router.post('/users', async (req, res) => {
  const store = await readStore();
  const user: UserProfile = {
    ...(req.body as Omit<UserProfile, 'id'>),
    id: `usr-${Date.now()}`,
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  await patchStore({ users: [...store.users, user] });
  res.status(201).json(user);
});

router.put('/users/:id', async (req, res) => {
  const store = await readStore();
  const users = store.users.map((u) =>
    u.id === req.params.id ? ({ ...u, ...req.body, id: req.params.id } as UserProfile) : u
  );
  await patchStore({ users });
  const updated = users.find((u) => u.id === req.params.id);
  if (!updated) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json(updated);
});

router.delete('/users/:id', async (req, res) => {
  const store = await readStore();
  if (store.users.length <= 1) {
    res.status(400).json({ error: 'Cannot delete the only user' });
    return;
  }
  await patchStore({ users: store.users.filter((u) => u.id !== req.params.id) });
  res.json({ ok: true });
});

router.post('/expenses', async (req, res) => {
  const store = await readStore();
  const expense: Expense = { ...(req.body as Omit<Expense, 'id'>), id: `exp-${Date.now()}` };
  await patchStore({ expenses: [expense, ...store.expenses] });
  res.status(201).json(expense);
});

router.post('/checkout', async (req, res) => {
  const {
    cart,
    payments,
    notes,
    customerId,
    invoiceDiscount = 0,
    invoiceDiscountType = 'fixed',
    cashierName,
  } = req.body as {
    cart: CartItem[];
    payments: InvoicePayment[];
    notes?: string;
    customerId: string;
    invoiceDiscount?: number;
    invoiceDiscountType?: 'fixed' | 'percentage';
    cashierName: string;
  };

  if (!cart?.length) {
    res.status(400).json({ error: 'Cart is empty' });
    return;
  }

  const store = await readStore();
  const customer = store.customers.find((c) => c.id === customerId) || store.customers[0];
  const settings = store.settings;

  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const itemDiscountTotal = cart.reduce((acc, item) => {
    const disc =
      item.discountType === 'percentage'
        ? (item.unitPrice * item.quantity * item.discount) / 100
        : item.discount * item.quantity;
    return acc + disc;
  }, 0);
  const netSubtotal = subtotal - itemDiscountTotal;
  const invDiscountVal =
    invoiceDiscountType === 'percentage' ? (netSubtotal * invoiceDiscount) / 100 : invoiceDiscount;
  const taxableAmount = Math.max(0, netSubtotal - invDiscountVal);
  const taxAmount = settings.enableTax ? (taxableAmount * settings.taxRate) / 100 : 0;
  const grandTotal = taxableAmount + taxAmount;
  const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0);
  const isCredit = payments.some((p) => p.method === 'credit');

  let paymentStatus: Invoice['paymentStatus'] = 'paid';
  if (isCredit) paymentStatus = 'credit';
  else if (totalPaid < grandTotal) paymentStatus = 'partial';

  const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const invoice: Invoice = {
    id: `inv-${Date.now()}`,
    invoiceNumber,
    type: 'pos_sale',
    date: new Date().toISOString(),
    customerId: customer.id,
    customerName: customer.name,
    customerPhone: customer.phone,
    items: cart,
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
    cashierName,
    branchName: settings.defaultWarehouse,
    notes,
  };

  const newMovements: StockMovement[] = [];
  const products = store.products.map((prod) => {
    const cartMatch = cart.find((item) => item.product.id === prod.id);
    if (!cartMatch) return prod;
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
      referenceNo: invoiceNumber,
      warehouseFrom: prod.warehouseLocation,
      performedBy: cashierName,
      reason: 'POS Invoice Checkout',
    });
    return { ...prod, currentStock: Math.max(0, newQty), status };
  });

  let customers = store.customers;
  if (customer.id !== 'cust-1' && (isCredit || totalPaid < grandTotal)) {
    const unpaidDifference = grandTotal - totalPaid;
    customers = customers.map((c) =>
      c.id === customer.id ? { ...c, balance: c.balance + unpaidDifference } : c
    );
  }

  const cashPaid = payments.filter((p) => p.method === 'cash').reduce((a, b) => a + b.amount, 0);
  const cardPaid = payments
    .filter((p) => p.method === 'card' || p.method === 'bank_transfer')
    .reduce((a, b) => a + b.amount, 0);
  const creditPaid = payments.filter((p) => p.method === 'credit').reduce((a, b) => a + b.amount, 0);

  const currentShift: CashDrawerShift = {
    ...store.currentShift,
    closingCashSystem: store.currentShift.closingCashSystem + cashPaid,
    totalSalesCash: store.currentShift.totalSalesCash + cashPaid,
    totalSalesCard: store.currentShift.totalSalesCard + cardPaid,
    totalSalesCredit: store.currentShift.totalSalesCredit + creditPaid,
  };

  const next = await writeStore({
    ...store,
    products,
    customers,
    invoices: [invoice, ...store.invoices],
    stockMovements: [...newMovements, ...store.stockMovements],
    currentShift,
  });

  res.status(201).json({ invoice, store: next });
});

router.post('/purchase-orders/:id/receive', async (req, res) => {
  const store = await readStore();
  const po = store.purchaseOrders.find((p) => p.id === req.params.id);
  if (!po) {
    res.status(404).json({ error: 'PO not found' });
    return;
  }
  if (po.status === 'received') {
    res.status(400).json({ error: 'PO already received' });
    return;
  }

  const performedBy = (req.body?.performedBy as string) || 'System';
  const movements: StockMovement[] = [];
  const products = store.products.map((prod) => {
    const item = po.items.find((i) => i.productId === prod.id);
    if (!item) return prod;
    const newQty = prod.currentStock + item.quantity;
    movements.push({
      id: `sm-po-${Date.now()}-${prod.id}`,
      date: new Date().toISOString(),
      productId: prod.id,
      productName: item.productName,
      partNumber: item.partNumber,
      type: 'stock_in',
      quantity: item.quantity,
      previousStock: prod.currentStock,
      newStock: newQty,
      referenceNo: po.poNumber,
      performedBy,
      reason: `PO Goods Receipt (${po.supplierName})`,
    });
    return {
      ...prod,
      currentStock: newQty,
      status: newQty <= 0 ? 'out_of_stock' : newQty <= prod.minStock ? 'low_stock' : 'active',
    } as Product;
  });

  const purchaseOrders = store.purchaseOrders.map((p) =>
    p.id === po.id ? { ...p, status: 'received' as const } : p
  );

  const next = await writeStore({
    ...store,
    products,
    purchaseOrders,
    stockMovements: [...movements, ...store.stockMovements],
  });

  res.json({ po: purchaseOrders.find((p) => p.id === po.id), store: next });
});

router.post('/purchase-orders', async (req, res) => {
  const store = await readStore();
  const po: PurchaseOrder = { ...(req.body as Omit<PurchaseOrder, 'id'>), id: `po-${Date.now()}` };
  await patchStore({ purchaseOrders: [po, ...store.purchaseOrders] });
  res.status(201).json(po);
});

router.post('/stock-movements', async (req, res) => {
  const store = await readStore();
  const movement: StockMovement = {
    ...(req.body as Omit<StockMovement, 'id' | 'date'>),
    id: `sm-${Date.now()}`,
    date: new Date().toISOString(),
  };
  const products = store.products.map((p) => {
    if (p.id !== movement.productId) return p;
    const newQty = movement.newStock;
    const status = newQty <= 0 ? 'out_of_stock' : newQty <= p.minStock ? 'low_stock' : 'active';
    return { ...p, currentStock: newQty, status };
  });
  const next = await writeStore({
    ...store,
    products,
    stockMovements: [movement, ...store.stockMovements],
  });
  res.status(201).json({ movement, store: next });
});

router.post('/shifts/close', async (req, res) => {
  const store = await readStore();
  const { actualCash, notes } = req.body as { actualCash: number; notes?: string };
  const diff = actualCash - store.currentShift.closingCashSystem;
  const currentShift: CashDrawerShift = {
    ...store.currentShift,
    closingCashActual: actualCash,
    difference: diff,
    closedAt: new Date().toISOString(),
    status: 'closed',
    notes,
  };
  res.json((await patchStore({ currentShift })).currentShift);
});

router.post('/shifts/open', async (req, res) => {
  const { openingCash, cashierName } = req.body as { openingCash: number; cashierName: string };
  const currentShift: CashDrawerShift = {
    id: `shift-${Date.now()}`,
    openedAt: new Date().toISOString(),
    cashierName,
    openingCash,
    closingCashSystem: openingCash,
    totalSalesCash: 0,
    totalSalesCard: 0,
    totalSalesCredit: 0,
    totalExpensesCash: 0,
    status: 'open',
  };
  res.json((await patchStore({ currentShift })).currentShift);
});

router.post('/ai/part-lookup', async (req, res) => {
  try {
    const { query, language } = req.body as { query?: string; language?: 'ar' | 'en' };
    if (!query?.trim()) {
      res.status(400).json({ error: 'query is required' });
      return;
    }
    const result = await lookupPart(query.trim(), language || 'ar');
    res.json({ result });
  } catch (error) {
    const err = error as Error & { status?: number };
    res.status(err.status || 500).json({ error: err.message || 'AI lookup failed' });
  }
});

export default router;
