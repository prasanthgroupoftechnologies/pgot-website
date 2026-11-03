import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

let pool = null;
let dbInitPromise = null;

/**
 * Determine SSL configuration based on the PostgreSQL connection string.
 * Local connections (localhost/127.0.0.1) or explicit DATABASE_SSL=false use no SSL.
 * Remote managed databases (Render, Neon, Supabase, AWS RDS, etc.) require SSL with rejectUnauthorized: false.
 */
function getSslConfig(connectionString) {
  if (!connectionString) return false;
  if (process.env.DATABASE_SSL === 'false') return false;
  if (
    connectionString.includes('localhost') ||
    connectionString.includes('127.0.0.1')
  ) {
    return false;
  }
  return { rejectUnauthorized: false };
}

/**
 * Get or initialize the PostgreSQL connection pool.
 */
export function getPool() {
  if (!pool) {
    const connectionString = (process.env.DATABASE_URL || '').trim();
    if (!connectionString) {
      console.warn('[DB WARNING] DATABASE_URL is not defined. PostgreSQL queries will not execute until DATABASE_URL is configured.');
      return null;
    }

    try {
      const sslConfig = getSslConfig(connectionString);
      pool = new Pool({
        connectionString,
        ssl: sslConfig,
        max: parseInt(process.env.DB_POOL_MAX || '10', 10),
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      });

      pool.on('error', (err) => {
        console.error('[DB POOL ERROR] [OP: POOL_IDLE] Unexpected idle PostgreSQL client error:', err.message);
      });

      console.log(`[DB] PostgreSQL connection pool initialized (SSL: ${sslConfig ? 'enabled' : 'disabled'}).`);
    } catch (err) {
      console.error('[DB ERROR] [OP: POOL_INIT] Failed to create PostgreSQL pool:', err.message);
      throw err;
    }
  }
  return pool;
}

/**
 * Allow injection of a mock or custom pool (useful for testing).
 */
export function setPool(customPool) {
  pool = customPool;
  dbInitPromise = null;
}

/**
 * Generate standard PGOT customer enquiry reference code (e.g. PGOT-ENQ-123456-789).
 */
export function generateReferenceCode() {
  const timestampNum = Date.now().toString().slice(-6);
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `PGOT-ENQ-${timestampNum}-${randomSuffix}`;
}

/**
 * Initialize the PostgreSQL schema and create table and indexes if they do not exist.
 * Uses idempotent CREATE TABLE and ALTER TABLE statements to handle both fresh databases and pre-existing tables.
 */
