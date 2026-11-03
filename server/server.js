import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { saveEnquiry, updateEmailStatus, getAllEnquiries, getEnquiryCount, getDb, dbPath } from './database.js';
import { sendEnquiryEmail } from './emailService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory rate limiting map (IP -> timestamps[])
const rateLimitMap = new Map();

function rateLimiter(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 5 * 60 * 1000; // 5 minutes
  const maxRequests = 15; // 15 enquiries per 5 minutes per IP

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

// Root Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'PGOT Customer Intelligence Server',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      enquiry: 'POST /api/enquiry',
    },
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  try {
    const totalStored = getEnquiryCount();
    res.json({
      status: 'ONLINE',
      service: 'PGOT Customer Intelligence Server',
      timestamp: new Date().toISOString(),
      database: {
        status: 'CONNECTED',
        path: dbPath,
        totalStoredEnquiries: totalStored,
      },
      emailProvider: process.env.RESEND_API_KEY
        ? 'Resend API'
        : process.env.SMTP_USER
        ? 'SMTP / Gmail'
        : 'Ethereal / Fallback Test Transport',
    });
  } catch (dbErr) {
    res.status(500).json({
      status: 'DEGRADED',
      service: 'PGOT Customer Intelligence Server',
      timestamp: new Date().toISOString(),
      database: {
        status: 'ERROR',
        error: dbErr.message,
        path: dbPath,
      },
    });
  }
});

// Enquiries List (For Testing & Verification)
app.get('/api/enquiries', (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const enquiries = getAllEnquiries(limit);
    res.json({
      success: true,
      count: enquiries.length,
      enquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Unable to retrieve enquiries: ' + error.message,
    });
  }
});

// Submit Customer Enquiry
app.post('/api/enquiry', rateLimiter, async (req, res) => {
  try {
    const {
      fullName,
      companyName,
      email,
      phone,
      service,
      subject,
      message,
      bot_trap, // Honeypot field
    } = req.body;

    // 1. Spam Protection: Honeypot check
    if (bot_trap && bot_trap.trim() !== '') {
      console.warn('Spam bot detected via honeypot. Ignoring submission silently.');
      return res.json({
        success: true,
        referenceCode: 'PGOT-ENQ-DISCARDED',
        message: 'Enquiry received successfully.',
      });
    }

    // 2. Strict Input Validations
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Full Name is required and must be at least 2 characters.',
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
    const phoneClean = (phone || '').replace(/[^0-9+]/g, '');
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

    // 3. Persist into Database FIRST (Zero Data Loss Guarantee)
    const enquiryRecord = saveEnquiry({
      fullName: fullName.trim(),
      companyName: companyName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      service: service || 'General Technical Consultation',
      subject: (subject || '').trim() || 'Customer Business Enquiry',
      message: message.trim(),
      ipAddress: clientIp,
    });

    console.log(`[DB] Enquiry saved successfully with ID: ${enquiryRecord.id} (${enquiryRecord.referenceCode})`);

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
        updateEmailStatus(enquiryRecord.id, 'SENT', null);
        console.log(`[EMAIL] Dispatch succeeded via ${emailResult.provider}:`, emailResult.messageId);
      } else {
        updateEmailStatus(enquiryRecord.id, 'FAILED', emailResult.error || 'Failed to dispatch');
        console.warn(`[EMAIL] Dispatch was not delivered by provider:`, emailResult.error);
      }
    } catch (emailErr) {
      updateEmailStatus(enquiryRecord.id, 'FAILED', emailErr.message);
      console.error('[EMAIL] Delivery error:', emailErr.message);
    }

    // 5. Response to Client
    return res.status(200).json({
      success: true,
      referenceCode: enquiryRecord.referenceCode,
      createdAt: enquiryRecord.createdAt,
      message: 'Your enquiry has been successfully registered and transmitted to Prasanth Group of Technologies.',
      emailDelivery: emailResult,
    });

  } catch (err) {
    console.error('[API] Server error during enquiry processing:', err);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred while saving your enquiry. Please try again or reach us directly at prasanthgroupoftechnologies@gmail.com.',
    });
  }
});

// Eagerly initialize SQLite database and ensure directory exists on startup
try {
  getDb();
} catch (startupErr) {
  console.error('[DB STARTUP WARNING] Database initialization failed on startup:', startupErr.message);
}

// Start Server
app.listen(PORT, () => {
  console.log(`[PGOT BACKEND] Server running on http://localhost:${PORT}`);
  console.log(`[PGOT BACKEND] Database verified at: ${dbPath}`);
});
