import fs from 'fs/promises';
import path from 'path';
import bcryptjs from 'bcryptjs';

const DATA_DIR = path.resolve('data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const ensureDataFile = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(USERS_FILE);
  } catch (err) {
    await fs.writeFile(USERS_FILE, JSON.stringify([]), 'utf8');
  }
};

const readUsers = async () => {
  await ensureDataFile();
  const raw = await fs.readFile(USERS_FILE, 'utf8');
  return JSON.parse(raw || '[]');
};

const writeUsers = async (users) => {
  await ensureDataFile();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
};

export const findByEmail = async (email) => {
  const users = await readUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
};

export const findByVerificationToken = async (token) => {
  const users = await readUsers();
  return users.find(u => u.verificationToken === token && (!u.verificationTokenExpires || new Date(u.verificationTokenExpires) > new Date())) || null;
};

export const createUser = async ({ name, email, password, role = 'user', verificationToken = null, verificationTokenExpires = null, isEmailVerified = false }) => {
  const users = await readUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('User exists');
  }
  const salt = await bcryptjs.genSalt(10);
  const hashed = await bcryptjs.hash(password, salt);
  const id = Date.now();
  const user = {
    id,
    name,
    email,
    password: hashed,
    role,
    isActive: true,
    isEmailVerified,
    verificationToken,
    verificationTokenExpires: verificationTokenExpires ? new Date(verificationTokenExpires).toISOString() : null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  users.push(user);
  await writeUsers(users);
  return user;
};

export const updateUser = async (user) => {
  const users = await readUsers();
  const idx = users.findIndex(u => u.id === user.id);
  if (idx === -1) throw new Error('User not found');
  user.updatedAt = new Date().toISOString();
  users[idx] = user;
  await writeUsers(users);
  return user;
};

export const comparePassword = async (plain, hashed) => {
  return bcryptjs.compare(plain, hashed);
};

export default {
  findByEmail,
  findByVerificationToken,
  createUser,
  updateUser,
  comparePassword,
};
