const { resolveChain, inheritMissing, inheritedKeys, inheritSummary } = require('./inherit');

describe('resolveChain', () => {
  it('returns empty object for empty array', () => {
    expect(resolveChain([])).toEqual({});
  });

  it('returns single env unchanged', () => {
    const env = { A: '1', B: '2' };
    expect(resolveChain([env])).toEqual(env);
  });

  it('later envs override earlier ones', () => {
    const base = { A: 'base', B: 'base' };
    const child = { A: 'child', C: 'child' };
    expect(resolveChain([base, child])).toEqual({ A: 'child', B: 'base', C: 'child' });
  });

  it('supports three-level chain', () => {
    const a = { X: '1', Y: '1' };
    const b = { Y: '2', Z: '2' };
    const c = { Z: '3', W: '3' };
    expect(resolveChain([a, b, c])).toEqual({ X: '1', Y: '2', Z: '3', W: '3' });
  });
});

describe('inheritMissing', () => {
  it('fills in missing keys from base', () => {
    const base = { A: '1', B: '2' };
    const child = { B: 'override', C: '3' };
    expect(inheritMissing(base, child)).toEqual({ A: '1', B: 'override', C: '3' });
  });

  it('does not modify child keys', () => {
    const base = { A: 'base' };
    const child = { A: 'child' };
    expect(inheritMissing(base, child)).toEqual({ A: 'child' });
  });

  it('returns child if base is empty', () => {
    expect(inheritMissing({}, { X: '1' })).toEqual({ X: '1' });
  });
});

describe('inheritedKeys', () => {
  it('returns keys present in base but not child', () => {
    const base = { A: '1', B: '2', C: '3' };
    const child = { B: 'x', D: 'y' };
    expect(inheritedKeys(base, child)).toEqual(['A', 'C']);
  });

  it('returns empty array when child has all base keys', () => {
    const base = { A: '1' };
    const child = { A: '2', B: '3' };
    expect(inheritedKeys(base, child)).toEqual([]);
  });
});

describe('inheritSummary', () => {
  it('returns correct summary', () => {
    const base = { A: '1', B: '2' };
    const child = { B: 'new', C: '3' };
    const summary = inheritSummary(base, child);
    expect(summary.inherited).toEqual(['A']);
    expect(summary.overridden).toEqual(['B']);
    expect(summary.added).toEqual(['C']);
    expect(summary.total).toBe(3);
  });
});
