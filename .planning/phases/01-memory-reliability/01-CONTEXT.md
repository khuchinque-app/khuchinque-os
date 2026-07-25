# Phase 1: Memory Reliability - Context

**Gathered:** 2026-07-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the 4-layer cognitive memory architecture reliable and automatic — context persists on every interaction (surviving disconnects) and loads on session start with a summary + deep-dive option. The existing memory infrastructure (EchoesVault, Mem0, Letta, Membase, Graphify) stays in place; this phase adds the automation and reliability layer.

</domain>

<decisions>
## Implementation Decisions

### Save Behavior (Disconnect Resilience)
- **D-01:** Auto-save on EVERY interaction — each tool call or assistant response triggers a context save. No manual save command needed.
- **D-02:** Save target is the EchoesVault daily log (episodic layer). Working memory (current chat state) is preserved via OpenCode's built-in session resume where available.

### Context Loading (Session Start)
- **D-03:** On session start, agent auto-loads a BRIEF SUMMARY of the last session (key decisions, current task, last state). Does NOT dump full history.
- **D-04:** After presenting the summary, agent offers to dive deeper: "Want full context from last session?" — user can accept or ask specific questions.

### Memory Search
- **D-05:** Two search modes:
  1. **Explicit command** — `/memory "query"` or similar slash command that searches all 4 memory layers
  2. **Implicit chat search** — During conversation, agent autonomously searches memory when relevant context is needed

### OpenCode's Discretion
- Retention/rotation strategy for daily logs (truncation, archival thresholds)
- Implementation details of save serialization format
- Specific memory layer routing for search queries

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Memory Architecture
- `.planning/codebase/ARCHITECTURE.md` — 4-layer cognitive memory design (Lines 39-52)
- `memory-protocol.md` — 4-layer cognitive protocol document
- `memory-list.md` — All memory tools reference

### EchoesVault
- `EchoesVault/index.md` — Vault master registry
- `skills/echoes-append-to-daily-log/SKILL.md` — Current daily log skill
- `skills/echoes-create-or-update-page/SKILL.md` — Vault page creation skill
- `skills/echoes-search-vault-pages/SKILL.md` — Vault search skill

### Existing State
- `echoes-state.json` — Echoes vault state (Initialized=true, Session=false)
- `.planning/PROJECT.md` — Project requirements MEM-01, MEM-02, MEM-03
- `.planning/ROADMAP.md` — Phase 1 goal and success criteria
- `.planning/STATE.md` — Current position tracker

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `skills/echoes-append-to-daily-log/SKILL.md` — Already has session logging mechanism
- `commit_memory_to_echoes_vault` tool — Existing save mechanism (currently manual)
- EchoesVault daily logs (`EchoesVault/daily/`) — Established log format
- `echoes-state.json` — State tracking (just needs Session flag toggling)

### Established Patterns
- 4-layer cognitive memory — Working (Letta/Membase), Episodic (EchoesVault/Mem0), Semantic (Membase/Letta), Procedural (Graphify/EchoesVault)
- File-based state in `.planning/` with git tracking

### Integration Points
- OpenCode session lifecycle hooks (session start / session end events)
- Echoes vault init already done (`Initialized=true`) — just needs session start wired
- MCP tools (mem0-mcp, membase) for vector/knowledge base access

</code_context>

<specifics>
## Specific Ideas

- Disconnect scenario is the primary driver: save on every interaction so mid-task disconnection never loses context
- "Never forget" as the core principle — no manual save/restore ritual
- Memory search should work across ALL 4 layers transparently

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 1-Memory Reliability*
*Context gathered: 2026-07-25*
