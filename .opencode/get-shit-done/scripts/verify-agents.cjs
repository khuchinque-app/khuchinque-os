#!/usr/bin/env node
/**
 * verify-agents.cjs — Validates all 33 GSD agent files and their registration
 *
 * Usage: node verify-agents.cjs [--check-registration]
 *   --check-registration  Also verify opencode.json has agent entries
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const AGENTS_DIR = path.join(ROOT, '.opencode', 'agents');
const OPENCODE_JSON = path.join(ROOT, 'opencode.json');

const agentFiles = fs.readdirSync(AGENTS_DIR)
  .filter(f => f.endsWith('.md'))
  .sort();

let passed = 0;
let failed = 0;
const errors = [];

console.log(`\nChecking ${agentFiles.length} agent files...\n`);

for (const file of agentFiles) {
  const filePath = path.join(AGENTS_DIR, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const agentName = file.replace('.md', '');
  const fileErrors = [];

  // Check YAML frontmatter
  const fmMatch = content.match(/^---\r?\n([\s\S]+?)\r?\n---/);
  if (!fmMatch) {
    fileErrors.push('Missing YAML frontmatter (--- blocks)');
  } else {
    const fm = fmMatch[1];
    if (!/^name:\s*\S+/m.test(fm)) fileErrors.push('Missing frontmatter: name');
    if (!/^description:\s*\S+/m.test(fm)) fileErrors.push('Missing frontmatter: description');
    if (!/^mode:\s*subagent/m.test(fm)) fileErrors.push('Missing frontmatter: mode (must be "subagent")');
  }

  // Check <role> section
  if (!/<role>/.test(content)) fileErrors.push('Missing <role> section');

  if (fileErrors.length) {
    failed++;
    errors.push({ agent: agentName, issues: fileErrors });
  } else {
    passed++;
  }
}

console.log(`Agent structural validation:`);
for (const file of agentFiles) {
  const agentName = file.replace('.md', '');
  const err = errors.find(e => e.agent === agentName);
  if (err) {
    console.log(`  FAIL  ${agentName}`);
    err.issues.forEach(i => console.log(`        - ${i}`));
  } else {
    console.log(`  PASS  ${agentName}`);
  }
}

console.log(`\n${passed} passed, ${failed} failed`);

if (process.argv.includes('--check-registration')) {
  console.log();
  const config = JSON.parse(fs.readFileSync(OPENCODE_JSON, 'utf-8'));
  const registered = config.agent ? Object.keys(config.agent) : [];
  const unregistered = agentFiles
    .map(f => f.replace('.md', ''))
    .filter(name => !registered.includes(name));

  if (unregistered.length === 0) {
    console.log('Registration check: All 33 agents registered in opencode.json');
  } else {
    console.log(`Registration check: ${unregistered.length} agents NOT registered in opencode.json:`);
    for (const name of unregistered) console.log(`  - ${name}`);
  }
}

if (failed > 0) process.exit(1);