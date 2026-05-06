// Export env data to various formats (JSON, YAML-like, shell script)

/**
 * Export parsed env object to JSON format
 * @param {Object} env - parsed env key/value pairs
 * @param {Object} options - { pretty: bool }
 * @returns {string}
 */
function exportToJson(env, options = {}) {
  const { pretty = true } = options;
  return pretty ? JSON.stringify(env, null, 2) : JSON.stringify(env);
}

/**
 * Export parsed env object to shell export statements
 * @param {Object} env
 * @returns {string}
 */
function exportToShell(env) {
  return Object.entries(env)
    .map(([key, value]) => {
      const escaped = value.replace(/'/g, "'\\'')");
      return `export ${key}='${escaped}'`;
    })
    .join('\n');
}

/**
 * Export parsed env object to a simple YAML-like format
 * @param {Object} env
 * @returns {string}
 */
function exportToYaml(env) {
  return Object.entries(env)
    .map(([key, value]) => {
      const needsQuotes = /[:#{}\[\],&*?|<>=!%@`]/.test(value) || value.trim() !== value;
      const formatted = needsQuotes ? `"${value.replace(/"/g, '\\"')}"` : value || '""';
      return `${key}: ${formatted}`;
    })
    .join('\n');
}

/**
 * Export env to a given format
 * @param {Object} env
 * @param {'json'|'shell'|'yaml'} format
 * @param {Object} options
 * @returns {string}
 */
function exportEnv(env, format = 'json', options = {}) {
  switch (format) {
    case 'json':  return exportToJson(env, options);
    case 'shell': return exportToShell(env);
    case 'yaml':  return exportToYaml(env);
    default: throw new Error(`Unsupported export format: ${format}`);
  }
}

module.exports = { exportToJson, exportToShell, exportToYaml, exportEnv };
