import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const DB_PATH = process.env.SQLITE_PATH || 'database.sqlite';

// If DATABASE_URL is provided and not a mongodb URL, prefer it (e.g., sqlite://)
const connectionString = process.env.DATABASE_URL || `sqlite:${DB_PATH}`;

export const sequelize = new Sequelize(connectionString, {
  logging: false,
});

export const initDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('✅ SQLite (Sequelize) connected and synced');
    return true;
  } catch (error) {
    console.error('⚠️ Sequelize connection error:', error.message);
    return false;
  }
};

export default sequelize;
