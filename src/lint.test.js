const { lint, formatLintResults } = require('./lint');

describe('lint', () => {
  test('returns empty array for valid content', () => {
    const raw = 'APP_NAME=myapp\nDEBUG=false\nPORT=3000\n';
    expect(lint(raw)).toEqual([]);
  });

  test('E001 – missing equals sign', () => {
    const issues = lint('BROKEN_LINE\n');
    expect(issues).toHaveLength(1);
    expect(issues[0].code).toBe('E001');
    expect(issues[0].line).toBe(1);
  });

  test('W001 – lowercase key', () => {
    const issues = lint('lowercase_key=value\n');
    expect(issues.some(i => i.code === 'W001')).toBe(true);
  });

  test('E002 – duplicate key', () => {
    const raw = 'API_KEY=abc\nAPI_KEY=xyz\n';
    const issues = lint(raw);
    expect(issues.some(i => i.code === 'E002')).toBe(true);
    const dup = issues.find(i => i.code === 'E002');
    expect(dup.line).toBe(2);
    expect(dup.message).toContain('line 1');
  });

  test('W002 – trailing whitespace in value', () => {
    const issues = lint('SECRET=abc   \n');
    expect(issues.some(i => i.code === 'W002')).toBe(true);
  });

  test('W003 – unbalanced quotes', () => {
    const issues = lint('MSG="hello world\n');
    expect(issues.some(i => i.code === 'W003')).toBe(true);
  });

  test('W004 – multiple consecutive blank lines', () => {
    const raw = 'A=1\n\n\n\nB=2\n';
    const issues = lint(raw);
    expect(issues.some(i => i.code === 'W004')).toBe(true);
  });

  test('ignores comment lines', () => {
    const raw = '# this is a comment\nVALID=true\n';
    expect(lint(raw)).toEqual([]);
  });

  test('ignores blank lines', () => {
    const raw = 'A=1\n\nB=2\n';
    expect(lint(raw)).toEqual([]);
  });
});

describe('formatLintResults', () => {
  test('no issues message', () => {
    expect(formatLintResults([])).toBe('No issues found.');
  });

  test('formats single issue', () => {
    const issues = [{ line: 3, code: 'E001', message: 'Missing "=" in assignment' }];
    const out = formatLintResults(issues);
    expect(out).toContain('1 issue found.');
    expect(out).toContain('[E001]');
    expect(out).toContain('line 3');
  });

  test('formats multiple issues', () => {
    const issues = [
      { line: 1, code: 'W001', message: 'Key should be uppercase' },
      { line: 2, code: 'E002', message: 'Duplicate key' },
    ];
    const out = formatLintResults(issues);
    expect(out).toContain('2 issues found.');
  });

  test('formats file-level issue with null line', () => {
    const issues = [{ line: null, code: 'W004', message: 'Multiple consecutive blank lines' }];
    const out = formatLintResults(issues);
    expect(out).toContain('file:');
  });
});
