# مؤسسة AK ERP

نظام إدارة قطع غيار السيارات (POS + مخزون + مبيعات) مع PostgreSQL (Neon).

## التشغيل محلياً

1. `npm install`
2. انسخ `.env.example` إلى `.env` وضع `DATABASE_URL`
3. `npm run db:ping` للتأكد من الاتصال
4. `npm run dev` → http://localhost:3000

## حسابات تجريبية

- `admin` / `123456`
- `fahad` / `123456`
- `sultan` / `123456`

## النشر

- Frontend: Vite → Vercel
- API: `/api` serverless
- Database: Neon PostgreSQL (`DATABASE_URL`)
