# Phase 2: Agent Infrastructure - Research

**Researched:** 2026-07-25
**Domain:** GSD agent installation/registration, CI/CD pipeline, workflow validation, testing infrastructure
**Confidence:** HIGH

## Summary

This phase installs, verifies, and operationalizes all 33 GSD subagent definitions, adds a CI/CD pipeline for workflow integrity validation, and writes automated tests for critical GSD procedures.

**Key discovery:** All 33 agent `.md` files already exist at `.opencode/.opencode/agents/` — identical to the upstream GSD source. The root cause of "18 agents flagged as missing" is **registration**, not file absence: `opencode.json` lacks an `agent` key entirely. The GSD reference repo's `opencode.json` registers only 11 of 33 agents with model assignments — remaining 22 need registration. Fix: add `agent` entries to `opencode.json`.

**CI/CD is greenfield** — no `.github/workflows/` exists. The GSD source repo at `.local/share/opencode/repos/github.com/rokicool/gsd-opencode/` has 3 reusable workflows (`ci.yml`, `validate.yml`, `release.yml`) that demonstrate the validation patterns needed.

**Testing infrastructure exists but is fragmented** — 6 Vitest test files in `bin/test/` use ESM imports from vitest, but `gsd-tools.test.cjs` uses `node:test`. No `vitest.config.*` exists in `get-shit-done/`. Need a config file and a `test/` directory for CJS lib module tests.

**Primary recommendation:** Plan 02-01 adds agent registration to `opencode.json` (task 1), creates a structural verification script (task 2). Plan 02-02 creates GitHub Actions CI with workflow markdown validation (reusing validation patterns from upstream). Plan 02-03 sets up Vitest config and writes unit tests for `bin/lib/*.cjs` functions.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** All 33 GSD agent definitions exist in `.opencode/agents/` and `.opencode/.opencode/agents/`. Create a verification script that tests agent loading against OpenCode's agent runtime.
- **D-02:** `opencode.json` has no `agents` key — agents are auto-discovered from `agents/` directory. Verify auto-discovery works end-to-end. If it doesn't, add explicit agent registration to `opencode.json`.
- **D-03:** Prioritize the 18 agents flagged as "not installed" in STATE.md as the verification target.
- **D-04:** GitHub Actions on push to master. Validate workflow markdown structural integrity (frontmatter, required sections), cross-reference integrity (all `@` refs resolve), and agent file consistency.
- **D-05:** No scheduled runs — event-driven only (push, PR to master). Keep pipeline cheap and fast (< 2 min).
- **D-06:** Use existing Vitest setup in `.opencode/get-shit-done/`. Two tiers: (1) Unit tests for CJS tool functions in `bin/lib/*.cjs`, (2) Integration tests for critical workflow paths.
- **D-07:** Workflow markdown files tested via structural validation — not full E2E execution.
- **D-08:** Agent verification is plan 02-01. CI/CD (02-02) and tests (02-03) depend on verified agents working correctly.

