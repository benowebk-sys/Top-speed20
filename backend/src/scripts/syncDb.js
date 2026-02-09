import { initDb } from '../config/db.js';

(async () => {
  try {
    await initDb();
    console.log('✅ DB sync complete');
    process.exit(0);
  } catch (err) {
    console.error('❌ DB sync failed', err);
    process.exit(1);
  }
})();
