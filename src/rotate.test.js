const { rotateKey, rotateKeys, rotatePrefix, rotateSummary } = require('./rotate');

describe('rotateKey', () => {
  const env = { DB_HOST: 'localhost', DB_PASS: 'secret', PORT: '3000' };

  test('renames key keeping value', () => {
    const { env: next, entry } = rotateKey(env, 'DB_HOST', 'DATABASE_HOST');
    expect(next).toHaveProperty('DATABASE_HOST', 'localhost');
    expect(next).not.toHaveProperty('DB_HOST');
    expect(entry.valueChanged).toBe(false);
  });

  test('renames key and updates value', () => {
    const { env: next, entry } = rotateKey(env, 'DB_PASS', 'DATABASE_PASSWORD', 'newpass');
    expect(next.DATABASE_PASSWORD).toBe('newpass');
    expect(entry.valueChanged).toBe(true);
    expect(entry.oldValue).toBe('secret');
  });

  test('returns null entry for missing key', () => {
    const { entry } = rotateKey(env, 'MISSING', 'ALSO_MISSING');
    expect(entry).toBeNull();
  });

  test('does not mutate original env', () => {
    rotateKey(env, 'PORT', 'APP_PORT');
    expect(env).toHaveProperty('PORT');
  });
});

describe('rotateKeys', () => {
  const env = { OLD_A: '1', OLD_B: '2', KEEP: '3' };

  test('rotates multiple keys', () => {
    const { env: next, entries } = rotateKeys(env, [
      { oldKey: 'OLD_A', newKey: 'NEW_A' },
      { oldKey: 'OLD_B', newKey: 'NEW_B', newValue: '99' },
    ]);
    expect(next).toMatchObject({ NEW_A: '1', NEW_B: '99', KEEP: '3' });
    expect(next).not.toHaveProperty('OLD_A');
    expect(entries).toHaveLength(2);
  });

  test('skips missing keys silently', () => {
    const { entries } = rotateKeys(env, [{ oldKey: 'NOPE', newKey: 'YEP' }]);
    expect(entries).toHaveLength(0);
  });
});

describe('rotatePrefix', () => {
  const env = { DB_HOST: 'h', DB_PORT: '5432', APP_NAME: 'x' };

  test('rotates all keys with matching prefix', () => {
    const { env: next, entries } = rotatePrefix(env, 'DB_', 'DATABASE_');
    expect(next).toHaveProperty('DATABASE_HOST', 'h');
    expect(next).toHaveProperty('DATABASE_PORT', '5432');
    expect(next).toHaveProperty('APP_NAME', 'x');
    expect(next).not.toHaveProperty('DB_HOST');
    expect(entries).toHaveLength(2);
  });

  test('returns unchanged env when no prefix matches', () => {
    const { env: next, entries } = rotatePrefix(env, 'REDIS_', 'CACHE_');
    expect(next).toEqual(env);
    expect(entries).toHaveLength(0);
  });
});

describe('rotateSummary', () => {
  test('summarizes rotation entries', () => {
    const entries = [
      { oldKey: 'A', newKey: 'B', oldValue: '1', newValue: '1', valueChanged: false },
      { oldKey: 'C', newKey: 'D', oldValue: '2', newValue: '9', valueChanged: true },
    ];
    const summary = rotateSummary(entries);
    expect(summary.total).toBe(2);
    expect(summary.renamed).toBe(2);
    expect(summary.valueChanged).toBe(1);
    expect(summary.keys).toEqual(['A', 'C']);
  });

  test('handles empty entries', () => {
    expect(rotateSummary([])).toMatchObject({ total: 0, renamed: 0, valueChanged: 0 });
  });
});