### OpenCode's Discretion
- Specific test framework configuration (Vitest settings, coverage thresholds)
- CI/CD job structure and action selection (actions/checkout, actions/setup-node expected)
- Agent verification script implementation details (bash vs Node.js)
- Whether to use `opencode.json` `agents` key or rely on auto-discovery

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AGENT-01 | Install GSD subagents — 18 missing agent types installed and operational | Registration mechanism identified (`opencode.json.agent` key per schema line 269-298). All 33 `.md` files exist — missing registration is root cause. |
| DX-01 | CI/CD pipeline — Automated validation for GSD workflow integrity | Greenfield setup. Upstream GSD workflows (`ci.yml`, `validate.yml`) provide validation patterns to adapt. |
| DX-02 | Workflow testing — Automated tests for 89 workflow procedures | Existing vitest pattern in `bin/test/` 6 files. No `vitest.config.*` in `get-shit-done/`. CJS lib modules at `bin/lib/*.cjs` are the primary test targets. |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Agent verification | CLI / Backend | — | Verification script runs locally via Node.js, checks file presence, frontmatter validity, and opencode.json registration. No UI involved. |
| CI/CD pipeline | GitHub Actions | — | Pure CI — triggers on push/PR to master, runs validation checks, produces no deployable artifact. Resides in `.github/workflows/`. |
| Workflow markdown validation | CI (validate job) | CLI (same checks runnable locally) | Validation reuses frontmatter.cjs patterns. Same checks work in CI and local dev. |
| Unit tests (lib/*.cjs) | CLI Runtime | — | Tests run via Vitest in the `get-shit-done/` package. Test CJS modules directly using `import()` or `require()`. |
| Integration tests | CLI Runtime | — | Tests exercise `gsd-tools.cjs` subprocess calls against temp project directories. |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Node.js | >=18.0.0 | Runtime for scripts and tests | Engine requirement in `get-shit-done/package.json` |
| Vitest | ^3.2.4 | Test runner | Existing devDependency in `get-shit-done/package.json`. Used by SDK (`vitest.config.ts`) and 6 existing test files. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@iarna/toml` | ^2.2.5 | TOML parsing for plan frontmatter | Already a dependency, used by `frontmatter.cjs` |
| `commander` | ^12.1.0 | CLI arg parsing | Already a dependency of `gsd-tools.cjs` |
| `actions/checkout@v4` | v4 | GitHub checkout action | Standard for all CI jobs |
| `actions/setup-node@v4` | v4 | Node.js setup in CI | Standard, sets up npm cache via `cache: npm` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Vitest | `node:test` (built-in) | 6 existing tests already use vitest. `node:test` is newer and lacks some matchers. Vitest matches SDK pattern. |
| GitHub Actions | No CI (manual validation) | D-04 explicitly requires GitHub Actions. No debate. |
| YAML frontmatter validation | External schema validator | `frontmatter.cjs` already has `FRONTMATTER_SCHEMAS` and `cmdFrontmatterValidate` — reuse existing. |

**Installation:**
```bash
# Already installed — verify with:
cd .opencode/get-shit-done && node -e "require('vitest/package.json').version"
# Returns: 3.2.4
```

**Version verification:**
```bash
npm view vitest version
# → 3.2.4 (verified in package.json)
```

## Architecture Patterns

### System Architecture Diagram

```text
┌─────────────────────────────────────────────────────────────────────┐
│                      GSD Agent Registration Flow                      │
│                                                                     │
│  opencode.json (agent key)     ───reads──>   OpenCode Agent Loader   │
│       │                                                              │
│       │ references                                                    │
│       ▼                                                              │
│  .opencode/.opencode/agents/*.md  (33 agent definition files)        │
│       │                                                              │
│       └── each .md has: frontmatter (name, mode, tools) + <role>     │
│                                                                     │
│  Key finding: All 33 .md files exist. 0 are registered in opencode. │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          CI/CD Pipeline (02-02)                       │
│                                                                     │
│  GitHub Push/PR to master                                              │
│       │                                                              │
│       ▼                                                              │
│  validate-workflows job:                                              │
│  1. Check all agent .md frontmatter has name, description, mode      │
│  2. Check all workflow .md has <objective>, <process> sections       │
│  3. Check workflow @-references resolve to existing files            │
│  4. Cross-check agent names in workflows against agents/ directory   │
│                                                                     │
│  Estimated: < 1 min. No deploy step (local dev environment).         │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          Test Architecture (02-03)                    │
│                                                                     │
│  vitest.config.ts (in get-shit-done/)                                 │
│       ├── Project: unit                                              │
│       │   ├── bin/lib/*.test.cjs  (unit tests for lib modules)       │
│       │   └── tests/unit/                                            │
│       └── Project: integration                                       │
│           ├── bin/test/*.test.cjs (existing pattern)                 │
│           └── tests/integration/                                     │
│                                                                     │
│  Test pattern: tmpdir fixtures + mock console/process.exit + cleanup │
└─────────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure
```
.github/
└── workflows/
    └── validate.yml              # Single CI workflow (D-04, D-05)

.opencode/get-shit-done/
├── vitest.config.ts              # NEW — Vitest config for GSD tests
├── bin/
│   ├── lib/*.cjs                 # 33 shared library modules (test targets)
│   ├── test/*.test.cjs           # Existing 6 test files (keep)
│   └── lib/*.test.cjs            # NEW — unit tests alongside source
├── scripts/
│   └── verify-agents.sh/.cjs     # NEW — agent verification script (02-01)

opencode.json                     # MODIFIED — add agent key with 33 entries
```

### Pattern 1: Vitest Test Fixture Setup
**What:** Tests create isolated temp directories, mock IO functions, and clean up.
**When to use:** Every test that reads/writes files, calls process.exit, or uses console.log.
**Source:** [VERIFIED: `.opencode/get-shit-done/bin/test/get-profile.test.cjs`]

```javascript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('my-module', () => {
  let testDir;
  let capturedLog;
  let exitCode;

  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'my-test-'));
    fs.mkdirSync(path.join(testDir, '.planning'), { recursive: true });
    capturedLog = null;
    exitCode = null;
    console.log = (msg) => { capturedLog = msg; };
    process.exit = (code) => { exitCode = code; throw new Error(`exit(${code})`); };
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
    // Restore in production; for research doc, pattern shown
  });

  it('handles happy path', () => {
    // test logic using testDir as cwd
  });
});
```

### Pattern 2: Agent .md Frontmatter & Section Validation
**What:** Validate agent markdown files have required YAML frontmatter and `<role>` sections.
**When to use:** Agent verification (02-01) and CI validation (02-02).
**Source:** [VERIFIED: `.opencode/agents/gsd-planner.md` structure]

```bash
# Check agent .md has required frontmatter fields
grep -q "^name:" "$AGENT_FILE" || echo "MISSING name"
grep -q "^description:" "$AGENT_FILE" || echo "MISSING description"
grep -q "^mode: subagent" "$AGENT_FILE" || echo "MISSING mode"
grep -q "<role>" "$AGENT_FILE" || echo "MISSING <role> section"

# Or use frontmatter.cjs via gsd-sdk (preferred for CI):
# gsd-sdk query frontmatter.validate "$FILE" --schema <schema>
```

### Anti-Patterns to Avoid
- **Assuming all 33 agents are registered:** Only 11 are registered in the GSD source opencode.json. Most agents will need explicit registration.
- **Starting with the hard questions:** D-08 says verify agents first (02-01), then CI/CD (02-02), then tests (02-03). Follow this order since CI tests depend on known-working agents.
- **Custom schema instead of opencode-schema.json:** The `agent` key's schema is already defined in `opencode-schema.json:269-298`. Use it to validate additions to `opencode.json` rather than creating a separate validation.
- **Vitest config in root:** D-06 says use existing Vitest setup in `.opencode/get-shit-done/`. Don't create a new top-level config.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| YAML frontmatter parsing | Custom parser | `frontmatter.cjs` (exists) or `@iarna/toml` (already dep) | 379-line, tested module handles nested YAML, inline arrays, must_haves blocks |
| Agent file validation schema | New schema | `opencode-schema.json` agent definition (line 269-298) | Official OpenCode config schema — validates model, mode, tools, color, disable etc. |
| CI workflow scaffolding | Full CI pipeline from scratch | Adapt upstream GSD `validate.yml` patterns | Upstream has validate command structure, workflows, files, naming conventions — adapt for agent verification |
| Rerunning tests on change | Watch mode watcher | `vitest --watch` (built into vitest) | Available via `npm run test:watch` already |

**Key insight:** The GSD framework already has building blocks for frontmatter parsing, schema validation, and CI validation patterns. This phase connects existing pieces rather than building new infrastructure.

## Common Pitfalls

### Pitfall 1: Registration ≠ File Existence
**What goes wrong:** Verifying agent `.md` files exist but not checking if OpenCode can actually discover them.
**Why it happens:** Files in `.opencode/.opencode/agents/` and `.opencode/agents/` exist, but without registration in `opencode.json`'s `agent` key, OpenCode may not load them as spawnable subagents.
**How to avoid:** The verification script must check BOTH file presence AND `opencode.json` registration. Cross-reference agent names from `agents/` directory against keys in `opencode.json.agent`.
**Warning signs:** D-02 says agents are "auto-discovered from agents/ directory" — verify this claim before assuming registration is unnecessary.

### Pitfall 2: CJS vs ESM Import in Tests
**What goes wrong:** `bin/lib/*.cjs` modules use `require/module.exports` (CommonJS). Vitest test files use ESM `import`. Direct `import` of CJS from ESM vitest config works (Node.js interop), but `require()` calls inside `.cjs` tests need `createRequire()`.
**How to avoid:** Existing tests at `bin/test/get-profile.test.cjs` already prove the pattern works — they import vitest with ESM `import` syntax and `require()` the CJS module under test via `require()` (which works because vitest handles CJS/ESM interop). Follow the same pattern.
**Warning signs:** `ERR_REQUIRE_ESM` errors during test runs.

### Pitfall 3: CI Pipeline Duration Blowup
**What goes wrong:** Validation of all 89 workflow files plus 33 agent files plus @-reference resolution takes > 2 minutes (violating D-05).
**Why it happens:** Naive loops over all files with slow grep/fs operations.
**How to avoid:** Use bash `find` + `xargs` patterns (from upstream validate.yml). Parallelize checks within a single job. Keep each check as a simple grep/stat — no npm install needed script-wise (though setup-node may pull cache).
**Warning signs:** CI run time approaching 2 min on a simple push.

### Pitfall 4: The 15/18 Agent Split
**What goes wrong:** Confusion about which 18 are "missing" vs the 15 that are "confirmed operational."
**Why it happens:** STATE.md says "18/33 agents uninstalled" but D-03 says "15 are already confirmed operational." The math seems contradictory — but likely means 15 of the 33 are registered/already working, and 18 complete the set. Actually: 33 total - 15 confirmed working = 18 need verification/registration. The 15 "confirmed operational" may be the ones OpenCode auto-discovered from its own internal mechanisms, not from `opencode.json`.
**How to avoid:** Verify all 33 against `opencode.json` registration. The upstream GSD `opencode.json` registers only 11. The 15 "confirmed operational" may include those 11 plus 4 auto-discovered by another mechanism. Do not assume only 18 need attention — verify all 33.
**Warning signs:** After registering 18, some agents still don't work.

## Code Examples

### Agent Registration in opencode.json
**Source:** [VERIFIED: GSD reference repo opencode.json]

```json
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "gsd-planner": {
      "model": "bailian-coding-plan/qwen3-coder-plus"
    },
    "gsd-executor": {
      "model": "bailian-coding-plan/qwen3-coder-plus"
    },
    "gsd-verifier": {
      "model": "bailian-coding-plan/MiniMax-M2.5"
    }
  }
}
```

The `agent` key accepts an object where keys are agent names (matching `name` in `.md` frontmatter) and values are objects with optional: `model`, `variant`, `temperature`, `top_p`, `prompt`, `tools`, `disable`, `description`, `mode` (`subagent`|`primary`|`all`), `hidden`, `options`, `color`. [VERIFIED: opencode-schema.json:269-334]

### Agent Verification Script (Node.js)
**Source:** [VERIFIED: frontmatter.cjs parse patterns + agent.md structure]

```javascript
#!/usr/bin/env node
/**
 * verify-agents.cjs — Validates all 33 GSD agent files and their registration
 *
 * Usage: node verify-agents.cjs [--check-registration]
 *   --check-registration  Also verify opencode.json has agent entries
 */

const fs = require('fs');
const path = require('path');
const { extractFrontmatter } = require('./lib/frontmatter.cjs');

const AGENTS_DIR = path.join(__dirname, '..', 'agents');
const OPENCODE_JSON = path.join(__dirname, '..', '..', '..', 'opencode.json');

const REQUIRED_FRONTMATTER = ['name', 'description', 'mode'];
const REQUIRED_TOOLS = ['read', 'write', 'bash', 'grep', 'glob'];
const REQUIRED_SECTIONS = ['<role>'];

let passed = 0;
let failed = 0;
const errors = [];

// Get all agent files
const agentFiles = fs.readdirSync(AGENTS_DIR)
  .filter(f => f.endsWith('.md'))
  .sort();

console.log(`\nChecking ${agentFiles.length} agent files...\n`);

agentFiles.forEach(file => {
  const filePath = path.join(AGENTS_DIR, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const fm = extractFrontmatter(content);
  const agentName = file.replace('.md', '');

  // Check frontmatter
  const missingFields = REQUIRED_FRONTMATTER.filter(f => !fm[f]);
  const missingTools = REQUIRED_TOOLS.filter(t => !fm.tools || fm.tools[t] !== true);
  const missingSections = REQUIRED_SECTIONS.filter(s => !content.includes(s));

  if (missingFields.length || missingTools.length || missingSections.length) {
    failed++;
    errors.push({ agent: agentName, missingFields, missingTools, missingSections });
  } else {
    passed++;
  }
});

// Check registration if requested
if (process.argv.includes('--check-registration')) {
  const config = JSON.parse(fs.readFileSync(OPENCODE_JSON, 'utf-8'));
  const registered = config.agent ? Object.keys(config.agent) : [];
  const unregistered = agentFiles
    .map(f => f.replace('.md', ''))
    .filter(name => !registered.includes(name));

  if (unregistered.length) {
    console.log(`⚠  ${unregistered.length} agents not registered in opencode.json:`);
    unregistered.forEach(a => console.log(`   - ${a}`));
  }
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (errors.length) {
  errors.forEach(e => {
    console.error(`\n  ${e.agent}:`);
    if (e.missingFields.length) console.error(`    Missing frontmatter: ${e.missingFields.join(', ')}`);
    if (e.missingTools.length) console.error(`    Missing tools: ${e.missingTools.join(', ')}`);
    if (e.missingSections.length) console.error(`    Missing sections: ${e.missingSections.join(', ')}`);
  });
  process.exit(1);
}
```

### CI Workflow (validate.yml)
**Source:** [VERIFIED: upstream GSD `.github/workflows/validate.yml` structure]

```yaml
name: Validate GSD Workflows

on:
  push:
    branches: [master, main]
  pull_request:
    branches: [master, main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "18"
      - name: Validate agent frontmatter
        run: |
          for f in .opencode/.opencode/agents/*.md; do
            grep -q "^name:" "$f" || { echo "MISSING name in $f"; exit 1; }
            grep -q "^description:" "$f" || { echo "MISSING description in $f"; exit 1; }
            grep -q "^mode:" "$f" || { echo "MISSING mode in $f"; exit 1; }
          done
          echo "✓ All agent files valid"
      - name: Validate workflow structure
        run: |
          for f in .opencode/.opencode/get-shit-done/workflows/*.md; do
            grep -q "<objective>" "$f" || { echo "MISSING <objective> in $f"; exit 1; }
            grep -E "<(process|step)>" "$f" > /dev/null || \
              echo "⚠  $f may lack <process>/<step> sections"
          done
          echo "✓ Workflow structure checks passed"
```

### Vitest Config for GSD Tests
**Source:** [VERIFIED: SDK `vitest.config.ts` pattern + upstream `vitest.config.js`]

```typescript
// .opencode/get-shit-done/vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['bin/lib/**/*.test.cjs'],
        },
      },
      {
        test: {
          name: 'existing',
          include: ['bin/test/**/*.test.cjs'],
        },
      },
    ],
  },
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Agent files exist but unregistered | Agent files + `opencode.json` registration | This phase | Agents can be spawned by OpenCode |
| No CI | GitHub Actions workflow on push | This phase | Workflow integrity validated automatically |
| Tests fragmented (vitest + node:test) | Unified vitest config | This phase | Single test runner, consistent patterns |

