const { listTags } = require('./tag');

/**
 * Format a single tagged key entry for display
 * @param {string} key
 * @param {{ value: string, tags: string[] }} entry
 * @returns {string}
 */
function formatTagEntry(key, entry) {
  const tagStr = entry.tags.length > 0 ? ` [${entry.tags.join(', ')}]` : '';
  return `${key}=${entry.value}${tagStr}`;
}

/**
 * Format all tagged entries grouped by tag
 * @param {Record<string, { value: string, tags: string[] }>} tagged
 * @returns {string}
 */
function formatTagGroups(tagged) {
  const tags = listTags(tagged);
  if (tags.length === 0) return '(no tags defined)';

  const lines = [];
  for (const tag of tags) {
    lines.push(`[${tag}]`);
    for (const [key, entry] of Object.entries(tagged)) {
      if (entry.tags.includes(tag)) {
        lines.push(`  ${key}`);
      }
    }
  }
  return lines.join('\n');
}

/**
 * Format tag summary for display
 * @param {{ totalKeys: number, taggedKeys: number, tags: Record<string,number> }} summary
 * @returns {string}
 */
function formatTagSummary(summary) {
  const lines = [
    `Keys: ${summary.totalKeys} total, ${summary.taggedKeys} tagged`
  ];
  const tagEntries = Object.entries(summary.tags).sort(([a], [b]) => a.localeCompare(b));
  if (tagEntries.length === 0) {
    lines.push('No tags found.');
  } else {
    for (const [tag, count] of tagEntries) {
      lines.push(`  ${tag}: ${count} key${count !== 1 ? 's' : ''}`);
    }
  }
  return lines.join('\n');
}

module.exports = { formatTagEntry, formatTagGroups, formatTagSummary };
