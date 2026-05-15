const { formatInheritSummary, formatInheritEntry, formatInheritResult } = require('./formatInherit');

describe('formatInheritSummary', () => {
  const summary = {
    inherited: ['A'],
    overridden: ['B'],
    added: ['C'],
    total: 3,
  };

  it('includes base and child names', () => {
    const out = formatInheritSummary(summary, '.env.base', '.env.local');
    expect(out).toContain('.env.base');
    expect(out).toContain('.env.local');
  });

  it('lists inherited keys', () => {
    const out = formatInheritSummary(summary);
    expect(out).toContain('Inherited (1): A');
  });

  it('lists overridden keys', () => {
    const out = formatInheritSummary(summary);
    expect(out).toContain('Overridden (1): B');
  });

  it('lists added keys', () => {
    const out = formatInheritSummary(summary);
    expect(out).toContain('Added (1): C');
  });

  it('shows total', () => {
    const out = formatInheritSummary(summary);
    expect(out).toContain('Total keys: 3');
  });

  it('omits sections with no keys', () => {
    const s = { inherited: [], overridden: ['X'], added: [], total: 1 };
    const out = formatInheritSummary(s);
    expect(out).not.toContain('Inherited');
    expect(out).not.toContain('Added');
    expect(out).toContain('Overridden');
  });
});

describe('formatInheritEntry', () => {
  it('uses ↓ for inherited', () => {
    expect(formatInheritEntry('FOO', 'bar', 'inherited')).toBe('↓ FOO=bar');
  });

  it('uses ↑ for overridden', () => {
    expect(formatInheritEntry('FOO', 'bar', 'overridden')).toBe('↑ FOO=bar');
  });

  it('uses + for added', () => {
    expect(formatInheritEntry('FOO', 'bar', 'added')).toBe('+ FOO=bar');
  });
});

describe('formatInheritResult', () => {
  it('formats all entries with correct icons', () => {
    const result = { A: '1', B: 'new', C: '3' };
    const summary = { inherited: ['A'], overridden: ['B'], added: ['C'] };
    const out = formatInheritResult(result, summary);
    expect(out).toContain('↓ A=1');
    expect(out).toContain('↑ B=new');
    expect(out).toContain('+ C=3');
  });
});
