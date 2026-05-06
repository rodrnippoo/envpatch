const {
  formatRedacted,
  formatRedactSummary,
  formatRedactWarning,
} = require('./formatRedact');

describe('formatRedacted', () => {
  it('formats key=value pairs', () => {
    const result = formatRedacted({
      APP_NAME: 'myapp',
      DB_PASSWORD: '***',
      PORT: '3000',
    });
    expect(result).toContain('APP_NAME=myapp');
    expect(result).toContain('DB_PASSWORD=***');
    expect(result).toContain('PORT=3000');
  });

  it('returns empty string for empty env', () => {
    expect(formatRedacted({})).toBe('');
  });
});

describe('formatRedactSummary', () => {
  it('shows redacted key names and count', () => {
    const result = formatRedactSummary(['DB_PASSWORD', 'API_KEY'], 5);
    expect(result).toContain('2 of 5');
    expect(result).toContain('DB_PASSWORD');
    expect(result).toContain('API_KEY');
  });

  it('shows message when nothing is redacted', () => {
    const result = formatRedactSummary([], 3);
    expect(result).toContain('No sensitive keys');
    expect(result).toContain('3 keys checked');
  });
});

describe('formatRedactWarning', () => {
  it('returns warning with key list', () => {
    const result = formatRedactWarning(['SECRET_KEY', 'DB_PASSWORD']);
    expect(result).toContain('WARNING');
    expect(result).toContain('SECRET_KEY');
    expect(result).toContain('DB_PASSWORD');
  });

  it('returns empty string when no sensitive keys', () => {
    expect(formatRedactWarning([])).toBe('');
  });
});
