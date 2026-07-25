<!-- refreshed: 2026-07-25 -->
# Architecture

**Analysis Date:** 2026-07-25

## System Overview

This is a **planning and design repository** — no implementation code exists. The architecture described here is the *target architecture* for Khucinque OS, an Intelligence Layer that sits on top of OpenCode.

```text
┌────────────────────────────────────────────────────────────┐
│                         USER                                │
├────────────────────────────────────────────────────────────┤
│                    Mission Control                          │
│               (GUI / Dashboard / Monitoring)                │
├────────────────────────────────────────────────────────────┤
│                    Intelligence Layer                       │
│    (memory reasoning, graph reasoning, goal tracking,      │
│     self-reflection, self-improvement, context assembly)   │
├────────────────────────────────────────────────────────────┤
│                  Workflow / Orchestration                   │
│    (planning, delegation, scheduling, retries, checkpoints) │
├────────────────────────────────────────────────────────────┤
│                    OpenCode Runtime                         │
│     (agent runtime, subagents, skills, terminal, tools)    │
├────────────────────────────────────────────────────────────┤
│                      MCP / Tools                           │
│  (web, browser, GitHub, Docker, databases, Slack, email)   │
├────────────────────────────────────────────────────────────┤
│                     Memory System                           │
│   (vector DB, knowledge graph, EchoesVault, consolidation) │
├────────────────────────────────────────────────────────────┤
│                         LLMs                                │
└────────────────────────────────────────────────────────────┘
```

*Source: `README.md` (lines 11–29), `plan-secondbrain.md` (lines 142–161)*

## The Six Pillars

| # | Pillar | Priority | Nature | Design Source |
|---|--------|----------|--------|---------------|
| 1 | **Memory** | ⭐⭐⭐⭐⭐ | Persistent/episodic/semantic/procedural memory, vector DB, knowledge graph, consolidation, retrieval | `plan-secondbrain.md` lines 6–31, `components.md` lines 7–23 |
| 2 | **Execution Layer** | ⭐⭐⭐⭐⭐ | OpenCode runtime — agent runtime, subagents, skills, file ops, multi-model support | `plan-secondbrain.md` lines 32–47, `components.md` lines 25–33 |
| 3 | **MCP / Tools** | ⭐⭐⭐⭐⭐ | Universal hardware abstraction — web, browser, GitHub, Docker, DBs, Slack, Telegram, email | `plan-secondbrain.md` lines 48–71, `components.md` lines 35–53 |
| 4 | **Workflow & Orchestration** | ⭐⭐⭐⭐⭐ | Planning, delegation, scheduling, retries, checkpoints, long-running tasks, background jobs | `plan-secondbrain.md` lines 72–97, `components.md` lines 55–74 |
| 5 | **GUI / Mission Control** | ⭐⭐⭐⭐☆ | Agent visualization, memory graph, task graph, logs, timeline, token usage, cost tracking | `plan-secondbrain.md` lines 98–120, `components.md` lines 76–86 |
| 6 | **Intelligence Layer** | ⭐⭐⭐⭐⭐ | Memory reasoning, graph reasoning, goal tracking, self-reflection, self-improvement, context assembly | `plan-secondbrain.md` lines 121–139, `components.md` lines 88–93 |

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| `README.md` | Project overview, ASCII architecture diagram, 6-pillar summary, license reference | `/README.md` |
| `AGENTS.md` | Agent-quickstart reference declares "No code yet," links key design docs, lists 6 pillars | `/AGENTS.md` |
| `plan-secondbrain.md` | Full architectural design notes — per-pillar responsibilities, examples, priorities, rationales | `/plan-secondbrain.md` |
| `components.md` | Evaluated candidate libraries/tools per pillar with GitHub links and status markers (`- done`) | `/components.md` |
| `EchoesVault/index.md` | Master registry of all knowledge base pages (currently empty — 0 pages) | `/EchoesVault/index.md` |
| `.opencode/echoes-state.json` | EchoesVault plugin state: version 1.2.2, initialized=false, session status | `/.opencode/echoes-state.json` |
| `.opencode/commands/echoes-init.md` | Vault initialization workflow (create directories, index, activate) | `/.opencode/commands/echoes-init.md` |
| `.opencode/commands/echoes-start.md` | Session start with context restoration from last 3 daily logs | `/.opencode/commands/echoes-start.md` |
| `.opencode/commands/echoes-end.md` | Session end with memory save via `commit_memory_to_echoes_vault` | `/.opencode/commands/echoes-end.md` |
| `.opencode/commands/echoes-status.md` | Vault health dashboard (topic count, index health, scale alert) | `/.opencode/commands/echoes-status.md` |
| `.opencode/skills/echoes-append-to-daily-log/SKILL.md` | Skill: append dry mid-session notes to daily log | `/.opencode/skills/echoes-append-to-daily-log/SKILL.md` |
| `.opencode/skills/echoes-create-or-update-page/SKILL.md` | Skill: create/update encyclopedia pages with YAML frontmatter, auto-index | `/.opencode/skills/echoes-create-or-update-page/SKILL.md` |
| `.opencode/skills/echoes-search-vault-pages/SKILL.md` | Skill: targeted keyword search across `pages/` dir | `/.opencode/skills/echoes-search-vault-pages/SKILL.md` |

