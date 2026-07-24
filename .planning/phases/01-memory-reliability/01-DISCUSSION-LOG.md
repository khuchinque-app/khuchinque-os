# Phase 1: Memory Reliability - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-25
**Phase:** 1-Memory Reliability
**Areas discussed:** Save behavior, Context loading, Memory search

---

## Save Behavior (Disconnect Resilience)

| Option | Description | Selected |
|--------|-------------|----------|
| Every interaction | Each tool call or assistant response triggers a context save | ✓ |
| On meaningful events | File edits, git commits, phase transitions | |
| Interval + manual | Time-based auto-save (5-10 min) plus explicit save commands | |

**User's choice:** Every interaction
**Notes:** Primary driver is disconnect scenario — never lose mid-task context. Save on every interaction so a dropped connection loses nothing.

---

## Context Loading

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-load full context | Load all recent context silently on session start | |
| Summary + offer details | Brief summary of last session, then offer to dive deeper | ✓ |
| Passive notification | Show "Last session ended at X", user asks on demand | |

**User's choice:** Summary + offer details
**Notes:** Agent should present a concise summary of last session's key decisions and current state, then offer "Want full context?" rather than dumping everything.

---

## Memory Search

| Option | Description | Selected |
|--------|-------------|----------|
| Dedicated slash command | /memory "query" to search all layers | ✓ |
| Auto-injected context | Context auto-loaded at session start | |
| Both auto-inject + search | Auto-inject summary + search command for deeper look | |
| Natural language during chat | Agent searches memory autonomously when relevant | ✓ |

**User's choice:** Both dedicated command AND natural language chat search
**Notes:** Want both explicit search via `/memory` command AND implicit search where the agent autonomously queries memory during conversation when context is needed.

---

## OpenCode's Discretion

- Log retention/rotation strategy and thresholds
- Save serialization format details
- Implementation specifics of memory layer routing for search

## Deferred Ideas

None.
