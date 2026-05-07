const { formatTransformSummary, formatTransformResult, formatValueChange } = require('./formatTransform');

describe('formatTransformSummary', () => {
  it('returns no-change message when summary is empty', () => {
    expect(formatTransformSummary({ added: [], removed: [], changed: [] })).toBe('No changes from transform.');
  });

  it('lists added keys', () => {
    const out = formatTransformSummary({ added: ['NEW_KEY'], removed: [], changed: [] });
    expect(out).toContain('Added keys (1)');
    expect(out).toContain('+ NEW_KEY');
  });

  it('lists removed keys', () => {
    const out = formatTransformSummary({ added: [], removed: ['OLD_KEY'], changed: [] });
    expect(out).toContain('Removed keys (1)');
    expect(out).toContain('- OLD_KEY');
  });

  it('lists changed values', () => {
    const out = formatTransformSummary({ added: [], removed: [], changed: ['FOO'] });
    expect(out).toContain('Changed values (1)');
    expect(out).toContain('~ FOO');
  });

  it('combines all sections', () => {
    const out = formatTransformSummary({ added: ['A'], removed: ['B'], changed: ['C'] });
    expect(out).toContain('+ A');
    expect(out).toContain('- B');
    expect(out).toContain('~ C');
  });
});

describe('formatTransformResult', () => {
  it('includes total key count and change count', () => {
    const before = { A: '1', B: '2' };
    const after  = { A: '1', C: '3' };
    const summary = { added: ['C'], removed: ['B'], changed: [] };
    const out = formatTransformResult(before, after, summary);
    expect(out).toContain('1 key(s) in result');
    expect(out).toContain('2 change(s)');
  });
});

describe('formatValueChange', () => {
  it('formats a before/after value change', () => {
    expect(formatValueChange('FOO', 'old', 'new')).toBe('  FOO: "old" → "new"');
  });
});
