const fs = require('fs');
const path = require('path');
const { parse } = require('./parser');
const { diff, hasDifferences } = require('./diff');
const { createAuditEntry } = require('./audit');

/**
 * Watch a .env file for changes and emit diff events
 * @param {string} filePath - path to the .env file
 * @param {object} options
 * @param {function} options.onChange - callback(diff, auditEntry)
 * @param {function} [options.onError] - callback(err)
 * @returns {{ stop: function }} watcher handle
 */
function watchEnv(filePath, options = {}) {
  const { onChange, onError = console.error } = options;
  const resolved = path.resolve(filePath);

  let previousContent = '';
  try {
    previousContent = fs.readFileSync(resolved, 'utf8');
  } catch (_) {
    // file may not exist yet
  }

  let previousParsed = parse(previousContent);

  const watcher = fs.watch(resolved, { persistent: false }, (eventType) => {
    if (eventType !== 'change') return;
    try {
      const nextContent = fs.readFileSync(resolved, 'utf8');
      const nextParsed = parse(nextContent);
      const result = diff(previousParsed, nextParsed);

      if (hasDifferences(result)) {
        const entry = createAuditEntry('watch-change', filePath, {
          added: result.added.length,
          removed: result.removed.length,
          changed: result.changed.length,
        });
        onChange(result, entry);
      }

      previousParsed = nextParsed;
      previousContent = nextContent;
    } catch (err) {
      onError(err);
    }
  });

  return {
    stop() {
      watcher.close();
    },
  };
}

module.exports = { watchEnv };
