# OpenCode

## What This Is

OpenCode is a personal AI-assisted development environment — an interactive CLI tool that helps individual developers with software engineering tasks through AI-powered code generation, debugging, refactoring, and project lifecycle management. Built on a layered plugin architecture with a 4-layer cognitive memory system, it aims to be an AI coding partner that never forgets context across sessions.

## Core Value

Persistent memory that never forgets — every session picks up exactly where the last one left off, with full context, decisions, and reasoning preserved.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ 4-Layer Cognitive Memory Architecture — Working (Letta/Membase), Episodic (EchoesVault/Mem0), Semantic (Membase/Letta), Procedural (Graphify/EchoesVault)
- ✓ EchoesVault knowledge base — Session logging, daily logs, encyclopedia pages with index
- ✓ GSD Framework — 89 commands, 33 agent definitions, 12 skills for project lifecycle management
- ✓ Plugin system — OpenCode Plugin SDK, ponytail, caveman, echoes plugins
- ✓ MCP tool layer — ruflo (260+ tools), mem0-mcp (vector memory), membase (knowledge base)
- ✓ Codebase mapping — 7 codebase analysis documents committed

### Active

<!-- Current scope. Building toward these. -->

- [ ] **MEM-01: Reliable cross-session memory** — AI assistant remembers everything across sessions without manual save/restore
- [ ] **MEM-02: Automated session lifecycle** — `/echoes-start` on session begin, automatic context loading from daily logs + vault
- [ ] **MEM-03: Memory search & retrieval** — Semantic search across all memory layers from natural language
- [ ] **AGENT-01: Install GSD subagents** — 18 missing agent types installed and operational
- [ ] **DX-01: CI/CD pipeline** — Automated validation for GSD workflow integrity
- [ ] **DX-02: Workflow testing** — Automated tests for 89 workflow procedures

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Public/team deployment — This is a personal development environment; multitenant or SaaS features add complexity without benefit
- Mobile client — CLI-first; mobile would require separate runtime

## Context

- **Technical environment:** Node.js v24.18, TypeScript 5.7+, Linux (VPS host "deneuve")
- **Existing memory infrastructure:** 4-layer cognitive architecture with EchoesVault, Mem0, Letta, Membase, Graphify — implements working/episodic/semantic/procedural memory layers
- **Current gaps:** Echoes vault session never started (state shows Initialized=true, Session=false); memory persistence requires explicit `/echoes-end` or `commit_memory_to_echoes_vault` calls — not automatic
- **GSD framework:** v1.38.5 framework installed with 89 commands but 18 of 33 subagents not registered
- **Prior work:** Extensive configuration and integration work completed; codebase mapped and documented

## Constraints

- **Tech stack**: Node.js/TypeScript runtime — must stay within OpenCode/Claude Code ecosystem
- **Memory architecture**: Must work within the existing 4-layer model (not replace it)
- **Single-user**: Personal dev environment — no multi-tenant or auth requirements
- **API dependency**: Mem0 and Membase are external MCP services — availability depends on those services

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 4-layer cognitive memory | Covers all memory types (working/episodic/semantic/procedural) | ✓ Good |
| File-based planning (`.planning/`) | Survives context loss, git-tracked, no DB dependency | ✓ Good |
| EchoesVault markdown KB | Human-readable, git-friendly, no special tooling needed | ✓ Good |
| GSD framework for lifecycle | Structured planning without enterprise PM overhead | ✓ Good |

---
*Last updated: 2026-07-25 after /gsd-new-project*
