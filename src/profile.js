// profile.js — manage named environment profiles (dev, staging, prod, etc.)

/**
 * A profile is a named collection of env overrides layered on top of a base.
 * { name: string, vars: Record<string, string>, description?: string }
 */

export function createProfile(name, vars = {}, description = '') {
  if (!name || typeof name !== 'string' || !/^[\w-]+$/.test(name)) {
    throw new Error(`Invalid profile name: "${name}". Use alphanumeric, dash, or underscore.`);
  }
  return { name, vars: { ...vars }, description };
}

export function applyProfile(base, profile) {
  // Returns a new env object with profile vars merged over base
  return { ...base, ...profile.vars };
}

export function diffProfiles(profileA, profileB) {
  const keys = new Set([...Object.keys(profileA.vars), ...Object.keys(profileB.vars)]);
  const changes = [];
  for (const key of keys) {
    const a = profileA.vars[key];
    const b = profileB.vars[key];
    if (a !== b) {
      changes.push({ key, from: a ?? null, to: b ?? null });
    }
  }
  return changes;
}

export function listProfiles(profileMap) {
  return Object.values(profileMap).map(p => ({
    name: p.name,
    description: p.description,
    varCount: Object.keys(p.vars).length,
  }));
}

export function serializeProfile(profile) {
  const lines = [`# profile: ${profile.name}`];
  if (profile.description) lines.push(`# ${profile.description}`);
  for (const [k, v] of Object.entries(profile.vars)) {
    lines.push(`${k}=${v}`);
  }
  return lines.join('\n');
}

export function parseProfile(name, text, description = '') {
  const vars = {};
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    vars[key] = value;
  }
  return createProfile(name, vars, description);
}
