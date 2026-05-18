const { formatTagEntry, formatTagGroups, formatTagSummary } = require('./formatTag');
const { tagKeys } = require('./tag');

const env = { DB_HOST: 'localhost', DB_PASS: 'secret', API_KEY: 'abc', PORT: '3000' };
const tagMap = { DB_PASS: ['sensitive', 'db'], API_KEY: ['sensitive'], DB_HOST: ['db'] };

describe('formatTagEntry', () => {
  it('includes tags in brackets', () => {
    const entry = { value: 'secret', tags: ['sensitive', 'db'] };
    expect(formatTagEntry('DB_PASS', entry)).toBe('DB_PASS=secret [sensitive, db]');
  });

  it('omits brackets when no tags', () => {
    const entry = { value: '3000', tags: [] };
    expect(formatTagEntry('PORT', entry)).toBe('PORT=3000');
  });
});

describe('formatTagGroups', () => {
  it('groups keys under their tags', () => {
    const tagged = tagKeys(env, tagMap);
    const output = formatTagGroups(tagged);
    expect(output).toContain('[db]');
    expect(output).toContain('[sensitive]');
    expect(output).toContain('  DB_HOST');
    expect(output).toContain('  API_KEY');
  });

  it('returns fallback message when no tags', () => {
    const tagged = tagKeys(env, {});
    expect(formatTagGroups(tagged)).toBe('(no tags defined)');
  });
});

describe('formatTagSummary', () => {
  it('shows total and tagged key counts', () => {
    const summary = { totalKeys: 4, taggedKeys: 3, tags: { sensitive: 2, db: 2 } };
    const output = formatTagSummary(summary);
    expect(output).toContain('Keys: 4 total, 3 tagged');
  });

  it('lists each tag with count', () => {
    const summary = { totalKeys: 4, taggedKeys: 3, tags: { sensitive: 2, db: 2 } };
    const output = formatTagSummary(summary);
    expect(output).toContain('sensitive: 2 keys');
    expect(output).toContain('db: 2 keys');
  });

  it('handles singular key count', () => {
    const summary = { totalKeys: 1, taggedKeys: 1, tags: { special: 1 } };
    expect(formatTagSummary(summary)).toContain('special: 1 key');
  });

  it('shows no tags message when empty', () => {
    const summary = { totalKeys: 2, taggedKeys: 0, tags: {} };
    expect(formatTagSummary(summary)).toContain('No tags found.');
  });
});