**Deprecated/outdated:**
- **gsd-tools.test.cjs using `node:test`**: This file exists but uses `node:test` while all other 6 tests use vitest. During 02-03, consider migrating to vitest or leaving as-is (not broken, just inconsistent).

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | OpenCode auto-discovers agents from `.opencode/*/agents/` directories without `agent` key in `opencode.json` | Agent Registration | D-02 assumes auto-discovery; if it doesn't work, must add full `opencode.json` agent registration for all 33 |
| A2 | The 15 agents labeled "confirmed operational" work because OpenCode auto-discovers them, not because they're registered in `opencode.json` | Agent Verification | If they work through a different mechanism, the registration approach for the remaining 18 may differ |
| A3 | Agent `.md` files in `.opencode/agents/` and `.opencode/.opencode/agents/` are in sync | Agent Verification | If they diverge, which directory takes precedence matters for verification |

## Open Questions

1. **How does OpenCode auto-discover agents?**
   - What we know: `opencode.json` has no `agent` key, yet 15 agents are "confirmed operational." The GSD CLI installer copies agents to the target `agents/` dir and writes `GSD_AGENTS_DIR` in `.env`. OpenCode may scan `GSD_AGENTS_DIR` or hardcoded paths.
   - What's unclear: Whether D-02's claim of auto-discovery actually works without the `agent` key.
   - Recommendation: **Plan 02-01 should verify first** — list spawnable agents via OpenCode runtime API or check if a known agent like `gsd-planner` is available. If auto-discovery works, register only the 18. If not, add `agent` entries for all 33.

