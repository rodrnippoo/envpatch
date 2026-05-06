const { toTemplate, checkTemplate, formatTemplateCheck } = require('./template');

describe('toTemplate', () => {
  test('strips all values to empty strings', () => {
    const parsed = { DB_HOST: 'localhost', DB_PORT: '5432', SECRET: 'abc123' };
    const result = toTemplate(parsed);
    expect(result).toEqual({ DB_HOST: '', DB_PORT: '', SECRET: '' });
  });

  test('uses hints when provided', () => {
    const parsed = { DB_HOST: 'localhost', DB_PORT: '5432' };
    const hints = { DB_HOST: 'your-db-host', DB_PORT: '5432' };
    const result = toTemplate(parsed, hints);
    expect(result).toEqual({ DB_HOST: 'your-db-host', DB_PORT: '5432' });
  });

  test('partial hints — only hinted keys get values', () => {
    const parsed = { A: '1', B: '2', C: '3' };
    const result = toTemplate(parsed, { B: 'hint-for-b' });
    expect(result).toEqual({ A: '', B: 'hint-for-b', C: '' });
  });

  test('returns empty object for empty input', () => {
    expect(toTemplate({})).toEqual({});
  });
});

describe('checkTemplate', () => {
  test('returns empty arrays when env matches template exactly', () => {
    const template = { A: '', B: '', C: '' };
    const env = { A: '1', B: '2', C: '3' };
    expect(checkTemplate(template, env)).toEqual({ missing: [], extra: [] });
  });

  test('detects missing keys', () => {
    const template = { A: '', B: '', C: '' };
    const env = { A: '1' };
    const { missing, extra } = checkTemplate(template, env);
    expect(missing).toEqual(expect.arrayContaining(['B', 'C']));
    expect(extra).toEqual([]);
  });

  test('detects extra keys', () => {
    const template = { A: '' };
    const env = { A: '1', B: '2', EXTRA: '3' };
    const { missing, extra } = checkTemplate(template, env);
    expect(missing).toEqual([]);
    expect(extra).toEqual(expect.arrayContaining(['B', 'EXTRA']));
  });

  test('handles both missing and extra', () => {
    const template = { A: '', B: '' };
    const env = { A: '1', C: '3' };
    const result = checkTemplate(template, env);
    expect(result.missing).toContain('B');
    expect(result.extra).toContain('C');
  });
});

describe('formatTemplateCheck', () => {
  test('shows success message when no issues', () => {
    const output = formatTemplateCheck({ missing: [], extra: [] });
    expect(output).toBe('All required keys are present.');
  });

  test('lists missing keys with - prefix', () => {
    const output = formatTemplateCheck({ missing: ['FOO', 'BAR'], extra: [] });
    expect(output).toContain('Missing required keys:');
    expect(output).toContain('  - FOO');
    expect(output).toContain('  - BAR');
  });

  test('lists extra keys with + prefix', () => {
    const output = formatTemplateCheck({ missing: [], extra: ['EXTRA'] });
    expect(output).toContain('Extra keys not in template:');
    expect(output).toContain('  + EXTRA');
  });
});
