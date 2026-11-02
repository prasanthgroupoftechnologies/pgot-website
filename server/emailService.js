import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const PRIMARY_EMAIL = process.env.COMPANY_PRIMARY_EMAIL || 'prasanthgroupoftechnologies@gmail.com';
const NOTIFICATION_EMAIL = process.env.COMPANY_NOTIFICATION_EMAIL || 'prasanthhealthtech@gmail.com';

function createHtmlTemplate({
  referenceCode,
  fullName,
  companyName,
  email,
  phone,
  service,
  subject,
  message,
  createdAt,
}) {
  const formattedDate = new Date(createdAt).toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Customer Enquiry - PGOT</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #061426; color: #FFFFFF; margin: 0; padding: 24px; }
    .container { max-width: 640px; margin: 0 auto; background-color: #0A1B33; border: 1px solid #D4AF37; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #061426 0%, #0A1B33 100%); padding: 32px 24px; text-align: center; border-bottom: 2px solid #D4AF37; }
    .title { font-size: 22px; font-weight: 800; letter-spacing: 2px; color: #FFFFFF; margin: 0; }
    .tagline { font-size: 11px; letter-spacing: 3px; color: #D4AF37; margin-top: 6px; text-transform: uppercase; }
    .badge { display: inline-block; background-color: rgba(212, 175, 55, 0.15); border: 1px solid #D4AF37; color: #F0D98A; font-size: 12px; font-weight: 600; padding: 4px 14px; border-radius: 20px; margin-top: 14px; }
    .content { padding: 28px 24px; }
    .field-grid { width: 100%; border-collapse: collapse; margin-top: 16px; }
    .field-grid td { padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 13px; }
    .field-label { color: #D4AF37; font-weight: 600; text-transform: uppercase; font-size: 11px; width: 34%; }
    .field-value { color: #FFFFFF; font-weight: 500; }
    .field-value a { color: #60A5FA; text-decoration: none; }
    .message-box { background-color: #061426; border-left: 3px solid #D4AF37; padding: 18px; margin-top: 24px; border-radius: 8px; font-size: 14px; line-height: 1.6; color: #E2E8F0; white-space: pre-wrap; }
    .footer { background-color: #040D1A; padding: 20px; text-align: center; font-size: 11px; color: #94A3B8; border-top: 1px solid rgba(255,255,255,0.08); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="title">PRASANTH GROUP OF TECHNOLOGIES</h1>
      <div class="tagline">THINK BEYOND. BUILD BEYOND.</div>
      <div class="badge">CUSTOMER ENQUIRY // ${referenceCode}</div>
    </div>
    
    <div class="content">
      <h2 style="font-size: 16px; color: #F0D98A; margin-top: 0; text-transform: uppercase; letter-spacing: 1px;">
        New Inbound Business Telemetry
      </h2>
      <p style="font-size: 13px; color: #94A3B8; margin-bottom: 20px;">
        A new enterprise enquiry has been submitted through the official PGOT web portal.
      </p>

      <table class="field-grid">
        <tr>
          <td class="field-label">Reference ID</td>
          <td class="field-value"><strong style="color: #F0D98A;">${referenceCode}</strong></td>
        </tr>
        <tr>
          <td class="field-label">Customer Name</td>
          <td class="field-value"><strong>${fullName}</strong></td>
        </tr>
        <tr>
          <td class="field-label">Company Name</td>
          <td class="field-value">${companyName}</td>
        </tr>
        <tr>
          <td class="field-label">Email Address</td>
          <td class="field-value"><a href="mailto:${email}">${email}</a></td>
        </tr>
        <tr>
          <td class="field-label">Phone Number</td>
          <td class="field-value"><a href="tel:${phone}">${phone}</a></td>
        </tr>
        <tr>
          <td class="field-label">Service Focus</td>
          <td class="field-value">${service || 'General Technical Consultation'}</td>
        </tr>
        <tr>
          <td class="field-label">Subject</td>
          <td class="field-value">${subject || 'Customer Enquiry'}</td>
        </tr>
        <tr>
          <td class="field-label">Received At</td>
          <td class="field-value">${formattedDate} (IST)</td>
        </tr>
      </table>

      <div style="margin-top: 24px;">
        <span style="font-size: 11px; color: #D4AF37; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
          Enquiry Statement & Requirements:
        </span>
        <div class="message-box">${message}</div>
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 6px 0;">
        Recipients: <strong>${PRIMARY_EMAIL}</strong> &bull; <strong>${NOTIFICATION_EMAIL}</strong>
      </p>
      <p style="margin: 0; color: #64748B;">
        Sent automatically via PGOT Customer Intelligence System &bull; Reply directly to this email to contact the customer.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

export async function sendEnquiryEmail(enquiryData) {
  const { referenceCode, fullName, email, subject } = enquiryData;
  const emailSubject = `[PGOT ENQUIRY] ${subject || 'New Business Inquiry'} - ${fullName} (${referenceCode})`;
  const htmlContent = createHtmlTemplate(enquiryData);
  const textContent = `
PRASANTH GROUP OF TECHNOLOGIES
Customer Enquiry: ${referenceCode}

Full Name: ${enquiryData.fullName}
Company Name: ${enquiryData.companyName}
Email: ${enquiryData.email}
Phone: ${enquiryData.phone}
Service: ${enquiryData.service}
Subject: ${enquiryData.subject}
Date: ${enquiryData.createdAt}

Message:
${enquiryData.message}

Reply-To: ${enquiryData.email}
Recipients: ${PRIMARY_EMAIL}, ${NOTIFICATION_EMAIL}
  `;

  // 1. Try Resend if configured
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const fromAddress = process.env.EMAIL_FROM || 'PGOT Portal <onboarding@resend.dev>';
      
      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: [PRIMARY_EMAIL, NOTIFICATION_EMAIL],
        replyTo: email,
        subject: emailSubject,
        html: htmlContent,
        text: textContent,
      });

      if (error) {
        throw new Error(error.message || JSON.stringify(error));
      }

      return {
        provider: 'Resend',
        success: true,
        messageId: data?.id || 'resend-delivered',
        recipients: [PRIMARY_EMAIL, NOTIFICATION_EMAIL],
      };
    } catch (err) {
      console.error('Resend delivery failed, evaluating SMTP fallback:', err.message);
    }
  }

  // 2. Try SMTP (Gmail App Password or custom SMTP) if configured
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '465', 10),
        secure: process.env.SMTP_SECURE !== 'false',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'PGOT Customer Enquiry'}" <${process.env.SMTP_USER}>`,
        to: [PRIMARY_EMAIL, NOTIFICATION_EMAIL],
        replyTo: email,
        subject: emailSubject,
        text: textContent,
        html: htmlContent,
      });

      return {
        provider: 'SMTP',
        success: true,
        messageId: info.messageId,
        recipients: [PRIMARY_EMAIL, NOTIFICATION_EMAIL],
      };
    } catch (err) {
      console.error('SMTP delivery failed:', err.message);
      throw err;
    }
  }

  // 3. Fallback Test Transport (Ethereal test account for development/testing verification)
  try {
    const testAccount = await nodemailer.createTestAccount();
    const testTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await testTransporter.sendMail({
      from: `"PGOT System" <${testAccount.user}>`,
      to: [PRIMARY_EMAIL, NOTIFICATION_EMAIL],
      replyTo: email,
      subject: emailSubject,
      text: textContent,
      html: htmlContent,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);

    return {
      provider: 'Ethereal Test Transport (Configure RESEND_API_KEY or SMTP in .env for live inbox)',
      success: true,
      messageId: info.messageId,
      previewUrl,
      recipients: [PRIMARY_EMAIL, NOTIFICATION_EMAIL],
    };
  } catch (fallbackErr) {
    console.error('Fallback email transport error:', fallbackErr.message);
    return {
      provider: 'Local Storage Only',
      success: false,
      error: fallbackErr.message,
      recipients: [PRIMARY_EMAIL, NOTIFICATION_EMAIL],
    };
  }
}
