# Phase 2: Agent Infrastructure - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-25
**Phase:** 2-Agent-Infrastructure
**Areas discussed:** Agent verification, CI/CD scope, Test targets, Agent registration

---

## Agent Verification Method

| Option | Description | Selected |
|--------|-------------|----------|
| Manual verification | User manually checks each agent | |
| Structural validation script | Script checks file existence, frontmatter, required sections | ✓ |
| Full runtime spawn test | Actually spawn each agent in OpenCode runtime | |

**User's choice:** Delegated to OpenCode
**Notes:** OpenCode chose structural validation as sufficient for 02-01. Full spawn testing deferred or handled as edge cases.

## CI/CD Scope and Triggers

| Option | Description | Selected |
|--------|-------------|----------|
| Push only | GitHub Actions on push to master, basic checks | ✓ |
| Push + scheduled | Add nightly integrity run | |
| Per-PR | Validate on PRs to master in addition to push | |

**User's choice:** Delegated to OpenCode
**Notes:** OpenCode chose push-to-master only. Keep pipeline cheap (< 2 min). Validate workflow frontmatter, cross-ref integrity, agent file consistency.

## Test Targets and Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Unit + integration | CJS tool unit tests + critical path integration | ✓ |
| Only unit | Tests for bin/lib/*.cjs only | |
| Full E2E | Execute workflows in test environment | |

**User's choice:** Delegated to OpenCode
**Notes:** OpenCode chose two-tier approach. Reuse existing Vitest setup in `.opencode/get-shit-done/`.

## Agent Registration Completeness

| Option | Description | Selected |
|--------|-------------|----------|
| Verify auto-discovery | Confirm OpenCode discovers agents from agents/ dir | ✓ |
| Add explicit registration | Add `agents` key to opencode.json | (if needed) |
| No change | Assume current setup works | |

**User's choice:** Delegated to OpenCode
**Notes:** OpenCode chose to verify auto-discovery first, add explicit registration only if needed.

---

## OpenCode's Discretion

All four areas were delegated to OpenCode. Decisions captured in CONTEXT.md reflect OpenCode's judgment after investigating:
- All 33 agent files exist on disk
- No `agents` key in `opencode.json`
- No `.github/workflows/` directory exists
- Existing Vitest setup in GSD-OpenCode

## Deferred Ideas

None.