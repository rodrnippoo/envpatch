/**
 * Format output messages for clone operations.
 */

/**
 * Format a summary of a clone operation.
 * @param {Record<string, string>} source
 * @param {Record<string, string>} result
 * @param {object} [options]
 * @param {string} [options.prefix]
 * @param {string[]} [options.keys]
 * @param {string[]} [options.excluding]
 * @returns {string}
 */
function formatCloneSummary(source, result, options = {}) {
  const sourceCount = Object.keys(source).length;
  const resultCount = Object.keys(result).length;
  const skipped = sourceCount - resultCount;

  const lines = [];
  lines.push(`Cloned ${resultCount} of ${sourceCount} key(s)`);

  if (options.prefix) {
    lines.push(`  Filter: prefix "${options.prefix}"`);
  } else if (options.keys && options.keys.length > 0) {
    lines.push(`  Filter: keys [${options.keys.join(', ')}]`);
  } else if (options.excluding && options.excluding.length > 0) {
    lines.push(`  Excluded: [${options.excluding.join(', ')}]`);
  }

  if (skipped > 0) {
    lines.push(`  Skipped: ${skipped} key(s)`);
  }

  return lines.join('\n');
}

/**
 * Format a list of cloned keys.
 * @param {Record<string, string>} result
 * @param {boolean} [showValues=false]
 * @returns {string}
 */
function formatCloneResult(result, showValues = false) {
  const keys = Object.keys(result);
  if (keys.length === 0) return '(no keys cloned)';

  return keys
    .map(key => showValues ? `  ${key}=${result[key]}` : `  ${key}`)
    .join('\n');
}

module.exports = { formatCloneSummary, formatCloneResult };
