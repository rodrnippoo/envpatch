const { expandDotted, flattenDotted, listDottedKeys, hasDottedKeys } = require('./flatten');

describe('expandDotted', () => {
  it('expands single dotted key', () => {
    const result = expandDotted({ 'DB.HOST': 'localhost' });
    expect(result).toEqual({ DB: { HOST: 'localhost' } });
  });

  it('expands multiple dotted keys under same prefix', () => {
    const result = expandDotted({ 'DB.HOST': 'localhost', 'DB.PORT': '5432' });
    expect(result).toEqual({ DB: { HOST: 'localhost', PORT: '5432' } });
  });

  it('expands deeply nested keys', () => {
    const result = expandDotted({ 'A.B.C': 'deep' });
    expect(result).toEqual({ A: { B: { C: 'deep' } } });
  });

  it('leaves non-dotted keys at root', () => {
    const result = expandDotted({ HOST: 'localhost', 'DB.PORT': '5432' });
    expect(result).toEqual({ HOST: 'localhost', DB: { PORT: '5432' } });
  });

  it('returns empty object for empty input', () => {
    expect(expandDotted({})).toEqual({});
  });
});

describe('flattenDotted', () => {
  it('flattens a nested object', () => {
    const result = flattenDotted({ DB: { HOST: 'localhost', PORT: '5432' } });
    expect(result).toEqual({ 'DB.HOST': 'localhost', 'DB.PORT': '5432' });
  });

  it('flattens deeply nested object', () => {
    const result = flattenDotted({ A: { B: { C: 'deep' } } });
    expect(result).toEqual({ 'A.B.C': 'deep' });
  });

  it('leaves flat keys unchanged', () => {
    const result = flattenDotted({ HOST: 'localhost' });
    expect(result).toEqual({ HOST: 'localhost' });
  });

  it('converts non-string values to strings', () => {
    const result = flattenDotted({ PORT: 5432 });
    expect(result).toEqual({ PORT: '5432' });
  });

  it('round-trips with expandDotted', () => {
    const original = { 'DB.HOST': 'localhost', 'DB.PORT': '5432', 'APP.NAME': 'test' };
    const expanded = expandDotted(original);
    const flattened = flattenDotted(expanded);
    expect(flattened).toEqual(original);
  });
});

describe('listDottedKeys', () => {
  it('returns only dotted keys', () => {
    const env = { HOST: 'localhost', 'DB.PORT': '5432', 'APP.NAME': 'test' };
    expect(listDottedKeys(env)).toEqual(['DB.PORT', 'APP.NAME']);
  });

  it('returns empty array when no dotted keys', () => {
    expect(listDottedKeys({ HOST: 'localhost' })).toEqual([]);
  });
});

describe('hasDottedKeys', () => {
  it('returns true when dotted keys exist', () => {
    expect(hasDottedKeys({ 'DB.HOST': 'localhost' })).toBe(true);
  });

  it('returns false when no dotted keys', () => {
    expect(hasDottedKeys({ HOST: 'localhost' })).toBe(false);
  });
});
