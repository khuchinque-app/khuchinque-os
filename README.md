# Khucinque OS

Khucinque OS is an Intelligence Layer that sits on top of OpenCode, powered by a persistent memory system, connected to the world through MCP, orchestrated by workflows, and operated through Mission Control.

Its unique value isn't execution — OpenCode already does that well. The value is making the agent remember, reason, and continuously evolve over the long term.

See [plan-secondbrain.md](./plan-secondbrain.md) for the current architecture notes.

## Architecture

```text
                USER
                  │
          Mission Control
                  │
────────────────────────────────────
        Intelligence Layer
   (custom software)
────────────────────────────────────
Workflow / Supervisor
────────────────────────────────────
OpenCode Runtime
────────────────────────────────────
MCP / Tools
────────────────────────────────────
Memory System
────────────────────────────────────
LLMs
```

## The Six Pillars

1. **Memory** — persistent, episodic, semantic, and procedural memory; vector database; knowledge graph; document storage; consolidation, ranking, retrieval, decay/archiving; world model.
2. **Execution Layer** — the OpenCode runtime: agent runtime, coding agent, subagents, skills, terminal execution, file operations, tool execution, multi-model support. The "kernel."
3. **MCP / Tools** — the universal hardware abstraction layer: web search/fetch, browser automation, terminal, GitHub, Docker, databases, filesystem, Notion, Slack, Telegram, Drive, email, calendar, APIs.
4. **Workflow & Orchestration** — the coordinating "brain": planning, parallel agents, delegation, supervision, scheduling, retries, checkpoints, long-running tasks, reflection, background jobs.
5. **GUI / Mission Control** — everything the user sees: agent visualization, memory graph, task graph, agent status, logs, timeline, knowledge graph explorer, workflow monitor, token usage, cost tracking.
6. **Intelligence Layer** — the layer that makes Khucinque OS unique: memory reasoning, graph reasoning, goal tracking, self-reflection, self-improvement, skill generation, decision making, world modeling, context assembly, long-term planning. This is the core software to build.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[CC BY 4.0](./LICENSE)
