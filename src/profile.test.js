import { describe, it, expect } from 'vitest';
import {
  createProfile,
  applyProfile,
  diffProfiles,
  listProfiles,
  serializeProfile,
  parseProfile,
} from './profile.js';

describe('createProfile', () => {
  it('creates a profile with given name and vars', () => {
    const p = createProfile('dev', { PORT: '3000' }, 'development');
    expect(p.name).toBe('dev');
    expect(p.vars.PORT).toBe('3000');
    expect(p.description).toBe('development');
  });

  it('throws on invalid name', () => {
    expect(() => createProfile('my profile')).toThrow();
    expect(() => createProfile('')).toThrow();
  });

  it('defaults to empty vars and description', () => {
    const p = createProfile('prod');
    expect(p.vars).toEqual({});
    expect(p.description).toBe('');
  });
});

describe('applyProfile', () => {
  it('merges profile vars over base', () => {
    const base = { HOST: 'localhost', PORT: '8080', DEBUG: 'false' };
    const profile = createProfile('dev', { PORT: '3000', DEBUG: 'true' });
    const result = applyProfile(base, profile);
    expect(result).toEqual({ HOST: 'localhost', PORT: '3000', DEBUG: 'true' });
  });

  it('does not mutate base', () => {
    const base = { A: '1' };
    const profile = createProfile('x', { A: '2' });
    applyProfile(base, profile);
    expect(base.A).toBe('1');
  });
});

describe('diffProfiles', () => {
  it('returns changes between two profiles', () => {
    const a = createProfile('dev', { PORT: '3000', HOST: 'localhost' });
    const b = createProfile('prod', { PORT: '80', HOST: 'example.com', SSL: 'true' });
    const changes = diffProfiles(a, b);
    expect(changes).toContainEqual({ key: 'PORT', from: '3000', to: '80' });
    expect(changes).toContainEqual({ key: 'SSL', from: null, to: 'true' });
  });

  it('returns empty array for identical profiles', () => {
    const a = createProfile('x', { A: '1' });
    const b = createProfile('y', { A: '1' });
    expect(diffProfiles(a, b)).toEqual([]);
  });
});

describe('serializeProfile / parseProfile', () => {
  it('round-trips a profile', () => {
    const original = createProfile('staging', { API_URL: 'https://api.staging.com', TIMEOUT: '5000' }, 'staging env');
    const text = serializeProfile(original);
    const parsed = parseProfile('staging', text, 'staging env');
    expect(parsed.vars).toEqual(original.vars);
  });

  it('skips blank lines and comments', () => {
    const text = '# comment\n\nFOO=bar\n';
    const p = parseProfile('test', text);
    expect(p.vars).toEqual({ FOO: 'bar' });
  });
});

describe('listProfiles', () => {
  it('lists profiles with summary info', () => {
    const map = {
      dev: createProfile('dev', { A: '1', B: '2' }, 'dev'),
      prod: createProfile('prod', { A: '1' }, 'prod'),
    };
    const list = listProfiles(map);
    expect(list).toHaveLength(2);
    expect(list.find(p => p.name === 'dev').varCount).toBe(2);
  });
});
