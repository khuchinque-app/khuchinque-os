# Codebase Concerns

**Analysis Date:** 2026-07-25

## Tech Debt

**Duplicate echoes-state.json with conflicting state:**
- Issue: Two `echoes-state.json` files exist with contradictory initialization/session state — one at root and one in `.opencode/`. Root file says `initialized=false, session.started=true, totalPages=0` while `.opencode/` file says `initialized=true, session.started=false, totalPages=2`.
- Files: `echoes-state.json` (root), `.opencode/echoes-state.json`
- Impact: EchoesVault plugin picks up wrong state depending on startup path. Memory persistence unreliable because the two states disagree about whether the vault is initialized and whether sessions are active.
- Fix approach: Determine which file the plugin actually reads, delete the other, and reconcile to a single truth: `initialized=true, session.started=false, totalPages=2` (since vault pages exist).

**Triple npm node_modules (439MB total):**
- Issue: Three separate `node_modules/` directories: root (63MB), `.opencode/` (63MB), `.opencode/sdk/` (313MB). The root `node_modules/` is gitignored (along with root `package.json`), making it invisible to version control but physically present.
- Files: `node_modules/`, `.opencode/node_modules/`, `.opencode/sdk/node_modules/`
- Impact: Disk waste (~439MB). Root `package.json`/`package-lock.json` are gitignored, so dependencies are not reproducible from git clone. SDK has 313MB for a library with no source `.ts` files (only `.d.ts` + compiled `.js`).
- Fix approach: Remove root `node_modules/` if root `package.json` is not needed. Audit SDK `node_modules/` — pre-compiled libs don't need devDependencies. Move root `package.json` into git if it defines actual workspace dependencies.

**Root package.json gitignored:**
- Issue: `.gitignore` explicitly excludes `package.json`, `package-lock.json`, `bun.lock`, `node_modules/`. But `package.json` and `package-lock.json` exist at root and are physically present.
- Files: `.gitignore` (line 2-3), `package.json`, `package-lock.json`
- Impact: Git clone does not reproduce dependencies. A fresh checkout cannot `npm install` because the manifest is missing. Breaks CI/reproducibility.
- Fix approach: If root `package.json` expresses real deps (`@opencode-ai/plugin`, `ponytail`), remove it from `.gitignore` and commit it. If not needed, delete the files.

**AGENTS.md is empty:**
- Issue: `AGENTS.md` at root is 0 bytes. GSD framework (and `planning/config.json`) expects it to contain agent instructions (`"claude_md_path": "./AGENTS.md"`).
- Files: `AGENTS.md`
- Impact: Workflows that read AGENTS.md for agent discovery will get nothing. Downstream agent spawns may fail silently.
- Fix approach: Populate AGENTS.md with agent definitions or set `claude_md_path` to null if unused.

**Empty c+/ directory:**
- Issue: `c+/` directory exists but is empty.
- Files: `c+/`
- Impact: Dead directory — either leftover from setup or placeholder for future use. Currently causes confusion when navigating the repo.
- Fix approach: Remove or document intent.

## Known Bugs

**Echoes vault auto-save configured but not wired:**
- Symptoms: Root `echoes-state.json` has `"autoSave": {"enabled": true, "lastAutoSave": null}` — auto-save is enabled but never ran. The `.opencode/` state file lacks the `autoSave` field entirely.
- Files: `echoes-state.json`, `.opencode/echoes-state.json`
- Trigger: Any session — the vault expects auto-save but no trigger mechanism hooks into it.
- Workaround: Manual `commit_memory_to_echoes_vault` invocation.

**Session context loading not automatic (MEM-01 not achieved):**
- Symptoms: `echoes-state.json (root): session.started=true` but session context is never loaded on start. The 4-layer memory protocol (`memory-protocol.md`) requires `read membase://recent + /echoes-start` but neither runs automatically.
- Files: `memory-protocol.md`, `echoes-state.json`
- Trigger: Every session start — no hook fires to load prior context.
- Workaround: Manual `/echoes-start` command.

## Security Considerations

**Hardcoded API token in opencode.jsonc:**
- Risk: `~/.config/opencode/opencode.jsonc` contains a plaintext Mem0 bearer token (`m0-rZvp...C2`) in the `Authorization` header.
- Files: `~/.config/opencode/opencode.jsonc` (line 9)
- Current mitigation: File is outside git repo (in `~/.config/`), but is world-readable on a single-user VPS.
- Recommendations: Use environment variable substitution (`${MEM0_API_KEY}`) instead of hardcoded value. The root `opencode.json` already uses `${MEM0_API_KEY}` for the mem0-mcp header — the global config should match.

**GSD agent directory env file:**
- Risk: `.opencode/.env` exists (7 lines) with GSD agent directory configuration.
- Files: `.opencode/.env`
- Current mitigation: Like all `.env` files, not read by this tool.
- Recommendations: Verify no secrets leaked into this file. Use it only for non-sensitive path overrides.

