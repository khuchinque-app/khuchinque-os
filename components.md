# Khucinque OS — Components

A working parts-list for building Khucinque OS on top of [OpenCode](https://github.com/sst/opencode) as the execution layer, organized by the six pillars in [plan-secondbrain.md](./plan-secondbrain.md). Each entry links to its GitHub repo.

> These are candidates to evaluate, not a fixed bill of materials — pick one per slot rather than running all of them.

## 1. Memory

Persistent, episodic, semantic, and procedural memory; vector storage; knowledge graph; consolidation, ranking, retrieval, decay.

* [mem0ai/mem0](https://github.com/mem0ai/mem0) — universal memory layer for AI agents (user/session/agent memory, ranking, retrieval).
* [letta-ai/letta](https://github.com/letta-ai/letta) — formerly MemGPT; stateful agents with self-editing memory and context management.
* [getzep/graphiti](https://github.com/getzep/graphiti) — temporal knowledge graph engine built for agent memory; tracks how facts change over time.
* [neo4j/neo4j](https://github.com/neo4j/neo4j) — graph database for the knowledge graph layer.
* [kuzudb/kuzu](https://github.com/kuzudb/kuzu) — embedded, lightweight property graph database (Neo4j alternative for local-first setups).
* [qdrant/qdrant](https://github.com/qdrant/qdrant) — vector database for semantic memory / embeddings retrieval.
* [chroma-core/chroma](https://github.com/chroma-core/chroma) — embedded vector database, easy local alternative to Qdrant.
* [weaviate/weaviate](https://github.com/weaviate/weaviate) — vector database with hybrid search, alternative to Qdrant.
* [pgvector/pgvector](https://github.com/pgvector/pgvector) — vector similarity search as a Postgres extension, if you want memory to live in the same PostgreSQL instance as everything else.
* [run-llama/llama_index](https://github.com/run-llama/llama_index) — document ingestion, indexing, and retrieval framework (document storage → semantic memory pipeline).
* [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) — turns a codebase (docs, SQL schemas, configs, PDFs) into a queryable knowledge graph via local deterministic AST parsing, no vector store required; ships as a `/graphify` skill for Claude Code, Cursor, Codex, and Gemini CLI.
* [psinetron/echoes-vault-opencode](https://github.com/psinetron/echoes-vault-opencode) — persistent memory plugin for OpenCode specifically: an Obsidian-style, plain-Markdown knowledge base (decisions, work logs, project encyclopedia) that survives across sessions.

## 2. Execution Layer

The kernel. This is OpenCode itself, plus the SDKs used to script/extend it, and skills that change how the agent behaves.

* [sst/opencode](https://github.com/sst/opencode) — the AI coding agent runtime: terminal execution, file operations, tool execution, multi-model, subagents.
* [anthropics/claude-agent-sdk-python](https://github.com/anthropics/claude-agent-sdk-python) — Python SDK exposing the Claude agent loop, tools, and context management (what OpenCode itself is built on top of).
* [anthropics/claude-agent-sdk-typescript](https://github.com/anthropics/claude-agent-sdk-typescript) — TypeScript equivalent, useful if Mission Control or the Intelligence Layer is a Node/TS service driving OpenCode.
* [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) — coding-agent skill that compresses agent output into minimal-token "caveman" phrasing, cutting ~65% of tokens without losing technical accuracy.
* [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) — skill that pushes the agent toward the smallest correct diff (YAGNI, stdlib-first) instead of over-building; reports 80–94% less code written on benchmarks.

## 3. MCP / Tools

The hardware abstraction layer — everything OpenCode reaches out to the world through.

* [modelcontextprotocol/modelcontextprotocol](https://github.com/modelcontextprotocol/modelcontextprotocol) — the MCP specification itself.
* [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) — official reference MCP servers: filesystem, fetch, git, memory, sequential-thinking, time.
* [browser-use/browser-use](https://github.com/browser-use/browser-use) — browser automation for AI agents, MCP/CLI-friendly.
* [browserbase/stagehand](https://github.com/browserbase/stagehand) — SDK for browser agents, alternative to browser-use.
* [dondai1234/master-fetch](https://github.com/dondai1234/master-fetch) — self-hosted MCP web-fetch server with Cloudflare bypass and content extraction; no API keys, no per-request billing.

## 4. Workflow & Orchestration

The brain that coordinates work: planning, delegation, scheduling, retries, checkpoints, long-running/background jobs.

OpenCode-native plugins (drop-in for this exact stack):

* [ruvnet/ruflo](https://github.com/ruvnet/ruflo) — agent meta-harness for OpenCode/Claude Code/Codex: multi-agent swarms, adaptive/self-learning memory, RAG integration, MCP tools for coordination.
* [hffmnnj/opencode-goopspec](https://github.com/hffmnnj/opencode-goopspec) — spec-driven development for OpenCode: 5-phase workflow (Discuss → Plan → Execute → Audit → Confirm) with delegation, checkpoints, and verification gates.
* [spoons-and-mirrors/pocket-universe](https://github.com/spoons-and-mirrors/pocket-universe) — closed-loop async subagents for OpenCode: broadcast messaging, spawn, and recall for coordinating parallel agents without blocking the main thread.
* [vtemian/micode](https://github.com/vtemian/micode) — OpenCode plugin enforcing a Brainstorm → Plan → Implement workflow, with 12 specialized subagents and session continuity across isolated git worktrees.

General-purpose orchestration (bring your own agent runtime):

* [temporalio/temporal](https://github.com/temporalio/temporal) — durable execution engine for long-running workflows, retries, and checkpoints.
* [ray-project/ray](https://github.com/ray-project/ray) — distributed compute framework for scaling parallel agents.
* [langchain-ai/langgraph](https://github.com/langchain-ai/langgraph) — graph-based agent orchestration with state, cycles, and human-in-the-loop.
* [crewAIInc/crewAI](https://github.com/crewAIInc/crewAI) — role-based multi-agent orchestration framework.
* [microsoft/autogen](https://github.com/microsoft/autogen) — multi-agent conversation framework (now in maintenance mode; Microsoft is folding it into Microsoft Agent Framework — evaluate that migration path before committing).
* [n8n-io/n8n](https://github.com/n8n-io/n8n) — visual workflow automation, useful for scheduling and background job wiring.
* [PrefectHQ/prefect](https://github.com/PrefectHQ/prefect) — Python-native workflow orchestration, retries, and scheduling.

## 5. GUI / Mission Control

Everything the user sees: agent visualization, task graph, logs, timeline, token usage, cost tracking.

* [BloopAI/vibe-kanban](https://github.com/BloopAI/vibe-kanban) — kanban board built to orchestrate and monitor coding agents like Claude Code / OpenCode.
* [psinetron/opencode-visualiser](https://github.com/psinetron/opencode-visualiser) — OpenCode plugin that turns agent terminal logs into a real-time animated 2D pixel-art view of multiple agents working, idling, and reacting.
* [langfuse/langfuse](https://github.com/langfuse/langfuse) — LLM observability: traces, token usage, cost tracking, evals.
* [FlowiseAI/Flowise](https://github.com/FlowiseAI/Flowise) — visual builder/monitor for LLM flows, reference for a drag-and-drop mission-control UI.
* [grafana/grafana](https://github.com/grafana/grafana) — dashboards for logs/metrics if Mission Control needs a metrics backend rather than a bespoke UI.
* [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) — collection of `DESIGN.md` files distilled from real brand design systems; drop one in and have the coding agent scaffold a matching Mission Control UI in one shot.

## 6. Intelligence Layer

Not an off-the-shelf project — this is the custom software Khucinque OS is actually about. The projects below are building blocks/prior art for reasoning, self-reflection, and context assembly, not drop-in replacements.

* [stanfordnlp/dspy](https://github.com/stanfordnlp/dspy) — framework for programming (not prompting) LLM pipelines; useful for building the reasoning/decision-making core.
* [getzep/graphiti](https://github.com/getzep/graphiti) — also relevant here for graph reasoning over the memory layer (see Pillar 1).
* [letta-ai/letta](https://github.com/letta-ai/letta) — also relevant here for self-editing memory as a self-improvement primitive (see Pillar 1).
