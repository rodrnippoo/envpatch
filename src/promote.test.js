const { promoteKeys, promoteAll, promoteMissing, promoteSummary } = require('./promote');

const source = { API_URL: 'https://prod.example.com', SECRET: 'abc123', NEW_KEY: 'new' };
const target = { API_URL: 'https://dev.example.com', LOCAL: 'only-here' };

test('promoteKeys copies specified keys', () => {
  const { result, promoted } = promoteKeys(source, target, ['NEW_KEY'], { overwrite: false });
  expect(result.NEW_KEY).toBe('new');
  expect(result.LOCAL).toBe('only-here');
  expect(promoted).toHaveLength(1);
});

test('promoteKeys skips existing keys without overwrite', () => {
  const { skipped, result } = promoteKeys(source, target, ['API_URL'], { overwrite: false });
  expect(skipped).toHaveLength(1);
  expect(result.API_URL).toBe('https://dev.example.com');
});

test('promoteKeys overwrites when flag is set', () => {
  const { result, promoted } = promoteKeys(source, target, ['API_URL'], { overwrite: true });
  expect(result.API_URL).toBe('https://prod.example.com');
  expect(promoted).toHaveLength(1);
});

test('promoteKeys tracks missing keys', () => {
  const { missing } = promoteKeys(source, target, ['DOES_NOT_EXIST']);
  expect(missing).toContain('DOES_NOT_EXIST');
});

test('promoteAll promotes all source keys', () => {
  const { result } = promoteAll(source, {}, { overwrite: true });
  expect(result).toMatchObject(source);
});

test('promoteMissing only fills in missing keys', () => {
  const { result, promoted, skipped } = promoteMissing(source, target);
  expect(result.API_URL).toBe('https://dev.example.com');
  expect(result.SECRET).toBe('abc123');
  expect(promoted.map((p) => p.key)).toContain('SECRET');
  expect(skipped).toHaveLength(0);
});

test('promoteSummary returns correct counts', () => {
  const data = { promoted: [1, 2], skipped: [3], missing: [] };
  const summary = promoteSummary(data);
  expect(summary.promotedCount).toBe(2);
  expect(summary.skippedCount).toBe(1);
  expect(summary.missingCount).toBe(0);
});
