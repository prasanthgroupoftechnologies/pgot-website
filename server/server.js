import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  saveEnquiry,
  updateEmailStatus,
  getAllEnquiries,
  getEnquiryCount,
  initDb,
  ensureDbReady,
} from './database.js';
import { sendEnquiryEmail } from './emailService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Enable trust proxy for accurate IP telemetry when hosted behind Render / Netlify reverse proxies
app.set('trust proxy', 1);

// CORS configuration (handles preflight OPTIONS, custom headers, and cross-origin fetch)
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200,
  })
);

// Express JSON body parser (limit to 1MB to prevent memory exhaustion attacks)
app.use(express.json({ limit: '1mb' }));

// In-memory rate limiting map (IP -> timestamps[])
const rateLimitMap = new Map();

function rateLimiter(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 5 * 60 * 1000; // 5 minutes
  const maxRequests = 25; // 25 enquiries per 5 minutes per IP

  let timestamps = rateLimitMap.get(ip) || [];
  timestamps = timestamps.filter((time) => now - time < windowMs);

  if (timestamps.length >= maxRequests) {
    return res.status(429).json({
      success: false,
      error: 'Too many enquiry requests from this address. Please wait a few minutes before trying again.',
    });
  }

  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  next();
}

/**
 * Mask customer email for secure telemetry logging without exposing PII.
 */
function maskEmail(email) {
  if (!email || !email.includes('@')) return '***@***.***';
  const [user, domain] = email.split('@');
  const maskedUser = user.length > 2 ? `${user[0]}***${user[user.length - 1]}` : `${user[0]}***`;
  return `${maskedUser}@${domain}`;
}

/**
 * Mask phone number for secure telemetry logging without exposing PII.
 */
function maskPhone(phone) {
  if (!phone) return '***';
  const clean = String(phone).replace(/\s+/g, '');
  if (clean.length < 6) return '***';
  return `${clean.slice(0, 3)}****${clean.slice(-4)}`;
}

// Root Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    service: 'PGOT Customer Intelligence Server',
    database: 'PostgreSQL',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      enquiry: 'POST /api/enquiry',
      enquiries: 'GET /api/enquiries',
    },
  });
});

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  const hasDbUrl = Boolean(process.env.DATABASE_URL);
  if (!hasDbUrl) {
    return res.status(200).json({
      status: 'ONLINE',
      service: 'PGOT Customer Intelligence Server',
      timestamp: new Date().toISOString(),
      database: {
        type: 'PostgreSQL',
        status: 'CONFIGURATION_REQUIRED',
        message: 'DATABASE_URL environment variable is not defined.',
      },
      emailProvider: process.env.RESEND_API_KEY
        ? 'Resend API'
        : process.env.SMTP_USER
        ? 'SMTP / Gmail'
        : 'Ethereal / Fallback Test Transport',
    });
  }

  try {
    const totalStored = await getEnquiryCount();
    return res.status(200).json({
      status: 'ONLINE',
      service: 'PGOT Customer Intelligence Server',
      timestamp: new Date().toISOString(),
      database: {
        type: 'PostgreSQL',
        status: 'CONNECTED',
        totalStoredEnquiries: totalStored,
      },
      emailProvider: process.env.RESEND_API_KEY
        ? 'Resend API'
        : process.env.SMTP_USER
        ? 'SMTP / Gmail'
        : 'Ethereal / Fallback Test Transport',
    });
  } catch (dbErr) {
    console.error('[API HEALTH] Database connectivity error:', dbErr.message);
    return res.status(500).json({
      status: 'DEGRADED',
      service: 'PGOT Customer Intelligence Server',
      timestamp: new Date().toISOString(),
      database: {
        type: 'PostgreSQL',
        status: 'ERROR',
        error: dbErr.message,
      },
      emailProvider: process.env.RESEND_API_KEY
        ? 'Resend API'
        : process.env.SMTP_USER
        ? 'SMTP / Gmail'
        : 'Ethereal / Fallback Test Transport',
    });
  }
});

// Enquiries List (For Testing & Verification)
app.get('/api/enquiries', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const enquiries = await getAllEnquiries(limit);
    return res.status(200).json({
      success: true,
      count: enquiries.length,
      enquiries,
    });
  } catch (error) {
    console.error('[API ENQUIRIES] Error retrieving enquiries:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Unable to retrieve enquiries: ' + error.message,
    });
  }
});

// Guard against accidental GET requests on /api/enquiry
app.get('/api/enquiry', (req, res) => {
  return res.status(405).json({
    success: false,
    error: 'Method Not Allowed. Enquiry submissions must use HTTP POST.',
  });
});

