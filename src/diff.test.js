const { diff, hasDifferences } = require('./diff');

describe('diff', () => {
  const base = { API_URL: 'http://localhost', DB_PASS: 'secret', PORT: '3000' };
  const next = { API_URL: 'https://prod.example.com', PORT: '3000', NEW_KEY: 'hello' };

  let changes;
  beforeEach(() => {
    changes = diff(base, next);
  });

  test('detects removed keys', () => {
    const removed = changes.filter((c) => c.type === 'removed');
    expect(removed).toHaveLength(1);
    expect(removed[0].key).toBe('DB_PASS');
    expect(removed[0].oldValue).toBe('secret');
  });

  test('detects added keys', () => {
    const added = changes.filter((c) => c.type === 'added');
    expect(added).toHaveLength(1);
    expect(added[0].key).toBe('NEW_KEY');
    expect(added[0].newValue).toBe('hello');
  });

  test('detects modified keys', () => {
    const modified = changes.filter((c) => c.type === 'modified');
    expect(modified).toHaveLength(1);
    expect(modified[0].key).toBe('API_URL');
    expect(modified[0].oldValue).toBe('http://localhost');
    expect(modified[0].newValue).toBe('https://prod.example.com');
  });

  test('detects unchanged keys', () => {
    const unchanged = changes.filter((c) => c.type === 'unchanged');
    expect(unchanged).toHaveLength(1);
    expect(unchanged[0].key).toBe('PORT');
  });

  test('returns keys in sorted order', () => {
    const keys = changes.map((c) => c.key);
    expect(keys).toEqual([...keys].sort());
  });

  test('hasDifferences returns true when changes exist', () => {
    expect(hasDifferences(changes)).toBe(true);
  });

  test('hasDifferences returns false when all unchanged', () => {
    const same = diff({ A: '1' }, { A: '1' });
    expect(hasDifferences(same)).toBe(false);
  });

  test('empty base vs populated next marks all as added', () => {
    const result = diff({}, { X: '1', Y: '2' });
    expect(result.every((c) => c.type === 'added')).toBe(true);
  });

  test('populated base vs empty next marks all as removed', () => {
    const result = diff({ X: '1', Y: '2' }, {});
    expect(result.every((c) => c.type === 'removed')).toBe(true);
  });
});