## Layers

### Pillar 1 — Memory System (Bottom Infrastructure Layer)
- **Purpose:** All persistent storage — episodic memory, semantic memory, procedural memory (skills), vector search, knowledge graph, document storage, consolidation/ranking/retrieval/decay
- **Location:** `EchoesVault/` (file-based), plus planned external DBs (Neo4j/KuzuDB, Qdrant/Chroma, PostgreSQL)
- **Contains:** Markdown files (current), planned vector/graph/relational databases
- **Depends on:** LLMs (for embeddings), OpenCode filesystem tools
- **Used by:** Intelligence Layer (Pillar 6), Workflow/Orchestration (Pillar 4)

### Pillar 2 — Execution Layer (The Kernel)
- **Purpose:** OpenCode runtime that executes agent actions — terminal, file ops, tool execution, subagents, skills
- **Location:** External — the OpenCode binary
- **Depends on:** LLMs, MCP/Tools (Pillar 3)
- **Used by:** Workflow/Orchestration (Pillar 4), Intelligence Layer (Pillar 6)

### Pillar 3 — MCP / Tools (Hardware Abstraction)
- **Purpose:** Universal interface to external services via Model Context Protocol
- **Planned integrations:** web search, web fetch, browser automation, GitHub, Docker, databases, Notion, Slack, Telegram, Google Drive, Gmail, Calendar
- **Depends on:** MCP specification, individual MCP servers
- **Used by:** Execution Layer (Pillar 2)

### Pillar 4 — Workflow & Orchestration
- **Purpose:** Planning, parallel agents, delegation, scheduling, retries, checkpoints, long-running tasks, reflection, background jobs
- **Location:** Planned — candidates listed in `components.md` lines 55–74
- **Depends on:** Execution Layer (Pillar 2), MCP/Tools (Pillar 3)
- **Used by:** Intelligence Layer (Pillar 6)

### Pillar 5 — GUI / Mission Control
- **Purpose:** User-facing visualization — agent visualization, memory graph, task graph, logs, timeline, knowledge graph explorer, workflow monitor, token usage, cost tracking
- **Location:** Planned — candidates listed in `components.md` lines 76–86
- **Depends on:** Intelligence Layer (Pillar 6), Execution Layer (Pillar 2)

### Pillar 6 — Intelligence Layer (The Value Layer)
- **Purpose:** Memory reasoning, graph reasoning, goal tracking, self-reflection, self-improvement, skill generation, decision making, world modeling, context assembly, long-term planning
- **Status:** "This is not an existing project. It's the core software you write." (`plan-secondbrain.md` line 139)
- **Depends on:** All other pillars (1–5)
- **Unique value:** This is what differentiates Khucinque OS from a plain OpenCode setup

## Data Flow

### Current State (Documentation Flow Only)
1. Design decisions captured in `plan-secondbrain.md` (167 lines)
2. Tool/library candidates listed in `components.md` (94 lines, 30+ candidates)
3. Knowledge base structured via EchoesVault plugin conventions
4. Session context persisted across OpenCode sessions via `.opencode/commands/` and `.opencode/skills/`
5. No runtime data flow exists — repo is pre-implementation

