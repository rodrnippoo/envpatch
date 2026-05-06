const { validate, isValid, isValidKey, formatValidationErrors } = require('./validate');

describe('isValidKey', () => {
  test('accepts standard env key names', () => {
    expect(isValidKey('DATABASE_URL')).toBe(true);
    expect(isValidKey('_PRIVATE')).toBe(true);
    expect(isValidKey('myVar123')).toBe(true);
  });

  test('rejects keys starting with a digit', () => {
    expect(isValidKey('1INVALID')).toBe(false);
  });

  test('rejects keys with spaces or special chars', () => {
    expect(isValidKey('MY VAR')).toBe(false);
    expect(isValidKey('MY-VAR')).toBe(false);
    expect(isValidKey('MY.VAR')).toBe(false);
  });
});

describe('validate', () => {
  test('returns empty array for valid env object', () => {
    const env = { PORT: '3000', DATABASE_URL: 'postgres://localhost/db' };
    expect(validate(env)).toEqual([]);
  });

  test('reports invalid key names', () => {
    const env = { 'BAD-KEY': 'value' };
    const errors = validate(env);
    expect(errors).toHaveLength(1);
    expect(errors[0].key).toBe('BAD-KEY');
    expect(errors[0].message).toMatch(/Invalid key name/);
  });

  test('reports non-string values', () => {
    const env = { PORT: 3000 };
    const errors = validate(env);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toMatch(/must be a string/);
  });

  test('reports multiple errors across multiple keys', () => {
    const env = { 'BAD-KEY': 'ok', GOOD_KEY: 42 };
    const errors = validate(env);
    expect(errors).toHaveLength(2);
  });
});

describe('isValid', () => {
  test('returns true for valid env', () => {
    expect(isValid({ NODE_ENV: 'production' })).toBe(true);
  });

  test('returns false for invalid env', () => {
    expect(isValid({ 'INVALID KEY': 'value' })).toBe(false);
  });
});

describe('formatValidationErrors', () => {
  test('returns friendly message when no errors', () => {
    expect(formatValidationErrors([])).toBe('No validation errors.');
  });

  test('formats errors with key and message', () => {
    const errors = [{ key: 'BAD-KEY', message: 'Invalid key name: "BAD-KEY"' }];
    const output = formatValidationErrors(errors);
    expect(output).toContain('[BAD-KEY]');
    expect(output).toContain('Invalid key name');
  });
});
