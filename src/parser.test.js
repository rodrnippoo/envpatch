const { parse, serialize } = require('./parser');

describe('parse()', () => {
  test('parses simple key=value pairs', () => {
    const result = parse('FOO=bar\nBAZ=qux\n');
    expect(result.get('FOO')).toBe('bar');
    expect(result.get('BAZ')).toBe('qux');
  });

  test('ignores blank lines and comments', () => {
    const content = `# this is a comment\n\nFOO=bar\n`;
    const result = parse(content);
    expect(result.size).toBe(1);
    expect(result.get('FOO')).toBe('bar');
  });

  test('strips double-quoted values', () => {
    const result = parse('FOO="hello world"\n');
    expect(result.get('FOO')).toBe('hello world');
  });

  test('strips single-quoted values', () => {
    const result = parse("FOO='hello world'\n");
    expect(result.get('FOO')).toBe('hello world');
  });

  test('strips inline comments from unquoted values', () => {
    const result = parse('FOO=bar # this is inline\n');
    expect(result.get('FOO')).toBe('bar');
  });

  test('does not strip inline comments from quoted values', () => {
    const result = parse('FOO="bar # not a comment"\n');
    expect(result.get('FOO')).toBe('bar # not a comment');
  });

  test('skips lines without = sign', () => {
    const result = parse('INVALID_LINE\nFOO=bar\n');
    expect(result.size).toBe(1);
  });

  test('handles Windows-style CRLF line endings', () => {
    const result = parse('FOO=bar\r\nBAZ=qux\r\n');
    expect(result.get('FOO')).toBe('bar');
    expect(result.get('BAZ')).toBe('qux');
  });
});

describe('serialize()', () => {
  test('serializes a map to .env format', () => {
    const map = new Map([['FOO', 'bar'], ['BAZ', 'qux']]);
    const result = serialize(map);
    expect(result).toContain('FOO=bar');
    expect(result).toContain('BAZ=qux');
  });

  test('quotes values with spaces', () => {
    const map = new Map([['FOO', 'hello world']]);
    const result = serialize(map);
    expect(result).toContain('FOO="hello world"');
  });

  test('quotes values containing #', () => {
    const map = new Map([['FOO', 'bar#baz']]);
    const result = serialize(map);
    expect(result).toContain('FOO="bar#baz"');
  });

  test('ends with a newline', () => {
    const map = new Map([['FOO', 'bar']]);
    expect(serialize(map).endsWith('\n')).toBe(true);
  });
});
