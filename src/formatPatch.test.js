const { formatPatch } = require('./formatPatch');

const samplePatch = [
  { key: 'HOST', type: 'added', newValue: 'localhost' },
  { key: 'OLD_KEY', type: 'removed', oldValue: 'gone' },
  { key: 'PORT', type: 'changed', oldValue: '3000', newValue: '8080' },
];

describe('formatPatch', () => {
  test('returns no-changes message for empty patch', () => {
    expect(formatPatch([])).toBe('(no changes)');
  });

  test('formats added entry with + symbol', () => {
    const out = formatPatch([samplePatch[0]]);
    expect(out).toContain('+ HOST=localhost');
  });

  test('formats removed entry with - symbol', () => {
    const out = formatPatch([samplePatch[1]]);
    expect(out).toContain('- OLD_KEY=gone');
  });

  test('formats changed entry with ~ symbol and arrow', () => {
    const out = formatPatch([samplePatch[2]]);
    expect(out).toContain('~ PORT: 3000 -> 8080');
  });

  test('formats multiple entries separated by newlines', () => {
    const out = formatPatch(samplePatch);
    const lines = out.split('\n');
    expect(lines).toHaveLength(3);
  });

  test('includes ANSI codes when color option is true', () => {
    const out = formatPatch([samplePatch[0]], { color: true });
    expect(out).toContain('\x1b[32m');
    expect(out).toContain('\x1b[0m');
  });

  test('no ANSI codes by default', () => {
    const out = formatPatch(samplePatch);
    expect(out).not.toContain('\x1b[');
  });
});