**MCP servers expose broad tool surfaces to AI:**
- Risk: `ruflo` MCP provides 260+ tools (memory_store, browser, agent management, DB) with `enabled: true`. `mem0-mcp` exposes 11 memory mutation tools (delete_all_memories, delete_entities). Any agent prompt injection could trigger destructive operations.
- Files: `opencode.json` (ruflo config lines 8-18), `opencode.jsonc` (mem0-mcp config)
- Current mitigation: OpenCode's permission system (Deny rules) and `"share": "manual"` config setting limit exposure.
- Recommendations: Audit tool surface. Add Deny rules for `mem0-mcp_delete_all_memories` and `mem0-mcp_delete_entities`. Restrict ruflo's destructive tools.

**Source of truth file permissions on single-user VPS:**
- Risk: All config files, including those with bearer tokens, are stored with default `rw-rw-r--` (664) permissions on a shared VPS (`deneuve`).
- Files: All files under `~/.opencode/` and `~/.config/opencode/`
- Current mitigation: Single-user system, but multi-process environments may expose files.
- Recommendations: Restrict sensitive config files to `600` (owner-only read).

## Performance Bottlenecks

**GSD SDK cold start (~500ms-2s per invocation):**
- Problem: `gsd-sdk query` spawns a fresh Node.js subprocess for every query. With 313MB of `node_modules/` loaded, each invocation incurs significant startup cost.
- Files: `.opencode/sdk/dist/cli.js` (SDK entry point), `.opencode/get-shit-done/workflows/*.md` (89 callers)
- Cause: Node.js subprocess spawn + module resolution for large dependency tree.
- Improvement path: Use a persistent daemon/worker for SDK queries, or consolidate queries into batch operations.

**33 agent files = 614KB of agent definitions:**
- Problem: Each spawned agent loads its full `.md` definition. Large files like `gsd-planner.md` (48KB), `gsd-debugger.md` (48KB) consume significant context window tokens.
- Files: `.opencode/agents/*.md` (33 files)
- Cause: Comprehensive agent instructions written as monolithic files.
- Improvement path: Lazy-load agent definitions — load only the process/validation sections needed for the current task, not the full file.

**101 workflow files = large cross-reference graph:**
- Problem: Each workflow references other workflows, agents, templates, and reference docs via `@-links` and inline `gsd-tools.cjs` calls. The resolution graph is O(N²).
- Files: `.opencode/get-shit-done/workflows/*.md` (101 files)
- Cause: Flat workflow directory with bidirectional cross-references.
- Improvement path: Index workflow dependencies at build time to detect stale references.

## Fragile Areas

**GSD workflow cross-references (no integrity validation):**
- Files: `.opencode/get-shit-done/workflows/*.md` (101 workflows)
- Why fragile: Workflows reference agents, templates, and other workflows by filename. Renaming any file leaves dangling references. No automated integrity check exists.
- Common failures: Workflow references a moved/renamed document → agent silently gets empty instructions.
- Safe modification: Use `grep -r "old-reference"` to find all cross-references before renaming. Prefer relative paths over filenames alone.
- Test coverage: None — no CI pipeline validates cross-reference integrity.

**CI/CD absent for 101 workflows + 33 agents + 88 commands:**
- Files: `.opencode/get-shit-done/workflows/*.md` (101 files), `.opencode/agents/*.md` (33 files), `.opencode/commands/gsd/*.md` (88 files)
- Why fragile: No automated validation. A broken workflow doesn't surface until manual execution.
- Common failures: Schema drift between templates and generated docs, broken @-links, missing required sections.
- Safe modification: Run manual smoke tests after any batch change.
- Test coverage: Zero — only 6 test files exist in `get-shit-done/bin/test/` for profile/profile-config operations (not workflows).

**Missing SDK TypeScript source:**
- Files: `.opencode/sdk/` (only `.d.ts` + compiled `.js` in `dist/`, plus `prompts/`, `scripts/`, `docs/`)
- Why fragile: The SDK has 3 handover docs (`HANDOVER-GOLDEN-PARITY.md`, `HANDOVER-PARITY-DOCS.md`, `HANDOVER-QUERY-LAYER.md`) but no `.ts` source files. Only `vitest.config.ts` is present. Bugs cannot be fixed at source — only in the compiled output.
- Safe modification: Fork SDK from upstream `get-shit-done` repo; do not edit `dist/` files directly.
- Test coverage: SDK has no integration tests against actual OpenCode runtime.

**Large CJS library files (high cyclomatic complexity):**
- Files: `.opencode/get-shit-done/bin/lib/init.cjs` (1875 lines, 68KB), `core.cjs` (1733 lines, 68KB), `state.cjs` (1618 lines, 64KB)
- Why fragile: Monolithic files with multiple responsibilities. `core.cjs` alone has a 1255-line `gsd-tools.cjs` dispatcher that delegates to 30+ commands. Changing one command risks breaking through shared state (e.g., `_heldPlanningLocks`, `cachedControllingTtyToken`).
- Safe modification: Run the full test suite after any change to these files.
- Test coverage: 6 test files covering profile operations only — no tests for state, phase, milestone, or audit.

