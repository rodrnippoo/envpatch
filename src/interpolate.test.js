const { interpolateValue, interpolateEnv, hasReferences, listReferences } = require('./interpolate');

describe('interpolateValue', () => {
  test('expands ${VAR} syntax', () => {
    expect(interpolateValue('hello ${NAME}', { NAME: 'world' })).toBe('hello world');
  });

  test('expands $VAR syntax', () => {
    expect(interpolateValue('hello $NAME', { NAME: 'world' })).toBe('hello world');
  });

  test('leaves unresolved references intact', () => {
    expect(interpolateValue('${MISSING}', {})).toBe('${MISSING}');
  });

  test('expands nested references', () => {
    const env = { BASE: '/app', PATH: '${BASE}/bin' };
    expect(interpolateValue('${PATH}', env)).toBe('/app/bin');
  });

  test('throws on circular reference', () => {
    const env = { A: '$B', B: '$A' };
    expect(() => interpolateValue('$A', env, new Set(['A']))).toThrow('Circular reference');
  });

  test('handles value with no references', () => {
    expect(interpolateValue('static-value', {})).toBe('static-value');
  });
});

describe('interpolateEnv', () => {
  test('interpolates all values', () => {
    const env = { HOST: 'localhost', PORT: '5432', URL: 'postgres://${HOST}:${PORT}/db' };
    const result = interpolateEnv(env);
    expect(result.URL).toBe('postgres://localhost:5432/db');
    expect(result.HOST).toBe('localhost');
  });

  test('returns new object without mutating input', () => {
    const env = { A: 'foo', B: '$A-bar' };
    const result = interpolateEnv(env);
    expect(result.B).toBe('foo-bar');
    expect(env.B).toBe('$A-bar');
  });

  test('throws with key context on circular ref', () => {
    const env = { X: '$X' };
    expect(() => interpolateEnv(env)).toThrow('Error interpolating key "X"');
  });
});

describe('hasReferences', () => {
  test('detects ${VAR} reference', () => {
    expect(hasReferences('${FOO}')).toBe(true);
  });

  test('detects $VAR reference', () => {
    expect(hasReferences('prefix_$BAR')).toBe(true);
  });

  test('returns false for plain value', () => {
    expect(hasReferences('just-a-string')).toBe(false);
  });
});

describe('listReferences', () => {
  test('lists all referenced variable names', () => {
    expect(listReferences('${A}-$B-${C}')).toEqual(['A', 'B', 'C']);
  });

  test('returns empty array when no references', () => {
    expect(listReferences('no-refs')).toEqual([]);
  });
});
