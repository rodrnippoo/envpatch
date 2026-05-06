const { createAuditEntry, formatAuditLog } = require('./audit');

describe('createAuditEntry', () => {
  const before = { FOO: 'bar', OLD: 'value' };
  const after = { FOO: 'baz', NEW: 'thing' };

  test('detects added keys', () => {
    const entry = createAuditEntry('merge', before, after);
    expect(entry.summary.added).toEqual(['NEW']);
  });

  test('detects removed keys', () => {
    const entry = createAuditEntry('merge', before, after);
    expect(entry.summary.removed).toEqual(['OLD']);
  });

  test('detects changed keys', () => {
    const entry = createAuditEntry('merge', before, after);
    expect(entry.summary.changed).toEqual(['FOO']);
  });

  test('records operation name', () => {
    const entry = createAuditEntry('patch', before, after);
    expect(entry.operation).toBe('patch');
  });

  test('uses provided timestamp from meta', () => {
    const entry = createAuditEntry('merge', before, after, { timestamp: '2024-01-01T00:00:00.000Z' });
    expect(entry.timestamp).toBe('2024-01-01T00:00:00.000Z');
  });

  test('records user from meta', () => {
    const entry = createAuditEntry('encrypt', before, after, { user: 'alice' });
    expect(entry.user).toBe('alice');
  });

  test('null user when not provided', () => {
    const entry = createAuditEntry('merge', before, after);
    expect(entry.user).toBeNull();
  });

  test('reports totalKeys from after', () => {
    const entry = createAuditEntry('merge', before, after);
    expect(entry.totalKeys).toBe(2);
  });

  test('no changes when before equals after', () => {
    const same = { FOO: 'bar' };
    const entry = createAuditEntry('merge', same, { ...same });
    expect(entry.summary.added).toHaveLength(0);
    expect(entry.summary.removed).toHaveLength(0);
    expect(entry.summary.changed).toHaveLength(0);
  });
});

describe('formatAuditLog', () => {
  test('returns placeholder for empty log', () => {
    expect(formatAuditLog([])).toBe('(no audit entries)');
  });

  test('includes operation and timestamp', () => {
    const entry = createAuditEntry('patch', {}, { FOO: 'bar' }, { timestamp: '2024-06-01T12:00:00.000Z' });
    const log = formatAuditLog([entry]);
    expect(log).toContain('[2024-06-01T12:00:00.000Z] patch');
  });

  test('lists added keys', () => {
    const entry = createAuditEntry('merge', {}, { A: '1', B: '2' }, { timestamp: 't' });
    const log = formatAuditLog([entry]);
    expect(log).toContain('+ added:');
  });

  test('shows no changes message when nothing changed', () => {
    const entry = createAuditEntry('merge', { X: '1' }, { X: '1' }, { timestamp: 't' });
    const log = formatAuditLog([entry]);
    expect(log).toContain('(no changes)');
  });

  test('includes user when present', () => {
    const entry = createAuditEntry('encrypt', {}, {}, { user: 'bob', timestamp: 't' });
    const log = formatAuditLog([entry]);
    expect(log).toContain('by bob');
  });

  test('formats multiple entries separated by blank line', () => {
    const e1 = createAuditEntry('merge', {}, { A: '1' }, { timestamp: 't1' });
    const e2 = createAuditEntry('patch', { A: '1' }, { A: '2' }, { timestamp: 't2' });
    const log = formatAuditLog([e1, e2]);
    expect(log.split('\n\n')).toHaveLength(2);
  });
});
