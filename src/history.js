const crypto = require('crypto');

/**
 * Create a history entry recording a change to an env file.
 * @param {string} action - e.g. 'merge', 'patch', 'encrypt', 'apply'
 * @param {object} before - parsed env before change
 * @param {object} after - parsed env after change
 * @param {object} [meta] - optional extra metadata
 * @returns {object} history entry
 */
function createHistoryEntry(action, before, after, meta = {}) {
  const changedKeys = getChangedKeys(before, after);
  return {
    id: crypto.randomBytes(6).toString('hex'),
    timestamp: new Date().toISOString(),
    action,
    changedKeys,
    addedKeys: changedKeys.filter(k => !(k in before)),
    removedKeys: changedKeys.filter(k => !(k in after)),
    modifiedKeys: changedKeys.filter(k => k in before && k in after && before[k] !== after[k]),
    meta,
  };
}

/**
 * Get all keys that differ between two env objects.
 * @param {object} before
 * @param {object} after
 * @returns {string[]}
 */
function getChangedKeys(before, after) {
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  return [...keys].filter(k => before[k] !== after[k]);
}

/**
 * Append a history entry to a history log array.
 * @param {object[]} log
 * @param {object} entry
 * @returns {object[]}
 */
function appendHistory(log, entry) {
  return [...log, entry];
}

/**
 * Filter history entries by action type.
 * @param {object[]} log
 * @param {string} action
 * @returns {object[]}
 */
function filterHistory(log, action) {
  return log.filter(e => e.action === action);
}

/**
 * Find the most recent entry that touched a specific key.
 * @param {object[]} log
 * @param {string} key
 * @returns {object|null}
 */
function findLastChangeForKey(log, key) {
  for (let i = log.length - 1; i >= 0; i--) {
    if (log[i].changedKeys.includes(key)) return log[i];
  }
  return null;
}

module.exports = { createHistoryEntry, getChangedKeys, appendHistory, filterHistory, findLastChangeForKey };