## Scaling Limits

**Echoes vault daily logs accumulate without archival:**
- Current capacity: 1 daily log file (`2026-07-25.md`, ~300 bytes)
- Limit: Daily logs grow unbounded. No archival/rotation mechanism exists.
- Symptoms at limit: Large daily logs consume context window. Search across accumulated logs slows.
- Scaling path: Implement log rotation (archive logs older than N days to `EchoesVault/archive/`). Load only last 3 daily logs on session start (as echoes-start already intends).

**Single .planning/ directory for all project state:**
- Current capacity: 1 project, 1 phase, 3 plans
- Limit: `.planning/` is designed for single-project use. Multiple projects would conflict.
- Symptoms at limit: STATE.md, ROADMAP.md, config.json are all project-specific but stored at a single path.
- Scaling path: Current architecture is correct for single-project — document this as a constraint, not a bug.

## Dependencies at Risk

**@dietrichgebert/ponytail (npm, v4.8.4):**
- Risk: Community-maintained plugin. Already had a `ponytail-frontmatter.cjs` missing from the npm package requiring manual fix (documented in daily log).
- Impact: Skills become unavailable if package is removed, broken by npm publish, or incompatible with OpenCode API changes.
- Migration plan: Inline the skill logic (SKILL.md files are standalone). The npm package is primarily a delivery mechanism for ~6 sub-skill markdown files.

**gsd-opencode framework (GitHub, v1.38.5):**
- Risk: Single-maintainer project (`rokicool/gsd-opencode`). 33 agents, 88 commands, 101 workflows, 12 skills, 52 reference docs all depend on this framework.
- Impact: If repo goes private, is abandoned, or has breaking changes, the entire workflow engine breaks.
- Migration plan: Vendor the framework (commit `get-shit-done/` to this repo) rather than relying on remote install. Already partially vendored as the files exist under `.opencode/get-shit-done/`.

**mem0-mcp (remote MCP service):**
- Risk: Hosted at `https://mcp.mem0.ai/mcp` — depends on external service availability and API compatibility.
- Impact: Vector memory (search, add, update all memories) breaks if service is down. Long-term memory reliability depends on this external service.
- Migration plan: Local fallback using Membase or Letta for critical memory operations when mem0-mcp is unreachable.

## Missing Critical Features

**No automated CI/CD pipeline:**
- Problem: 101 workflows, 33 agents, 88 commands, 52 reference docs — zero automated validation. No PR checks, no linting, no integrity tests.
- Files: All `.opencode/get-shit-done/` and `.opencode/agents/` files
- Blocks: Confident refactoring. Currently, any cross-reference breakage goes undetected until manual execution.
- Implementation complexity: Low — GitHub Actions + basic grep checks for @-link integrity + markdown structure validation.

**No automated testing for 101 workflows:**
- Problem: Workflows are the core orchestration mechanism but have zero automated tests. Only 6 test files exist for profile operations.
- Blocks: Cannot detect regression when workflows are modified.
- Implementation complexity: Medium — would require simulating workflow execution or at minimum schema validation.

**Session lifecycle automation (MEM-01, MEM-02, MEM-03):**
- Problem: The entire Phase 1 roadmap (Memory Reliability) is unimplemented. Cross-session memory requires manual `/echoes-start` and `commit_memory_to_echoes_vault`.
- Files: `EchoesVault/` (all), `.planning/ROADMAP.md` (Phase 1)
- Blocks: Core value proposition ("never forget") is not achieved.
- Implementation complexity: Medium — requires hooking into OpenCode session lifecycle events.

## Test Coverage Gaps

**GSD workflows:**
- What's not tested: All 101 workflow procedures
- Files: `.opencode/get-shit-done/workflows/*.md`
- Risk: Workflow breakage from cross-reference drift, removed tools, or changed paths. Any broken workflow fails silently when executed.
- Priority: Medium

**GSD tools CJS library:**
- What's not tested: State management (state.cjs, 1618 lines), phase operations (phase.cjs, 1058 lines), milestones (milestone.cjs), verification (verify.cjs, 1101 lines), audit (audit.cjs), intel (intel.cjs), roadmap (roadmap.cjs)
- Files: `.opencode/get-shit-done/bin/lib/*.cjs` (excluding profile, config, and schema modules)
- Risk: Core project lifecycle operations have no regression protection.
- Priority: High (state.cjs and phase.cjs handle the project state — corruption risks data loss)

**GSD SDK integration:**
- What's not tested: SDK queries against actual OpenCode runtime, JSON serialization, path resolution
- Files: `.opencode/sdk/dist/*.js`
- Risk: SDK query failures in real execution (schema mismatches, path resolution errors).
- Priority: Low (tested implicitly via manual execution of GSD commands)

---

*Concerns audit: 2026-07-25*
*Update as issues are fixed or new ones discovered*
