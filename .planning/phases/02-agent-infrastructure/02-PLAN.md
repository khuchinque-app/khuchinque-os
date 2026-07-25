---
phase: 02-agent-infrastructure
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - opencode.json
  - .opencode/get-shit-done/scripts/verify-agents.cjs
autonomous: true
requirements: [AGENT-01]
user_setup: []

must_haves:
  truths:
    - "All 33 agent .md files pass structural validation (frontmatter name/description/mode, <role> section)"
    - "opencode.json has agent key registering all 33 agents"
    - "Verification script runnable standalone, returns 0 when all pass"
    - "No agent file has missing required fields or sections"
  artifacts:
    - path: ".opencode/get-shit-done/scripts/verify-agents.cjs"
      provides: "Agent structural verification (frontmatter + section checks)"
      min_lines: 80
    - path: "opencode.json"
      provides: "Agent registration for all 33 GSD subagents"
      contains: "agent"
  key_links:
    - from: "opencode.json"
      to: ".opencode/.opencode/agents/*.md"
      via: "agent key names matching agent .md filenames"
      pattern: "agent\\s*:"
    - from: "verify-agents.cjs"
      to: ".opencode/.opencode/agents/"
      via: "reads agents/ dir + validates each .md"
      pattern: "agents"
---

<objective>
Install and verify all 33 GSD subagents.

Purpose: Root cause of "18 missing agents" is opencode.json lacking any `agent` key. All 33 `.md` files exist on disk — registration is missing. This plan adds registration and a verification script to confirm every agent has valid frontmatter and required sections.

Output: verify-agents.cjs script + updated opencode.json with agent key.
</objective>

<execution_context>
@./.opencode/get-shit-done/workflows/execute-plan.md
@./.opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/02-agent-infrastructure/02-CONTEXT.md
@.planning/phases/02-agent-infrastructure/02-RESEARCH.md
@opencode.json
@.opencode/.opencode/agents/gsd-planner.md
</context>

<tasks>

