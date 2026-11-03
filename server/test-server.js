import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { app } from './server.js';
import { setPool } from './database.js';

describe('PGOT Express Server & PostgreSQL API Endpoints', () => {
  let server;
  let baseUrl;
  const mockEnquiryDb = [];
  let shouldFailDb = false;

  before(async () => {
    // Provide mock PostgreSQL pool for API testing
    const mockClient = {
      query: async (query, values) => {
        if (query === 'BEGIN' || query === 'COMMIT' || query === 'ROLLBACK') {
          return { rows: [] };
        }
        if (query.includes('CREATE TABLE') || query.includes('ALTER TABLE')) {
          return { rows: [] };
        }
        if (query.includes('INSERT INTO enquiries')) {
          if (shouldFailDb) {
            const err = new Error('Simulated PostgreSQL connection failure');
            err.code = '08006';
            throw err;
          }
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
          return {
            rows: [
              {
                id: row.id,
                reference_code: row.reference_code,
                created_at: row.created_at,
              },
            ],
          };
        }
        return { rows: [] };
      },
      release: () => {},
    };

    const mockPool = {
      connect: async () => mockClient,
      query: async (query, values) => {
        if (query.includes('COUNT(*)')) {
          return { rows: [{ count: mockEnquiryDb.length.toString() }] };
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

    // Start server on ephemeral port (port 0) for isolated test run
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

  it('GET / should return online status and PostgreSQL database identifier as JSON', async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.strictEqual(res.status, 200);
    assert.ok(res.headers.get('content-type')?.includes('application/json'));
    const body = await res.json();
    assert.strictEqual(body.status, 'ONLINE');
    assert.strictEqual(body.database, 'PostgreSQL');
    assert.strictEqual(body.service, 'PGOT Customer Intelligence Server');
  });

  it('GET /api/health should report health status with PostgreSQL as JSON', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.status, 200);
    assert.ok(res.headers.get('content-type')?.includes('application/json'));
    const body = await res.json();
    assert.strictEqual(body.status, 'ONLINE');
    assert.strictEqual(body.database.type, 'PostgreSQL');
  });

  it('OPTIONS /api/enquiry preflight should return 200 with CORS headers', async () => {
    const res = await fetch(`${baseUrl}/api/enquiry`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://pgot-corporate.netlify.app',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Accept',
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get('access-control-allow-origin'), '*');
    assert.ok(res.headers.get('access-control-allow-methods')?.includes('POST'));
  });

  it('POST /api/enquiry with malformed JSON body should return 400 JSON (not HTML)', async () => {
    const res = await fetch(`${baseUrl}/api/enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"badJson: ',
    });
    assert.strictEqual(res.status, 400);
    assert.ok(res.headers.get('content-type')?.includes('application/json'));
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.errorCode, 'ERR_MALFORMED_JSON');
    assert.ok(body.error.includes('Malformed JSON'));
  });

  it('GET /api/enquiry should return 405 Method Not Allowed as JSON', async () => {
    const res = await fetch(`${baseUrl}/api/enquiry`);
    assert.strictEqual(res.status, 405);
    assert.ok(res.headers.get('content-type')?.includes('application/json'));
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.errorCode, 'ERR_METHOD_NOT_ALLOWED');
  });

  it('GET /api/nonexistent-route should return 404 as JSON (not HTML)', async () => {
    const res = await fetch(`${baseUrl}/api/nonexistent-route`);
    assert.strictEqual(res.status, 404);
    assert.ok(res.headers.get('content-type')?.includes('application/json'));
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.errorCode, 'ERR_NOT_FOUND');
  });

  it('POST /api/enquiry should reject submissions missing required fields with 400 JSON', async () => {
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
    assert.strictEqual(body1.errorCode, 'ERR_VALIDATION_NAME');

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
    assert.strictEqual(body2.errorCode, 'ERR_VALIDATION_COMPANY');

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
    const body3 = await res3.json();
    assert.strictEqual(body3.errorCode, 'ERR_VALIDATION_EMAIL');

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
    const body4 = await res4.json();
    assert.strictEqual(body4.errorCode, 'ERR_VALIDATION_PHONE');

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
    const body5 = await res5.json();
    assert.strictEqual(body5.errorCode, 'ERR_VALIDATION_MESSAGE');
  });

  it('POST /api/enquiry honeypot bot trap should silently discard bots with 200 JSON', async () => {
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

  it('POST /api/enquiry should save valid enquiry to PostgreSQL and return 200 JSON even if email provider is offline', async () => {
    const res = await fetch(`${baseUrl}/api/enquiry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': '203.0.113.195, 70.41.3.18, 150.172.238.178, 108.162.245.105',
      },
      body: JSON.stringify({
        fullName: 'Prasanth Founder',
        companyName: 'Prasanth Group of Technologies',
        email: 'prasanth@pgot.in',
        phone: '+916369727736',
        service: 'Next-Gen Enterprise Architecture',
        subject: 'Technology Partnership',
        message: 'We are expanding our high-security AI cloud deployments globally.',
      }),
    });

    assert.strictEqual(res.status, 200);
    assert.ok(res.headers.get('content-type')?.includes('application/json'));
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.match(body.referenceCode, /^PGOT-ENQ-\d{6}-\d{3}$/);
    assert.ok(body.createdAt);
    assert.ok(body.emailDelivery);

    // Verify it was stored in mock database
    assert.strictEqual(mockEnquiryDb.length, 1);
    assert.strictEqual(mockEnquiryDb[0].full_name, 'Prasanth Founder');
    assert.strictEqual(mockEnquiryDb[0].company_name, 'Prasanth Group of Technologies');
    assert.strictEqual(mockEnquiryDb[0].email, 'prasanth@pgot.in');
    assert.strictEqual(mockEnquiryDb[0].phone, '+916369727736');
    assert.strictEqual(mockEnquiryDb[0].ip_address, '203.0.113.195');
  });

  it('POST /api/enquiry should return 500 JSON with errorCode if PostgreSQL insert fails', async () => {
    shouldFailDb = true;

    const res = await fetch(`${baseUrl}/api/enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Jane Doe',
        companyName: 'Acme Corp',
        email: 'jane@acme.com',
        phone: '+15551234567',
        service: 'Cloud Computing',
        subject: 'Cloud Scale',
        message: 'Testing database failure handling when PostgreSQL is unreachable.',
      }),
    });

    assert.strictEqual(res.status, 500);
    assert.ok(res.headers.get('content-type')?.includes('application/json'));
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.errorCode, '08006');
    assert.ok(body.error.includes('database could not register'));

    shouldFailDb = false;
  });

  it('POST /api/enquiry/ with trailing slash should succeed seamlessly', async () => {
    const res = await fetch(`${baseUrl}/api/enquiry/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Enterprise Client',
        companyName: 'Alpha Ventures',
        email: 'client@alphaventures.com',
        phone: '+919988776655',
        service: 'Custom Software Development',
        subject: 'Scale Architecture',
        message: 'Evaluating custom cloud solutions for modern enterprise scalability.',
      }),
    });

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.match(body.referenceCode, /^PGOT-ENQ-\d{6}-\d{3}$/);
    assert.strictEqual(mockEnquiryDb.length, 2);
  });

  it('GET /api/enquiries should return stored enquiries list', async () => {
    const res = await fetch(`${baseUrl}/api/enquiries?limit=10`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.count, 2);
    assert.strictEqual(body.enquiries[0].full_name, 'Enterprise Client');
    assert.strictEqual(body.enquiries[1].full_name, 'Prasanth Founder');
  });
});
