const { formatCoerceEntry, formatCoerceSummary, formatCoerceResult } = require('./formatCoerce');

describe('formatCoerceEntry', () => {
  test('formats a boolean coercion', () => {
    const entry = { key: 'DEBUG', from: 'true', to: true, type: 'boolean' };
    expect(formatCoerceEntry(entry)).toBe('  DEBUG: "true" → true (boolean)');
  });

  test('formats a number coercion', () => {
    const entry = { key: 'PORT', from: '3000', to: 3000, type: 'number' };
    expect(formatCoerceEntry(entry)).toBe('  PORT: "3000" → 3000 (number)');
  });
});

describe('formatCoerceSummary', () => {
  test('returns message when nothing coerced', () => {
    expect(formatCoerceSummary([])).toBe('No values were coerced (all remain strings).');
  });

  test('formats multiple entries', () => {
    const summary = [
      { key: 'DEBUG', from: 'true', to: true, type: 'boolean' },
      { key: 'PORT', from: '8080', to: 8080, type: 'number' },
    ];
    const result = formatCoerceSummary(summary);
    expect(result).toContain('Coerced values:');
    expect(result).toContain('DEBUG');
    expect(result).toContain('PORT');
  });
});

describe('formatCoerceResult', () => {
  test('shows summary stats', () => {
    const original = { DEBUG: 'true', PORT: '3000', HOST: 'localhost' };
    const coerced = { DEBUG: true, PORT: 3000, HOST: 'localhost' };
    const summary = [
      { key: 'DEBUG', from: 'true', to: true, type: 'boolean' },
      { key: 'PORT', from: '3000', to: 3000, type: 'number' },
    ];
    const result = formatCoerceResult(original, coerced, summary);
    expect(result).toContain('3 key(s) processed');
    expect(result).toContain('2 coerced');
    expect(result).toContain('1 left as string');
  });

  test('handles all-string result', () => {
    const original = { HOST: 'localhost' };
    const coerced = { HOST: 'localhost' };
    const result = formatCoerceResult(original, coerced, []);
    expect(result).toContain('1 key(s) processed');
    expect(result).toContain('0 coerced');
    expect(result).not.toContain('Coerced values:');
  });
});
