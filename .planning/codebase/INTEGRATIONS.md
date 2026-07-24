# External Integrations

**Analysis Date:** 2026-07-25

## APIs & External Services

**Memory/Knowledge:**
- Mem0 — Vector memory and semantic search via MCP
  - Integration: MCP remote server at `https://mcp.mem0.ai/mcp`
  - Auth: Bearer token in `MEM0_API_KEY` env var (configured in `opencode.jsonc`)
  - Tools: add/search/update/delete memories, list entities/events
- Membase — Long-term memory/encyclopedia via MCP
  - Integration: MCP remote server at `https://mcp.membase.so/mcp`
  - Auth: No auth header (configured in `.vscode/mcp.json`)
  - Tools: search_memory, search_wiki, add_memory, add_wiki
- Letta — Local agent memory backend
  - Integration: Local backend (`lc-local-backend`), agent ID `agent-local-4dbce745...`
  - Location: `~/.letta/` and `.letta/`

**Agent/AI:**
- Anthropic Claude API — Underlying model for OpenCode and GSD agents
  - Auth: `ANTHROPIC_API_KEY` env var
  - SDK: `@anthropic-ai/claude-agent-sdk` v0.2.84
  - Used by: OpenCode runtime, GSD subagents

**Agent Tools:**
- Ruflo — Agent swarming and MCP tool server
  - Integration: MCP local server via `npx ruflo@latest mcp start`
  - Tools: agent management, memory store, embeddings, coordination, browser
  - Configured in `opencode.json` under `mcp.ruflo`

## Data Storage

**Knowledge Base:**
- EchoesVault — Markdown knowledge base (local filesystem)
  - Location: `EchoesVault/`
  - Plugin: `echoes-vault-opencode`
  - Structure: `pages/` (encyclopedia), `daily/` (work logs), `index.md` (master registry)
  - Commands: `/echoes-init`, `/echoes-start`, `/echoes-end`, `/echoes-status`

**Knowledge Graph:**
- Graphify — AST-based knowledge graph from code/docs
  - Location: `graphify-out/`
  - Output: `graph.json`, `graph.html`, `GRAPH_REPORT.md`
  - Command: `/graphify <path>`, `/graphify query`, `/graphify path`, `/graphify explain`

**Project Planning:**
- GSD-OpenCode — Project lifecycle framework
  - Location: `.opencode/get-shit-done/` (v1.38.5)
  - Source: `rokicool/gsd-opencode` GitHub
  - Components: 89 commands in `commands/gsd/`, 33 agents in `agents/`, 12 skills, 40+ references, 30+ templates

## Authentication & Identity

**Auth Provider:**
- None (personal development environment — no user auth)
- MCP servers use bearer tokens where applicable (mem0-mcp)

## Monitoring & Observability

**Error Tracking:**
- None configured

**Analytics:**
- None

**Logs:**
- OpenCode built-in logging (logLevel: INFO)
- stdout/stderr only

## CI/CD & Deployment

**Hosting:**
- Not deployed (personal CLI environment on Linux VPS)

**CI Pipeline:**
- None configured for this directory

## Environment Configuration

**Development:**
- Required env vars: `MEM0_API_KEY`, `ANTHROPIC_API_KEY`
- Secrets location: `.env` files, environment variables
- MCP config: `opencode.json` (main), `opencode.jsonc` (global), `.vscode/mcp.json` (VS Code)

**Production:**
- N/A (personal dev environment)

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

---

*Integration audit: 2026-07-25*
*Update when adding/removing external services*
