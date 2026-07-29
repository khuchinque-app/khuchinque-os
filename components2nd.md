# Khucinque OS — Components v2 (pruned)

Follow-up to [components.md](./components.md) after auditing `~/khuchinque-os` (deleted 2026-07-29 — 43 vendored repos, zero local modifications, nothing referenced by live config). This is the cut-down list: one thing per slot, built around the memory-first goal.

**Core goal:** memory system that works like a human brain — four modules, not one blob store.

| Module | Function | Owner |
|---|---|---|
| Working | active context, self-editing state | **Letta** |
| Episodic | session/event history, "what happened when" | **EchoesVault** + **Mem0** |
| Semantic | facts, concepts, relationships | **Membase** |
| Procedural | skills, codebase structure, how-to | **Graphify** |

This matches what PROJECT.md already calls the "4-layer cognitive memory architecture" — v2 just confirms it and cuts everything that duplicates it.

## Must-keep (explicit)

* **Graphify** — codebase/doc → knowledge graph, procedural memory layer. Already live (`/graphify` skill, `~/graphify-out`).
* **GSD** (`gsd-core`) — project lifecycle framework: phases, plans, roadmap, 33 agents. Already live (`gsd` MCP server). This *is* the workflow/orchestration pillar now — nothing else in that category is needed underneath it.
* **cua-driver** (trycua CuaDriver, `~/.cua-driver`) — computer-use agent: drives real GUI apps (not just browser) via accessibility tree + pixel fallback, sandboxed daemon. Fills the gap browser-use/stagehand don't cover. **Wired 2026-07-29**: skill linked at `~/.config/opencode/skills/cua-driver`, MCP entry `cua-driver` (`cua-driver mcp`) added to this project's `opencode.json`. Default transport is still the CLI (`Bash` + `cua-driver <tool> '<json>'`) per the skill's own guidance — MCP is the fallback path, not primary.
* **Agent-parallel** — **ruflo**. Already live (`ruflo` MCP, swarm coordinator, 260+ tools). Covers delegation/parallel execution — this is the "agent-parallel" slot. [pocket-universe](https://github.com/spoons-and-mirrors/pocket-universe) is the lighter OpenCode-native alternative if ruflo ever feels like too much — worth a bake-off later, not both.
* **Visualisation** — **Mission Control** (control plane: agent status, task graph, logs, cost). [opencode-visualiser](https://github.com/psinetron/opencode-visualiser) optional add-on (cheap, glanceable pixel-art activity view) — keep both, they don't overlap.

## Memory — keep only

* Letta, EchoesVault, Mem0, Membase, Graphify (table above)

**Cut:** Neo4j, KuzuDB, Qdrant, Chroma, Weaviate, pgvector, llama_index, standalone Postgres — these are raw vector/graph infra that Mem0/Membase/Graphify already provide as a managed layer. Adding them back means running a database for something already solved.

## Execution Layer — keep only

* OpenCode (the kernel, external)
* ponytail — already live plugin
* caveman — already live (Claude Code side, separate from this repo)
* claude-agent-sdk (python/ts) — keep as reference only if actively scripting against it, otherwise cut

**Cut:** nothing else was in this pillar.

## MCP / Tools — keep only

* cua (must-have, see above)
* Whatever MCP servers you're actually calling this week (check `opencode.json` before adding — right now that's just `ruflo`, `mem0-mcp`, `membase`, `gsd`)

**Cut:** Notion, Slack, Telegram, Gmail, Google Cal/Drive, Brave Search, Docker gateway, Postgres MCP, master-fetch, browser-use/stagehand — none of these are wired into active config today. Add back one at a time, only when a real task needs it, as an `npx`/remote MCP entry — never re-vendor the source.

## Workflow & Orchestration — keep only

* GSD (must-have)
* ruflo (= agent-parallel, must-have)

**Cut:** LangGraph, Temporal, Ray, Prefect, CrewAI, AutoGen, n8n, micode, opencode-goopspec. All solve "coordinate multiple steps/agents" — GSD (planning) + ruflo (execution/swarm) already cover that combination for this project. Revisit only if a specific limitation shows up, not speculatively.

## GUI / Mission Control — keep only

* Mission Control (must-have)
* opencode-visualiser (optional, cheap)

**Cut:** Grafana, Langfuse, Flowise, vibe-kanban — dashboards for problems this project doesn't have yet (no metrics backend, no LLM-observability need, no separate kanban when GSD already tracks phases/plans).

## Intelligence Layer — no change

Still not off-the-shelf. DSPy remains prior art / optional building block if the reasoning core ends up needing programmatic LM pipelines — not a dependency to install now.

---

**Net effect vs components.md:** ~35 candidate repos → 9 live components (Letta, EchoesVault, Mem0, Membase, Graphify, GSD, ruflo, cua, Mission Control) + 2 optional (opencode-visualiser, claude-agent-sdk) + OpenCode itself as kernel. Everything else is cut from active scope; re-add individually, on demand, only when a concrete task needs it — never vendor the source again, always npx/remote/package.
