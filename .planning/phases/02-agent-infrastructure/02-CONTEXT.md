# Phase 2: Agent Infrastructure - Context

**Gathered:** 2026-07-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Install, verify, and operationalize all 33 GSD subagent definitions so they spawn reliably in OpenCode runtime. Add CI/CD pipeline for workflow integrity validation. Write automated tests for critical GSD workflow procedures. The existing 33 agent `.md` files in `.opencode/agents/` are the foundation — this phase makes them reliably usable and validated.

</domain>

<decisions>
## Implementation Decisions

### Agent Verification & Registration
- **D-01:** All 33 GSD agent definitions exist in `.opencode/agents/` and `.opencode/.opencode/agents/`. First task is verifying each agent spawns correctly (not just file presence). Create a verification script that tests agent loading against OpenCode's agent runtime.
- **D-02:** `opencode.json` has no `agents` key — agents are auto-discovered from `agents/` directory. Verify auto-discovery works end-to-end. If it doesn't, add explicit agent registration to `opencode.json`.
- **D-03:** Prioritize the 18 agents flagged as "not installed" in STATE.md as the verification target. The remaining 15 are already confirmed operational (currently used by the system).

### CI/CD Pipeline
- **D-04:** GitHub Actions on push to master. Initial scope: validate workflow markdown structural integrity (frontmatter, required sections), cross-reference integrity (all `@` refs resolve), and agent file consistency.
- **D-05:** No scheduled runs — event-driven only (push, PR to master). Keep pipeline cheap and fast (< 2 min).

### Testing Strategy
- **D-06:** Use existing Vitest setup in `.opencode/get-shit-done/`. Two tiers:
  1. **Unit tests** for CJS tool functions in `bin/lib/*.cjs` (phase CRUD, state management, path resolution)
  2. **Integration tests** for critical workflow paths (plan creation, phase transitions, state persistence)
- **D-07:** Workflow markdown files tested via structural validation (parsing frontmatter, checking required sections) — not full E2E execution.

### Verification Approach
- **D-08:** Agent verification is a separate plan (02-01). CI/CD (02-02) and tests (02-03) depend on verified agents working correctly — they can't validate workflows that use broken agents.

### OpenCode's Discretion
- Specific test framework configuration (Vitest settings, coverage thresholds)
- CI/CD job structure and action selection (actions/checkout, actions/setup-node are expected)
- Agent verification script implementation details (bash vs Node.js)
- Whether to use `opencode.json` `agents` key or rely on auto-discovery

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### GSD Agent Definitions
- `.opencode/agents/` — All 33 agent `.md` files (the agents to verify and operationalize)
- `.opencode/.opencode/agents/` — Mirror copy of agent definitions

### Agent Registration
- `opencode.json` — Current config (no `agents` key — needs verification/addition)
- `opencode-schema.json:269` — Schema definition for `agent` config key

### Testing Infrastructure
- `.opencode/get-shit-done/package.json` — Existing Vitest dependency
- `.opencode/sdk/vitest.config.ts` — Existing Vitest configuration pattern

### CI/CD
- No existing `.github/workflows/` directory — greenfield setup

### Code Context
- `.planning/codebase/STACK.md` — Tech stack (Node.js v24, Vitest, TypeScript)
- `.planning/codebase/ARCHITECTURE.md` — GSD system architecture layers
- `.planning/codebase/INTEGRATIONS.md` — Existing integrations (no CI/CD)
- `.planning/STATE.md:45-47` — Blockers: 18 agents flagged as missing
- `.planning/ROADMAP.md:36-49` — Phase 2 requirements: AGENT-01, DX-01, DX-02

### Prior Phase Decisions
- `.planning/phases/01-memory-reliability/01-CONTEXT.md` — Auto-save pattern, EchoesVault persistence approach

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `.opencode/get-shit-done/bin/gsd-tools.cjs` — CLI tool with phase/state/milestone operations (testable CJS functions)
- `.opencode/get-shit-done/bin/lib/*.cjs` — 33 shared library modules (unit test targets)
- `.opencode/sdk/vitest.config.ts` — Existing Vitest config (reusable pattern for GSD-OpenCode tests)
- `.opencode/get-shit-done/package.json` — Has vitest as dependency already

### Established Patterns
- CJS tooling in `.opencode/get-shit-done/bin/` — Tests should match CJS structure
- ESM CLI manager in `.config/opencode/src/` — Separate from GSD tool tests
- Markdown-as-configuration: agents, commands, skills, workflows are `.md` files
- File-based state in `.planning/` with git tracking

### Integration Points
- `.github/workflows/` — Does not exist yet, needs creation
- opencode.json — May need `agents` key added
- Agent spawning — OpenCode's agent loader at runtime consumes `.opencode/agents/*.md`

### Creative Options
- Single validation action that checks all workflows vs. per-category checks
- Agent verification as a standalone npm script vs. Vitest test
- Mock-based agent tests vs. actual OpenCode runtime spawning

</code_context>

<specifics>
## Specific Ideas

- Agent verification should NOT require OpenCode runtime — a structural check (file exists, valid frontmatter, minimum required sections) is sufficient for 02-01. Full spawn testing is deferred or handled as edge cases.
- CI/CD should be minimal: one workflow file that runs structural checks. No deployment pipeline needed (local dev environment).
- Tests should reuse the existing vitest setup rather than creating a new framework.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 2-Agent-Infrastructure*
*Context gathered: 2026-07-25*