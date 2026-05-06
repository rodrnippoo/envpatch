const { sortKeys, sortByPrefix, pinKeys, sortByOrder } = require('./sort');

const env = {
  PORT: '3000',
  APP_NAME: 'myapp',
  DB_HOST: 'localhost',
  APP_ENV: 'production',
  DB_PORT: '5432',
  NODE_ENV: 'production',
};

describe('sortKeys', () => {
  it('sorts keys alphabetically ascending', () => {
    const result = sortKeys(env);
    const keys = Object.keys(result);
    expect(keys).toEqual([...keys].sort());
  });

  it('sorts keys alphabetically descending', () => {
    const result = sortKeys(env, { descending: true });
    const keys = Object.keys(result);
    expect(keys).toEqual([...keys].sort().reverse());
  });

  it('preserves all values', () => {
    const result = sortKeys(env);
    expect(result['PORT']).toBe('3000');
    expect(result['DB_HOST']).toBe('localhost');
  });
});

describe('sortByPrefix', () => {
  it('groups keys by prefix', () => {
    const result = sortByPrefix(env);
    const keys = Object.keys(result);
    const appIdx = keys.findIndex(k => k.startsWith('APP_'));
    const dbIdx = keys.findIndex(k => k.startsWith('DB_'));
    const lastApp = keys.map((k, i) => k.startsWith('APP_') ? i : -1).filter(i => i >= 0).pop();
    expect(lastApp).toBeLessThan(dbIdx);
    expect(appIdx).toBeLessThan(dbIdx);
  });

  it('sorts within prefix groups alphabetically', () => {
    const result = sortByPrefix(env);
    const keys = Object.keys(result);
    const appKeys = keys.filter(k => k.startsWith('APP_'));
    expect(appKeys).toEqual([...appKeys].sort());
  });
});

describe('pinKeys', () => {
  it('moves specified keys to the top', () => {
    const result = pinKeys(env, ['PORT', 'NODE_ENV']);
    const keys = Object.keys(result);
    expect(keys[0]).toBe('PORT');
    expect(keys[1]).toBe('NODE_ENV');
  });

  it('ignores pinned keys not in env', () => {
    const result = pinKeys(env, ['MISSING', 'PORT']);
    expect(Object.keys(result)[0]).toBe('PORT');
    expect('MISSING' in result).toBe(false);
  });

  it('preserves all other keys', () => {
    const result = pinKeys(env, ['PORT']);
    expect(Object.keys(result)).toHaveLength(Object.keys(env).length);
  });
});

describe('sortByOrder', () => {
  it('places known keys first in given order', () => {
    const result = sortByOrder(env, ['NODE_ENV', 'PORT', 'APP_NAME']);
    const keys = Object.keys(result);
    expect(keys[0]).toBe('NODE_ENV');
    expect(keys[1]).toBe('PORT');
    expect(keys[2]).toBe('APP_NAME');
  });

  it('appends unknown keys sorted alphabetically', () => {
    const result = sortByOrder(env, ['PORT']);
    const keys = Object.keys(result);
    const rest = keys.slice(1);
    expect(rest).toEqual([...rest].sort());
  });
});
