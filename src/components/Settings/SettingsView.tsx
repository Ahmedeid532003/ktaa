import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Save, Building, Receipt, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, language, currentUser, canAccess } = useApp();
  const [formData, setFormData] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setFormData({ ...settings });
  }, [settings]);

  if (!canAccess('settings')) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        {language === 'ar' ? 'لا تملك صلاحية تعديل الإعدادات' : 'You cannot edit settings'}
      </div>
    );
  }

  const handleSaveSettings = () => {
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-600" />
            <span>{language === 'ar' ? 'إعدادات النظام والشركة' : 'System & Company Settings'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'ar'
              ? 'الهوية التجارية، الضريبة، وتصميم الإيصال الحراري'
              : 'Store profile, VAT, and thermal receipt branding'}
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95"
        >
          {savedSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>
            {savedSuccess
              ? language === 'ar' ? 'تم الحفظ' : 'Saved'
              : language === 'ar' ? 'حفظ التغييرات' : 'Save Settings'}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Building className="w-4 h-4 text-indigo-600" />
            <span>{language === 'ar' ? 'بيانات المؤسسة والضريبة' : 'Company & Tax Profile'}</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold">{language === 'ar' ? 'اسم المنشأة' : 'Company Name'}</label>
              <input
                type="text"
                value={language === 'ar' ? formData.companyNameAr : formData.companyNameEn}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    companyNameAr: e.target.value,
                    companyNameEn: e.target.value,
                  })
                }
                className="w-full mt-1 p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold">{language === 'ar' ? 'السجل التجاري' : 'CR Number'}</label>
                <input
                  type="text"
                  value={formData.crNumber}
                  onChange={(e) => setFormData({ ...formData, crNumber: e.target.value })}
                  className="w-full mt-1 p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="font-bold">{language === 'ar' ? 'الرقم الضريبي' : 'VAT Number'}</label>
                <input
                  type="text"
                  value={formData.taxNumber}
                  onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                  className="w-full mt-1 p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold">{language === 'ar' ? 'نسبة الضريبة %' : 'Tax Rate %'}</label>
                <input
                  type="number"
                  value={formData.taxRate}
                  onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                  className="w-full mt-1 p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="font-bold">{language === 'ar' ? 'العملة' : 'Currency'}</label>
                <input
                  type="text"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full mt-1 p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enableTax}
                onChange={(e) => setFormData({ ...formData, enableTax: e.target.checked })}
                className="rounded"
              />
              {language === 'ar' ? 'تفعيل ضريبة القيمة المضافة على الفواتير' : 'Enable VAT on invoices'}
            </label>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Receipt className="w-4 h-4 text-indigo-600" />
            <span>{language === 'ar' ? 'ترويسة وتذييل الإيصال' : 'Receipt Header & Footer'}</span>
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold">{language === 'ar' ? 'عنوان الإيصال الحراري' : 'Thermal Header'}</label>
              <textarea
                rows={3}
                value={formData.printThermalHeader}
                onChange={(e) => setFormData({ ...formData, printThermalHeader: e.target.value })}
                className="w-full mt-1 p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="font-bold">{language === 'ar' ? 'تذييل وشروط الاسترجاع' : 'Footer & Return Policy'}</label>
              <textarea
                rows={4}
                value={formData.printThermalFooter}
                onChange={(e) => setFormData({ ...formData, printThermalFooter: e.target.value })}
                className="w-full mt-1 p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              {language === 'ar'
                ? `آخر تعديل بواسطة: ${currentUser.nameAr || currentUser.name}`
                : `Last edited context: ${currentUser.name}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
