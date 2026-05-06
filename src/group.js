/**
 * Group env keys by prefix (e.g. DB_HOST, DB_PORT -> { DB: { HOST, PORT } })
 */

/**
 * Groups env entries by their prefix (split on first underscore).
 * @param {Record<string, string>} env
 * @param {string} [separator='_']
 * @returns {Record<string, Record<string, string>>}
 */
function groupByPrefix(env, separator = '_') {
  const groups = {};
  for (const [key, value] of Object.entries(env)) {
    const idx = key.indexOf(separator);
    if (idx === -1) {
      const group = '__ungrouped__';
      groups[group] = groups[group] || {};
      groups[group][key] = value;
    } else {
      const prefix = key.slice(0, idx);
      const rest = key.slice(idx + 1);
      groups[prefix] = groups[prefix] || {};
      groups[prefix][rest] = value;
    }
  }
  return groups;
}

/**
 * Flattens a grouped env object back to a flat key=value record.
 * @param {Record<string, Record<string, string>>} groups
 * @param {string} [separator='_']
 * @returns {Record<string, string>}
 */
function flattenGroups(groups, separator = '_') {
  const env = {};
  for (const [prefix, entries] of Object.entries(groups)) {
    if (prefix === '__ungrouped__') {
      Object.assign(env, entries);
    } else {
      for (const [key, value] of Object.entries(entries)) {
        env[`${prefix}${separator}${key}`] = value;
      }
    }
  }
  return env;
}

/**
 * Lists all unique prefixes found in an env object.
 * @param {Record<string, string>} env
 * @param {string} [separator='_']
 * @returns {string[]}
 */
function listPrefixes(env, separator = '_') {
  const prefixes = new Set();
  for (const key of Object.keys(env)) {
    const idx = key.indexOf(separator);
    if (idx !== -1) {
      prefixes.add(key.slice(0, idx));
    }
  }
  return Array.from(prefixes).sort();
}

module.exports = { groupByPrefix, flattenGroups, listPrefixes };
