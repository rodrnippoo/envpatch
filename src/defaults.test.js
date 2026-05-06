const { applyDefaults, missingKeys, isComplete } = require('./defaults');

describe('applyDefaults', () => {
  it('fills missing keys from defaults', () => {
    const target = { A: '1' };
    const defaults = { A: 'default_a', B: 'default_b' };
    expect(applyDefaults(target, defaults)).toEqual({ A: '1', B: 'default_b' });
  });

  it('does not overwrite existing non-empty values', () => {
    const target = { A: 'existing' };
    const defaults = { A: 'default_a' };
    expect(applyDefaults(target, defaults)).toEqual({ A: 'existing' });
  });

  it('does not overwrite empty values by default', () => {
    const target = { A: '' };
    const defaults = { A: 'default_a' };
    expect(applyDefaults(target, defaults)).toEqual({ A: '' });
  });

  it('overwrites empty values when overwriteEmpty is true', () => {
    const target = { A: '' };
    const defaults = { A: 'default_a' };
    expect(applyDefaults(target, defaults, { overwriteEmpty: true })).toEqual({ A: 'default_a' });
  });

  it('returns a new object and does not mutate target', () => {
    const target = { A: '1' };
    const defaults = { B: '2' };
    const result = applyDefaults(target, defaults);
    expect(result).not.toBe(target);
    expect(target).toEqual({ A: '1' });
  });

  it('handles empty defaults gracefully', () => {
    const target = { A: '1' };
    expect(applyDefaults(target, {})).toEqual({ A: '1' });
  });
});

describe('missingKeys', () => {
  it('returns keys present in defaults but not in target', () => {
    expect(missingKeys({ A: '1' }, { A: 'x', B: 'y', C: 'z' })).toEqual(['B', 'C']);
  });

  it('returns empty array when target has all keys', () => {
    expect(missingKeys({ A: '1', B: '2' }, { A: 'x', B: 'y' })).toEqual([]);
  });

  it('includes empty keys when overwriteEmpty is true', () => {
    const result = missingKeys({ A: '' }, { A: 'x' }, { overwriteEmpty: true });
    expect(result).toEqual(['A']);
  });
});

describe('isComplete', () => {
  it('returns true when all default keys are in target', () => {
    expect(isComplete({ A: '1', B: '2' }, { A: 'x', B: 'y' })).toBe(true);
  });

  it('returns false when a default key is missing from target', () => {
    expect(isComplete({ A: '1' }, { A: 'x', B: 'y' })).toBe(false);
  });

  it('returns true for empty defaults', () => {
    expect(isComplete({}, {})).toBe(true);
  });
});
