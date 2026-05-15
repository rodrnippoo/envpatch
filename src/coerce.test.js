const { coerceValue, serializeValue, coerceEnv, coerceSummary } = require('./coerce');

describe('coerceValue', () => {
  test('coerces true strings to boolean', () => {
    expect(coerceValue('true')).toBe(true);
    expect(coerceValue('yes')).toBe(true);
    expect(coerceValue('1')).toBe(true);
    expect(coerceValue('on')).toBe(true);
  });

  test('coerces false strings to boolean', () => {
    expect(coerceValue('false')).toBe(false);
    expect(coerceValue('no')).toBe(false);
    expect(coerceValue('0')).toBe(false);
    expect(coerceValue('off')).toBe(false);
  });

  test('coerces integer strings', () => {
    expect(coerceValue('42')).toBe(42);
    expect(coerceValue('-7')).toBe(-7);
  });

  test('coerces float strings', () => {
    expect(coerceValue('3.14')).toBe(3.14);
    expect(coerceValue('-0.5')).toBe(-0.5);
  });

  test('leaves plain strings as-is', () => {
    expect(coerceValue('hello')).toBe('hello');
    expect(coerceValue('localhost')).toBe('localhost');
  });

  test('explicit type overrides auto detection', () => {
    expect(coerceValue('1', 'string')).toBe('1');
    expect(coerceValue('true', 'string')).toBe('true');
    expect(coerceValue('42', 'boolean')).toBe(true);
    expect(coerceValue('3.14', 'integer')).toBe(3);
  });
});

describe('serializeValue', () => {
  test('serializes booleans', () => {
    expect(serializeValue(true)).toBe('true');
    expect(serializeValue(false)).toBe('false');
  });

  test('serializes numbers', () => {
    expect(serializeValue(42)).toBe('42');
    expect(serializeValue(3.14)).toBe('3.14');
  });

  test('serializes strings as-is', () => {
    expect(serializeValue('hello')).toBe('hello');
  });
});

describe('coerceEnv', () => {
  test('coerces all values in env object', () => {
    const env = { DEBUG: 'true', PORT: '3000', HOST: 'localhost', RATIO: '0.5' };
    const result = coerceEnv(env);
    expect(result).toEqual({ DEBUG: true, PORT: 3000, HOST: 'localhost', RATIO: 0.5 });
  });

  test('applies explicit type to all keys', () => {
    const env = { A: 'true', B: '1' };
    expect(coerceEnv(env, 'string')).toEqual({ A: 'true', B: '1' });
  });
});

describe('coerceSummary', () => {
  test('reports only coerced keys', () => {
    const original = { DEBUG: 'true', PORT: '3000', HOST: 'localhost' };
    const coerced = { DEBUG: true, PORT: 3000, HOST: 'localhost' };
    const summary = coerceSummary(original, coerced);
    expect(summary).toHaveLength(2);
    expect(summary.find(s => s.key === 'DEBUG')).toMatchObject({ from: 'true', to: true, type: 'boolean' });
    expect(summary.find(s => s.key === 'PORT')).toMatchObject({ from: '3000', to: 3000, type: 'number' });
  });

  test('returns empty array when nothing was coerced', () => {
    const env = { HOST: 'localhost' };
    expect(coerceSummary(env, env)).toEqual([]);
  });
});
