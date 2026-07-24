# Architecture

**Analysis Date:** 2026-07-25

## Pattern Overview

**Overall:** Personal AI Development Environment with Layered Plugin Architecture

**Key Characteristics:**
- OpenCode CLI as the runtime orchestrator
- Plugin-based extensibility (echoes, ponytail, GSD framework)
- MCP (Model Context Protocol) for external tool integration
- Multi-layered memory architecture (4-layer cognitive model)
- File-based state for project planning (`.planning/` directory)
- 33 specialized agents for project lifecycle management

## Layers

**OpenCode Runtime Layer:**
- Purpose: Orchestrates the AI agent, manages MCP servers, plugins, and conversation
- Contains: Plugin system, MCP client, conversation management, permission rules
- Configuration: `opencode.json`, `opencode.jsonc`, `.claude/settings.local.json`
- Used by: All other layers via agent runtime

**MCP Tool Layer:**
- Purpose: External tools and services accessed via Model Context Protocol
- Contains: ruflo (local agent tools), mem0-mcp (vector memory), membase (knowledge base)
- Location: MCP configs in `opencode.json` and `opencode.jsonc`
- Depends on: Network (for remote MCP) or local Node processes
- Used by: OpenCode agents for tool execution

**GSD Framework Layer:**
- Purpose: Project lifecycle management — plan, execute, verify, ship
- Contains: 89 commands, 33 agent definitions, 12 skills, 40+ references, 30+ templates
- Location: `.opencode/get-shit-done/`
- Depends on: OpenCode task tool for agent spawning, SDK for queries
- Used by: All project phases

**Memory Layer (4-Layer Cognitive Architecture):**
- Purpose: Persistent context across sessions and tasks
- Layers:
  - Layer 1 (Working): Letta, Membase recent
  - Layer 2 (Episodic): EchoesVault daily logs, Mem0
  - Layer 3 (Semantic): Membase wiki, Letta human.md
  - Layer 4 (Procedural): Graphify knowledge graph, EchoesVault pages

**Custom Project Layer (khuchinque-os):**
- Purpose: Personal intelligence layer project (concept/design phase)
- Location: `khuchinque-os/`
- Status: Planning only — components.md evaluates 40+ tools across 6 pillars
- Depends on: All lower layers

## Data Flow

**Session Lifecycle:**
1. OpenCode session starts
2. Agent reads Letta context (human.md, persona.md)
3. Agent loads Membase recent context + EchoesVault daily logs
4. User provides task or command
5. Agent processes using available tools (MCP, task, filesystem)
6. Mid-task: echoes_append_to_daily_log for breadcrumbs
7. Session end: /echoes-end or commit_memory_to_echoes_vault

**GSD Command Flow:**
1. User invokes `/gsd-<command>`
2. Command definition loaded from `commands/gsd/<command>.md`
3. Workflow executed (may spawn subagents via task tool)
4. Artifacts written to `.planning/` directory
5. Commit via gsd-sdk query commit
6. Context returned to user

**State Management:**
- File-based: `.planning/` directory for project artifacts
- Memory-based: EchoesVault (markdown), Mem0 (vectors), Letta (agent memory), Graphify (graph)
- No database — all state is file or MCP-server backed

## Key Abstractions

**Plugin:**
- Purpose: Extend OpenCode capabilities
- Examples: `echoes-vault-opencode`, `@dietrichgebert/ponytail`
- Pattern: npm plugin package with lifecycle hooks

**MCP Server:**
- Purpose: Expose tools/resources to AI agent
- Examples: ruflo (local), mem0-mcp (remote), membase (remote)
- Pattern: Client-server via MCP protocol (local stdio or remote HTTP)

**GSD Command:**
- Purpose: Single project lifecycle operation
- Examples: `gsd-new-project`, `gsd-plan-phase`, `gsd-execute-phase`
- Pattern: Markdown file with frontmatter + workflow reference

**GSD Agent:**
- Purpose: Specialized subagent for focused tasks
- Examples: `gsd-project-researcher`, `gsd-roadmapper`, `gsd-executor`
- Pattern: Agent definition file with system prompt + tool capabilities

**Skill:**
- Purpose: Reusable instruction set for common tasks
- Examples: caveman, ponytail, echoes skills
- Pattern: SKILL.md file loaded via skill() tool

## Entry Points

**OpenCode CLI:**
- Location: `opencode.json` (config), `bin/opencode` (binary)
- Triggers: `opencode` CLI command
- Responsibilities: Load config, start session, process conversation

**GSD Commands:**
- Location: `commands/gsd/*.md`
- Triggers: User types `/gsd-<command>` in conversation
- Responsibilities: Execute workflow, produce artifacts

**GSD SDK:**
- Location: `.opencode/sdk/dist/cli.js`
- Triggers: `gsd-sdk query <command>`
- Responsibilities: Init checks, commit, config queries, agent skill retrieval

## Error Handling

**Strategy:** Agent-level error handling with user notification. Workflows include validation gates.

**Patterns:**
- Missing agents detected at init → fallback to inline execution
- Workflow gates (user approval) prevent incorrect state transitions
- Atomic commits ensure artifacts persist even if context lost
- gsd-sdk commands propagate errors to agent context

## Cross-Cutting Concerns

**Logging:**
- OpenCode built-in logging (configurable via logLevel)
- GSD SDK uses ora for spinner/progress display

**Validation:**
- Workflow gates ensure correct state before proceeding
- gsd-sdk init queries validate project state before commands
- Secret scanning before commits (grep for API key patterns)

**Configuration:**
- Primary: `opencode.json` (project-level)
- Global: `opencode.jsonc` (`~/.config/opencode/`)
- Per-runtime: `.claude/settings.local.json`, `.vscode/mcp.json`
- GSD: `.planning/config.json`

**Security:**
- Sensitive values via environment variables (MEM0_API_KEY, ANTHROPIC_API_KEY)
- MCP auth via bearer tokens in config files
- OpenCode "Deny" permissions for sensitive tools/files

---

*Architecture analysis: 2026-07-25*
*Update when major patterns change*
