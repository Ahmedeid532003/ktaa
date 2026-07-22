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
  initialNotifications,
} from '../src/data/mockData.ts';
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
  SystemNotification,
  CashDrawerShift,
} from '../src/types/index.ts';
import { query } from './db.ts';

export interface AppStore {
  settings: CompanySettings;
  users: UserProfile[];
  products: Product[];
  categories: string[];
  customers: Customer[];
  suppliers: Supplier[];
  invoices: Invoice[];
  purchaseOrders: PurchaseOrder[];
  stockMovements: StockMovement[];
  expenses: Expense[];
  notifications: SystemNotification[];
  currentShift: CashDrawerShift;
  heldInvoices: Invoice[];
}

const defaultCategories = [
  'Brake System',
  'Filters & Fluids',
  'Ignition System',
  'Suspension & Steering',
  'Electrical',
  'Engine Parts',
  'Body & Accessories',
];

export function createSeed(): AppStore {
  return {
    settings: initialCompanySettings,
    users: initialUsers,
    products: initialProducts,
    categories: defaultCategories,
    customers: initialCustomers,
    suppliers: initialSuppliers,
    invoices: initialInvoices,
    purchaseOrders: initialPurchaseOrders,
    stockMovements: initialStockMovements,
    expenses: initialExpenses,
    notifications: initialNotifications,
    currentShift: initialCashShift,
    heldInvoices: [],
  };
}

let initPromise: Promise<void> | null = null;
let cache: AppStore | null = null;

async function ensureSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS app_state (
      id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function loadFromDb(): Promise<AppStore> {
  const result = await query<{ data: AppStore }>('SELECT data FROM app_state WHERE id = 1');
  if (result.rows[0]?.data) {
    return result.rows[0].data;
  }
  const seed = createSeed();
  await query(
    `INSERT INTO app_state (id, data) VALUES (1, $1::jsonb)
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
    [JSON.stringify(seed)]
  );
  return seed;
}

export async function initStore(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }
  if (!initPromise) {
    initPromise = (async () => {
      await ensureSchema();
      cache = await loadFromDb();
      // Ensure AK branding on existing DB rows
      if (cache.settings) {
        const needsUpdate =
          cache.settings.companyNameAr?.includes('المجد') ||
          cache.settings.companyNameEn?.includes('Majd') ||
          cache.settings.companyNameAr === 'AK لقطع غيار السيارات';
        if (needsUpdate) {
          cache.settings = {
            ...cache.settings,
            companyNameAr: 'مؤسسة AK',
            companyNameEn: 'AK Establishment',
            email: cache.settings.email?.includes('almajd')
              ? 'sales@ak-autoparts.com'
              : cache.settings.email,
            printThermalHeader: 'WELCOME TO AK\nOfficial Toyota & OEM Distributor',
          };
          await persist(cache);
        }
      }
    })();
  }
  await initPromise;
}

async function persist(next: AppStore): Promise<AppStore> {
  cache = next;
  await query(
    `INSERT INTO app_state (id, data) VALUES (1, $1::jsonb)
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
    [JSON.stringify(next)]
  );
  return cache;
}

export async function readStore(): Promise<AppStore> {
  await initStore();
  // Refresh from DB on serverless to avoid stale cache across instances
  if (process.env.VERCEL) {
    cache = await loadFromDb();
  }
  return cache!;
}

export async function writeStore(next: AppStore): Promise<AppStore> {
  await initStore();
  return persist(next);
}

export async function patchStore(partial: Partial<AppStore>): Promise<AppStore> {
  const current = await readStore();
  return writeStore({ ...current, ...partial });
}

export async function resetStore(): Promise<AppStore> {
  return writeStore(createSeed());
}
