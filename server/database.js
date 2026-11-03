import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Allow overriding database path via SQLITE_DB_PATH (e.g., Render Persistent Disk mount /var/data/enquiries.db)
// Defaults to '<project_root>/data/enquiries.db' for local development & default deployments
export const dbPath = process.env.SQLITE_DB_PATH
  ? path.resolve(process.env.SQLITE_DB_PATH)
  : path.resolve(__dirname, '../data/enquiries.db');

let db = null;

export function getDb() {
  if (!db) {
    try {
      const dbDir = path.dirname(dbPath);
      // Ensure the parent directory exists before initializing better-sqlite3
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
        console.log(`[DB] Created missing database directory: ${dbDir}`);
      }

      db = new Database(dbPath);
      db.pragma('journal_mode = WAL');
      console.log(`[DB] Successfully connected to SQLite database at: ${dbPath}`);
      initDb();
    } catch (err) {
      console.error(`[DB ERROR] Failed to initialize SQLite database at ${dbPath}:`, err.message);
      throw err;
    }
  }
  return db;
}

function initDb() {
  const schema = `
    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference_code TEXT UNIQUE,
      full_name TEXT NOT NULL,
      company_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      service TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL,
      email_status TEXT DEFAULT 'PENDING',
      email_error TEXT,
      ip_address TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_enquiries_email ON enquiries(email);
    CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at);
  `;
  db.exec(schema);
  console.log(`[DB] Schema verified and indexes initialized.`);
}

export function saveEnquiry({
  fullName,
  companyName,
  email,
  phone,
  service,
  subject,
  message,
  ipAddress,
}) {
  const database = getDb();
  const createdAt = new Date().toISOString();
  const timestampNum = Date.now().toString().slice(-6);
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const referenceCode = `PGOT-ENQ-${timestampNum}-${randomSuffix}`;

  const stmt = database.prepare(`
    INSERT INTO enquiries (
      reference_code,
      full_name,
      company_name,
      email,
      phone,
      service,
      subject,
      message,
      created_at,
      email_status,
      ip_address
    ) VALUES (
      @referenceCode,
      @fullName,
      @companyName,
      @email,
      @phone,
      @service,
      @subject,
      @message,
      @createdAt,
      'PENDING',
      @ipAddress
    )
  `);

  const result = stmt.run({
    referenceCode,
    fullName,
    companyName,
    email,
    phone,
    service: service || 'General Technical Consultation',
    subject: subject || 'New Customer Enquiry',
    message,
    createdAt,
    ipAddress: ipAddress || 'Unknown',
  });

  return {
    id: result.lastInsertRowid,
    referenceCode,
    createdAt,
  };
}

export function updateEmailStatus(id, status, errorMsg = null) {
  const database = getDb();
  const stmt = database.prepare(`
    UPDATE enquiries
    SET email_status = ?, email_error = ?
    WHERE id = ?
  `);
  stmt.run(status, errorMsg, id);
}

export function getAllEnquiries(limit = 100) {
  const database = getDb();
  const stmt = database.prepare(`
    SELECT * FROM enquiries
    ORDER BY id DESC
    LIMIT ?
  `);
  return stmt.all(limit);
}

export function getEnquiryCount() {
  const database = getDb();
  const row = database.prepare('SELECT COUNT(*) as count FROM enquiries').get();
  return row ? row.count : 0;
}
