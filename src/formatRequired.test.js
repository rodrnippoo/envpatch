import { formatRequiredEntry, formatRequiredCheck, formatRequiredSummary } from './formatRequired.js';

describe('formatRequiredEntry', () => {
  it('formats a present entry', () => {
    const result = formatRequiredEntry({ key: 'API_KEY', present: true, value: 'abc123' });
    expect(result).toContain('✔');
    expect(result).toContain('API_KEY');
    expect(result).toContain('abc123');
  });

  it('formats a missing entry', () => {
    const result = formatRequiredEntry({ key: 'SECRET', present: false, value: undefined });
    expect(result).toContain('✘');
    expect(result).toContain('SECRET');
    expect(result).toContain('MISSING');
  });
});

describe('formatRequiredCheck', () => {
  it('shows all present when env is complete', () => {
    const env = { A: '1', B: '2' };
    const result = formatRequiredCheck(env, ['A', 'B']);
    expect(result).toContain('All required keys are present.');
    expect(result).toContain('✔ A');
    expect(result).toContain('✔ B');
  });

  it('shows missing keys when env is incomplete', () => {
    const env = { A: '1' };
    const result = formatRequiredCheck(env, ['A', 'B']);
    expect(result).toContain('1 required key(s) missing');
    expect(result).toContain('B');
    expect(result).toContain('✘ B');
  });

  it('includes the total key count in header', () => {
    const result = formatRequiredCheck({}, ['X', 'Y']);
    expect(result).toContain('2 keys');
  });
});

describe('formatRequiredSummary', () => {
  it('returns success message when nothing missing', () => {
    expect(formatRequiredSummary([], 4)).toBe('All 4 required key(s) satisfied.');
  });

  it('returns failure message listing missing keys', () => {
    const result = formatRequiredSummary(['FOO', 'BAR'], 5);
    expect(result).toContain('Missing 2/5');
    expect(result).toContain('FOO');
    expect(result).toContain('BAR');
  });
});