### Planned Primary Request Path
1. **User input** via Mission Control GUI (Pillar 5)
2. **Intelligence Layer** processes intent — context assembly, memory reasoning, graph reasoning, goal tracking (Pillar 6)
3. **Workflow/Orchestration** creates plan, delegates to subagents, manages checkpoints (Pillar 4)
4. **OpenCode Runtime** executes agent actions — coding, file ops, terminal (Pillar 2)
5. **MCP/Tools** interface with external services — web, GitHub, Docker, DBs, Slack (Pillar 3)
6. **Memory System** logs results, updates knowledge graph, consolidates episodic records (Pillar 1)
7. **Feedback** to Intelligence Layer for self-reflection and self-improvement

## Entry Points

### Repository Entry Points (for human contributors)
- `README.md` — Project overview, stack diagram, 6-pillar summary, contributing link
- `AGENTS.md` — Agent-focused quick-start: "No code yet," links to `plan-secondbrain.md` and `components.md`
- `plan-secondbrain.md` — Deepest architectural document (167 lines) covering all 6 pillars

### OpenCode Plugin Entry Points (for agent sessions)
- `.opencode/commands/echoes-init.md` — Initialize vault structure (run once per project)
- `.opencode/commands/echoes-start.md` — Start session, restore last 3 days of context
- `.opencode/commands/echoes-end.md` — End session, save via `commit_memory_to_echoes_vault`
- `.opencode/commands/echoes-status.md` — Quick health dashboard (topic count, deprecations)
- `.opencode/skills/echoes-search-vault-pages/SKILL.md` — Search before writing (read-before-write rule)

## Architectural Constraints

- **No code yet:** This repo holds architecture documents and component candidates only. `AGENTS.md` explicitly states "No code yet."
- **Design-first:** Architecture is documented before implementation. The 6-pillar model is the single source of truth.
- **OpenCode-native:** All plugin configurations (commands, skills) are OpenCode-specific Markdown files with YAML frontmatter.
- **CC BY 4.0:** Open-source contributions welcome under Creative Commons Attribution.
- **Memory-first:** Memory pillar is designated "heart of Khucinque OS" (⭐⭐⭐⭐⭐ importance).
- **Candidate-select:** `components.md` lists 30+ candidates with instruction "pick one per slot rather than running all of them."
- **ADR-style documentation:** EchoesVault commands enforce Architectural Decision Record format — YAML frontmatter required, technical density, no conversational filler.
- **Deprecation over deletion:** `> [!warning] DEPRECATED` callouts used instead of deleting old docs.

## Anti-Patterns

### Candidate Overload / Analysis Paralysis
- **What happens:** `components.md` lists 30+ candidate tools/libraries without selection criteria or trade-off analysis. Multiple options exist for every slot (4 vector DBs, 5 orchestration frameworks, 5 GUI projects).
- **Why it's wrong:** Without explicit selection criteria, design remains abstract and cannot progress to implementation. New contributors can't tell which choice is preferred.
- **Do this instead:** Prune to top 1–2 per slot with explicit selection notes per the header instruction "pick one per slot rather than running all of them."

### Undefined Selection Criteria
- **What happens:** No files define the criteria for choosing between candidates (e.g., local-first vs cloud, embedded vs server, license compatibility, Python vs TypeScript).
- **Why it's wrong:** Prevents the transition from design to implementation.
- **Do this instead:** Add a small decision matrix in `components.md` per pillar with 3–4 evaluation axes (e.g., self-hosted, Python-native, open-source license, active maintenance).

## Error Handling

**Strategy:** Not yet designed — this is a pre-implementation design repo. No error-handling patterns exist.

## Cross-Cutting Concerns

**Logging:**
- Session logging handled by EchoesVault daily logs (`EchoesVault/daily/YYYY-MM-DD.md`)
- Pattern: Append-only, dry technical notes, triggered after sub-task completion
- No structured logging (e.g., `loguru`, `structlog`) designed yet

**Validation:**
- Not addressed in any design document
- EchoesVault skills enforce YAML frontmatter validation on page creation

**Authentication:**
- Not addressed — planned MCP servers each handle their own auth
- No credential management designed for the Intelligence Layer

---

*Architecture analysis: 2026-07-25*
