import { missingRequired, presentRequired, checkRequired, requiredReport } from './required.js';

const env = {
  DATABASE_URL: 'postgres://localhost/db',
  API_KEY: 'abc123',
  SECRET: '',
  DEBUG: undefined,
};

const keys = ['DATABASE_URL', 'API_KEY', 'SECRET', 'DEBUG', 'PORT'];

describe('missingRequired', () => {
  it('returns keys that are missing or empty', () => {
    expect(missingRequired(env, keys)).toEqual(['SECRET', 'DEBUG', 'PORT']);
  });

  it('returns empty array when all keys are present', () => {
    expect(missingRequired({ A: '1', B: '2' }, ['A', 'B'])).toEqual([]);
  });

  it('handles empty required list', () => {
    expect(missingRequired(env, [])).toEqual([]);
  });
});

describe('presentRequired', () => {
  it('returns keys that are present and non-empty', () => {
    expect(presentRequired(env, keys)).toEqual(['DATABASE_URL', 'API_KEY']);
  });
});

describe('checkRequired', () => {
  it('returns false when required keys are missing', () => {
    expect(checkRequired(env, keys)).toBe(false);
  });

  it('returns true when all required keys are present', () => {
    expect(checkRequired({ A: '1' }, ['A'])).toBe(true);
  });

  it('returns true for empty required list', () => {
    expect(checkRequired({}, [])).toBe(true);
  });
});

describe('requiredReport', () => {
  it('builds a report for each required key', () => {
    const report = requiredReport(env, ['DATABASE_URL', 'SECRET']);
    expect(report).toEqual([
      { key: 'DATABASE_URL', present: true, value: 'postgres://localhost/db' },
      { key: 'SECRET', present: false, value: undefined },
    ]);
  });

  it('marks undefined keys as not present', () => {
    const report = requiredReport({}, ['MISSING']);
    expect(report[0]).toEqual({ key: 'MISSING', present: false, value: undefined });
  });
});
