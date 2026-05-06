/**
 * Encrypt and decrypt sensitive .env values using AES-256-GCM
 */

const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const PREFIX = 'enc:';

function deriveKey(secret) {
  return crypto.scryptSync(secret, 'envpatch-salt', KEY_LENGTH);
}

function encrypt(value, secret) {
  const key = deriveKey(secret);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(value, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  const payload = Buffer.concat([iv, tag, encrypted]);
  return PREFIX + payload.toString('base64');
}

function decrypt(value, secret) {
  if (!isEncrypted(value)) {
    throw new Error('Value is not encrypted');
  }

  const key = deriveKey(secret);
  const payload = Buffer.from(value.slice(PREFIX.length), 'base64');

  const iv = payload.subarray(0, IV_LENGTH);
  const tag = payload.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const encrypted = payload.subarray(IV_LENGTH + TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  return decipher.update(encrypted, undefined, 'utf8') + decipher.final('utf8');
}

function isEncrypted(value) {
  return typeof value === 'string' && value.startsWith(PREFIX);
}

function encryptEnv(parsed, keys, secret) {
  const result = { ...parsed };
  for (const key of keys) {
    if (key in result && !isEncrypted(result[key])) {
      result[key] = encrypt(result[key], secret);
    }
  }
  return result;
}

function decryptEnv(parsed, secret) {
  const result = { ...parsed };
  for (const key of Object.keys(result)) {
    if (isEncrypted(result[key])) {
      result[key] = decrypt(result[key], secret);
    }
  }
  return result;
}

module.exports = { encrypt, decrypt, isEncrypted, encryptEnv, decryptEnv };
