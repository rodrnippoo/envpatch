const fs = require('fs');
const os = require('os');
const path = require('path');
const { watchEnv } = require('./watch');

function tmpFile(content = '') {
  const p = path.join(os.tmpdir(), `envpatch-watch-${Date.now()}-${Math.random().toString(36).slice(2)}.env`);
  fs.writeFileSync(p, content, 'utf8');
  return p;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

describe('watchEnv', () => {
  test('calls onChange when file content changes', async () => {
    const file = tmpFile('FOO=1\nBAR=2\n');
    const changes = [];

    const handle = watchEnv(file, {
      onChange: (d) => changes.push(d),
    });

    await sleep(50);
    fs.writeFileSync(file, 'FOO=1\nBAR=3\nBAZ=new\n', 'utf8');
    await sleep(200);

    handle.stop();
    fs.unlinkSync(file);

    expect(changes.length).toBeGreaterThanOrEqual(1);
    const last = changes[changes.length - 1];
    expect(last.changed.some((c) => c.key === 'BAR')).toBe(true);
    expect(last.added.some((a) => a.key === 'BAZ')).toBe(true);
  });

  test('does not call onChange when content is identical', async () => {
    const file = tmpFile('FOO=1\n');
    const changes = [];

    const handle = watchEnv(file, {
      onChange: (d) => changes.push(d),
    });

    await sleep(50);
    fs.writeFileSync(file, 'FOO=1\n', 'utf8');
    await sleep(200);

    handle.stop();
    fs.unlinkSync(file);

    expect(changes.length).toBe(0);
  });

  test('includes audit entry in onChange callback', async () => {
    const file = tmpFile('A=1\n');
    const entries = [];

    const handle = watchEnv(file, {
      onChange: (_, entry) => entries.push(entry),
    });

    await sleep(50);
    fs.writeFileSync(file, 'A=2\n', 'utf8');
    await sleep(200);

    handle.stop();
    fs.unlinkSync(file);

    expect(entries.length).toBeGreaterThanOrEqual(1);
    expect(entries[0]).toHaveProperty('action', 'watch-change');
    expect(entries[0]).toHaveProperty('timestamp');
  });
});
