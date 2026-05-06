const { formatWatchEvent, formatWatchStart, formatWatchStop } = require('./formatWatch');

const mockDiff = {
  added: [{ key: 'NEW_KEY', value: 'hello' }],
  removed: [],
  changed: [],
  unchanged: [],
};

const mockAuditEntry = {
  action: 'watch-change',
  target: '.env',
  timestamp: new Date('2024-01-15T10:30:00.000Z').toISOString(),
  meta: { added: 1, removed: 0, changed: 0 },
};

describe('formatWatchEvent', () => {
  test('includes file path in output', () => {
    const out = formatWatchEvent('.env', mockDiff, mockAuditEntry);
    expect(out).toContain('.env');
  });

  test('includes diff output', () => {
    const out = formatWatchEvent('.env', mockDiff, mockAuditEntry);
    expect(out).toContain('NEW_KEY');
  });

  test('includes timestamp', () => {
    const out = formatWatchEvent('.env', mockDiff, mockAuditEntry);
    expect(out).toMatch(/\[.*\]/);
  });
});

describe('formatWatchStart', () => {
  test('mentions the file path', () => {
    const out = formatWatchStart('.env.local');
    expect(out).toContain('.env.local');
  });

  test('mentions Ctrl+C', () => {
    const out = formatWatchStart('.env');
    expect(out).toContain('Ctrl+C');
  });
});

describe('formatWatchStop', () => {
  test('shows singular for 1 event', () => {
    const out = formatWatchStop('.env', 1);
    expect(out).toContain('1 change');
    expect(out).not.toContain('changes');
  });

  test('shows plural for multiple events', () => {
    const out = formatWatchStop('.env', 3);
    expect(out).toContain('3 changes');
  });

  test('includes file path', () => {
    const out = formatWatchStop('.env.staging', 0);
    expect(out).toContain('.env.staging');
  });
});
