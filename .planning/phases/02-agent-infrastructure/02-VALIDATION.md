# Phase 2: Agent Infrastructure — Validation Architecture

**Generated:** 2026-07-25
**Source:** Extracted from 02-RESEARCH.md §Validation Architecture

## Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest ^3.2.4 |
| Config file | NEW: `.opencode/get-shit-done/vitest.config.ts` |
| Quick run | `cd .opencode/get-shit-done && npx vitest run --project unit` |
| Full suite | `cd .opencode/get-shit-done && npx vitest run` |

## Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File |
|--------|----------|-----------|-------------------|------|
| AGENT-01 | Agent .md files have valid frontmatter | unit | `node scripts/verify-agents.cjs` | `scripts/verify-agents.cjs` |
| AGENT-01 | All 33 agents registered in opencode.json | unit | `node scripts/verify-agents.cjs --check-registration` | `scripts/verify-agents.cjs` |
| DX-01 | CI validates workflow structure on push | integration | `.github/workflows/validate.yml` exists + runs | `.github/workflows/validate.yml` |
| DX-02 | frontmatter.cjs parse functions work correctly | unit | `npx vitest run bin/lib/frontmatter.test.cjs` | `bin/lib/frontmatter.test.cjs` |
| DX-02 | phase.cjs CRUD operations work | unit | `npx vitest run bin/lib/phase.test.cjs` | `bin/lib/phase.test.cjs` |
| DX-02 | state.cjs load/save round-trips correctly | unit | `npx vitest run bin/lib/state.test.cjs` | `bin/lib/state.test.cjs` |

## Sampling Rate

- **Per task commit:** `npx vitest run --project unit --changed`
- **Per wave merge:** `npx vitest run --project unit && node scripts/verify-agents.cjs`
- **Phase gate:** `npx vitest run` (both projects) + `node scripts/verify-agents.cjs --check-registration` + CI workflow passes

## Wave 0 Gaps (Files to Create)

- [ ] `.opencode/get-shit-done/vitest.config.ts` — Vitest config for CJS lib tests
- [ ] `.opencode/get-shit-done/bin/lib/frontmatter.test.cjs` — Tests for frontmatter parsing
- [ ] `.opencode/get-shit-done/bin/lib/state.test.cjs` — Tests for state management
- [ ] `.opencode/get-shit-done/bin/lib/phase.test.cjs` — Tests for phase CRUD
- [ ] `.opencode/get-shit-done/scripts/verify-agents.cjs` — Agent verification script