<task type="auto">
  <name>task 1: create agent structural verification script</name>
  <files>.opencode/get-shit-done/scripts/verify-agents.cjs</files>
  <action>
    Create a standalone Node.js CJS script at `.opencode/get-shit-done/scripts/verify-agents.cjs` that:
    
    1. Reads `.opencode/.opencode/agents/` — lists all .md files (expect 33)
    
    2. For each .md file, validates:
       - File is readable (fs.readFileSync doesn't throw)
       - Has YAML frontmatter (`/^---\r?\n[\s\S]+?\r?\n---/` matches)
       - Frontmatter contains: `name`, `description`, `mode` keys. `mode` must be `subagent`.
       - Body contains `<role>` section
       
       Per D-01/D-07: structural check only. Does NOT attempt runtime agent spawning.
    
    3. Reports:
       - PASS/FAIL per agent with specific missing fields
       - Summary: "X passed, Y failed"
       - Exit code 0 if all pass, 1 if any fail
    
    4. Accepts optional `--check-registration` flag. When set, also:
       - Reads opencode.json from repo root
       - Lists agents registered in `agent` key
       - Reports which agents are missing from registration (by comparing filenames to registered keys)
       - Does NOT exit non-zero for registration gaps — just reports them (the agent key addition may come after this script runs)
    
    Use only `fs`, `path` modules (no external deps). Keep it under 120 lines.
    
    ponytail: This script does NOT spawn agents or test runtime behavior. That would require OpenCode's agent loader API which doesn't expose a CLI entry point. Structural validation catches the vast majority of real failure modes (malformed frontmatter, missing critical sections).
  </action>
  <verify>
    <automated>node .opencode/get-shit-done/scripts/verify-agents.cjs</automated>
  </verify>
  <done>"33 passed, 0 failed" from verification script. Script exits 0.</done>
</task>

<task type="auto">
  <name>task 2: register all 33 agents in opencode.json</name>
  <files>opencode.json</files>
  <action>
    Add `agent` key to opencode.json with all 33 GSD subagents.
    
    Per D-02: verify auto-discovery first, but given 18 agents are flagged as missing, add explicit registration for all 33 agents. Per D-03, this covers all agents — not just the 18 flagged ones.
    
    Steps:
    
    1. Read opencode.json
    2. List all agent .md files from `.opencode/.opencode/agents/` — strip `.md` extension to get agent name
    3. Add `agent` key with each agent name mapped to a minimal config object:
       ```json
       "agent": {
         "gsd-planner": { "model": "bailian-coding-plan/qwen3-coder-plus" },
         ...
       }
       ```
    4. Use model `bailian-coding-plan/qwen3-coder-plus` for all agents — this is the standard GSD planning agent model from the upstream reference config. Per D-03, the verification target is structural validity + registration, not per-agent model optimization.
    5. Write updated opencode.json back
    
    Per D-02: after adding, run the verification script with `--check-registration` to confirm all 33 are registered:
    ```
    node .opencode/get-shit-done/scripts/verify-agents.cjs --check-registration
    ```
    
    Also run the structural check to confirm every agent still passes:
    ```
    node .opencode/get-shit-done/scripts/verify-agents.cjs
    ```
    
    ponytail: One model for all agents. If performance profiling later shows specific agents need different models (budget agents vs deep-reasoning agents), that's a separate optimization pass. Registration is the bottleneck, not model tuning.
  </action>
  <verify>
    <automated>node -e "JSON.parse(require('fs').readFileSync('opencode.json','utf8')).agent.length" &amp;&amp; node .opencode/get-shit-done/scripts/verify-agents.cjs --check-registration</automated>
  </verify>
  <done>opencode.json has `agent` key with all 33 agent names. Verification script reports 33 passed, 0 failed. Registration check shows 0 unregistered agents.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries
No new trust boundaries created — this plan modifies local config files and creates a verification script that only reads files within the repo.

## STRIDE Threat Register
No applicable threats — this plan adds no runtime attack surface, no network access, no user input across boundaries. opencode.json is a local config file with no secrets or credentials.
</threat_model>

<verification>
- `node .opencode/get-shit-done/scripts/verify-agents.cjs` exits 0, reports 33 passed
- `node .opencode/get-shit-done/scripts/verify-agents.cjs --check-registration` shows 0 unregistered agents
- `grep -c '"agent"' opencode.json` returns 1 (has agent key)
- `node -e "const a=JSON.parse(require('fs').readFileSync('opencode.json','utf8')).agent; console.log(Object.keys(a).length)"` prints 33
</verification>

<success_criteria>
- Verify-agents script passes all 33 agents structurally
- opencode.json registers all 33 agents with model configs
- Registration check confirms 0 gaps
</success_criteria>

<output>
After completion, create `.planning/phases/02-agent-infrastructure/02-01-SUMMARY.md`
</output>

---

---
phase: 02-agent-infrastructure
plan: 02
type: execute
wave: 2
depends_on: [02-01]
files_modified:
  - .github/workflows/validate.yml
autonomous: true
requirements: [DX-01]
user_setup:
  - service: github-actions
    why: "CI/CD pipeline runs on push to master"
    env_vars:
      - name: GITHUB_TOKEN
        source: "Auto-provided by GitHub Actions — no manual setup needed"

must_haves:
  truths:
    - "GitHub Actions workflow validates agent frontmatter on push to master"
    - "Workflow validates workflow markdown structure (objective, process sections)"
    - "Workflow validates cross-reference integrity (@-refs resolve to existing files)"
    - "Pipeline completes in under 2 minutes"
    - "No scheduled runs — event-driven only"
  artifacts:
    - path: ".github/workflows/validate.yml"
      provides: "CI/CD pipeline for GSD workflow integrity"
      contains: "name: Validate GSD Workflows"
  key_links:
    - from: ".github/workflows/validate.yml"
      to: ".opencode/.opencode/agents/*.md"
      via: "bash+grep validation loop in validate job"
      pattern: "for f in .opencode/.opencode/agents"
    - from: ".github/workflows/validate.yml"
      to: ".opencode/.opencode/get-shit-done/workflows/*.md"
      via: "workflow structure validation loop"
      pattern: "for f in .opencode/.opencode/get-shit-done/workflows"
    - from: ".github/workflows/validate.yml"
      to: ".opencode/.opencode/get-shit-done/references/*.md"
      via: "@-reference resolution check"
      pattern: "grep.*@ref|grep.*@file"
---

<objective>
Set up CI/CD pipeline with workflow structural validation.

Purpose: No CI exists today. Every push to master should validate agent files, workflow markdown structure, and cross-reference integrity automatically. Kept cheap (< 2 min) using bash+grep — Node.js only for setup-node when running tests later.

Output: .github/workflows/validate.yml — one workflow, two jobs.
</objective>

<execution_context>
@./.opencode/get-shit-done/workflows/execute-plan.md
@./.opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/02-agent-infrastructure/02-CONTEXT.md
@.planning/phases/02-agent-infrastructure/02-RESEARCH.md
@.local/share/opencode/repos/github.com/rokicool/gsd-opencode/.github/workflows/validate.yml
</context>

<tasks>

<task type="auto">
  <name>task 1: create validate workflow</name>
  <files>.github/workflows/validate.yml</files>
  <action>
    Create `.github/workflows/validate.yml` — single GitHub Actions workflow with two parallel jobs:
    
    **validate-agents job** (bash+grep, no Node.js needed):
    - Trigger: push to master, pull_request to master
    - Steps:
      1. actions/checkout@v4
      2. Validate agent frontmatter: loop over `.opencode/.opencode/agents/*.md`, check "name:", "description:", "mode:" frontmatter fields via grep. Exit 1 if any missing.
      3. Validate agent `<role>` section: loop over agent files, check for `<role>` via grep. Exit 1 if any missing.
      4. Validate agent-child directory: check `.opencode/agents/` mirrors `.opencode/.opencode/agents/` (same file count).
    
    **validate-workflows job** (bash+grep, no Node.js needed):
    - Trigger: push to master, pull_request to master
    - Steps:
      1. actions/checkout@v4
      2. actions/setup-node@v4 (needed for Node.js projects only — include but skip npm install unless running tests; per D-04/D-05 keep under 2 min)
      3. Validate workflow .md structure: loop over `.opencode/.opencode/get-shit-done/workflows/*.md`, check for `<objective>` and `<process>` or `<step>` tags. Exit 1 if missing.
      4. Validate reference cross-references: loop over `.opencode/.opencode/get-shit-done/references/*.md`, check @-refs resolve to existing files via `grep -oP '@\.[^\s)]+'` + `test -f` for each. ponytail: only check first 3 @-refs per file at most (complete check is expensive, 3 samples catch most breakage).
      5. Optional: print warnings for naming convention violations (non-kebab-case .md files)
    
    Per D-04: "push to master and PR to master" triggers.
    Per D-05: No scheduled runs. Keep < 2 min.
    
    No `npm install` step unless we need to run node-based tests (handled in 02-03).
    
    Adapt patterns from upstream GSD validate.yml but keep it minimal:
    - No anti-patterns check (temporal language, enterprise patterns — out of scope)
    - No template validation (no templates dir yet)
    - No Node.js syntax check (not a Node.js app at root level)
  </action>
  <verify>
    <automated>ls -la .github/workflows/validate.yml &amp;&amp; grep -q "push.*master" .github/workflows/validate.yml &amp;&amp; grep -q "name:" .github/workflows/validate.yml &amp;&amp; grep -q "actions/checkout@v4" .github/workflows/validate.yml</automated>
  </verify>
  <done>validate.yml exists with push-to-master trigger, agent frontmatter validation, workflow structure validation, and cross-reference check. File parses as valid YAML.</done>
</task>

<task type="auto">
  <name>task 2: verify workflow is syntactically valid</name>
  <files>.github/workflows/validate.yml</files>
  <action>
    Validate the created workflow file:
    
    1. Parse YAML to check syntax: `node -e "JSON.stringify(require('js-yaml').load(require('fs').readFileSync('.github/workflows/validate.yml','utf8')))"` or use a basic bash+python YAML check: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/validate.yml')); print('valid')"`
    
    2. Verify all referenced paths exist:
       ```
       for f in .opencode/.opencode/agents/*.md; do test -f "$f" || echo "MISSING $f"; done
       for f in .opencode/.opencode/get-shit-done/workflows/*.md; do test -f "$f" || echo "MISSING $f"; done
       ```
    
    3. Run the agent validation inline to confirm the grep patterns work:
       ```
       PASS=0; FAIL=0
       for f in .opencode/.opencode/agents/*.md; do
         grep -q "^name:" "$f" && PASS=$((PASS+1)) || { FAIL=$((FAIL+1)); echo "FAIL name in $f"; }
         grep -q "^description:" "$f" && PASS=$((PASS+1)) || { FAIL=$((FAIL+1)); echo "FAIL description in $f"; }
         grep -q "^mode:" "$f" && PASS=$((PASS+1)) || { FAIL=$((FAIL+1)); echo "FAIL mode in $f"; }
         grep -q "<role>" "$f" && PASS=$((PASS+1)) || { FAIL=$((FAIL+1)); echo "FAIL <role> in $f"; }
       done
       echo "Validations: $PASS pass, $FAIL fail"
       ```
  </action>
  <verify>
    <automated>
      PASS=0; FAIL=0
      for f in .opencode/.opencode/agents/*.md; do
        grep -q "^name:" "$f" && PASS=$((PASS+1)) || FAIL=$((FAIL+1))
        grep -q "^description:" "$f" && PASS=$((PASS+1)) || FAIL=$((FAIL+1))
        grep -q "^mode:" "$f" && PASS=$((PASS+1)) || FAIL=$((FAIL+1))
        grep -q "<role>" "$f" && PASS=$((PASS+1)) || FAIL=$((FAIL+1))
      done
      [ "$FAIL" -eq 0 ] || exit 1
    </automated>
  </verify>
  <done>YAML parses correctly. All validation patterns pass locally (0 failures). All referenced paths exist.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries
- CI runner ↔ repo files: GITHUB_TOKEN scoped by GitHub Actions, read-only for validation
- No user input crosses any boundary

## STRIDE Threat Register
| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-02-01 | T | validate.yml | accept | No secrets in workflow. GITHUB_TOKEN is auto-scoped, minimal permissions. CI only reads repo files — no write or deploy step. |
</threat_model>

<verification>
- `.github/workflows/validate.yml` exists, parsable as YAML
- All agent grep validation patterns pass when run locally
- Workflow structure validation passes locally
- Cross-reference check passes locally (first 3 @-refs per reference file)
- Pipeline estimated under 2 min (bash+grep only, no npm install)
</verification>

<success_criteria>
- validate.yml committed, two jobs (validate-agents, validate-workflows)
- Agent validation: 33 agents checked for name/description/mode/<role> — 0 failures
- Workflow structure: all .md files checked for objective/process sections — 0 failures
- Cross-reference: @-refs in reference files resolve to existing files
</success_criteria>

<output>
After completion, create `.planning/phases/02-agent-infrastructure/02-02-SUMMARY.md`
</output>

---

---
phase: 02-agent-infrastructure
plan: 03
type: execute
wave: 3
depends_on: [02-02]
files_modified:
  - .opencode/get-shit-done/vitest.config.ts
  - .opencode/get-shit-done/bin/lib/frontmatter.test.cjs
  - .opencode/get-shit-done/bin/lib/phase.test.cjs
  - .opencode/get-shit-done/bin/lib/state.test.cjs
autonomous: true
requirements: [DX-02]
user_setup: []

must_haves:
  truths:
    - "vitest run --project unit passes for frontmatter.cjs tests"
    - "vitest run --project unit passes for phase.cjs tests"
    - "vitest run --project unit passes for state.cjs tests"
    - "vitest config exists in get-shit-done/ and can run both unit and integration projects"
    - "Existing bin/test/*.test.cjs tests still pass (regression)"
  artifacts:
    - path: ".opencode/get-shit-done/vitest.config.ts"
      provides: "Vitest configuration with unit and integration projects"
      exports: ["defineConfig"]
    - path: ".opencode/get-shit-done/bin/lib/frontmatter.test.cjs"
      provides: "Tests for frontmatter parsing (extractFrontmatter, splitInlineArray, parseMustHavesBlock)"
      min_lines: 80
    - path: ".opencode/get-shit-done/bin/lib/phase.test.cjs"
      provides: "Tests for phase CRUD operations (list, find, create)"
      min_lines: 80
    - path: ".opencode/get-shit-done/bin/lib/state.test.cjs"
      provides: "Tests for state management (load, save, round-trip)"
      min_lines: 80
  key_links:
    - from: "vitest.config.ts"
      to: "bin/lib/*.test.cjs"
      via: "unit project include pattern"
      pattern: "bin/lib"
    - from: "vitest.config.ts"
      to: "bin/test/*.test.cjs"
      via: "existing project include pattern"
      pattern: "bin/test"
---

<objective>
Write automated tests for critical GSD workflow procedures.

Purpose: Unit tests for the 3 most critical lib modules (frontmatter parsing, phase CRUD, state management) plus integration test for critical workflow paths. Vitest config consolidates existing test patterns under one runner.

Output: vitest.config.ts + 3 test files (frontmatter, phase, state).
</objective>

<execution_context>
@./.opencode/get-shit-done/workflows/execute-plan.md
@./.opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/02-agent-infrastructure/02-CONTEXT.md
@.planning/phases/02-agent-infrastructure/02-RESEARCH.md
@.opencode/sdk/vitest.config.ts
@.opencode/get-shit-done/bin/test/get-profile.test.cjs
@.opencode/get-shit-done/bin/lib/frontmatter.cjs
@.opencode/get-shit-done/bin/lib/phase.cjs
@.opencode/get-shit-done/bin/lib/state.cjs
</context>

<interfaces>
From .opencode/get-shit-done/bin/lib/frontmatter.cjs (key exports):
```javascript
function extractFrontmatter(content)     // YAML frontmatter → object
function reconstructFrontmatter(data)    // object → YAML frontmatter string
function splitInlineArray(body)          // "a,b" → ['a','b']
function cmdFrontmatterParse(cwd, raw)   // CLI: parse a file's frontmatter
function cmdFrontmatterExtract(cwd, options, raw, args)  // CLI: extract specific field
function cmdFrontmatterValidate(cwd, schemaName)
const FRONTMATTER_SCHEMAS                // object of validation schemas
```
From .opencode/get-shit-done/bin/lib/phase.cjs (key exports):
```javascript
function cmdPhasesList(cwd, options, raw)
function cmdPhasesFind(cwd, args, raw)
function cmdPhasesCreate(cwd, phase, title)
// Depends on: core.cjs (planningDir, loadConfig, etc.), frontmatter.cjs, state.cjs
```
From .opencode/get-shit-done/bin/lib/state.cjs (key exports):
```javascript
function cmdStateLoad(cwd, raw)
function stateExtractField(content, fieldName)
function writeStateMd(cwd, frontmatter, body)
function readModifyWriteStateMd(cwd, modifyFn)
function cmdStateAdvance(cwd, raw)
function cmdStateComplete(cwd, raw)
// File: STATE.md read/write with lock mechanism
```
</interfaces>

<tasks>

<task type="auto">
  <name>task 1: create vitest config for get-shit-done/</name>
  <files>.opencode/get-shit-done/vitest.config.ts</files>
  <action>
    Create `.opencode/get-shit-done/vitest.config.ts` — Vitest config file with two projects:
    
    1. **unit** project: includes `bin/lib/**/*.test.cjs` — unit tests for lib modules
    2. **existing** project: includes `bin/test/**/*.test.cjs` — the 5 existing test files that use vitest
    
    Mirror the SDK's vitest.config.ts pattern (projects array, named projects, separate include patterns).
    
    Do NOT include `gsd-tools.test.cjs` from `bin/` — it uses `node:test`, not vitest. That's a pre-existing inconsistency; leave it alone.
    
    Per D-06: Use existing Vitest setup in `.opencode/get-shit-done/`.
    
    ```typescript
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
    
    No coverage thresholds, no reporters, no global setup. Minimal config. ponytail: add those only when someone asks for them.
  </action>
  <verify>
    <automated>cd .opencode/get-shit-done &amp;&amp; npx vitest run --project existing 2>&amp;1 | tail -5</automated>
  </verify>
  <done>vitest.config.ts created. `npx vitest run --project existing` passes (5 existing test files). Both projects listed in config.</done>
</task>

<task type="auto">
  <name>task 2: write unit tests for frontmatter.cjs</name>
  <files>.opencode/get-shit-done/bin/lib/frontmatter.test.cjs</files>
  <action>
    Create `.opencode/get-shit-done/bin/lib/frontmatter.test.cjs` — unit tests for frontmatter parsing utilities.
    
    Follow the existing test pattern from `bin/test/get-profile.test.cjs`:
    - ESM `import` for vitest (`import { describe, it, expect } from 'vitest'`)
    - CJS `require()` for the module under test (Node.js interop handles this)
    - `describe`/`it`/`expect` blocks — no tmpdir fixtures needed (pure functions)
    
    Test targets (pure functions, no filesystem needed):
    
    1. **extractFrontmatter(content)** — parse YAML frontmatter:
       - Returns empty object for content with no frontmatter
       - Parses simple key: value pairs
       - Parses nested objects (tools key with sub-keys)
       - Parses inline arrays (`color: "#008000"` — treated as scalar)
       - Handles closing `---` at end of file
       - Does NOT parse body content after frontmatter as frontmatter
       
    2. **splitInlineArray(body)** — split comma-separated values:
       - Simple split: `"a, b, c"` → `['a', 'b', 'c']`
       - Quoted values: `'"a, b", c'` → `['a, b', 'c']`
       - Single quotes: `"'x,y'"` → `['x,y']`
       - Empty string → empty array
       - Whitespace trimming
       
    3. **reconstructFrontmatter(data)** — object → YAML string:
       - Simple object → valid YAML frontmatter
       - Nested object → indented YAML
       - Handles empty object
    
    ponytail: 15-20 tests max. Pure function tests are fast. No fixtures needed. Skip full FRONTMATTER_SCHEMAS validation testing — that's covered by the existing CLI integration.
  </action>
  <verify>
    <automated>cd .opencode/get-shit-done &amp;&amp; npx vitest run bin/lib/frontmatter.test.cjs 2>&1 | tail -10</automated>
  </verify>
  <done>All frontmatter tests pass. extractFrontmatter, splitInlineArray, reconstructFrontmatter tested with 15+ test cases covering happy paths, edge cases, and empty input.</done>
</task>

<task type="auto">
  <name>task 3: write unit tests for phase.cjs and state.cjs</name>
  <files>.opencode/get-shit-done/bin/lib/phase.test.cjs, .opencode/get-shit-done/bin/lib/state.test.cjs</files>
  <action>
    Create two test files mirroring the tmpdir fixture pattern from `bin/test/get-profile.test.cjs`:
    
    ---
    
    **phase.test.cjs** — Test phase CRUD operations:
    
    Use tmpdir fixture:
    - `beforeEach`: create temp dir, set up `.planning/` dirs, write a minimal ROADMAP.md and STATE.md
    - `afterEach`: rm -rf temp dir
    - Mock `console.log`, `console.error`, `process.exit` using vi.spyOn or direct assignment
    
    Test targets:
    1. **cmdPhasesList(cwd, options, raw)** with various options:
       - Returns empty list when no phases dir exists
       - Lists phase directories when they exist (create `.planning/phases/01-test/`)
       - Filters by phase number
       - Handles --raw flag
    
    2. **cmdPhasesFind(cwd, args, raw)** — phase lookup:
       - Finds phase by number
       - Returns null/error for non-existent phase
       - Handles normalized phase names
    
    3. Optional: test the `reviewPhaseDirs` helper (if exported or accessible via requiring the module)
    
    Mock or stub core.cjs dependencies where needed (planningDir, loadConfig, etc.).
    
    ---
    
    **state.test.cjs** — Test state management:
    
    Same tmpdir fixture pattern:
    - Create temp DIR with `.planning/STATE.md` containing realistic frontmatter
    
    Test targets:
    1. **stateExtractField(content, fieldName)** — **pure function, no fixture needed**:
       - Extracts `**Field:** value` bold-markdown format
       - Extracts `Field: value` plain format
       - Returns null for missing field
       - Case-insensitive matching
    
    2. **cmdStateLoad(cwd, raw)**:
       - Loads existing STATE.md
       - Returns empty/default for missing STATE.md
    
    3. **writeStateMd(cwd, frontmatter, body)** — round-trip:
       - Writes STATE.md then reads it back
       - Preserves frontmatter fields
    
    4. **readModifyWriteStateMd(cwd, modifyFn)** — atomic update:
       - Applies modifyFn to STATE.md content
       - Writes updated state
       - Reads back confirms modification
    
    Follow the tmpdir pattern exactly from `get-profile.test.cjs`:
    - `fs.mkdtempSync(path.join(os.tmpdir(), 'phase-test-'))`
    - Mock `console.log` to capture output
    - Mock `process.exit` to throw
    - Restore in `afterEach`
    
    ponytail: 10-15 tests per file. Focus on CRUD and round-trips, not edge-case permutations. The code is simple filesystem operations — the main risk is a regression in path resolution or state format.
  </action>
  <verify>
    <automated>cd .opencode/get-shit-done &amp;&amp; npx vitest run bin/lib/phase.test.cjs bin/lib/state.test.cjs 2>&1 | tail -10</automated>
  </verify>
  <done>phase.test.cjs and state.test.cjs both pass. Phase tests cover list, find, and error cases. State tests cover extract, load/write round-trip, and atomic modify. All tmpdir fixtures clean up after themselves.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries
No new trust boundaries — tests run in isolated tmpdir fixtures, no network access, no production data.

## STRIDE Threat Register
No applicable threats — this plan creates test infrastructure only. All test operations are contained within temporary directories that are cleaned up after each test suite.
</threat_model>

<verification>
- `cd .opencode/get-shit-done && npx vitest run --project unit` passes
- `cd .opencode/get-shit-done && npx vitest run --project existing` passes (regression check)
- `cd .opencode/get-shit-done && npx vitest run` passes (both projects)
- Each test file has proper tmpdir setup and teardown
- No existing tests broken by new config
</verification>

<success_criteria>
- vitest.config.ts works for both unit and existing projects
- frontmatter.test.cjs: 15+ tests for extractFrontmatter, splitInlineArray, reconstructFrontmatter
- phase.test.cjs: 10+ tests for cmdPhasesList, cmdPhasesFind
- state.test.cjs: 10+ tests for stateExtractField, cmdStateLoad, writeStateMd round-trip, readModifyWriteStateMd
- All tests pass, all temp dirs cleaned up
</success_criteria>

<output>
After completion, create `.planning/phases/02-agent-infrastructure/02-03-SUMMARY.md`
</output>