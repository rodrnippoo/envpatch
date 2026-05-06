const { formatEncryptResult, formatDecryptResult, formatEncryptSummary } = require('./formatEncrypt');
const { encrypt } = require('./encrypt');

const SECRET = 'test-secret';

describe('formatEncryptResult', () => {
  it('marks encrypted keys as encrypted', () => {
    const before = { API_KEY: 'plain', HOST: 'localhost' };
    const after = { API_KEY: encrypt('plain', SECRET), HOST: 'localhost' };
    const output = formatEncryptResult(before, after);
    expect(output).toMatch(/encrypted.*API_KEY/);
    expect(output).toMatch(/unchanged.*HOST/);
  });

  it('marks all as unchanged when nothing was encrypted', () => {
    const env = { HOST: 'localhost' };
    const output = formatEncryptResult(env, env);
    expect(output).toMatch(/unchanged.*HOST/);
    expect(output).not.toMatch(/encrypted/);
  });
});

describe('formatDecryptResult', () => {
  it('marks decrypted keys as decrypted', () => {
    const before = { API_KEY: encrypt('secret', SECRET), HOST: 'localhost' };
    const after = { API_KEY: 'secret', HOST: 'localhost' };
    const output = formatDecryptResult(before, after);
    expect(output).toMatch(/decrypted.*API_KEY/);
    expect(output).toMatch(/unchanged.*HOST/);
  });
});

describe('formatEncryptSummary', () => {
  it('returns correct count', () => {
    const before = { A: 'x', B: 'y', C: 'z' };
    const after = { A: encrypt('x', SECRET), B: 'y', C: encrypt('z', SECRET) };
    expect(formatEncryptSummary(before, after)).toBe('2/3 value(s) encrypted');
  });

  it('returns 0 when nothing changed', () => {
    const env = { A: 'x' };
    expect(formatEncryptSummary(env, env)).toBe('0/1 value(s) encrypted');
  });
});
