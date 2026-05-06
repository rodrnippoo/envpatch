const { createHistoryEntry, getChangedKeys, appendHistory, filterHistory, findLastChangeForKey } = require('./history');

const before = { DB_HOST: 'localhost', DB_PORT: '5432', SECRET: 'old' };
const after  = { DB_HOST: 'localhost', DB_PORT: '5433', SECRET: 'new', NEW_KEY: 'val' };

describe('getChangedKeys', () => {
  it('returns keys that differ', () => {
    const changed = getChangedKeys(before, after);
    expect(changed).toContain('DB_PORT');
    expect(changed).toContain('SECRET');
    expect(changed).toContain('NEW_KEY');
    expect(changed).not.toContain('DB_HOST');
  });

  it('returns empty array when envs are identical', () => {
    expect(getChangedKeys(before, before)).toEqual([]);
  });
});

describe('createHistoryEntry', () => {
  it('creates an entry with correct fields', () => {
    const entry = createHistoryEntry('merge', before, after, { source: 'test' });
    expect(entry.action).toBe('merge');
    expect(entry.addedKeys).toContain('NEW_KEY');
    expect(entry.removedKeys).toEqual([]);
    expect(entry.modifiedKeys).toContain('DB_PORT');
    expect(entry.modifiedKeys).toContain('SECRET');
    expect(entry.meta.source).toBe('test');
    expect(typeof entry.id).toBe('string');
    expect(typeof entry.timestamp).toBe('string');
  });

  it('detects removed keys', () => {
    const entry = createHistoryEntry('patch', after, before);
    expect(entry.removedKeys).toContain('NEW_KEY');
  });
});

describe('appendHistory', () => {
  it('appends without mutating original', () => {
    const log = [];
    const entry = createHistoryEntry('merge', before, after);
    const newLog = appendHistory(log, entry);
    expect(newLog).toHaveLength(1);
    expect(log).toHaveLength(0);
  });
});

describe('filterHistory', () => {
  it('returns only entries matching action', () => {
    const e1 = createHistoryEntry('merge', before, after);
    const e2 = createHistoryEntry('patch', after, before);
    const log = [e1, e2];
    expect(filterHistory(log, 'merge')).toEqual([e1]);
    expect(filterHistory(log, 'patch')).toEqual([e2]);
    expect(filterHistory(log, 'encrypt')).toEqual([]);
  });
});

describe('findLastChangeForKey', () => {
  it('finds the most recent entry for a key', () => {
    const e1 = createHistoryEntry('merge', before, after);
    const e2 = createHistoryEntry('patch', { DB_PORT: '5433' }, { DB_PORT: '5434' });
    const log = [e1, e2];
    expect(findLastChangeForKey(log, 'DB_PORT')).toBe(e2);
  });

  it('returns null when key has no history', () => {
    const log = [createHistoryEntry('merge', before, after)];
    expect(findLastChangeForKey(log, 'UNKNOWN')).toBeNull();
  });
});
