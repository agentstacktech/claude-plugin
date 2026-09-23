#!/usr/bin/env node
/**
 * Claude Code plugin structural validation (publish-safe, no monorepo imports).
 * @see repo.plugins.claude.gen1
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SEMVER = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;
const HARD_CODED_ACTION_COUNT = /\b(60|70|80|100|149|300|332|500)\+?\s*(MCP\s+)?actions?\b/i;

const ANTHROPIC_RESERVED_MARKETPLACES = new Set([
  'claude-code-marketplace',
  'claude-code-plugins',
  'claude-plugins-official',
  'claude-plugins-community',
  'claude-community',
  'anthropic-marketplace',
  'anthropic-plugins',
]);

const LEAK_PATTERNS = [
  /docs\/operations\//,
  /agentstack-core\//,
  /~\/\.cursor\//,
  /rules\/agentstack-[^\s`]+\.mdc/,
  /\.\.\/\.\.\/commands\/agentstack-/,
  /agentstack_safe_project_cycle/,
  /agentstack_tenant_ops_mcp_first/,
];

const MIN_MIRROR_SKILLS = 29;

let errors = 0;
let warnings = 0;

function fail(msg) {
  errors += 1;
  console.error(`FAIL ${msg}`);
}

function warn(msg) {
  warnings += 1;
  console.warn(`WARN ${msg}`);
}

function ok(msg) {
  console.log(`OK   ${msg}`);
}

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    fail(`${path.relative(ROOT, p)}: ${e.message}`);
    return null;
  }
}

function listSkillDirs() {
  const skillsRoot = path.join(ROOT, 'skills');
  if (!fs.existsSync(skillsRoot)) return [];
  return fs
    .readdirSync(skillsRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
}

function scanSkillLeaks() {
  let leaks = 0;
  for (const name of listSkillDirs()) {
    const skill = path.join(ROOT, 'skills', name, 'SKILL.md');
    if (!fs.existsSync(skill)) continue;
    const text = fs.readFileSync(skill, 'utf8');
    for (const re of LEAK_PATTERNS) {
      if (re.test(text)) {
        console.error(`FAIL partner skill leak ${name}: ${re}`);
        leaks += 1;
      }
    }
  }
  return leaks;
}

if (fs.existsSync(path.join(ROOT, 'marketplace.json'))) {
  fail('remove root marketplace.json; use .claude-plugin/marketplace.json');
} else {
  ok('no legacy root marketplace.json');
}

for (const rel of ['.claude-plugin/plugin.json', '.claude-plugin/marketplace.json', 'skills', 'MCP_QUICKSTART.md']) {
  if (!fs.existsSync(path.join(ROOT, rel))) fail(`missing required path: ${rel}`);
  else ok(`present: ${rel}`);
}

const manifest = readJson(path.join(ROOT, '.claude-plugin/plugin.json'));
const marketplace = readJson(path.join(ROOT, '.claude-plugin/marketplace.json'));

if (manifest) {
  for (const key of ['name', 'version', 'description', 'author']) {
    if (!manifest[key]) fail(`plugin.json: missing ${key}`);
  }
  if (manifest.version && !SEMVER.test(manifest.version)) fail('plugin.json: invalid semver');
  if (manifest.$schema !== undefined) fail('plugin.json: must not ship $schema');
  else ok(`plugin.json version ${manifest.version}`);
}

if (marketplace) {
  if (!marketplace.name) fail('marketplace.json: missing name');
  if (!marketplace.owner?.name) fail('marketplace.json: missing owner.name');
  if (ANTHROPIC_RESERVED_MARKETPLACES.has(marketplace.name)) {
    fail(`marketplace.json: reserved name ${marketplace.name}`);
  }
  if (marketplace.$schema !== undefined) fail('marketplace.json: must not ship $schema');
  const entry = marketplace.plugins?.[0];
  if (!entry?.name) fail('marketplace.json: missing plugins[0].name');
  if (!String(entry?.source || '').startsWith('./')) {
    fail('marketplace.json: plugins[0].source must start with ./');
  } else {
    ok('marketplace source uses ./ prefix');
  }
  if (entry?.version) {
    warn('marketplace entry has version — prefer plugin.json as sole SoT');
    if (manifest?.version && entry.version !== manifest.version) {
      warn('marketplace entry version differs from plugin.json');
    }
  }
}

const skillDirs = listSkillDirs();
if (skillDirs.length < MIN_MIRROR_SKILLS) {
  fail(`expected at least ${MIN_MIRROR_SKILLS} skill folders, found ${skillDirs.length}`);
} else {
  ok(`skill folders: ${skillDirs.length}`);
}

if (!skillDirs.includes('agentstack-prefer')) {
  warn('missing Claude-only skill agentstack-prefer');
}

if (scanSkillLeaks()) {
  fail('partner skill leak scan failed');
} else {
  ok('skill leak scan passed');
}

for (const rel of ['README.md', 'MARKETPLACE.md', 'MCP_QUICKSTART.md']) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) continue;
  if (HARD_CODED_ACTION_COUNT.test(fs.readFileSync(p, 'utf8'))) {
    fail(`${rel}: hard-coded action count — use GET /mcp/actions`);
  }
}

if (!fs.existsSync(path.join(ROOT, 'commands/agentstack-login.md'))) {
  fail('missing commands/agentstack-login.md');
} else {
  ok('login command present');
}

if (!fs.existsSync(path.join(ROOT, 'scripts/device-login.mjs'))) {
  fail('missing scripts/device-login.mjs');
} else {
  ok('device-login script present');
}

if (process.argv.includes('--strict-cli')) {
  const r = spawnSync('claude', ['plugin', 'validate', '.', '--strict'], {
    cwd: ROOT,
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
  if (r.status !== 0) {
    fail(`claude plugin validate --strict failed:\n${r.stdout || ''}${r.stderr || ''}`);
  } else {
    ok('claude plugin validate --strict passed');
  }
}

console.log('');
if (errors > 0) {
  console.error(`Validation FAILED with ${errors} error(s), ${warnings} warning(s).`);
  process.exit(1);
}
console.log(`All Claude plugin checks passed (${warnings} warning(s)).`);