export async function initDb() {
  const p = getPool();
  if (!p) {
    throw new Error('DATABASE_URL is not configured. Cannot initialize PostgreSQL schema.');
  }

  const client = await p.connect();
  try {
    const schema = `
      CREATE TABLE IF NOT EXISTS enquiries (
        id SERIAL PRIMARY KEY,
        reference_code VARCHAR(100) UNIQUE,
        full_name VARCHAR(255) NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        service VARCHAR(255),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL,
        email_status VARCHAR(50) DEFAULT 'PENDING',
        email_error TEXT,
        ip_address TEXT
      );

      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS reference_code VARCHAR(100);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS email VARCHAR(255);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS service VARCHAR(255);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS subject VARCHAR(255);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS message TEXT;
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS email_status VARCHAR(50) DEFAULT 'PENDING';
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS email_error TEXT;
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS ip_address TEXT;

      CREATE UNIQUE INDEX IF NOT EXISTS idx_enquiries_reference_code ON enquiries(reference_code);
      CREATE INDEX IF NOT EXISTS idx_enquiries_email ON enquiries(email);
      CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at);
    `;

    await client.query(schema);
    console.log('[DB] PostgreSQL schema verified and indexes initialized successfully.');
  } catch (err) {
    console.error(`[DB ERROR] [OP: DB_INIT] [CODE: ${err.code || 'ERR_SCHEMA_INIT'}] Failed to initialize PostgreSQL schema:`, err.message);
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Ensure database schema initialization has completed or is in flight.
 */
export async function ensureDbReady() {
  if (!dbInitPromise) {
    dbInitPromise = initDb().catch((err) => {
      dbInitPromise = null; // allow retry on next attempt
      throw err;
    });
  }
  return dbInitPromise;
}

/**
 * Save an inbound customer enquiry to PostgreSQL using an atomic transaction & parameterized query.
 */
export async function saveEnquiry({
  fullName,
  companyName,
  email,
  phone,
  service,
  subject,
  message,
  ipAddress,
}) {
  const p = getPool();
  if (!p) {
    throw new Error('DATABASE_URL is not configured. Cannot persist enquiry to PostgreSQL.');
  }

  // Ensure table and indexes exist before inserting
  try {
    await ensureDbReady();
  } catch (initErr) {
    console.warn('[DB WARNING] [OP: ENSURE_SCHEMA] Proceeding with insert attempt:', initErr.message);
  }

  // Sanitize and bound field values to strictly adhere to PostgreSQL schema
  const sanitizedFullName = String(fullName || '').trim().slice(0, 255);
  const sanitizedCompanyName = String(companyName || '').trim().slice(0, 255);
  const sanitizedEmail = String(email || '').trim().toLowerCase().slice(0, 255);
  const sanitizedPhone = String(phone || '').trim().slice(0, 50);
  const sanitizedService = String(service || 'General Technical Consultation').slice(0, 255);
  const sanitizedSubject = String(subject || 'Customer Business Enquiry').slice(0, 255);
  const sanitizedMessage = String(message || '').trim();
  const sanitizedIp = String(ipAddress || 'Unknown').slice(0, 255);
  const createdAt = new Date().toISOString();
  const referenceCode = generateReferenceCode();

  const insertQuery = `
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
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'PENDING', $10)
    RETURNING id, reference_code, created_at;
  `;

  const values = [
    referenceCode,
    sanitizedFullName,
    sanitizedCompanyName,
    sanitizedEmail,
    sanitizedPhone,
    sanitizedService,
    sanitizedSubject,
    sanitizedMessage,
    createdAt,
    sanitizedIp,
  ];

  const client = await p.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(insertQuery, values);
    await client.query('COMMIT');

    const row = result.rows && result.rows[0];
    if (!row) {
      throw new Error('Database INSERT succeeded but returned no row.');
    }

    return {
      id: row.id,
      referenceCode: row.reference_code,
      createdAt: row.created_at,
    };
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackErr) {
      console.warn('[DB WARNING] [OP: DB_ROLLBACK] Rollback error:', rollbackErr.message);
    }
    console.error(`[DB ERROR] [OP: DB_INSERT] [CODE: ${err.code || 'ERR_DB_INSERT'}] ${err.message}`);
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Update the dispatch status and optional error message for an enquiry record.
 */
export async function updateEmailStatus(id, status, errorMsg = null) {
  const p = getPool();
  if (!p) {
    console.warn('[DB WARNING] Cannot update email status: DATABASE_URL not configured.');
    return;
  }

  const query = `
    UPDATE enquiries
    SET email_status = $1, email_error = $2
    WHERE id = $3;
  `;

  try {
    await p.query(query, [status, errorMsg ? String(errorMsg).slice(0, 1000) : null, id]);
  } catch (err) {
    console.error(`[DB ERROR] [OP: UPDATE_EMAIL_STATUS] [CODE: ${err.code || 'ERR_STATUS_UPDATE'}] Failed to update status for ID ${id}:`, err.message);
  }
}

/**
 * Fetch latest customer enquiries for verification & reporting.
 */
export async function getAllEnquiries(limit = 100) {
  const p = getPool();
  if (!p) {
    throw new Error('DATABASE_URL is not configured.');
  }

  const query = `
    SELECT * FROM enquiries
    ORDER BY id DESC
    LIMIT $1;
  `;

  try {
    const result = await p.query(query, [limit]);
    return result.rows;
  } catch (err) {
    console.error(`[DB ERROR] [OP: GET_ALL_ENQUIRIES] [CODE: ${err.code || 'ERR_FETCH_ENQUIRIES'}]`, err.message);
    throw err;
  }
}

/**
 * Retrieve total count of enquiries currently stored in PostgreSQL.
 */
export async function getEnquiryCount() {
  const p = getPool();
  if (!p) {
    throw new Error('DATABASE_URL is not configured.');
  }

  const query = 'SELECT COUNT(*) as count FROM enquiries;';
  try {
    const result = await p.query(query);
    return parseInt(result.rows[0]?.count || 0, 10);
  } catch (err) {
    console.error(`[DB ERROR] [OP: GET_ENQUIRY_COUNT] [CODE: ${err.code || 'ERR_COUNT'}]`, err.message);
    throw err;
  }
}

/**
 * Gracefully close the PostgreSQL connection pool.
 */
export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
    dbInitPromise = null;
    console.log('[DB] PostgreSQL pool closed.');
  }
}
