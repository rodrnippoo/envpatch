const {
  markDeprecated,
  findDeprecated,
  stripDeprecated,
  applyReplacements,
  deprecateSummary,
} = require('./deprecate');

const env = {
  OLD_API_KEY: 'abc123',
  NEW_API_KEY: 'xyz789',
  DB_HOST: 'localhost',
  LEGACY_TOKEN: 'tok',
};

test('markDeprecated returns only keys present in env', () => {
  const { deprecated } = markDeprecated(env, ['OLD_API_KEY', 'MISSING_KEY']);
  expect(deprecated).toEqual(['OLD_API_KEY']);
});

test('markDeprecated returns empty array when none present', () => {
  const { deprecated } = markDeprecated(env, ['NOPE', 'ALSO_NOPE']);
  expect(deprecated).toEqual([]);
});

test('findDeprecated detects deprecated keys in env', () => {
  const found = findDeprecated(env, ['OLD_API_KEY', 'LEGACY_TOKEN', 'GONE']);
  expect(found).toEqual(['OLD_API_KEY', 'LEGACY_TOKEN']);
});

test('findDeprecated returns empty when none present', () => {
  const found = findDeprecated(env, ['NOT_HERE']);
  expect(found).toEqual([]);
});

test('stripDeprecated removes specified keys', () => {
  const result = stripDeprecated(env, ['OLD_API_KEY', 'LEGACY_TOKEN']);
  expect(result).not.toHaveProperty('OLD_API_KEY');
  expect(result).not.toHaveProperty('LEGACY_TOKEN');
  expect(result).toHaveProperty('DB_HOST', 'localhost');
});

test('stripDeprecated does not mutate original env', () => {
  stripDeprecated(env, ['OLD_API_KEY']);
  expect(env).toHaveProperty('OLD_API_KEY');
});

test('applyReplacements renames old key to new key', () => {
  const input = { OLD_TOKEN: 'tok', DB_HOST: 'localhost' };
  const { env: result, applied } = applyReplacements(input, { OLD_TOKEN: 'NEW_TOKEN' });
  expect(result).toHaveProperty('NEW_TOKEN', 'tok');
  expect(result).not.toHaveProperty('OLD_TOKEN');
  expect(applied).toEqual([{ from: 'OLD_TOKEN', to: 'NEW_TOKEN' }]);
});

test('applyReplacements does not overwrite existing new key', () => {
  const input = { OLD_TOKEN: 'old', NEW_TOKEN: 'existing' };
  const { env: result } = applyReplacements(input, { OLD_TOKEN: 'NEW_TOKEN' });
  expect(result.NEW_TOKEN).toBe('existing');
  expect(result).not.toHaveProperty('OLD_TOKEN');
});

test('applyReplacements skips missing old keys', () => {
  const { applied } = applyReplacements(env, { MISSING: 'NEW_MISSING' });
  expect(applied).toEqual([]);
});

test('deprecateSummary reflects found and replaced', () => {
  const summary = deprecateSummary(['OLD_API_KEY'], [{ from: 'OLD_API_KEY', to: 'NEW_API_KEY' }]);
  expect(summary.total).toBe(1);
  expect(summary.clean).toBe(false);
  expect(summary.replaced).toHaveLength(1);
});

test('deprecateSummary clean when none found', () => {
  const summary = deprecateSummary([]);
  expect(summary.clean).toBe(true);
  expect(summary.total).toBe(0);
});
