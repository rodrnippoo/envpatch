const { formatConflictEntry, formatConflicts } = require('./formatConflict');

const entry = { ours: '3000', theirs: '4000' };

describe('formatConflictEntry', () => {
  test('renders plain conflict block', () => {
    const output = formatConflictEntry('PORT', entry);
    expect(output).toContain('<<<<<<< ours');
    expect(output).toContain('PORT=3000');
    expect(output).toContain('=======');
    expect(output).toContain('PORT=4000');
    expect(output).toContain('>>>>>>> theirs');
  });

  test('renders colored conflict block', () => {
    const output = formatConflictEntry('PORT', entry, { color: true });
    expect(output).toContain('\x1b[32m');
    expect(output).toContain('\x1b[31m');
    expect(output).toContain('PORT=3000');
    expect(output).toContain('PORT=4000');
  });
});

describe('formatConflicts', () => {
  const merged = {
    HOST: { conflict: false, value: 'localhost' },
    PORT: { conflict: true, ours: '3000', theirs: '4000' },
    SECRET: { conflict: true, ours: 'abc', theirs: 'xyz' },
  };

  test('returns empty string when no conflicts', () => {
    const clean = { HOST: { conflict: false, value: 'localhost' } };
    expect(formatConflicts(clean)).toBe('');
  });

  test('formats all conflicting entries', () => {
    const output = formatConflicts(merged);
    expect(output).toContain('PORT=3000');
    expect(output).toContain('PORT=4000');
    expect(output).toContain('SECRET=abc');
    expect(output).toContain('SECRET=xyz');
  });

  test('separates multiple conflicts with blank line', () => {
    const output = formatConflicts(merged);
    expect(output).toContain('\n\n');
  });
});
