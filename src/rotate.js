/**
 * rotate.js — Key rotation helpers for .env files
 * Supports rotating one or more keys to new names/values,
 * tracking what changed, and producing a rotation summary.
 */

/**
 * Rotate a single key: rename it and optionally set a new value.
 * @param {Object} env
 * @param {string} oldKey
 * @param {string} newKey
 * @param {string|undefined} newValue - if undefined, keeps existing value
 * @returns {{ env: Object, entry: Object|null }}
 */
function rotateKey(env, oldKey, newKey, newValue) {
  if (!Object.prototype.hasOwnProperty.call(env, oldKey)) {
    return { env, entry: null };
  }
  const oldValue = env[oldKey];
  const value = newValue !== undefined ? newValue : oldValue;
  const next = { ...env };
  delete next[oldKey];
  next[newKey] = value;
  return {
    env: next,
    entry: { oldKey, newKey, oldValue, newValue: value, valueChanged: value !== oldValue },
  };
}

/**
 * Rotate multiple keys from a rotation map.
 * @param {Object} env
 * @param {Array<{ oldKey: string, newKey: string, newValue?: string }>} rotations
 * @returns {{ env: Object, entries: Array }}
 */
function rotateKeys(env, rotations) {
  let current = { ...env };
  const entries = [];
  for (const { oldKey, newKey, newValue } of rotations) {
    const { env: next, entry } = rotateKey(current, oldKey, newKey, newValue);
    current = next;
    if (entry) entries.push(entry);
  }
  return { env: current, entries };
}

/**
 * Rotate all keys matching a prefix to a new prefix.
 * @param {Object} env
 * @param {string} oldPrefix
 * @param {string} newPrefix
 * @returns {{ env: Object, entries: Array }}
 */
function rotatePrefix(env, oldPrefix, newPrefix) {
  const rotations = Object.keys(env)
    .filter((k) => k.startsWith(oldPrefix))
    .map((oldKey) => ({ oldKey, newKey: newPrefix + oldKey.slice(oldPrefix.length) }));
  return rotateKeys(env, rotations);
}

/**
 * Summarize a rotation operation.
 * @param {Array} entries
 * @returns {Object}
 */
function rotateSummary(entries) {
  return {
    total: entries.length,
    renamed: entries.filter((e) => e.oldKey !== e.newKey).length,
    valueChanged: entries.filter((e) => e.valueChanged).length,
    keys: entries.map((e) => e.oldKey),
  };
}

module.exports = { rotateKey, rotateKeys, rotatePrefix, rotateSummary };
