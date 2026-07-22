import React from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../Common/Badge';
import { Bell, AlertTriangle, PackageX, CheckCircle, Info } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notifications, language } = useApp();

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-6 h-6 text-indigo-600" />
          <span>{language === 'ar' ? 'مركز التنبيهات والإشعارات' : 'Alert Center & System Notifications'}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {language === 'ar'
            ? 'متابعة تنبيهات النفاد، عمليات البيع الآجل، وإغلاق اليومية'
            : 'Track critical low stock events, high-value credit invoices, and daily closing reminders'}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
              n.severity === 'danger'
                ? 'bg-rose-500/5 border-rose-500/20'
                : n.severity === 'warning'
                ? 'bg-amber-500/5 border-amber-500/20'
                : 'bg-indigo-500/5 border-indigo-500/20'
            }`}
          >
            {n.severity === 'danger' && <PackageX className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />}
            {n.severity === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />}
            {n.severity === 'info' && <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />}

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                  {language === 'ar' ? n.titleAr || n.title : n.title}
                </h4>
                <span className="text-[10px] text-slate-400 font-semibold">{n.time}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                {language === 'ar' ? n.messageAr || n.message : n.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