// Submit Customer Enquiry (supports both /api/enquiry and /api/enquiry/)
async function handleEnquirySubmission(req, res) {
  try {
    const body = req.body || {};
    const {
      fullName,
      companyName,
      email,
      phone,
      service,
      subject,
      message,
      bot_trap, // Honeypot field
    } = body;

    // 1. Spam Protection: Honeypot check
    if (bot_trap && typeof bot_trap === 'string' && bot_trap.trim() !== '') {
      console.warn('[SPAM BOT TRAP] Bot detected via honeypot field. Discarding silently.');
      return res.status(200).json({
        success: true,
        referenceCode: 'PGOT-ENQ-DISCARDED',
        message: 'Enquiry received successfully.',
      });
    }

    // 2. Strict Input Validations
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Full Name is compulsory and must be at least 2 characters.',
      });
    }

    if (!companyName || typeof companyName !== 'string' || companyName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Company Name is compulsory and must be at least 2 characters.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: 'A valid corporate or personal email address is compulsory.',
      });
    }

    // Clean phone validation (digits, minimum 8 digits, handles international prefix +)
    const phoneClean = (phone || '').toString().replace(/[^0-9+]/g, '');
    if (!phone || typeof phone !== 'string' || phoneClean.replace(/\D/g, '').length < 8) {
      return res.status(400).json({
        success: false,
        error: 'A valid telephone / mobile number is compulsory (minimum 8 digits).',
      });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Enquiry message is compulsory and must be at least 10 characters.',
      });
    }

    const clientIp =
      req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress ||
      req.ip ||
      'Unknown';

    console.log(
      `[API INBOUND] Processing enquiry for service "${service || 'General'}" from ${maskEmail(
        email
      )} (${maskPhone(phoneClean)}) [IP: ${clientIp}]`
    );

    // 3. Persist into PostgreSQL Database FIRST (Zero Data Loss Guarantee)
    const enquiryRecord = await saveEnquiry({
      fullName: fullName.trim(),
      companyName: companyName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      service: service || 'General Technical Consultation',
      subject: (subject || '').trim() || 'Customer Business Enquiry',
      message: message.trim(),
      ipAddress: clientIp,
    });

    console.log(
      `[DB SUCCESS] Enquiry persisted to PostgreSQL under Ref: ${enquiryRecord.referenceCode} (ID: ${enquiryRecord.id})`
    );

    // 4. Dispatch Email to Primary & Notification Addresses
    let emailResult = { success: false, provider: 'None' };
    try {
      emailResult = await sendEnquiryEmail({
        referenceCode: enquiryRecord.referenceCode,
        fullName: fullName.trim(),
        companyName: companyName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        service: service || 'General Technical Consultation',
        subject: (subject || '').trim() || 'Customer Business Enquiry',
        message: message.trim(),
        createdAt: enquiryRecord.createdAt,
      });

      if (emailResult.success) {
        await updateEmailStatus(enquiryRecord.id, 'SENT', null);
        console.log(
          `[EMAIL SUCCESS] Dispatch delivered via ${emailResult.provider} for Ref: ${enquiryRecord.referenceCode}`
        );
      } else {
        await updateEmailStatus(enquiryRecord.id, 'FAILED', emailResult.error || 'Failed to dispatch');
        console.warn(
          `[EMAIL NOTICE] Dispatch not delivered by provider for Ref: ${enquiryRecord.referenceCode}:`,
          emailResult.error
        );
      }
    } catch (emailErr) {
      await updateEmailStatus(enquiryRecord.id, 'FAILED', emailErr.message);
      console.error(
        `[EMAIL ERROR] Delivery exception for Ref: ${enquiryRecord.referenceCode}:`,
        emailErr.message
      );
    }

    // 5. Success Response to Client (Always valid JSON)
    return res.status(200).json({
      success: true,
      referenceCode: enquiryRecord.referenceCode,
      createdAt: enquiryRecord.createdAt,
      message: 'Your enquiry has been successfully registered and transmitted to Prasanth Group of Technologies.',
      emailDelivery: emailResult,
    });
  } catch (err) {
    console.error('[API ERROR] Server failure during enquiry processing:', err.message);
    return res.status(500).json({
      success: false,
      error:
        'An error occurred while registering your enquiry. Please reach us directly at prasanthgroupoftechnologies@gmail.com.',
    });
  }
}

app.post('/api/enquiry', rateLimiter, handleEnquirySubmission);
app.post('/api/enquiry/', rateLimiter, handleEnquirySubmission);

// Global JSON 404 Handler (ensures every non-existent route returns valid JSON)
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global JSON Error Handler (catches malformed JSON syntax errors, payload limits, uncaught exceptions)
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // Handle JSON parse errors from express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.warn('[SERVER BAD JSON] Client sent malformed JSON:', err.message);
    return res.status(400).json({
      success: false,
      error: 'Malformed JSON payload. Please ensure request body is valid JSON.',
    });
  }

  // Handle entity too large
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      error: 'Payload too large. Please shorten your enquiry message.',
    });
  }

  console.error('[UNHANDLED SERVER ERROR]', err.name, err.message);
  const statusCode = err.status || err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    error: statusCode === 500 ? 'An internal server error occurred.' : err.message,
  });
});

export { app };

export function startServer(port = PORT, host = HOST) {
  // Initialize schema if DATABASE_URL is configured
  if (process.env.DATABASE_URL) {
    ensureDbReady()
      .then(() => {
        console.log('[PGOT BACKEND] PostgreSQL connected and schema verified.');
      })
      .catch((startupErr) => {
        console.error('[PGOT BACKEND] PostgreSQL initialization error on startup:', startupErr.message);
      });
  } else {
    console.warn(
      '[PGOT BACKEND WARNING] DATABASE_URL is not set. Configure DATABASE_URL in Render or .env for PostgreSQL persistence.'
    );
  }

  return app.listen(port, host, () => {
    console.log(`[PGOT BACKEND] Server running on http://${host}:${port}`);
    console.log(
      `[PGOT BACKEND] Database engine: PostgreSQL (${
        process.env.DATABASE_URL ? 'Configured' : 'Awaiting DATABASE_URL'
      })`
    );
  });
}

// Start server automatically in production/development unless running under test runner
const isRunningAsTest =
  process.env.NODE_ENV === 'test' ||
  process.execArgv.includes('--test') ||
  process.argv.some((arg) => typeof arg === 'string' && (arg.includes('--test') || arg.includes('test-')));

if (!isRunningAsTest) {
  startServer();
}