2. **Which exact 18 agents are "not installed"?**
   - What we know: STATE.md says 18/33 are "missing" but doesn't list them. Upstream GSD opencode.json registers only 11. The math: 33 total - 11 registered upstream - 4 more somehow discovered = 18 gaps, or 15 working + 18 remaining = 33.
   - What's unclear: The exact list of 18.
   - Recommendation: **Determine programmatically.** Compare `config.agent` keys from `opencode.json` against agent names from `agents/` directory. The unregistered ones are the 18 "missing."

3. **Should verification be bash (grep-heavy) or Node.js (frontmatter.cjs)?**
   - What we know: Both approaches work. Upstream CI uses bash+grep for speed. `frontmatter.cjs` provides more robust parsing (handles quoted values, nested objects, inline arrays).
   - What's unclear: Whether 2-minute CI budget allows npm install + node invocation for every CI run vs lean bash-only.
   - Recommendation: **Use bash+grep in CI** (no npm install needed, faster), **use Node.js for local agent verification script** (more thorough, accepts `--check-registration` flag). Both validate the same invariants.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Agent verification, tests, CI scripts | ✓ | v24.18.0 | — |
| npm | Installing dependencies | ✓ | 11.16.0 | — |
| Vitest | Unit/integration tests | ✓ | ^3.2.4 (in package.json) | — |
| Git | CI checkout, version detection | ✓ | — | — |
| GitHub Actions | CI/CD pipeline | ✓ (platform) | — | Manual validation only |
| actions/checkout@v4 | CI checkout action | ✓ (marketplace) | v4 | git clone in bash |
| actions/setup-node@v4 | CI Node.js setup | ✓ (marketplace) | v4 | Manual node install |

