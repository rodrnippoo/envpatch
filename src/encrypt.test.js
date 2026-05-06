const { encrypt, decrypt, isEncrypted, encryptEnv, decryptEnv } = require('./encrypt');

const SECRET = 'super-secret-passphrase-for-testing';

describe('isEncrypted', () => {
  it('returns true for encrypted values', () => {
    const val = encrypt('hello', SECRET);
    expect(isEncrypted(val)).toBe(true);
  });

  it('returns false for plain values', () => {
    expect(isEncrypted('plaintext')).toBe(false);
    expect(isEncrypted('')).toBe(false);
    expect(isEncrypted(null)).toBe(false);
  });
});

describe('encrypt / decrypt', () => {
  it('round-trips a value', () => {
    const original = 'my-secret-value';
    const enc = encrypt(original, SECRET);
    expect(decrypt(enc, SECRET)).toBe(original);
  });

  it('produces different ciphertext each time (random IV)', () => {
    const a = encrypt('same', SECRET);
    const b = encrypt('same', SECRET);
    expect(a).not.toBe(b);
  });

  it('throws when decrypting a plain value', () => {
    expect(() => decrypt('notencrypted', SECRET)).toThrow('Value is not encrypted');
  });

  it('throws with wrong secret', () => {
    const enc = encrypt('value', SECRET);
    expect(() => decrypt(enc, 'wrong-secret')).toThrow();
  });
});

describe('encryptEnv', () => {
  const parsed = { API_KEY: 'abc123', HOST: 'localhost', PORT: '3000' };

  it('encrypts only specified keys', () => {
    const result = encryptEnv(parsed, ['API_KEY'], SECRET);
    expect(isEncrypted(result.API_KEY)).toBe(true);
    expect(result.HOST).toBe('localhost');
    expect(result.PORT).toBe('3000');
  });

  it('skips already-encrypted values', () => {
    const already = { API_KEY: encrypt('abc123', SECRET) };
    const result = encryptEnv(already, ['API_KEY'], SECRET);
    expect(result.API_KEY).toBe(already.API_KEY);
  });

  it('ignores keys not present in parsed', () => {
    const result = encryptEnv(parsed, ['MISSING'], SECRET);
    expect(result).toEqual(parsed);
  });
});

describe('decryptEnv', () => {
  it('decrypts all encrypted values', () => {
    const input = {
      API_KEY: encrypt('secret', SECRET),
      HOST: 'localhost',
    };
    const result = decryptEnv(input, SECRET);
    expect(result.API_KEY).toBe('secret');
    expect(result.HOST).toBe('localhost');
  });
});
