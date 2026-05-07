const { maskValue, shouldMask, maskEnv, listMaskedKeys } = require('./mask');

describe('maskValue', () => {
  test('masks a normal value revealing ends', () => {
    const result = maskValue('supersecretvalue', 2);
    expect(result).toBe('su************ue');
  });

  test('fully masks short values', () => {
    expect(maskValue('ab', 2)).toBe('**');
    expect(maskValue('abcd', 2)).toBe('****');
  });

  test('returns empty string for empty input', () => {
    expect(maskValue('')).toBe('');
  });

  test('returns empty string for non-string', () => {
    expect(maskValue(null)).toBe('');
    expect(maskValue(undefined)).toBe('');
  });

  test('respects custom reveal count', () => {
    const result = maskValue('hello_world_env', 3);
    expect(result.startsWith('hel')).toBe(true);
    expect(result.endsWith('nv')).toBe(false);
    expect(result.endsWith('env')).toBe(true);
  });
});

describe('shouldMask', () => {
  test('matches secret keys', () => {
    expect(shouldMask('DB_SECRET')).toBe(true);
    expect(shouldMask('API_KEY')).toBe(true);
    expect(shouldMask('AUTH_TOKEN')).toBe(true);
    expect(shouldMask('PRIVATE_KEY')).toBe(true);
    expect(shouldMask('PASSWORD')).toBe(true);
  });

  test('does not mask safe keys', () => {
    expect(shouldMask('PORT')).toBe(false);
    expect(shouldMask('NODE_ENV')).toBe(false);
    expect(shouldMask('LOG_LEVEL')).toBe(false);
    expect(shouldMask('APP_NAME')).toBe(false);
  });
});

describe('maskEnv', () => {
  const env = {
    PORT: '3000',
    DB_PASSWORD: 'hunter2',
    API_KEY: 'abc123xyz',
    APP_NAME: 'myapp',
  };

  test('masks sensitive keys automatically', () => {
    const result = maskEnv(env);
    expect(result.PORT).toBe('3000');
    expect(result.APP_NAME).toBe('myapp');
    expect(result.DB_PASSWORD).not.toBe('hunter2');
    expect(result.API_KEY).not.toBe('abc123xyz');
  });

  test('masks only specified keys when provided', () => {
    const result = maskEnv(env, { keys: ['PORT'] });
    expect(result.PORT).not.toBe('3000');
    expect(result.DB_PASSWORD).toBe('hunter2');
  });

  test('does not mutate original env', () => {
    maskEnv(env);
    expect(env.DB_PASSWORD).toBe('hunter2');
  });
});

describe('listMaskedKeys', () => {
  test('returns keys that would be masked', () => {
    const env = { PORT: '3000', SECRET: 'x', TOKEN: 'y', HOST: 'localhost' };
    const keys = listMaskedKeys(env);
    expect(keys).toContain('SECRET');
    expect(keys).toContain('TOKEN');
    expect(keys).not.toContain('PORT');
    expect(keys).not.toContain('HOST');
  });

  test('respects explicit keys list', () => {
    const env = { PORT: '3000', HOST: 'localhost' };
    const keys = listMaskedKeys(env, ['PORT']);
    expect(keys).toEqual(['PORT']);
  });
});
