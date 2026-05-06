const { exportToJson, exportToShell, exportToYaml, exportEnv } = require('./export');

const sampleEnv = {
  APP_NAME: 'myapp',
  PORT: '3000',
  DB_URL: 'postgres://localhost/db',
  EMPTY_VAL: '',
  QUOTED_VAL: 'hello world',
};

describe('exportToJson', () => {
  test('exports pretty JSON by default', () => {
    const result = exportToJson(sampleEnv);
    const parsed = JSON.parse(result);
    expect(parsed.APP_NAME).toBe('myapp');
    expect(parsed.PORT).toBe('3000');
    expect(result).toContain('\n');
  });

  test('exports compact JSON when pretty=false', () => {
    const result = exportToJson(sampleEnv, { pretty: false });
    expect(result).not.toContain('\n');
    expect(JSON.parse(result).PORT).toBe('3000');
  });
});

describe('exportToShell', () => {
  test('wraps values in single quotes', () => {
    const result = exportToShell({ KEY: 'value' });
    expect(result).toBe("export KEY='value'");
  });

  test('escapes single quotes in values', () => {
    const result = exportToShell({ KEY: "it's here" });
    expect(result).toContain("KEY=");
    expect(result).toContain("it");
  });

  test('outputs multiple keys as separate lines', () => {
    const result = exportToShell({ A: '1', B: '2' });
    const lines = result.split('\n');
    expect(lines).toHaveLength(2);
    expect(lines[0]).toMatch(/^export A=/);
    expect(lines[1]).toMatch(/^export B=/);
  });
});

describe('exportToYaml', () => {
  test('exports simple values unquoted', () => {
    const result = exportToYaml({ KEY: 'simple' });
    expect(result).toBe('KEY: simple');
  });

  test('quotes values with special characters', () => {
    const result = exportToYaml({ KEY: 'value: with colon' });
    expect(result).toContain('"');
  });

  test('quotes empty values', () => {
    const result = exportToYaml({ KEY: '' });
    expect(result).toBe('KEY: ""');
  });
});

describe('exportEnv', () => {
  test('delegates to correct format', () => {
    expect(() => exportEnv(sampleEnv, 'json')).not.toThrow();
    expect(() => exportEnv(sampleEnv, 'shell')).not.toThrow();
    expect(() => exportEnv(sampleEnv, 'yaml')).not.toThrow();
  });

  test('throws on unknown format', () => {
    expect(() => exportEnv(sampleEnv, 'xml')).toThrow('Unsupported export format: xml');
  });
});
