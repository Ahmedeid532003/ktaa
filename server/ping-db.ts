import 'dotenv/config';
import { initStore, readStore } from './store.ts';

async function main() {
  await initStore();
  const s = await readStore();
  console.log('OK', s.settings.companyNameAr, 'users=' + s.users.length);
  process.exit(0);
}

main().catch((err) => {
  console.error('FAIL', err);
  process.exit(1);
});
