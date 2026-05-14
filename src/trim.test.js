const { trimValue, trimEnv, trimAll, listUntrimmedKeys, trimSummary } = require('./trim');

describe('trimValue', () => {
  it('trims leading and trailing whitespace', () => {
    expect(trimValue('  hello  ')).toBe('hello');
  });

  it('returns value unchanged if already trimmed', () => {
    expect(trimValue('hello')).toBe('hello');
  });

  it('handles empty string', () => {
    expect(trimValue('')).toBe('');
  });

  it('passes through non-string values', () => {
    expect(trimValue(undefined)).toBeUndefined();
  });
});

describe('trimEnv', () => {
  it('trims all values in env object', () => {
    const env = { FOO: '  bar  ', BAZ: 'qux' };
    expect(trimEnv(env)).toEqual({ FOO: 'bar', BAZ: 'qux' });
  });

  it('leaves keys unchanged', () => {
    const env = { '  KEY  ': 'value' };
    const result = trimEnv(env);
    expect(result['  KEY  ']).toBe('value');
  });

  it('returns empty object for empty input', () => {
    expect(trimEnv({})).toEqual({});
  });
});

describe('trimAll', () => {
  it('trims both keys and values', () => {
    const env = { '  FOO  ': '  bar  ' };
    expect(trimAll(env)).toEqual({ FOO: 'bar' });
  });

  it('drops keys that are empty after trimming', () => {
    const env = { '   ': 'value', VALID: 'ok' };
    const result = trimAll(env);
    expect(result).not.toHaveProperty('   ');
    expect(result.VALID).toBe('ok');
  });
});

describe('listUntrimmedKeys', () => {
  it('returns keys with untrimmed values', () => {
    const env = { FOO: '  bar', BAZ: 'clean', QUX: 'trailing  ' };
    expect(listUntrimmedKeys(env)).toEqual(expect.arrayContaining(['FOO', 'QUX']));
  });

  it('returns empty array when all values are trimmed', () => {
    expect(listUntrimmedKeys({ A: 'ok', B: 'fine' })).toEqual([]);
  });
});

describe('trimSummary', () => {
  it('reports changed keys', () => {
    const before = { FOO: '  bar  ', BAZ: 'clean' };
    const after = trimEnv(before);
    const summary = trimSummary(before, after);
    expect(summary.changed).toContain('FOO');
    expect(summary.changed).not.toContain('BAZ');
    expect(summary.total).toBe(1);
  });

  it('returns zero total when nothing changed', () => {
    const env = { A: 'x', B: 'y' };
    expect(trimSummary(env, env).total).toBe(0);
  });
});
