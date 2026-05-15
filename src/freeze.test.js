const { checkFrozen, applyFreeze, frozenKeys, freezeSummary } = require('./freeze');

const source = { DB_HOST: 'prod-db', API_KEY: 'secret123', PORT: '8080' };
const target = { DB_HOST: 'dev-db', API_KEY: 'secret123', PORT: '3000', EXTRA: 'val' };

describe('checkFrozen', () => {
  it('returns violations for changed frozen keys', () => {
    const violations = checkFrozen(source, target, ['DB_HOST', 'API_KEY', 'PORT']);
    expect(violations).toHaveLength(2);
    expect(violations[0]).toEqual({ key: 'DB_HOST', expected: 'prod-db', actual: 'dev-db' });
    expect(violations[1]).toEqual({ key: 'PORT', expected: '8080', actual: '3000' });
  });

  it('returns empty array when no violations', () => {
    const violations = checkFrozen(source, target, ['API_KEY']);
    expect(violations).toHaveLength(0);
  });

  it('ignores keys not present in target', () => {
    const violations = checkFrozen(source, { API_KEY: 'secret123' }, ['DB_HOST', 'API_KEY']);
    expect(violations).toHaveLength(0);
  });

  it('ignores keys not present in source', () => {
    const violations = checkFrozen(source, target, ['UNKNOWN']);
    expect(violations).toHaveLength(0);
  });
});

describe('applyFreeze', () => {
  it('overwrites changed keys with source values', () => {
    const result = applyFreeze(source, target, ['DB_HOST', 'PORT']);
    expect(result.DB_HOST).toBe('prod-db');
    expect(result.PORT).toBe('8080');
    expect(result.EXTRA).toBe('val');
  });

  it('preserves target keys not in freeze list', () => {
    const result = applyFreeze(source, target, ['API_KEY']);
    expect(result.DB_HOST).toBe('dev-db');
    expect(result.PORT).toBe('3000');
  });

  it('does not mutate the original target', () => {
    const original = { ...target };
    applyFreeze(source, target, ['DB_HOST']);
    expect(target).toEqual(original);
  });
});

describe('frozenKeys', () => {
  it('returns keys that differ between source and target', () => {
    const keys = frozenKeys(source, target);
    expect(keys).toContain('DB_HOST');
    expect(keys).toContain('PORT');
    expect(keys).not.toContain('API_KEY');
  });

  it('returns empty array when all match', () => {
    expect(frozenKeys(source, source)).toHaveLength(0);
  });
});

describe('freezeSummary', () => {
  it('reports violations and safe status', () => {
    const summary = freezeSummary(['A', 'B', 'C'], [{ key: 'A', expected: '1', actual: '2' }]);
    expect(summary.total).toBe(3);
    expect(summary.violations).toBe(1);
    expect(summary.safe).toBe(false);
  });

  it('marks safe when no violations', () => {
    const summary = freezeSummary(['A'], []);
    expect(summary.safe).toBe(true);
  });
});
