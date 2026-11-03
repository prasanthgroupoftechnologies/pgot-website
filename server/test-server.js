import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { app } from './server.js';
import { setPool } from './database.js';

describe('PGOT Express Server & PostgreSQL API Endpoints', () => {
  let server;
  let baseUrl;
  const mockEnquiryDb = [];

  before(async () => {
    // Provide mock PostgreSQL pool for API testing
    const mockPool = {
      connect: async () => ({
        query: async () => ({ rows: [] }),
        release: () => {},
      }),
      query: async (query, values) => {
        if (query.includes('COUNT(*)')) {
          return { rows: [{ count: mockEnquiryDb.length.toString() }] };
        }
        if (query.includes('INSERT INTO enquiries')) {
          const id = mockEnquiryDb.length + 1;
          const row = {
            id,
            reference_code: values[0],
            full_name: values[1],
            company_name: values[2],
            email: values[3],
            phone: values[4],
            service: values[5],
            subject: values[6],
            message: values[7],
            created_at: values[8],
            email_status: 'PENDING',
            ip_address: values[9],
          };
          mockEnquiryDb.push(row);
          return { rows: [{ id: row.id, reference_code: row.reference_code, created_at: row.created_at }] };
        }
        if (query.includes('UPDATE enquiries')) {
          const id = values[2];
          const found = mockEnquiryDb.find((r) => r.id === id);
          if (found) {
            found.email_status = values[0];
            found.email_error = values[1];
          }
          return { rowCount: 1 };
        }
        if (query.includes('SELECT * FROM enquiries')) {
          return { rows: [...mockEnquiryDb].reverse().slice(0, values[0]) };
        }
        return { rows: [] };
      },
    };

    setPool(mockPool);

    // Start server on ephemeral port (port 0)
    await new Promise((resolve) => {
      server = app.listen(0, '127.0.0.1', () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('GET / should return online status and PostgreSQL database identifier', async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.status, 'ONLINE');
    assert.strictEqual(body.database, 'PostgreSQL');
    assert.strictEqual(body.service, 'PGOT Customer Intelligence Server');
  });

  it('GET /api/health should report health status with PostgreSQL and stored count', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.status, 'ONLINE');
    assert.strictEqual(body.database.type, 'PostgreSQL');
  });

  it('POST /api/enquiry should reject submissions missing required fields', async () => {
    // Missing Full Name
    const res1 = await fetch(`${baseUrl}/api/enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: 'Test Corp',
        email: 'test@example.com',
        phone: '9876543210',
        message: 'Valid test message 12345',
      }),
    });
    assert.strictEqual(res1.status, 400);
    const body1 = await res1.json();
    assert.ok(body1.error.includes('Full Name'));

    // Missing Company Name
    const res2 = await fetch(`${baseUrl}/api/enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'John Doe',
        companyName: '',
        email: 'test@example.com',
        phone: '9876543210',
        message: 'Valid test message 12345',
      }),
    });
    assert.strictEqual(res2.status, 400);
    const body2 = await res2.json();
    assert.ok(body2.error.includes('Company Name'));

    // Invalid Email
    const res3 = await fetch(`${baseUrl}/api/enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'John Doe',
        companyName: 'Acme Inc',
        email: 'invalid-email',
        phone: '9876543210',
        message: 'Valid test message 12345',
      }),
    });
    assert.strictEqual(res3.status, 400);

    // Invalid Phone (< 8 digits)
    const res4 = await fetch(`${baseUrl}/api/enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'John Doe',
        companyName: 'Acme Inc',
        email: 'john@acme.com',
        phone: '1234',
        message: 'Valid test message 12345',
      }),
    });
    assert.strictEqual(res4.status, 400);

    // Short Message (< 10 chars)
    const res5 = await fetch(`${baseUrl}/api/enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'John Doe',
        companyName: 'Acme Inc',
        email: 'john@acme.com',
        phone: '9876543210',
        message: 'Hi',
      }),
    });
    assert.strictEqual(res5.status, 400);
  });

  it('POST /api/enquiry honeypot bot trap should silently discard bots', async () => {
    const res = await fetch(`${baseUrl}/api/enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Bot User',
        companyName: 'Spam Corp',
        email: 'bot@spam.com',
        phone: '1234567890',
        message: 'Automated spam message',
        bot_trap: 'I am a bot',
      }),
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.referenceCode, 'PGOT-ENQ-DISCARDED');
  });

  it('POST /api/enquiry should save valid enquiry to PostgreSQL and dispatch email', async () => {
    const res = await fetch(`${baseUrl}/api/enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Prasanth Founder',
        companyName: 'Prasanth Group',
        email: 'prasanth@pgot.in',
        phone: '+916369727736',
        service: 'Next-Gen Enterprise Architecture',
        subject: 'Technology Partnership',
        message: 'We are expanding our high-security AI cloud deployments.',
      }),
    });

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.match(body.referenceCode, /^PGOT-ENQ-\d{6}-\d{3}$/);
    assert.ok(body.createdAt);
    assert.ok(body.emailDelivery);

    // Verify it was stored in mock database
    assert.strictEqual(mockEnquiryDb.length, 1);
    assert.strictEqual(mockEnquiryDb[0].full_name, 'Prasanth Founder');
    assert.strictEqual(mockEnquiryDb[0].company_name, 'Prasanth Group');
    assert.strictEqual(mockEnquiryDb[0].email, 'prasanth@pgot.in');
    assert.strictEqual(mockEnquiryDb[0].phone, '+916369727736');
  });

  it('GET /api/enquiries should return stored enquiries list', async () => {
    const res = await fetch(`${baseUrl}/api/enquiries?limit=10`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.count, 1);
    assert.strictEqual(body.enquiries[0].full_name, 'Prasanth Founder');
  });
});
