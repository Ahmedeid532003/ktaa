import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Supplier } from '../../types';
import { Truck, Plus, Search, Phone, Mail, MapPin, X } from 'lucide-react';

export const SuppliersView: React.FC = () => {
  const { suppliers, addSupplier, settings, language } = useApp();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    companyNameAr: '',
    contactPerson: '',
    phone: '',
    email: '',
    taxNumber: '',
    address: 'Jeddah, KSA',
    country: 'Saudi Arabia',
    balance: 0
  });

  const filtered = suppliers.filter(s => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return s.companyName.toLowerCase().includes(q) || s.contactPerson.toLowerCase().includes(q);
  });

  const handleSave = () => {
    if (!formData.companyName.trim()) return;
    const name = formData.companyName.trim();
    addSupplier({
      companyName: name,
      companyNameAr: name,
      contactPerson: formData.contactPerson || 'Sales Dept',
      phone: formData.phone || '+966 50 000 0000',
      email: formData.email,
      taxNumber: formData.taxNumber,
      address: formData.address,
      country: formData.country,
      balance: Number(formData.balance) || 0
    });
    setShowAddModal(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Truck className="w-6 h-6 text-indigo-600" />
            <span>{language === 'ar' ? 'دليل الموردين والموزعين' : 'Suppliers & OEM Distributors'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'ar'
              ? 'متابعة الموردين المعتمدين، أرصدة التوريد الآجل، وفواتير الشراء'
              : 'Authorized component distributors, credit terms, and supplier account ledgers'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ar' ? 'إضافة مورد جديد' : 'Add New Supplier'}</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={
              language === 'ar'
                ? 'بحث باسم شركة المورد، مسؤول المبيعات، الدولة...'
                : 'Search Supplier Company, Contact Person, Country...'
            }
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => (
          <div key={s.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{s.companyNameAr || s.companyName}</h3>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">{language === 'ar' ? 'مسؤول التواصل:' : 'Contact:'}</span>
                <span className="font-bold">{s.contactPerson}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{language === 'ar' ? 'رقم الهاتف:' : 'Phone:'}</span>
                <span className="font-mono">{s.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{language === 'ar' ? 'الرقم الضريبي:' : 'Tax ID:'}</span>
                <span className="font-mono">{s.taxNumber || 'N/A'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t text-xs">
              <span className="text-slate-500 font-semibold">{language === 'ar' ? 'الرصيد المستحق للمورد:' : 'Payable Balance:'}</span>
              <span className={`font-black text-sm ${s.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {s.balance.toFixed(2)} {settings.currency}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {language === 'ar' ? 'إضافة بطاقة مورد جديد' : 'Add New Supplier Profile'}
              </h3>
              <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold">{language === 'ar' ? 'اسم الشركة / المورد *' : 'Company Name *'}</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={e => setFormData({ ...formData, companyName: e.target.value, companyNameAr: e.target.value })}
                  placeholder={language === 'ar' ? 'مثال: شركة عبد اللطيف جميل' : 'e.g. Abdul Latif Jameel'}
                  className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="font-bold">{language === 'ar' ? 'مسؤول المبيعات' : 'Contact Person'}</label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold">{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all mt-4"
            >
              {language === 'ar' ? 'حفظ المورد' : 'SAVE SUPPLIER'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
