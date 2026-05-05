const { merge, hasConflicts } = require('./merge');

describe('merge', () => {
  const base  = { APP_ENV: 'production', DB_HOST: 'localhost', SECRET: 'abc' };
  const patch = { APP_ENV: 'staging',    DB_PORT: '5432',      SECRET: 'abc' };

  test('adds new keys from patch', () => {
    const { result } = merge(base, patch);
    expect(result.DB_PORT).toBe('5432');
  });

  test('keeps base keys not in patch', () => {
    const { result } = merge(base, patch);
    expect(result.DB_HOST).toBe('localhost');
  });

  test('strategy=patch overwrites conflicting keys with patch value', () => {
    const { result, conflicts } = merge(base, patch, 'patch');
    expect(result.APP_ENV).toBe('staging');
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0]).toEqual({ key: 'APP_ENV', baseValue: 'production', patchValue: 'staging' });
  });

  test('strategy=base keeps base value on conflict', () => {
    const { result } = merge(base, patch, 'base');
    expect(result.APP_ENV).toBe('production');
  });

  test('strategy=error throws on conflict', () => {
    expect(() => merge(base, patch, 'error')).toThrow(/Merge conflict on key "APP_ENV"/);
  });

  test('unknown strategy throws', () => {
    expect(() => merge(base, patch, 'unknown')).toThrow(/Unknown merge strategy/);
  });

  test('equal values produce no conflicts', () => {
    const { conflicts } = merge(base, patch);
    // SECRET is same in both — should not be a conflict
    expect(conflicts.find(c => c.key === 'SECRET')).toBeUndefined();
  });

  test('merging identical objects yields no conflicts', () => {
    const { result, conflicts } = merge(base, base);
    expect(conflicts).toHaveLength(0);
    expect(result).toEqual(base);
  });
});

describe('hasConflicts', () => {
  test('returns true when there are conflicting keys', () => {
    expect(hasConflicts({ A: '1' }, { A: '2' })).toBe(true);
  });

  test('returns false when patch only adds new keys', () => {
    expect(hasConflicts({ A: '1' }, { B: '2' })).toBe(false);
  });

  test('returns false when all shared keys have equal values', () => {
    expect(hasConflicts({ A: '1' }, { A: '1' })).toBe(false);
  });

  test('returns false for empty patch', () => {
    expect(hasConflicts({ A: '1' }, {})).toBe(false);
  });
});
