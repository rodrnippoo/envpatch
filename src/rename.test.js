const { renameKey, renameKeys } = require('./rename');

describe('renameKey', () => {
  test('renames an existing key', () => {
    const env = { FOO: 'bar', BAZ: 'qux' };
    const { result, renamed } = renameKey(env, 'FOO', 'FOO_NEW');
    expect(renamed).toBe(true);
    expect(result).toEqual({ FOO_NEW: 'bar', BAZ: 'qux' });
    expect(result).not.toHaveProperty('FOO');
  });

  test('preserves insertion order', () => {
    const env = { A: '1', B: '2', C: '3' };
    const { result } = renameKey(env, 'B', 'B2');
    expect(Object.keys(result)).toEqual(['A', 'B2', 'C']);
  });

  test('returns renamed=false when key does not exist', () => {
    const env = { FOO: 'bar' };
    const { result, renamed } = renameKey(env, 'MISSING', 'NEW');
    expect(renamed).toBe(false);
    expect(result).toEqual({ FOO: 'bar' });
  });

  test('returns renamed=false when old and new key are the same', () => {
    const env = { FOO: 'bar' };
    const { result, renamed } = renameKey(env, 'FOO', 'FOO');
    expect(renamed).toBe(false);
    expect(result).toEqual({ FOO: 'bar' });
  });

  test('does not mutate original env', () => {
    const env = { FOO: 'bar' };
    renameKey(env, 'FOO', 'FOO2');
    expect(env).toEqual({ FOO: 'bar' });
  });
});

describe('renameKeys', () => {
  test('applies multiple renames', () => {
    const env = { A: '1', B: '2', C: '3' };
    const { result, applied, skipped } = renameKeys(env, { A: 'A2', C: 'C2' });
    expect(result).toEqual({ A2: '1', B: '2', C2: '3' });
    expect(applied).toEqual([{ from: 'A', to: 'A2' }, { from: 'C', to: 'C2' }]);
    expect(skipped).toHaveLength(0);
  });

  test('skips missing keys', () => {
    const env = { A: '1' };
    const { applied, skipped } = renameKeys(env, { MISSING: 'NEW' });
    expect(applied).toHaveLength(0);
    expect(skipped[0]).toMatchObject({ from: 'MISSING', to: 'NEW', reason: 'key not found' });
  });

  test('skips when target key already exists', () => {
    const env = { A: '1', B: '2' };
    const { result, skipped } = renameKeys(env, { A: 'B' });
    expect(result).toEqual({ A: '1', B: '2' });
    expect(skipped[0].reason).toMatch(/already exists/);
  });

  test('skips same-key renames', () => {
    const env = { A: '1' };
    const { skipped } = renameKeys(env, { A: 'A' });
    expect(skipped[0].reason).toBe('same key');
  });

  test('does not mutate original env', () => {
    const env = { A: '1' };
    renameKeys(env, { A: 'A2' });
    expect(env).toEqual({ A: '1' });
  });
});
