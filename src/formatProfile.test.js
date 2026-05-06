import { describe, it, expect } from 'vitest';
import { formatProfileList, formatProfileDiff, formatApplyResult } from './formatProfile.js';
import { createProfile, applyProfile, listProfiles } from './profile.js';

describe('formatProfileList', () => {
  it('returns a message when no profiles', () => {
    expect(formatProfileList([])).toContain('No profiles');
  });

  it('includes profile names and var counts', () => {
    const map = {
      dev: createProfile('dev', { A: '1', B: '2' }, 'local dev'),
      prod: createProfile('prod', { A: '1' }),
    };
    const output = formatProfileList(listProfiles(map));
    expect(output).toContain('dev');
    expect(output).toContain('2 vars');
    expect(output).toContain('local dev');
    expect(output).toContain('prod');
  });
});

describe('formatProfileDiff', () => {
  it('shows no differences message when profiles are identical', () => {
    const a = createProfile('a', { X: '1' });
    const b = createProfile('b', { X: '1' });
    const output = formatProfileDiff(a, b);
    expect(output).toContain('No differences');
  });

  it('shows added, removed, and changed keys', () => {
    const a = createProfile('dev', { PORT: '3000', OLD: 'yes' });
    const b = createProfile('prod', { PORT: '80', NEW: 'yes' });
    const output = formatProfileDiff(a, b);
    expect(output).toContain('PORT');
    expect(output).toContain('3000');
    expect(output).toContain('80');
    expect(output).toContain('OLD');
    expect(output).toContain('NEW');
  });
});

describe('formatApplyResult', () => {
  it('summarizes applied changes', () => {
    const base = { HOST: 'localhost', PORT: '8080' };
    const profile = createProfile('dev', { PORT: '3000', DEBUG: 'true' });
    const result = applyProfile(base, profile);
    const output = formatApplyResult('dev', base, result);
    expect(output).toContain('dev');
    expect(output).toContain('1 overridden');
    expect(output).toContain('1 added');
  });
});
