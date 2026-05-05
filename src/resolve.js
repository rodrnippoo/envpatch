/**
 * Conflict resolution strategies for merged .env files
 */

/**
 * Resolve conflicts in a merged env object using a given strategy.
 *
 * @param {Object} merged - output from merge(), may contain conflict markers
 * @param {'ours'|'theirs'|'interactive'} strategy
 * @param {Function} [resolver] - async fn(key, ours, theirs) => string, used when strategy='interactive'
 * @returns {Promise<Object>} resolved key-value map (no conflicts)
 */
async function resolve(merged, strategy, resolver) {
  const result = {};

  for (const [key, entry] of Object.entries(merged)) {
    if (!entry.conflict) {
      result[key] = entry.value;
      continue;
    }

    if (strategy === 'ours') {
      result[key] = entry.ours;
    } else if (strategy === 'theirs') {
      result[key] = entry.theirs;
    } else if (strategy === 'interactive') {
      if (typeof resolver !== 'function') {
        throw new Error('interactive strategy requires a resolver function');
      }
      result[key] = await resolver(key, entry.ours, entry.theirs);
    } else {
      throw new Error(`Unknown resolution strategy: "${strategy}"`);
    }
  }

  return result;
}

/**
 * Returns only the conflicting entries from a merged object.
 *
 * @param {Object} merged
 * @returns {Object}
 */
function getConflicts(merged) {
  return Object.fromEntries(
    Object.entries(merged).filter(([, entry]) => entry.conflict)
  );
}

module.exports = { resolve, getConflicts };
