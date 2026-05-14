const { normalizeKey, normalizeValue, normalizeEnv, normalizeSummary } = require('./normalize');

describe('normalizeKey', () => {
  it('trims whitespace from keys', () => {
    expect(normalizeKey('  FOO  ')).toBe('FOO');
  });

  it('uppercases keys when option is set', () => {
    expect(normalizeKey('db_host', { uppercaseKeys: true })).toBe('DB_HOST');
  });

  it('leaves case unchanged by default', () => {
    expect(normalizeKey('db_host')).toBe('db_host');
  });
});

describe('normalizeValue', () => {
  it('trims values by default', () => {
    expect(normalizeValue('  hello  ')).toBe('hello');
  });

  it('normalizes Windows line endings', () => {
    expect(normalizeValue('line1\r\nline2')).toBe('line1\nline2');
  });

  it('normalizes old Mac line endings', () => {
    expect(normalizeValue('line1\rline2')).toBe('line1\nline2');
  });

  it('collapses internal whitespace when option set', () => {
    expect(normalizeValue('hello   world', { collapseWhitespace: true })).toBe('hello world');
  });

  it('does not trim when trimValues is false', () => {
    expect(normalizeValue('  hi  ', { trimValues: false })).toBe('  hi  ');
  });
});

describe('normalizeEnv', () => {
  it('normalizes all keys and values', () => {
    const env = { '  FOO  ': '  bar  ', 'BAZ': 'qux\r\n' };
    expect(normalizeEnv(env)).toEqual({ FOO: 'bar', BAZ: 'qux' });
  });

  it('uppercases keys when option is set', () => {
    const env = { db_host: 'localhost', db_port: '5432' };
    const result = normalizeEnv(env, { uppercaseKeys: true });
    expect(result).toEqual({ DB_HOST: 'localhost', DB_PORT: '5432' });
  });

  it('returns empty object for empty input', () => {
    expect(normalizeEnv({})).toEqual({});
  });
});

describe('normalizeSummary', () => {
  it('identifies changed values', () => {
    const before = { FOO: '  bar  ', BAZ: 'qux' };
    const after = { FOO: 'bar', BAZ: 'qux' };
    const { changedKeys } = normalizeSummary(before, after);
    expect(changedKeys).toContain('FOO');
    expect(changedKeys).not.toContain('BAZ');
  });

  it('identifies renamed keys', () => {
    const before = { db_host: 'localhost' };
    const after = { DB_HOST: 'localhost' };
    const { renamedKeys } = normalizeSummary(before, after);
    expect(renamedKeys).toEqual([{ from: 'db_host', to: 'DB_HOST' }]);
  });

  it('returns empty arrays when nothing changed', () => {
    const env = { FOO: 'bar' };
    const { changedKeys, renamedKeys } = normalizeSummary(env, env);
    expect(changedKeys).toHaveLength(0);
    expect(renamedKeys).toHaveLength(0);
  });
});
