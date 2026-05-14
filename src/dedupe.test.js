const { findDuplicateKeys, dedupeEntries, dedupeEnv, dedupeMany, dedupeSummary } = require('./dedupe');

describe('findDuplicateKeys', () => {
  it('returns empty array when no duplicates', () => {
    expect(findDuplicateKeys(['A', 'B', 'C'])).toEqual([]);
  });

  it('returns duplicated keys', () => {
    const result = findDuplicateKeys(['A', 'B', 'A', 'C', 'B']);
    expect(result).toContain('A');
    expect(result).toContain('B');
    expect(result).toHaveLength(2);
  });

  it('handles empty array', () => {
    expect(findDuplicateKeys([])).toEqual([]);
  });
});

describe('dedupeEntries', () => {
  const entries = [
    { key: 'FOO', value: 'first' },
    { key: 'BAR', value: 'bar' },
    { key: 'FOO', value: 'second' },
  ];

  it('keeps last occurrence by default', () => {
    const { result, duplicates } = dedupeEntries(entries);
    expect(result.FOO).toBe('second');
    expect(result.BAR).toBe('bar');
    expect(duplicates).toContain('FOO');
  });

  it('keeps first occurrence when strategy is first', () => {
    const { result } = dedupeEntries(entries, 'first');
    expect(result.FOO).toBe('first');
  });

  it('reports no duplicates for unique entries', () => {
    const { duplicates } = dedupeEntries([{ key: 'A', value: '1' }]);
    expect(duplicates).toEqual([]);
  });
});

describe('dedupeEnv', () => {
  it('returns a copy of the env with no duplicates reported', () => {
    const env = { A: '1', B: '2' };
    const { result, duplicates } = dedupeEnv(env);
    expect(result).toEqual(env);
    expect(result).not.toBe(env);
    expect(duplicates).toEqual([]);
  });
});

describe('dedupeMany', () => {
  it('merges envs with later values winning', () => {
    const { result } = dedupeMany([{ A: '1', B: '2' }, { A: '99', C: '3' }]);
    expect(result).toEqual({ A: '99', B: '2', C: '3' });
  });

  it('reports keys that appear in multiple envs', () => {
    const { duplicates } = dedupeMany([{ A: '1' }, { A: '2' }]);
    expect(duplicates).toContain('A');
  });

  it('handles single env', () => {
    const { result, duplicates } = dedupeMany([{ X: 'x' }]);
    expect(result).toEqual({ X: 'x' });
    expect(duplicates).toEqual([]);
  });
});

describe('dedupeSummary', () => {
  it('marks clean when no duplicates', () => {
    const summary = dedupeSummary([]);
    expect(summary.clean).toBe(true);
    expect(summary.totalDuplicates).toBe(0);
  });

  it('reports count and keys when duplicates exist', () => {
    const summary = dedupeSummary(['FOO', 'BAR']);
    expect(summary.clean).toBe(false);
    expect(summary.totalDuplicates).toBe(2);
    expect(summary.keys).toEqual(['FOO', 'BAR']);
  });
});
