import { Product, Customer, Supplier, Expense, StockMovement, CompatibleVehicle } from '../types';

export const categoryMapAr: Record<string, string> = {
  'Brake System': 'نظام الفرامل',
  'Ignition System': 'نظام الإشعال',
  'Filters & Fluids': 'الفلاتر والزيوت',
  'Suspension & Steering': 'التعليق والمساعدات',
  'Engine Parts': 'أجزاء المحرك',
  'Electrical Parts': 'الأجزاء الكهربائية',
  'Cooling System': 'نظام التبريد',
  'Transmission': 'ناقل الحركة / القير',
  'Body Parts': 'قطع هيكل وهيئة',
  'Exhaust System': 'العادم والشكمان',
  'Lighting': 'الإضاءة والأنوار',
};

export const subcategoryMapAr: Record<string, string> = {
  'Brake Pads': 'فحمات فرامل',
  'Brake Rotors': 'هوبات فرامل',
  'Spark Plugs': 'بواجي إشعال',
  'Oil Filters': 'فلاتر زيت',
  'Air Filters': 'فلاتر هواء',
  'Cabin Filters': 'فلاتر مكيف',
  'Engine Oils': 'زيوت محركات',
  'Shock Absorbers': 'مساعدات',
  'Ignition Coils': 'كويلات إشعال',
  'Water Pumps': 'طلمبات ماء',
  'Radiators': 'رديترات',
  'Batteries': 'بطاريات',
  'Belts & Hoses': 'سيور وخراطيم',
};

export const brandMapAr: Record<string, string> = {
  'Toyota Genuine Parts': 'قطع تويوتا الأصلية',
  'Denso': 'دينسو',
  'Mobis / Hyundai Genuine': 'موبيس / هيونداي الأصلية',
  'Bosch': 'بوش',
  'Mobil 1': 'موبيل 1',
  'KYB': 'كي واي بي',
  'Brembo': 'بريمبو',
  'NGK': 'ان جي كي',
  'ACDelco': 'أي سي ديلكو',
  'Motorcraft': 'موتور كرافت',
};

export const countryMapAr: Record<string, string> = {
  'Japan': 'اليابان',
  'South Korea': 'كوريا الجنوبية',
  'Germany': 'ألمانيا',
  'USA': 'أمريكا',
  'Italy': 'إيطاليا',
  'Saudi Arabia': 'المملكة العربية السعودية',
  'United Arab Emirates': 'الإمارات العربية المتحدة',
  'Germany / KSA': 'ألمانيا / السعودية',
  'China': 'الصين',
  'Taiwan': 'تايوان',
  'Thailand': 'تايلاند',
};

export const unitMapAr: Record<string, string> = {
  'Set': 'طقم',
  'Pcs': 'قطعة',
  'Container': 'عبوة',
  'Pair': 'زوج',
  'Box': 'كرتون',
  'Kit': 'مجموعة',
  'Liter': 'لتر',
  'Gallon': 'جالون',
};

export const warehouseMapAr: Record<string, string> = {
  'Main Warehouse': 'المستودع الرئيسي',
  'Main Warehouse - Riyadh': 'المستودع الرئيسي - الرياض',
  'Branch 2 Warehouse': 'مستودع الفرع 2',
  'Showroom Display': 'معرض العرض المباشر',
};

export const vehicleMakeMapAr: Record<string, string> = {
  'Toyota': 'تويوتا',
  'Lexus': 'لكزس',
  'Hyundai': 'هيونداي',
  'Kia': 'كيا',
  'Nissan': 'نيسان',
  'Honda': 'هوندا',
  'Ford': 'فورد',
  'Chevrolet': 'شفروليه',
  'GMC': 'جي ام سي',
  'Mazda': 'مازدا',
  'Mitsubishi': 'ميتسوبيشي',
  'Universal': 'عام / جميع السيارات',
};

export const expenseCategoryMapAr: Record<string, string> = {
  'Rent': 'إيجار المقر',
  'Salaries': 'رواتب وأجور',
  'Electricity': 'كهرباء ومرافق',
  'Internet': 'إنترنت واتصالات',
  'Transportation': 'مواصلات ونقل',
  'Maintenance': 'صيانة وتجهيزات',
  'Customs': 'جمارك وتخليص',
  'Misc': 'مصروفات متنوعة',
};

export function getProductName(product: Product, lang: string): string {
  if (lang === 'ar') {
    return product.nameAr || product.nameEn;
  }
  return product.nameEn;
}

export function getCustomerName(customer: Customer, lang: string): string {
  if (lang === 'ar') {
    return customer.nameAr || customer.name;
  }
  return customer.name;
}

export function getSupplierName(supplier: Supplier, lang: string): string {
  if (lang === 'ar') {
    return supplier.companyNameAr || supplier.companyName;
  }
  return supplier.companyName;
}

export function getCategoryName(category: string, lang: string): string {
  if (lang === 'ar') {
    return categoryMapAr[category] || category;
  }
  return category;
}

export function getSubcategoryName(subcategory: string | undefined, lang: string): string {
  if (!subcategory) return '';
  if (lang === 'ar') {
    return subcategoryMapAr[subcategory] || subcategory;
  }
  return subcategory;
}

export function getBrandName(brand: string, lang: string): string {
  if (lang === 'ar') {
    return brandMapAr[brand] || brand;
  }
  return brand;
}

export function getCountryName(country: string, lang: string): string {
  if (lang === 'ar') {
    return countryMapAr[country] || country;
  }
  return country;
}

export function getUnitName(unit: string, lang: string): string {
  if (lang === 'ar') {
    return unitMapAr[unit] || unit;
  }
  return unit;
}

export function getWarehouseName(location: string, lang: string): string {
  if (lang === 'ar') {
    return warehouseMapAr[location] || location.replace('Main Warehouse', 'المستودع الرئيسي').replace('Rack', 'الرف').replace('Shelf', 'الرف العادي');
  }
  return location;
}

export function getExpenseCategory(expense: Expense, lang: string): string {
  if (lang === 'ar') {
    return expense.categoryAr || expenseCategoryMapAr[expense.category] || expense.category;
  }
  return expense.category;
}

export function getExpenseDescription(expense: Expense, lang: string): string {
  if (lang === 'ar') {
    return expense.descriptionAr || expense.description;
  }
  return expense.description;
}

export function getStockMovementReason(movement: StockMovement, lang: string): string {
  if (lang === 'ar') {
    return movement.reasonAr || movement.reason || 'N/A';
  }
  return movement.reason || 'N/A';
}

export function formatVehicleDetails(v: CompatibleVehicle, lang: string): string {
  const make = lang === 'ar' ? (vehicleMakeMapAr[v.make] || v.make) : v.make;
  let transmission = v.transmission || '';
  let fuelType = v.fuelType || '';

  if (lang === 'ar') {
    transmission = transmission.replace('Automatic', 'أوتوماتيك').replace('Manual', 'يدوي').replace('Auto', 'أوتوماتيك');
    fuelType = fuelType.replace('Gasoline', 'بنزين').replace('Hybrid', 'هايبرد').replace('Diesel', 'ديزل');
  }

  return `${make} ${v.model} (${v.years}) ${v.engine || ''} ${transmission} ${fuelType}`.trim();
}
