const { validateSchema, validateValue, formatSchemaErrors } = require('./schema');

describe('validateValue', () => {
  test('passes for string with no constraints', () => {
    expect(validateValue('hello', { type: 'string' })).toBeNull();
  });

  test('fails required when value is empty', () => {
    expect(validateValue('', { required: true })).toMatch(/required/);
  });

  test('fails required when value is undefined', () => {
    expect(validateValue(undefined, { required: true })).toMatch(/required/);
  });

  test('passes number type with numeric string', () => {
    expect(validateValue('42', { type: 'number' })).toBeNull();
  });

  test('fails number type with non-numeric string', () => {
    expect(validateValue('abc', { type: 'number' })).toMatch(/expected number/);
  });

  test('passes boolean with true/false', () => {
    expect(validateValue('true', { type: 'boolean' })).toBeNull();
    expect(validateValue('0', { type: 'boolean' })).toBeNull();
  });

  test('fails boolean with invalid value', () => {
    expect(validateValue('yes', { type: 'boolean' })).toMatch(/expected boolean/);
  });

  test('passes valid URL', () => {
    expect(validateValue('https://example.com', { type: 'url' })).toBeNull();
  });

  test('fails invalid URL', () => {
    expect(validateValue('not-a-url', { type: 'url' })).toMatch(/expected valid URL/);
  });

  test('passes valid email', () => {
    expect(validateValue('user@example.com', { type: 'email' })).toBeNull();
  });

  test('fails invalid email', () => {
    expect(validateValue('not-an-email', { type: 'email' })).toMatch(/expected valid email/);
  });

  test('passes pattern match', () => {
    expect(validateValue('abc123', { pattern: '^[a-z0-9]+$' })).toBeNull();
  });

  test('fails pattern mismatch', () => {
    expect(validateValue('ABC!', { pattern: '^[a-z0-9]+$' })).toMatch(/does not match pattern/);
  });
});

describe('validateSchema', () => {
  test('returns empty array for valid env', () => {
    const env = { PORT: '3000', HOST: 'localhost' };
    const schema = { PORT: { type: 'number', required: true }, HOST: { type: 'string' } };
    expect(validateSchema(env, schema)).toEqual([]);
  });

  test('returns errors for invalid values', () => {
    const env = { PORT: 'abc' };
    const schema = { PORT: { type: 'number', required: true } };
    const errors = validateSchema(env, schema);
    expect(errors).toHaveLength(1);
    expect(errors[0].key).toBe('PORT');
  });

  test('reports unknown type', () => {
    const env = {};
    const schema = { FOO: { type: 'uuid' } };
    const errors = validateSchema(env, schema);
    expect(errors[0].error).toMatch(/unknown type/);
  });
});

describe('formatSchemaErrors', () => {
  test('returns empty string for no errors', () => {
    expect(formatSchemaErrors([])).toBe('');
  });

  test('formats errors with key and message', () => {
    const errors = [{ key: 'PORT', error: 'expected number' }];
    expect(formatSchemaErrors(errors)).toContain('PORT');
    expect(formatSchemaErrors(errors)).toContain('expected number');
  });
});
