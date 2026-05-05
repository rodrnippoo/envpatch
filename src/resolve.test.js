const { resolve, getConflicts } = require('./resolve');

const mergedWithConflicts = {
  HOST: { conflict: false, value: 'localhost' },
  PORT: { conflict: true, ours: '3000', theirs: '4000' },
  SECRET: { conflict: true, ours: 'abc', theirs: 'xyz' },
};

const mergedClean = {
  HOST: { conflict: false, value: 'localhost' },
  PORT: { conflict: false, value: '3000' },
};

describe('resolve', () => {
  test('ours strategy picks ours values for conflicts', async () => {
    const result = await resolve(mergedWithConflicts, 'ours');
    expect(result).toEqual({ HOST: 'localhost', PORT: '3000', SECRET: 'abc' });
  });

  test('theirs strategy picks theirs values for conflicts', async () => {
    const result = await resolve(mergedWithConflicts, 'theirs');
    expect(result).toEqual({ HOST: 'localhost', PORT: '4000', SECRET: 'xyz' });
  });

  test('interactive strategy calls resolver for each conflict', async () => {
    const resolver = jest.fn(async (key, ours, theirs) => `${ours}+${theirs}`);
    const result = await resolve(mergedWithConflicts, 'interactive', resolver);
    expect(resolver).toHaveBeenCalledTimes(2);
    expect(result.PORT).toBe('3000+4000');
    expect(result.SECRET).toBe('abc+xyz');
    expect(result.HOST).toBe('localhost');
  });

  test('interactive strategy throws if no resolver provided', async () => {
    await expect(resolve(mergedWithConflicts, 'interactive')).rejects.toThrow(
      'interactive strategy requires a resolver function'
    );
  });

  test('throws on unknown strategy', async () => {
    await expect(resolve(mergedWithConflicts, 'magic')).rejects.toThrow(
      'Unknown resolution strategy'
    );
  });

  test('resolves cleanly when no conflicts exist', async () => {
    const result = await resolve(mergedClean, 'ours');
    expect(result).toEqual({ HOST: 'localhost', PORT: '3000' });
  });
});

describe('getConflicts', () => {
  test('returns only conflicting entries', () => {
    const conflicts = getConflicts(mergedWithConflicts);
    expect(Object.keys(conflicts)).toEqual(['PORT', 'SECRET']);
    expect(conflicts.HOST).toBeUndefined();
  });

  test('returns empty object when no conflicts', () => {
    expect(getConflicts(mergedClean)).toEqual({});
  });
});
