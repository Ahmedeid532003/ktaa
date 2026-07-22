import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import { Badge } from '../Common/Badge';
import {
  Users,
  Plus,
  Search,
  MessageCircle,
  Car,
  CreditCard,
  Phone,
  MapPin,
  X,
  FileText
} from 'lucide-react';

export const CustomersView: React.FC = () => {
  const { customers, addCustomer, settings, language } = useApp();

  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustDetails, setSelectedCustDetails] = useState<Customer | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    taxNumber: '',
    address: 'Riyadh, Saudi Arabia',
    type: 'retail' as 'retail' | 'wholesale' | 'workshop' | 'fleet',
    creditLimit: 5000,
    discountLevel: 'standard' as 'standard' | 'bronze' | 'silver' | 'gold' | 'vip',
    balance: 0,
    vehicles: []
  });

  const filteredCustomers = customers.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.type.includes(q);
  });

  const handleSaveCustomer = () => {
    if (!formData.name || !formData.phone) return;
    addCustomer({
      name: formData.name,
      phone: formData.phone,
      whatsapp: formData.phone.replace(/[^0-9]/g, ''),
      taxNumber: formData.taxNumber,
      address: formData.address,
      type: formData.type,
      creditLimit: Number(formData.creditLimit) || 0,
      discountLevel: formData.discountLevel,
      balance: Number(formData.balance) || 0,
      vehicles: []
    });
    setShowAddModal(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            <span>{language === 'ar' ? 'دليل العملاء والسيارات' : 'Customers & Registered Vehicles'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'ar'
              ? 'إدارة حسابات الورش، الأساطيل، الأرصدة الآجلة، ورقم الهيكل VIN'
              : 'Manage workshop credit limits, fleet accounts, outstanding balances, and vehicle VIN numbers'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ar' ? 'إضافة عميل جديد' : 'Add New Customer'}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={
              language === 'ar'
                ? 'بحث باسم العميل، رقم الجوال، الورشة، الأسطول...'
                : 'Search Customer Name, Phone, Workshop...'
            }
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs"
          />
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map(c => (
          <div
            key={c.id}
            onClick={() => setSelectedCustDetails(c)}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-indigo-500 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {language === 'ar' ? (c.nameAr || c.name) : c.name}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{c.phone}</span>
                </p>
              </div>

              <Badge variant={c.type === 'workshop' ? 'primary' : c.type === 'fleet' ? 'warning' : 'neutral'}>
                {language === 'ar'
                  ? (c.type === 'workshop' ? 'ورشة صيانة' : c.type === 'fleet' ? 'شركة أسطول' : c.type === 'wholesale' ? 'جملة' : 'قطاعي / فردي')
                  : c.type.toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs">
              <div>
                <span className="text-[10px] text-slate-400">{language === 'ar' ? 'الرصيد المتبقي' : 'Current Balance'}</span>
                <div className={`font-black ${c.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {c.balance.toFixed(2)} {settings.currency}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400">{language === 'ar' ? 'سقف الائتمان الآجل' : 'Credit Limit'}</span>
                <div className="font-bold text-slate-700 dark:text-slate-300">
                  {c.creditLimit.toFixed(2)} {settings.currency}
                </div>
              </div>
            </div>

            {/* Registered Vehicles Badge List */}
            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <Car className="w-4 h-4 text-indigo-500" />
                <span className="font-bold">
                  {language === 'ar' ? `السيارات المسجلة (${c.vehicles.length})` : `${c.vehicles.length} Vehicles Registered`}
                </span>
              </div>

              {c.whatsapp && (
                <a
                  href={`https://wa.me/${c.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 font-bold rounded-lg text-[10px] hover:bg-emerald-500/20"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CUSTOMER DETAILS MODAL */}
      {selectedCustDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-extrabold text-base">
                {language === 'ar' ? `ملف العميل: ${selectedCustDetails.nameAr || selectedCustDetails.name}` : `${selectedCustDetails.name} Profile`}
              </h3>
              <button onClick={() => setSelectedCustDetails(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                <div><span className="font-bold">{language === 'ar' ? 'رقم الجوال:' : 'Phone:'}</span> {selectedCustDetails.phone}</div>
                <div><span className="font-bold">{language === 'ar' ? 'العنوان:' : 'Address:'}</span> {language === 'ar' ? (selectedCustDetails.addressAr || selectedCustDetails.address) : selectedCustDetails.address}</div>
                <div><span className="font-bold">{language === 'ar' ? 'الرقم الضريبي:' : 'Tax Reg No:'}</span> {selectedCustDetails.taxNumber || (language === 'ar' ? 'غير مسجل' : 'N/A')}</div>
              </div>

              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 pt-2">
                {language === 'ar' ? 'السيارات المسجلة' : 'Registered Vehicles'}
              </h4>
              {selectedCustDetails.vehicles.length === 0 ? (
                <p className="text-slate-400 italic">
                  {language === 'ar' ? 'لا يوجد سيارات مسجلة لهذا العميل حالياً.' : 'No vehicle profiles registered yet.'}
                </p>
              ) : (
                <div className="space-y-1.5">
                  {selectedCustDetails.vehicles.map(v => (
                    <div key={v.id} className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl flex justify-between font-mono">
                      <div>
                        <div className="font-bold">
                          {language === 'ar' && v.make === 'Toyota' ? 'تويوتا' :
                           language === 'ar' && v.make === 'Lexus' ? 'لكزس' :
                           language === 'ar' && v.make === 'Hyundai' ? 'هيونداي' :
                           language === 'ar' && v.make === 'Kia' ? 'كيا' :
                           language === 'ar' && v.make === 'Nissan' ? 'نيسان' :
                           language === 'ar' && v.make === 'Honda' ? 'هوندا' :
                           language === 'ar' && v.make === 'Ford' ? 'فورد' :
                           v.make} {v.model} ({v.year})
                        </div>
                        <div className="text-[10px] text-slate-500">VIN: {v.vinNumber}</div>
                      </div>
                      <div className="font-bold text-indigo-600">{v.plateNumber}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADD CUSTOMER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {language === 'ar' ? 'إضافة بطاقة عميل جديد' : 'Add New Customer Account'}
              </h3>
              <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold">{language === 'ar' ? 'اسم العميل / الورشة *' : 'Customer / Workshop Name *'}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value, nameAr: e.target.value })}
                  placeholder={language === 'ar' ? 'مثال: ورشة الخليج لصيانة الفورد' : 'e.g. Al-Khobar Motors'}
                  className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="font-bold">{language === 'ar' ? 'رقم الهاتف / الجوال *' : 'Phone Number *'}</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+966 50 123 4567"
                  className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="font-bold">{language === 'ar' ? 'فئة العميل' : 'Customer Type'}</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border rounded-lg font-bold"
                >
                  <option value="retail">{language === 'ar' ? 'أفراد / قطاعي' : 'Retail Individual'}</option>
                  <option value="workshop">{language === 'ar' ? 'ورشة صيانة سيارات' : 'Auto Workshop / Garage'}</option>
                  <option value="fleet">{language === 'ar' ? 'شركة أسطول نقليات' : 'Fleet Transport Company'}</option>
                  <option value="wholesale">{language === 'ar' ? 'تاجر جملة' : 'Wholesale Trader'}</option>
                </select>
              </div>

              <div>
                <label className="font-bold">{language === 'ar' ? 'سقف الائتمان للآجل' : 'Credit Limit'} ({settings.currency})</label>
                <input
                  type="number"
                  value={formData.creditLimit}
                  onChange={e => setFormData({ ...formData, creditLimit: parseFloat(e.target.value) || 0 })}
                  className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border rounded-lg font-bold"
                />
              </div>
            </div>

            <button
              onClick={handleSaveCustomer}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all mt-4"
            >
              {language === 'ar' ? 'حفظ العميل' : 'SAVE CUSTOMER'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
