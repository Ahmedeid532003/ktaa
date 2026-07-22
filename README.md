# AutoParts Pro ERP

نظام إدارة قطع غيار السيارات (POS + مخزون + مبيعات) مع باك اند Express.

## التشغيل محلياً

**المتطلبات:** Node.js 18+

1. تثبيت الحزم:
   ```bash
   npm install
   ```
2. انسخ الإعدادات وعدّل مفتاح Gemini إن أردت ميزة البحث بالذكاء الاصطناعي:
   ```bash
   copy .env.example .env
   ```
3. شغّل الفرونت والباك اند معاً (منفذ 3000):
   ```bash
   npm run dev
   ```

افتح: http://localhost:3000

## الـ API

| Method | Path | الوصف |
|--------|------|--------|
| GET | `/api/health` | فحص صحة السيرفر |
| GET | `/api/bootstrap` | تحميل كل بيانات النظام |
| PUT | `/api/state` | حفظ حالة النظام |
| POST | `/api/checkout` | إتمام بيع POS |
| POST | `/api/purchase-orders/:id/receive` | استلام أمر شراء |
| POST | `/api/ai/part-lookup` | بحث قطعة عبر Gemini (سيرفر) |

البيانات تُحفظ في `server/data/store.json`.

## أوامر أخرى

- `npm run build` — بناء الفرونت
- `npm start` — تشغيل إنتاجي (بعد البناء)
- `npm run lint` — فحص TypeScript
