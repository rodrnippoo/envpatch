const { scopeEnv, addScope, listScopes, excludeScope, scopeSummary } = require('./scope');

const env = {
  DB_HOST: 'localhost',
  DB_PORT: '5432',
  APP_NAME: 'myapp',
  APP_ENV: 'production',
  SECRET: 'abc123',
};

describe('scopeEnv', () => {
  it('returns only keys with the given prefix', () => {
    const result = scopeEnv(env, 'DB_');
    expect(Object.keys(result)).toEqual(['DB_HOST', 'DB_PORT']);
  });

  it('strips prefix when strip option is true', () => {
    const result = scopeEnv(env, 'DB_', { strip: true });
    expect(result).toEqual({ HOST: 'localhost', PORT: '5432' });
  });

  it('returns empty object if no keys match', () => {
    const result = scopeEnv(env, 'REDIS_');
    expect(result).toEqual({});
  });

  it('preserves values exactly', () => {
    const result = scopeEnv(env, 'APP_');
    expect(result['APP_NAME']).toBe('myapp');
  });
});

describe('addScope', () => {
  it('adds prefix to all keys', () => {
    const result = addScope({ HOST: 'localhost', PORT: '5432' }, 'DB_');
    expect(result).toEqual({ DB_HOST: 'localhost', DB_PORT: '5432' });
  });

  it('returns empty object for empty input', () => {
    expect(addScope({}, 'X_')).toEqual({});
  });
});

describe('listScopes', () => {
  it('lists unique scope prefixes', () => {
    const scopes = listScopes(env);
    expect(scopes).toContain('DB_');
    expect(scopes).toContain('APP_');
  });

  it('excludes keys with no underscore', () => {
    const scopes = listScopes(env);
    expect(scopes).not.toContain('SECRET');
  });

  it('returns sorted list', () => {
    const scopes = listScopes(env);
    expect(scopes).toEqual([...scopes].sort());
  });
});

describe('excludeScope', () => {
  it('removes keys with the given prefix', () => {
    const result = excludeScope(env, 'DB_');
    expect(result).not.toHaveProperty('DB_HOST');
    expect(result).not.toHaveProperty('DB_PORT');
    expect(result).toHaveProperty('APP_NAME');
  });
});

describe('scopeSummary', () => {
  it('returns correct counts', () => {
    const scoped = scopeEnv(env, 'DB_');
    const summary = scopeSummary(env, scoped, 'DB_');
    expect(summary.prefix).toBe('DB_');
    expect(summary.matched).toBe(2);
    expect(summary.excluded).toBe(3);
    expect(summary.total).toBe(5);
  });
});
