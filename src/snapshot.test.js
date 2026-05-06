const { createSnapshot, hashEnv, compareSnapshots } = require('./snapshot');

describe('hashEnv', () => {
  test('returns consistent hash for same env', () => {
    const env = { FOO: 'bar', BAZ: 'qux' };
    expect(hashEnv(env)).toBe(hashEnv(env));
  });

  test('hash is order-independent', () => {
    const a = { FOO: '1', BAR: '2' };
    const b = { BAR: '2', FOO: '1' };
    expect(hashEnv(a)).toBe(hashEnv(b));
  });

  test('different values produce different hashes', () => {
    expect(hashEnv({ FOO: 'a' })).not.toBe(hashEnv({ FOO: 'b' }));
  });

  test('returns 16 char hex string', () => {
    expect(hashEnv({ X: '1' })).toMatch(/^[0-9a-f]{16}$/);
  });
});

describe('createSnapshot', () => {
  test('captures keys, hash, and timestamp', () => {
    const env = { PORT: '3000', HOST: 'localhost' };
    const snap = createSnapshot(env, 'v1');
    expect(snap.label).toBe('v1');
    expect(snap.keys).toEqual(['HOST', 'PORT']);
    expect(snap.hash).toMatch(/^[0-9a-f]{16}$/);
    expect(snap.timestamp).toBeTruthy();
    expect(snap.env).toEqual(env);
  });

  test('label defaults to empty string', () => {
    const snap = createSnapshot({ A: '1' });
    expect(snap.label).toBe('');
  });

  test('env is a copy, not reference', () => {
    const env = { A: '1' };
    const snap = createSnapshot(env);
    env.A = 'mutated';
    expect(snap.env.A).toBe('1');
  });
});

describe('compareSnapshots', () => {
  const before = createSnapshot({ A: '1', B: '2', C: '3' }, 'before');
  const after = createSnapshot({ A: '1', B: 'changed', D: '4' }, 'after');

  test('detects added keys', () => {
    const result = compareSnapshots(before, after);
    expect(result.added).toEqual(['D']);
  });

  test('detects removed keys', () => {
    const result = compareSnapshots(before, after);
    expect(result.removed).toEqual(['C']);
  });

  test('detects changed keys', () => {
    const result = compareSnapshots(before, after);
    expect(result.changed).toEqual(['B']);
  });

  test('detects unchanged keys', () => {
    const result = compareSnapshots(before, after);
    expect(result.unchanged).toEqual(['A']);
  });

  test('hasChanges is true when there are differences', () => {
    expect(compareSnapshots(before, after).hasChanges).toBe(true);
  });

  test('hasChanges is false for identical snapshots', () => {
    const snap = createSnapshot({ A: '1' });
    expect(compareSnapshots(snap, snap).hasChanges).toBe(false);
  });
});
