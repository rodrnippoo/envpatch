const { tagKeys, filterByTag, listTags, removeTag, tagSummary } = require('./tag');

const env = { DB_HOST: 'localhost', DB_PASS: 'secret', API_KEY: 'abc123', PORT: '3000' };
const tagMap = { DB_PASS: ['secret', 'db'], API_KEY: ['secret'], DB_HOST: ['db'] };

describe('tagKeys', () => {
  it('attaches tags to matching keys', () => {
    const result = tagKeys(env, tagMap);
    expect(result.DB_PASS.tags).toEqual(['secret', 'db']);
    expect(result.API_KEY.tags).toEqual(['secret']);
  });

  it('assigns empty tags to untagged keys', () => {
    const result = tagKeys(env, tagMap);
    expect(result.PORT.tags).toEqual([]);
  });

  it('preserves values', () => {
    const result = tagKeys(env, tagMap);
    expect(result.DB_HOST.value).toBe('localhost');
  });
});

describe('filterByTag', () => {
  it('returns only keys with the given tag', () => {
    const tagged = tagKeys(env, tagMap);
    const result = filterByTag(tagged, 'secret');
    expect(Object.keys(result).sort()).toEqual(['API_KEY', 'DB_PASS']);
  });

  it('returns plain key/value pairs', () => {
    const tagged = tagKeys(env, tagMap);
    const result = filterByTag(tagged, 'db');
    expect(result.DB_HOST).toBe('localhost');
  });

  it('returns empty object if no keys match', () => {
    const tagged = tagKeys(env, tagMap);
    expect(filterByTag(tagged, 'nonexistent')).toEqual({});
  });
});

describe('listTags', () => {
  it('returns sorted unique tags', () => {
    const tagged = tagKeys(env, tagMap);
    expect(listTags(tagged)).toEqual(['db', 'secret']);
  });

  it('returns empty array if no tags', () => {
    const tagged = tagKeys(env, {});
    expect(listTags(tagged)).toEqual([]);
  });
});

describe('removeTag', () => {
  it('removes the specified tag from all keys', () => {
    const tagged = tagKeys(env, tagMap);
    const result = removeTag(tagged, 'secret');
    expect(result.DB_PASS.tags).toEqual(['db']);
    expect(result.API_KEY.tags).toEqual([]);
  });

  it('does not affect keys without the tag', () => {
    const tagged = tagKeys(env, tagMap);
    const result = removeTag(tagged, 'secret');
    expect(result.DB_HOST.tags).toEqual(['db']);
  });
});

describe('tagSummary', () => {
  it('counts total and tagged keys', () => {
    const tagged = tagKeys(env, tagMap);
    const summary = tagSummary(tagged);
    expect(summary.totalKeys).toBe(4);
    expect(summary.taggedKeys).toBe(3);
  });

  it('counts tag occurrences', () => {
    const tagged = tagKeys(env, tagMap);
    const summary = tagSummary(tagged);
    expect(summary.tags.secret).toBe(2);
    expect(summary.tags.db).toBe(2);
  });
});
