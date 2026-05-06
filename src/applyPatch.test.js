const { applyPatch, checkApplicable } = require('./applyPatch');

describe('applyPatch', () => {
  const base = { HOST: 'localhost', PORT: '3000', DEBUG: 'false' };

  test('applies added entries', () => {
    const patch = [{ key: 'NEW_KEY', type: 'added', newValue: 'hello' }];
    expect(applyPatch(base, patch)).toMatchObject({ NEW_KEY: 'hello' });
  });

  test('applies removed entries', () => {
    const patch = [{ key: 'DEBUG', type: 'removed', oldValue: 'false' }];
    const result = applyPatch(base, patch);
    expect(result).not.toHaveProperty('DEBUG');
    expect(result).toHaveProperty('HOST');
  });

  test('applies changed entries', () => {
    const patch = [{ key: 'PORT', type: 'changed', oldValue: '3000', newValue: '8080' }];
    const result = applyPatch(base, patch);
    expect(result.PORT).toBe('8080');
  });

  test('does not mutate base', () => {
    const patch = [{ key: 'PORT', type: 'changed', oldValue: '3000', newValue: '9999' }];
    applyPatch(base, patch);
    expect(base.PORT).toBe('3000');
  });

  test('handles empty patch', () => {
    expect(applyPatch(base, [])).toEqual(base);
  });
});

describe('checkApplicable', () => {
  const base = { HOST: 'localhost', PORT: '3000' };

  test('returns applicable for clean patch', () => {
    const patch = [{ key: 'PORT', type: 'changed', oldValue: '3000', newValue: '8080' }];
    const result = checkApplicable(base, patch);
    expect(result.applicable).toBe(true);
    expect(result.conflicts).toHaveLength(0);
  });

  test('detects conflict when old value does not match', () => {
    const patch = [{ key: 'PORT', type: 'changed', oldValue: '9999', newValue: '8080' }];
    const result = checkApplicable(base, patch);
    expect(result.applicable).toBe(false);
    expect(result.conflicts).toContain('PORT');
  });

  test('detects conflict when key is missing for removal', () => {
    const patch = [{ key: 'MISSING', type: 'removed', oldValue: 'x' }];
    const result = checkApplicable(base, patch);
    expect(result.applicable).toBe(false);
    expect(result.conflicts).toContain('MISSING');
  });

  test('added entries are always applicable', () => {
    const patch = [{ key: 'NEW', type: 'added', newValue: 'val' }];
    const result = checkApplicable(base, patch);
    expect(result.applicable).toBe(true);
  });
});
