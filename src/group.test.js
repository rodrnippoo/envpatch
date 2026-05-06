const { groupByPrefix, flattenGroups, listPrefixes } = require('./group');

describe('groupByPrefix', () => {
  test('groups keys by prefix', () => {
    const env = { DB_HOST: 'localhost', DB_PORT: '5432', APP_NAME: 'test' };
    const result = groupByPrefix(env);
    expect(result).toEqual({
      DB: { HOST: 'localhost', PORT: '5432' },
      APP: { NAME: 'test' },
    });
  });

  test('places keys without separator into __ungrouped__', () => {
    const env = { PORT: '3000', DB_HOST: 'localhost' };
    const result = groupByPrefix(env);
    expect(result.__ungrouped__).toEqual({ PORT: '3000' });
    expect(result.DB).toEqual({ HOST: 'localhost' });
  });

  test('handles empty env', () => {
    expect(groupByPrefix({})).toEqual({});
  });

  test('uses custom separator', () => {
    const env = { 'DB.HOST': 'localhost', 'DB.PORT': '5432' };
    const result = groupByPrefix(env, '.');
    expect(result).toEqual({ DB: { HOST: 'localhost', PORT: '5432' } });
  });

  test('only splits on first separator occurrence', () => {
    const env = { DB_PRIMARY_HOST: 'localhost' };
    const result = groupByPrefix(env);
    expect(result.DB).toEqual({ PRIMARY_HOST: 'localhost' });
  });
});

describe('flattenGroups', () => {
  test('flattens grouped env back to flat record', () => {
    const groups = { DB: { HOST: 'localhost', PORT: '5432' }, APP: { NAME: 'test' } };
    const result = flattenGroups(groups);
    expect(result).toEqual({ DB_HOST: 'localhost', DB_PORT: '5432', APP_NAME: 'test' });
  });

  test('handles __ungrouped__ keys', () => {
    const groups = { __ungrouped__: { PORT: '3000' }, DB: { HOST: 'localhost' } };
    const result = flattenGroups(groups);
    expect(result).toEqual({ PORT: '3000', DB_HOST: 'localhost' });
  });

  test('roundtrip groupByPrefix -> flattenGroups', () => {
    const env = { DB_HOST: 'localhost', DB_PORT: '5432', PORT: '3000' };
    expect(flattenGroups(groupByPrefix(env))).toEqual(env);
  });
});

describe('listPrefixes', () => {
  test('returns sorted unique prefixes', () => {
    const env = { DB_HOST: 'x', DB_PORT: 'y', APP_NAME: 'z', PORT: '3000' };
    expect(listPrefixes(env)).toEqual(['APP', 'DB']);
  });

  test('returns empty array when no prefixed keys', () => {
    expect(listPrefixes({ PORT: '3000' })).toEqual([]);
  });

  test('handles empty env', () => {
    expect(listPrefixes({})).toEqual([]);
  });
});
