const { formatPromoteResult, formatPromoteSummary, formatPromoteHeader } = require('./formatPromote');

test('formatPromoteResult shows promoted keys', () => {
  const out = formatPromoteResult({
    promoted: [{ key: 'FOO', value: 'bar' }],
    skipped: [],
    missing: [],
  });
  expect(out).toContain('+ FOO=bar');
  expect(out).toContain('Promoted:');
});

test('formatPromoteResult shows skipped keys', () => {
  const out = formatPromoteResult({
    promoted: [],
    skipped: [{ key: 'API_URL', existing: 'dev', incoming: 'prod' }],
    missing: [],
  });
  expect(out).toContain('Skipped');
  expect(out).toContain('API_URL');
  expect(out).toContain('dev');
  expect(out).toContain('prod');
});

test('formatPromoteResult shows missing keys', () => {
  const out = formatPromoteResult({ promoted: [], skipped: [], missing: ['GHOST'] });
  expect(out).toContain('! GHOST');
});

test('formatPromoteResult returns nothing message when empty', () => {
  const out = formatPromoteResult({ promoted: [], skipped: [], missing: [] });
  expect(out).toBe('Nothing to promote.');
});

test('formatPromoteSummary formats counts', () => {
  const out = formatPromoteSummary({ promotedCount: 3, skippedCount: 1, missingCount: 0 });
  expect(out).toContain('3 promoted');
  expect(out).toContain('1 skipped');
  expect(out).not.toContain('missing');
});

test('formatPromoteSummary returns no changes when all zero', () => {
  const out = formatPromoteSummary({ promotedCount: 0, skippedCount: 0, missingCount: 0 });
  expect(out).toBe('No changes.');
});

test('formatPromoteHeader formats from/to', () => {
  const out = formatPromoteHeader('staging', 'production');
  expect(out).toContain('staging');
  expect(out).toContain('production');
  expect(out).toContain('→');
});
