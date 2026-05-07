const { mapValues, mapKeys, filterEnv, applyTransforms, transformSummary } = require('./transform');

describe('mapValues', () => {
  it('applies fn to each value', () => {
    const env = { FOO: 'hello', BAR: 'world' };
    expect(mapValues(env, v => v.toUpperCase())).toEqual({ FOO: 'HELLO', BAR: 'WORLD' });
  });

  it('passes key as second arg', () => {
    const env = { KEY: 'val' };
    const result = mapValues(env, (v, k) => `${k}=${v}`);
    expect(result).toEqual({ KEY: 'KEY=val' });
  });

  it('returns empty object for empty input', () => {
    expect(mapValues({}, v => v)).toEqual({});
  });
});

describe('mapKeys', () => {
  it('applies fn to each key', () => {
    const env = { foo: '1', bar: '2' };
    expect(mapKeys(env, k => k.toUpperCase())).toEqual({ FOO: '1', BAR: '2' });
  });

  it('preserves values', () => {
    const env = { A: 'alpha' };
    expect(mapKeys(env, k => `PREFIX_${k}`)).toEqual({ PREFIX_A: 'alpha' });
  });
});

describe('filterEnv', () => {
  it('keeps entries matching predicate', () => {
    const env = { A: '1', B: '', C: '3' };
    expect(filterEnv(env, v => v !== '')).toEqual({ A: '1', C: '3' });
  });

  it('filters by key', () => {
    const env = { DB_HOST: 'localhost', APP_NAME: 'test' };
    expect(filterEnv(env, (_, k) => k.startsWith('DB_'))).toEqual({ DB_HOST: 'localhost' });
  });
});

describe('applyTransforms', () => {
  it('applies transforms in sequence', () => {
    const env = { foo: 'bar' };
    const transforms = [
      { type: 'mapKeys', fn: k => k.toUpperCase() },
      { type: 'mapValues', fn: v => v + '!' }
    ];
    expect(applyTransforms(env, transforms)).toEqual({ FOO: 'bar!' });
  });

  it('throws on unknown transform type', () => {
    expect(() => applyTransforms({}, [{ type: 'unknown', fn: x => x }])).toThrow('Unknown transform type');
  });
});

describe('transformSummary', () => {
  it('detects added, removed, and changed keys', () => {
    const before = { A: '1', B: '2', C: '3' };
    const after  = { A: '1', B: 'changed', D: 'new' };
    const summary = transformSummary(before, after);
    expect(summary.added).toEqual(['D']);
    expect(summary.removed).toEqual(['C']);
    expect(summary.changed).toEqual(['B']);
  });

  it('returns empty arrays when nothing changed', () => {
    const env = { X: '1' };
    expect(transformSummary(env, { ...env })).toEqual({ added: [], removed: [], changed: [] });
  });
});
