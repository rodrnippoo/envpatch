/**
 * rename.js — Rename keys across a parsed .env object
 */

/**
 * Rename a single key in an env object.
 * Returns a new object with the key renamed, preserving insertion order.
 * @param {Record<string,string>} env
 * @param {string} oldKey
 * @param {string} newKey
 * @returns {{ result: Record<string,string>, renamed: boolean }}
 */
function renameKey(env, oldKey, newKey) {
  if (!Object.prototype.hasOwnProperty.call(env, oldKey)) {
    return { result: { ...env }, renamed: false };
  }
  if (oldKey === newKey) {
    return { result: { ...env }, renamed: false };
  }
  const result = {};
  for (const [k, v] of Object.entries(env)) {
    if (k === oldKey) {
      result[newKey] = v;
    } else {
      result[k] = v;
    }
  }
  return { result, renamed: true };
}

/**
 * Apply a map of renames { oldKey: newKey } to an env object.
 * Skips renames where oldKey does not exist or oldKey === newKey.
 * Returns the new env and a list of applied renames.
 * @param {Record<string,string>} env
 * @param {Record<string,string>} renameMap
 * @returns {{ result: Record<string,string>, applied: Array<{from:string,to:string}>, skipped: Array<{from:string,to:string,reason:string}> }}
 */
function renameKeys(env, renameMap) {
  const applied = [];
  const skipped = [];
  let current = { ...env };

  for (const [oldKey, newKey] of Object.entries(renameMap)) {
    if (!Object.prototype.hasOwnProperty.call(current, oldKey)) {
      skipped.push({ from: oldKey, to: newKey, reason: 'key not found' });
      continue;
    }
    if (oldKey === newKey) {
      skipped.push({ from: oldKey, to: newKey, reason: 'same key' });
      continue;
    }
    if (Object.prototype.hasOwnProperty.call(current, newKey)) {
      skipped.push({ from: oldKey, to: newKey, reason: `target key '${newKey}' already exists` });
      continue;
    }
    const { result } = renameKey(current, oldKey, newKey);
    current = result;
    applied.push({ from: oldKey, to: newKey });
  }

  return { result: current, applied, skipped };
}

module.exports = { renameKey, renameKeys };
