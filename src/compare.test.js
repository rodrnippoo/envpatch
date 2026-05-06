const { compareEnv, summarizeCompare, hasChanges } = require('./compare');

describe('compareEnv', () => {
  const base = { A: '1', B: '2', C: '3' };
  const target = { A: '1', B: '99', D: '4' };

  test('detects added keys', () => {
    const result = compareEnv(base, target);
    expect(result.added).toEqual({ D: '4' });
  });

  test('detects removed keys', () => {
    const result = compareEnv(base, target);
    expect(result.removed).toEqual({ C: '3' });
  });

  test('detects changed keys', () => {
    const result = compareEnv(base, target);
    expect(result.changed).toEqual({ B: { from: '2', to: '99' } });
  });

  test('detects unchanged keys', () => {
    const result = compareEnv(base, target);
    expect(result.unchanged).toEqual({ A: '1' });
  });

  test('empty envs produce empty result', () => {
    const result = compareEnv({}, {});
    expect(result.added).toEqual({});
    expect(result.removed).toEqual({});
    expect(result.changed).toEqual({});
    expect(result.unchanged).toEqual({});
  });

  test('identical envs have no changes', () => {
    const result = compareEnv(base, base);
    expect(result.added).toEqual({});
    expect(result.removed).toEqual({});
    expect(result.changed).toEqual({});
  });
});

describe('summarizeCompare', () => {
  test('returns correct counts', () => {
    const result = compareEnv(
      { A: '1', B: '2', C: '3' },
      { A: '1', B: '99', D: '4' }
    );
    const summary = summarizeCompare(result);
    expect(summary).toEqual({ added: 1, removed: 1, changed: 1, unchanged: 1 });
  });
});

describe('hasChanges', () => {
  test('returns true when there are differences', () => {
    const result = compareEnv({ A: '1' }, { A: '2' });
    expect(hasChanges(result)).toBe(true);
  });

  test('returns false when envs are identical', () => {
    const result = compareEnv({ A: '1' }, { A: '1' });
    expect(hasChanges(result)).toBe(false);
  });
});
