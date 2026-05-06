/**
 * snapshot.js — capture and compare .env snapshots over time
 */

const crypto = require('crypto');

/**
 * Create a snapshot of a parsed env object
 * @param {Object} env - parsed env key/value pairs
 * @param {string} [label] - optional label/tag for the snapshot
 * @returns {Object} snapshot
 */
function createSnapshot(env, label = '') {
  const timestamp = new Date().toISOString();
  const hash = hashEnv(env);
  return {
    label,
    timestamp,
    hash,
    keys: Object.keys(env).sort(),
    env: { ...env },
  };
}

/**
 * Compute a stable hash of an env object (keys + values)
 * @param {Object} env
 * @returns {string} hex hash
 */
function hashEnv(env) {
  const stable = Object.keys(env)
    .sort()
    .map((k) => `${k}=${env[k]}`)
    .join('\n');
  return crypto.createHash('sha256').update(stable).digest('hex').slice(0, 16);
}

/**
 * Compare two snapshots and return a summary of changes
 * @param {Object} before
 * @param {Object} after
 * @returns {Object} snapshotDiff
 */
function compareSnapshots(before, after) {
  const added = after.keys.filter((k) => !before.keys.includes(k));
  const removed = before.keys.filter((k) => !after.keys.includes(k));
  const changed = before.keys.filter(
    (k) => after.env[k] !== undefined && after.env[k] !== before.env[k]
  );
  const unchanged = before.keys.filter(
    (k) => after.env[k] === before.env[k]
  );

  return {
    before: { label: before.label, timestamp: before.timestamp, hash: before.hash },
    after: { label: after.label, timestamp: after.timestamp, hash: after.hash },
    added,
    removed,
    changed,
    unchanged,
    hasChanges: added.length > 0 || removed.length > 0 || changed.length > 0,
  };
}

module.exports = { createSnapshot, hashEnv, compareSnapshots };
