# Khucinque OS

Khucinque OS is an Intelligence Layer that sits on top of OpenCode, powered by a persistent memory system built like a human brain — four distinct memory modules, not one blob store — connected to the world through MCP, orchestrated by GSD + ruflo, and operated through Mission Control.

Its unique value isn't execution — OpenCode already does that well. The value is making the agent remember, reason, and continuously evolve over the long term.

This is the current, pruned architecture. See [components.md](./components.md) for the original full candidate list (evaluation phase) and [components2nd.md](./components2nd.md) for the cut-down reasoning behind what's below.

## Architecture

```text
                USER
                  │
          Mission Control
                  │
────────────────────────────────────
        Intelligence Layer
   (custom software, not built yet)
────────────────────────────────────
      GSD  +  ruflo  (workflow / parallel agents)
────────────────────────────────────
   OpenCode Runtime  +  cua-driver (native GUI control)
────────────────────────────────────
        MCP / Tools (on-demand, npx/remote only)
────────────────────────────────────
      Memory System (4 modules, see below)
────────────────────────────────────
                 LLMs
```

## Memory — four modules, like a brain

| Module | Function | Owner |
|---|---|---|
| Working | active context, self-editing state | Letta |
| Episodic | session/event history, "what happened when" | EchoesVault + Mem0 |
| Semantic | facts, concepts, relationships | Membase |
| Procedural | skills, codebase structure, how-to | Graphify |

## Live components

| Pillar | Component | Status |
|---|---|---|
| Memory | Letta, EchoesVault, Mem0, Membase, Graphify | live (per 4-module table above) |
| Execution | OpenCode (kernel) | live, external |
| Execution | cua-driver | **wired 2026-07-29** — skill + MCP entry (`cua-driver mcp`) in `opencode.json` |
| Execution | ponytail | live plugin |
| Execution | caveman | live (Claude Code side) |
| Workflow | GSD (`gsd-core`) | live MCP, 33 agents, drives `.planning/` |
| Workflow | ruflo | live MCP, swarm/parallel-agent coordination |
| GUI | Mission Control | must-keep, control plane |
| GUI | opencode-visualiser | optional, cheap add-on |

Everything else evaluated in `components.md` (Neo4j, Kuzu, Qdrant, Chroma, Weaviate, pgvector, LangGraph, Temporal, Ray, Prefect, CrewAI, AutoGen, n8n, Grafana, Langfuse, Flowise, vibe-kanban, and 25+ more) was **cut from active scope on 2026-07-29** — the vendored source (43 repos, 4.8G) was deleted after confirming zero local modifications and zero references from live config. Re-add individually, on demand, as an `npx`/remote MCP entry only when a concrete task needs it — never re-vendor source.

## Project status

GSD-managed. See [.planning/STATE.md](./.planning/STATE.md) for current phase/plan position and [.planning/ROADMAP.md](./.planning/ROADMAP.md) for the phase plan. Known open item: Phase 2 commits (`02-01`, `02-02`) exist on `origin/phase-01-memory-reliability` but are not yet merged to `master`.

## The Six Pillars (original framing)

1. **Memory** — persistent, episodic, semantic, and procedural memory; vector database; knowledge graph; document storage; consolidation, ranking, retrieval, decay/archiving; world model.
2. **Execution Layer** — the OpenCode runtime: agent runtime, coding agent, subagents, skills, terminal execution, file operations, tool execution, multi-model support, native GUI control (cua-driver). The "kernel."
3. **MCP / Tools** — the universal hardware abstraction layer: web search/fetch, browser automation, terminal, GitHub, Docker, databases, filesystem, Notion, Slack, Telegram, Drive, email, calendar, APIs — added on demand, not pre-vendored.
4. **Workflow & Orchestration** — the coordinating "brain": GSD for planning/phases, ruflo for parallel/delegated agent execution.
5. **GUI / Mission Control** — everything the user sees: agent visualization, memory graph, task graph, agent status, logs, timeline, knowledge graph explorer, workflow monitor, token usage, cost tracking.
6. **Intelligence Layer** — the layer that makes Khucinque OS unique: memory reasoning, graph reasoning, goal tracking, self-reflection, self-improvement, skill generation, decision making, world modeling, context assembly, long-term planning. This is not off-the-shelf. This is the core software to build.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[CC BY 4.0](./LICENSE)
