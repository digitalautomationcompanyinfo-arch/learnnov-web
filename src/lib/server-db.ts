import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'server-db.json');

export interface ServerUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  status: string;
}

export interface OTPRecord {
  email: string;
  otp: string;
  expiresAt: number;
  userData: Omit<ServerUser, 'id' | 'status'>;
}

export interface ServerDB {
  users: ServerUser[];
  otps: OTPRecord[];
}

const INITIAL_DB: ServerDB = {
  users: [
    { id: '1', name: 'سارة الأحمد (المدير العام)', email: 'sara.admin@learnnov.com', role: 'admin', status: 'active' },
    { id: '2', name: 'د. خالد بن محمد (محاضر)', email: 'khaled.instructor@learnnov.com', role: 'instructor', status: 'active' },
    { id: '3', name: 'طالب ليرنوف المتميز', email: 'student.demo@learnnov.com', role: 'student', status: 'active' }
  ],
  otps: []
};

export function loadServerDB(): ServerDB {
  try {
    if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
      fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
      return INITIAL_DB;
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading server DB:', error);
    return INITIAL_DB;
  }
}

export function saveServerDB(db: ServerDB) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving server DB:', error);
  }
}
