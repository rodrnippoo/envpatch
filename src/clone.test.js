const { cloneEnv, cloneKeys, cloneExcluding, cloneByPrefix } = require('./clone');

describe('cloneEnv', () => {
  it('returns a shallow copy of the env', () => {
    const env = { A: '1', B: '2' };
    const result = cloneEnv(env);
    expect(result).toEqual(env);
    expect(result).not.toBe(env);
  });

  it('throws for non-object input', () => {
    expect(() => cloneEnv(null)).toThrow(TypeError);
    expect(() => cloneEnv('string')).toThrow(TypeError);
  });

  it('handles empty env', () => {
    expect(cloneEnv({})).toEqual({});
  });
});

describe('cloneKeys', () => {
  const env = { A: '1', B: '2', C: '3' };

  it('clones only specified keys', () => {
    expect(cloneKeys(env, ['A', 'C'])).toEqual({ A: '1', C: '3' });
  });

  it('ignores keys not present in env', () => {
    expect(cloneKeys(env, ['A', 'Z'])).toEqual({ A: '1' });
  });

  it('returns empty object for empty key list', () => {
    expect(cloneKeys(env, [])).toEqual({});
  });

  it('throws if keys is not an array', () => {
    expect(() => cloneKeys(env, 'A')).toThrow(TypeError);
  });
});

describe('cloneExcluding', () => {
  const env = { A: '1', B: '2', C: '3' };

  it('excludes specified keys', () => {
    expect(cloneExcluding(env, ['B'])).toEqual({ A: '1', C: '3' });
  });

  it('returns full clone when no keys excluded', () => {
    expect(cloneExcluding(env, [])).toEqual(env);
  });

  it('throws if excludeKeys is not an array', () => {
    expect(() => cloneExcluding(env, null)).toThrow(TypeError);
  });
});

describe('cloneByPrefix', () => {
  const env = { DB_HOST: 'localhost', DB_PORT: '5432', APP_NAME: 'envpatch' };

  it('clones only keys matching prefix', () => {
    expect(cloneByPrefix(env, 'DB_')).toEqual({ DB_HOST: 'localhost', DB_PORT: '5432' });
  });

  it('returns empty object if no keys match', () => {
    expect(cloneByPrefix(env, 'REDIS_')).toEqual({});
  });

  it('throws if prefix is not a string', () => {
    expect(() => cloneByPrefix(env, 123)).toThrow(TypeError);
  });
});
