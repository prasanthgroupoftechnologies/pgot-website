import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  setPool,
  initDb,
  saveEnquiry,
  updateEmailStatus,
  getAllEnquiries,
  getEnquiryCount,
  generateReferenceCode,
} from './database.js';

describe('PostgreSQL Database Module Tests', () => {
  it('should generate valid PGOT reference codes matching pattern', () => {
    const code = generateReferenceCode();
    assert.match(code, /^PGOT-ENQ-\d{6}-\d{3}$/);
  });

  it('should execute CREATE TABLE and INDEX queries in initDb()', async () => {
    let executedQueries = [];
    let released = false;

    const mockClient = {
      query: async (sql) => {
        executedQueries.push(sql);
        return { rows: [] };
      },
      release: () => {
        released = true;
      },
    };

    const mockPool = {
      connect: async () => mockClient,
      query: async () => ({ rows: [] }),
    };

    setPool(mockPool);

    await initDb();

    assert.strictEqual(executedQueries.length, 1);
    assert.strictEqual(released, true);
    assert.ok(executedQueries[0].includes('CREATE TABLE IF NOT EXISTS enquiries'));
    assert.ok(executedQueries[0].includes('idx_enquiries_email'));
    assert.ok(executedQueries[0].includes('idx_enquiries_created_at'));
    assert.ok(executedQueries[0].includes('reference_code VARCHAR(100) UNIQUE'));
  });

  it('should save enquiry with parameterized values in an atomic transaction and return reference code', async () => {
    let transactionEvents = [];
    let capturedQuery = '';
    let capturedValues = [];
    let clientReleased = false;

    const mockClient = {
      query: async (query, values) => {
        if (query === 'BEGIN' || query === 'COMMIT' || query === 'ROLLBACK') {
          transactionEvents.push(query);
          return { rows: [] };
        }
        if (query.includes('CREATE TABLE')) {
          return { rows: [] };
        }
        capturedQuery = query;
        capturedValues = values;
        return {
          rows: [
            {
              id: 42,
              reference_code: values[0],
              created_at: values[8],
            },
          ],
        };
      },
      release: () => {
        clientReleased = true;
      },
    };

    const mockPool = {
      connect: async () => mockClient,
      query: async () => ({ rows: [] }),
    };

    setPool(mockPool);

    const enquiryInput = {
      fullName: 'Prasanth Kumar',
      companyName: 'PGOT Global Technologies',
      email: 'prasanth@example.com',
      phone: '+919876543210',
      service: 'AI & Enterprise Software',
      subject: 'Architecture Consultation',
      message: 'Looking to build next-generation enterprise AI infrastructure.',
      ipAddress: '192.168.1.100',
    };

    const record = await saveEnquiry(enquiryInput);

    assert.strictEqual(record.id, 42);
    assert.match(record.referenceCode, /^PGOT-ENQ-\d{6}-\d{3}$/);
    assert.ok(record.createdAt);
    assert.strictEqual(clientReleased, true);

    // Verify transaction lifecycle (BEGIN -> COMMIT)
    assert.deepStrictEqual(transactionEvents, ['BEGIN', 'COMMIT']);

    // Verify parameterized query security ($1..$10)
    assert.ok(capturedQuery.includes('$1, $2, $3, $4, $5, $6, $7, $8, $9, \'PENDING\', $10'));
    assert.ok(capturedQuery.includes('RETURNING id, reference_code, created_at'));
    assert.strictEqual(capturedValues[1], 'Prasanth Kumar');
    assert.strictEqual(capturedValues[2], 'PGOT Global Technologies');
    assert.strictEqual(capturedValues[3], 'prasanth@example.com');
    assert.strictEqual(capturedValues[4], '+919876543210');
    assert.strictEqual(capturedValues[5], 'AI & Enterprise Software');
    assert.strictEqual(capturedValues[6], 'Architecture Consultation');
    assert.strictEqual(capturedValues[7], 'Looking to build next-generation enterprise AI infrastructure.');
    assert.strictEqual(capturedValues[9], '192.168.1.100');
  });

  it('should rollback transaction if INSERT query fails', async () => {
    let transactionEvents = [];
    let clientReleased = false;

    const mockClient = {
      query: async (query) => {
        if (query === 'BEGIN' || query === 'COMMIT' || query === 'ROLLBACK') {
          transactionEvents.push(query);
          return { rows: [] };
        }
        if (query.includes('CREATE TABLE')) {
          return { rows: [] };
        }
        if (query.includes('INSERT INTO enquiries')) {
          throw new Error('Database constraint error');
        }
        return { rows: [] };
      },
      release: () => {
        clientReleased = true;
      },
    };

    const mockPool = {
      connect: async () => mockClient,
      query: async () => ({ rows: [] }),
    };

    setPool(mockPool);

    await assert.rejects(
      async () => {
        await saveEnquiry({
          fullName: 'Test User',
          companyName: 'Test Inc',
          email: 'test@example.com',
          phone: '9876543210',
          message: 'Valid test message 12345',
        });
      },
      /Database constraint error/
    );

    assert.ok(transactionEvents.includes('BEGIN'));
    assert.ok(transactionEvents.includes('ROLLBACK'));
    assert.strictEqual(clientReleased, true);
  });

  it('should update email status using parameterized query', async () => {
    let capturedQuery = '';
    let capturedValues = [];

    const mockPool = {
      query: async (query, values) => {
        capturedQuery = query;
        capturedValues = values;
        return { rowCount: 1 };
      },
    };

    setPool(mockPool);

    await updateEmailStatus(42, 'SENT', null);

    assert.ok(capturedQuery.includes('UPDATE enquiries'));
    assert.ok(capturedQuery.includes('email_status = $1'));
    assert.ok(capturedQuery.includes('email_error = $2'));
    assert.ok(capturedQuery.includes('WHERE id = $3'));
    assert.deepStrictEqual(capturedValues, ['SENT', null, 42]);

    await updateEmailStatus(42, 'FAILED', 'Connection timeout');
    assert.deepStrictEqual(capturedValues, ['FAILED', 'Connection timeout', 42]);
  });

  it('should get all enquiries ordered by ID DESC with limit', async () => {
    let capturedQuery = '';
    let capturedValues = [];

    const mockPool = {
      query: async (query, values) => {
        capturedQuery = query;
        capturedValues = values;
        return {
          rows: [
            { id: 2, full_name: 'Alice' },
            { id: 1, full_name: 'Bob' },
          ],
        };
      },
    };

    setPool(mockPool);

    const enquiries = await getAllEnquiries(25);

    assert.ok(capturedQuery.includes('ORDER BY id DESC'));
    assert.ok(capturedQuery.includes('LIMIT $1'));
    assert.deepStrictEqual(capturedValues, [25]);
    assert.strictEqual(enquiries.length, 2);
  });

  it('should count total stored enquiries', async () => {
    const mockPool = {
      query: async (query) => {
        assert.ok(query.includes('COUNT(*)'));
        return {
          rows: [{ count: '17' }],
        };
      },
    };

    setPool(mockPool);

    const count = await getEnquiryCount();
    assert.strictEqual(count, 17);
  });

  it('should throw clean error when pool is null and query is attempted', async () => {
    setPool(null);
    delete process.env.DATABASE_URL;

    await assert.rejects(
      async () => {
        await saveEnquiry({
          fullName: 'Test',
          companyName: 'Test Inc',
          email: 'test@example.com',
          phone: '1234567890',
          message: 'Hello world',
        });
      },
      /DATABASE_URL is not configured/
    );
  });
});
