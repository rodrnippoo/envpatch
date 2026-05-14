const { pinKeys, applyPins, getPinConflicts, pinSummary } = require('./pin');

const baseEnv = {
  HOST: 'localhost',
  PORT: '3000',
  DB_URL: 'postgres://localhost/dev',
  SECRET: 'dev-secret',
};

describe('pinKeys', () => {
  it('extracts specified keys from env', () => {
    const pinned = pinKeys(baseEnv, ['HOST', 'PORT']);
    expect(pinned).toEqual({ HOST: 'localhost', PORT: '3000' });
  });

  it('ignores keys not present in env', () => {
    const pinned = pinKeys(baseEnv, ['HOST', 'MISSING']);
    expect(pinned).toEqual({ HOST: 'localhost' });
  });

  it('accepts a single key as string', () => {
    const pinned = pinKeys(baseEnv, 'SECRET');
    expect(pinned).toEqual({ SECRET: 'dev-secret' });
  });

  it('returns empty object for empty key list', () => {
    expect(pinKeys(baseEnv, [])).toEqual({});
  });
});

describe('applyPins', () => {
  it('overrides env values with pinned values', () => {
    const incoming = { ...baseEnv, HOST: 'prod.example.com', PORT: '8080' };
    const pinned = { HOST: 'localhost', PORT: '3000' };
    const result = applyPins(incoming, pinned);
    expect(result.HOST).toBe('localhost');
    expect(result.PORT).toBe('3000');
  });

  it('keeps non-pinned keys from incoming env', () => {
    const incoming = { ...baseEnv, EXTRA: 'value' };
    const pinned = { HOST: 'localhost' };
    const result = applyPins(incoming, pinned);
    expect(result.EXTRA).toBe('value');
    expect(result.DB_URL).toBe(baseEnv.DB_URL);
  });

  it('does not mutate original env', () => {
    const incoming = { HOST: 'prod.example.com' };
    const pinned = { HOST: 'localhost' };
    applyPins(incoming, pinned);
    expect(incoming.HOST).toBe('prod.example.com');
  });
});

describe('getPinConflicts', () => {
  it('detects keys with differing values', () => {
    const incoming = { HOST: 'prod.example.com', PORT: '3000' };
    const pinned = { HOST: 'localhost', PORT: '3000' };
    const conflicts = getPinConflicts(incoming, pinned);
    expect(Object.keys(conflicts)).toEqual(['HOST']);
    expect(conflicts.HOST).toEqual({ incoming: 'prod.example.com', pinned: 'localhost' });
  });

  it('returns empty when all values match', () => {
    const conflicts = getPinConflicts({ HOST: 'localhost' }, { HOST: 'localhost' });
    expect(conflicts).toEqual({});
  });

  it('ignores pinned keys absent from incoming', () => {
    const conflicts = getPinConflicts({}, { HOST: 'localhost' });
    expect(conflicts).toEqual({});
  });
});

describe('pinSummary', () => {
  it('returns correct counts', () => {
    const incoming = { HOST: 'prod.example.com', PORT: '8080', DB_URL: 'postgres://prod/db' };
    const pinned = { HOST: 'localhost', PORT: '3000' };
    const summary = pinSummary(incoming, pinned);
    expect(summary.total).toBe(2);
    expect(summary.applied).toBe(2);
    expect(summary.conflicts).toBe(2);
    expect(summary.conflictKeys).toEqual(expect.arrayContaining(['HOST', 'PORT']));
  });

  it('reports zero conflicts when values match', () => {
    const summary = pinSummary({ HOST: 'localhost' }, { HOST: 'localhost' });
    expect(summary.conflicts).toBe(0);
  });
});