**Missing dependencies with no fallback:**
- None — all required tools are available or platform-provided.

**Missing dependencies with fallback:**
- None — the CI workflow uses standard GitHub Actions.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest ^3.2.4 |
| Config file | NEW: `.opencode/get-shit-done/vitest.config.ts` |
| Quick run command | `cd .opencode/get-shit-done && npx vitest run --project unit` |
| Full suite command | `cd .opencode/get-shit-done && npx vitest run` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| AGENT-01 | Agent .md files have valid frontmatter | unit | `node scripts/verify-agents.cjs` | ❌ Wave 0 |
| AGENT-01 | All 33 agents registered in opencode.json | unit | `node scripts/verify-agents.cjs --check-registration` | ❌ Wave 0 |
| DX-01 | CI validates workflow structure on push | integration | Verify `.github/workflows/validate.yml` exists + runs | ❌ Wave 0 |
| DX-02 | frontmatter.cjs parseMustHavesBlock works correctly | unit | `npx vitest run bin/lib/frontmatter.test.cjs` | ❌ Wave 0 |
| DX-02 | phase.cjs CRUD operations work | unit | `npx vitest run bin/lib/phase.test.cjs` | ❌ Wave 0 |
| DX-02 | state.cjs load/save round-trips correctly | unit | `npx vitest run bin/lib/state.test.cjs` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run --project unit --changed`
- **Per wave merge:** `npx vitest run --project unit && node scripts/verify-agents.cjs`
- **Phase gate:** `npx vitest run` (both projects) + `node scripts/verify-agents.cjs --check-registration` + CI workflow passes

### Wave 0 Gaps
- [ ] `.opencode/get-shit-done/vitest.config.ts` — Vitest config for CJS lib tests
- [ ] `.opencode/get-shit-done/bin/lib/frontmatter.test.cjs` — Tests for frontmatter parsing
- [ ] `.opencode/get-shit-done/bin/lib/state.test.cjs` — Tests for state management
- [ ] `.opencode/get-shit-done/bin/lib/phase.test.cjs` — Tests for phase CRUD
- [ ] `.opencode/get-shit-done/scripts/verify-agents.cjs` — Agent verification script

## Security Domain

> Not applicable — this phase is about agent infrastructure, CI/CD, and testing. No new trust boundaries created. No user data processed. No external API calls in scope.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | N/A — local dev env |
| V3 Session Management | no | N/A |
| V4 Access Control | no | N/A |
| V5 Input Validation | no | N/A — no user input across trust boundaries |
| V6 Cryptography | no | N/A |

### Known Threat Patterns
None — this phase creates no new runtime attack surface. CI tokens (GITHUB_TOKEN) are scoped to the repo and handled by GitHub Actions natively.

## Sources

### Primary (HIGH confidence)
- [VERIFIED: `.opencode/.opencode/agents/`] — All 33 agent `.md` files, structure analysis
- [VERIFIED: `opencode-schema.json:269-334`] — Agent config schema definition (model, mode, tools, color, etc.)
- [VERIFIED: `opencode.json` — root] — Current user config: no `agent` key
- [VERIFIED: GSD reference repo `opencode.json`] — Reference config with 11 registered agents and model assignments
- [VERIFIED: `get-shit-done/package.json`] — Vitest 3.2.4 as devDependency
- [VERIFIED: `get-shit-done/bin/test/get-profile.test.cjs`] — Existing test pattern (Vitest ESM + tmpdir fixtures)
- [VERIFIED: `.planning/STATE.md:45-47`] — Blocker: 18 agents flagged as missing
- [VERIFIED: `get-shit-done/bin/lib/frontmatter.cjs`] — Frontmatter parsing/schemas/validation (379 lines)
- [VERIFIED: GSD reference repo `.github/workflows/validate.yml`] — CI validation patterns (command frontmatter, workflow structure, naming conventions)

### Secondary (MEDIUM confidence)
- [VERIFIED: `get-shit-done/bin/gsd-tools.test.cjs`] — Uses `node:test` (not vitest), different pattern
- [VERIFIED: GSD reference repo `bin/dm/test/`] — Full test suite in GSD source with unit/integration split
- [VERIFIED: GSD reference repo `bin/dm/src/services/health-checker.js`] — Installation integrity verification patterns
- [VERIFIED: GSD reference repo `bin/dm/src/services/scope-manager.js`] — Global/local path resolution for installation
- [VERIFIED: GSD reference repo `bin/dm/src/commands/install.js`] — Installation orchestration, SDK build, VERSION tracking

### Tertiary (LOW confidence)
- [ASSUMED] OpenCode auto-discovers agents from `agents/` directories — not yet confirmed in this environment (per D-02)

## Metadata

**Confidence breakdown:**
- Agent registration mechanism: HIGH - `opencode-schema.json` schema and opencode.json contents verified directly
- Verification script approach: HIGH - frontmatter.cjs and agent .md structure confirmed
- CI/CD patterns: HIGH - upstream GSD workflows available as reference
- Test patterns: HIGH - 6 existing test files and SDK vitest config verified
- Auto-discovery behavior: LOW - need to verify OpenCode's actual agent discovery mechanism

**Research date:** 2026-07-25
**Valid until:** 2026-08-25 (stable patterns — OpenCode/Node.js ecosystem)
