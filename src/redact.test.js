const {
  isSensitiveKey,
  redactValue,
  redactEnv,
  listRedactedKeys,
} = require('./redact');

describe('isSensitiveKey', () => {
  it('detects password keys', () => {
    expect(isSensitiveKey('DB_PASSWORD')).toBe(true);
    expect(isSensitiveKey('PASSWD')).toBe(true);
  });

  it('detects token keys', () => {
    expect(isSensitiveKey('AUTH_TOKEN')).toBe(true);
    expect(isSensitiveKey('API_TOKEN')).toBe(true);
  });

  it('detects api key variants', () => {
    expect(isSensitiveKey('API_KEY')).toBe(true);
    expect(isSensitiveKey('STRIPE_APIKEY')).toBe(true);
  });

  it('returns false for non-sensitive keys', () => {
    expect(isSensitiveKey('APP_NAME')).toBe(false);
    expect(isSensitiveKey('PORT')).toBe(false);
    expect(isSensitiveKey('NODE_ENV')).toBe(false);
  });
});

describe('redactValue', () => {
  it('masks sensitive values', () => {
    expect(redactValue('DB_PASSWORD', 'hunter2')).toBe('***');
    expect(redactValue('SECRET_KEY', 'abc123')).toBe('***');
  });

  it('keeps non-sensitive values', () => {
    expect(redactValue('PORT', '3000')).toBe('3000');
    expect(redactValue('APP_NAME', 'myapp')).toBe('myapp');
  });

  it('supports custom mask', () => {
    expect(redactValue('API_KEY', 'xyz', '[HIDDEN]')).toBe('[HIDDEN]');
  });

  it('returns empty value as-is', () => {
    expect(redactValue('DB_PASSWORD', '')).toBe('');
  });
});

describe('redactEnv', () => {
  const env = {
    APP_NAME: 'myapp',
    PORT: '3000',
    DB_PASSWORD: 'secret',
    API_KEY: 'key123',
    NODE_ENV: 'production',
  };

  it('redacts sensitive keys and keeps others', () => {
    const result = redactEnv(env);
    expect(result.APP_NAME).toBe('myapp');
    expect(result.PORT).toBe('3000');
    expect(result.DB_PASSWORD).toBe('***');
    expect(result.API_KEY).toBe('***');
  });

  it('redacts additional specified keys', () => {
    const result = redactEnv(env, ['PORT']);
    expect(result.PORT).toBe('***');
    expect(result.APP_NAME).toBe('myapp');
  });

  it('does not mutate original env', () => {
    redactEnv(env);
    expect(env.DB_PASSWORD).toBe('secret');
  });
});

describe('listRedactedKeys', () => {
  it('lists keys that would be redacted', () => {
    const env = { APP_NAME: 'x', DB_PASSWORD: 'y', AUTH_TOKEN: 'z', PORT: '3000' };
    const keys = listRedactedKeys(env);
    expect(keys).toContain('DB_PASSWORD');
    expect(keys).toContain('AUTH_TOKEN');
    expect(keys).not.toContain('APP_NAME');
    expect(keys).not.toContain('PORT');
  });

  it('includes additional keys', () => {
    const env = { CUSTOM: 'val', OTHER: 'val2' };
    const keys = listRedactedKeys(env, ['CUSTOM']);
    expect(keys).toContain('CUSTOM');
  });
});
