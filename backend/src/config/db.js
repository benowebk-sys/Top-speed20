import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

// Prefer DATABASE_URL for production (Postgres), otherwise fallback to sqlite file for local dev
const DB_URL = process.env.DATABASE_URL;
const SQLITE_PATH = process.env.SQLITE_PATH || 'database.sqlite';

const sequelize = DB_URL
  ? new Sequelize(DB_URL, { dialect: 'postgres', protocol: 'postgres', logging: false })
  : new Sequelize({ dialect: 'sqlite', storage: SQLITE_PATH, logging: false });

export default sequelize;

export const initDb = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log(' Database connected and synced');
    return true;
  } catch (err) {
    console.error(' DB init error:', err.message);
    throw err;
  }
};
