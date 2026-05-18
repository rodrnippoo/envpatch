// Tag env keys with metadata labels for categorization and filtering

/**
 * Add tags to specific keys in an env object
 * @param {Record<string,string>} env
 * @param {Record<string,string[]>} tagMap - { KEY: ['tag1', 'tag2'] }
 * @returns {Record<string, { value: string, tags: string[] }>}
 */
function tagKeys(env, tagMap) {
  return Object.fromEntries(
    Object.entries(env).map(([key, value]) => [
      key,
      { value, tags: tagMap[key] ? [...tagMap[key]] : [] }
    ])
  );
}

/**
 * Filter tagged env to only keys that have a given tag
 * @param {Record<string, { value: string, tags: string[] }>} tagged
 * @param {string} tag
 * @returns {Record<string,string>}
 */
function filterByTag(tagged, tag) {
  return Object.fromEntries(
    Object.entries(tagged)
      .filter(([, entry]) => entry.tags.includes(tag))
      .map(([key, entry]) => [key, entry.value])
  );
}

/**
 * List all unique tags used across a tagged env
 * @param {Record<string, { value: string, tags: string[] }>} tagged
 * @returns {string[]}
 */
function listTags(tagged) {
  const all = Object.values(tagged).flatMap(e => e.tags);
  return [...new Set(all)].sort();
}

/**
 * Remove a specific tag from all keys
 * @param {Record<string, { value: string, tags: string[] }>} tagged
 * @param {string} tag
 * @returns {Record<string, { value: string, tags: string[] }>}
 */
function removeTag(tagged, tag) {
  return Object.fromEntries(
    Object.entries(tagged).map(([key, entry]) => [
      key,
      { value: entry.value, tags: entry.tags.filter(t => t !== tag) }
    ])
  );
}

/**
 * Summarize tag usage across env
 * @param {Record<string, { value: string, tags: string[] }>} tagged
 * @returns {{ totalKeys: number, taggedKeys: number, tags: Record<string,number> }}
 */
function tagSummary(tagged) {
  const tags = {};
  let taggedKeys = 0;
  for (const entry of Object.values(tagged)) {
    if (entry.tags.length > 0) taggedKeys++;
    for (const tag of entry.tags) {
      tags[tag] = (tags[tag] || 0) + 1;
    }
  }
  return { totalKeys: Object.keys(tagged).length, taggedKeys, tags };
}

module.exports = { tagKeys, filterByTag, listTags, removeTag, tagSummary };
