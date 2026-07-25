# External Integrations

**Analysis Date:** 2026-07-25

## Actively Wired Integrations

### EchoesVault (Persistent Memory Plugin)
- **Plugin:** `psinetron/echoes-vault-opencode` v1.2.2
- **Type:** OpenCode plugin — Obsidian-style flat-file knowledge base
- **Configured via 4 commands** in `.opencode/commands/`:
  - `echoes-init.md` — Create directory structure (`pages/`, `daily/`, `raw/`, `assets/`) and `index.md`
  - `echoes-start.md` — Restore session context from last 3 daily logs and index
  - `echoes-end.md` — Save session memory via `commit_memory_to_echoes_vault` tool
  - `echoes-status.md` — Report vault health dashboard (topic count, index health, scale alerts >200 pages)
- **Configured via 3 skills** in `.opencode/skills/`:
  - `echoes-append-to-daily-log` — Append dry technical notes mid-session
  - `echoes-create-or-update-page` — Create/update encyclopedia pages with YAML frontmatter
  - `echoes-search-vault-pages` — Targeted keyword search across `pages/`
- **State:** `.opencode/echoes-state.json` — tracks version, initialization, session start/save, page/log counts
- **Status:** Wired but inactive — `initialized: false`, `totalPages: 0`, `totalDailyLogs: 0`

## Planned Target Integrations (Per `components.md`)

**None are implemented or configured.** Listed here as the design targets for future implementation:

### APIs & External Services

| Category | Candidate Services | Config Status |
|----------|-------------------|---------------|
| Web Search | Brave Search (MCP) | Not configured |
| Web Fetch | master-fetch (self-hosted MCP) | Not configured |
| Browser Automation | browser-use, Stagehand | Not configured |
| Source Control | GitHub MCP Server | Not configured |
| Containers | Docker MCP Gateway | Not configured |
| Notion | Notion MCP Server | Not configured |
| Slack | Slack MCP Server | Not configured |
| Telegram | Telegram MCP Server (MTProto) | Not configured |
| Google Drive | Google Drive MCP Server | Not configured |
| Gmail | Gmail MCP Server | Not configured |
| Calendar | Google Calendar MCP Server | Not configured |
| MCP Standard | Official MCP servers (filesystem, fetch, git, memory, sequential-thinking, time) | Not configured |

### Data Storage

**Databases (Planned — per Pillar 1 in `components.md`):**
- Knowledge graph: Neo4j / KuzuDB (embeddable alternative)
- Vector DB: Qdrant / Chroma / Weaviate / pgvector (multiple options listed, none selected)
- Relational: PostgreSQL
- None are configured, deployed, or selected

**File Storage:**
- **EchoesVault** — local filesystem at `EchoesVault/`. Current state:
  - `EchoesVault/index.md`: 5 lines, empty vault registration page
  - Subdirectories `pages/`, `daily/`, `raw/`, `assets/`: **do not exist yet** (created by `echoes-init`)
  - Zero pages, zero daily logs, zero assets

**Caching:**
- None — not addressed in design phase

### Authentication & Identity

- **Auth Provider:** Not specified — no auth design exists
- **Credentials:** None present in repo. No `.env` files, certificate files, or key material

### Monitoring & Observability

- **Error Tracking:** Not configured. Langfuse listed as a candidate in Pillar 5 for LLM observability, token usage, cost tracking, and evals
- **Logs:** Session logs target `EchoesVault/daily/YYYY-MM-DD.md` via EchoesVault plugin. No structured logging framework designed

### CI/CD & Deployment

- **Hosting:** Not specified — Khucinque OS is an agent OS layer deployed atop the OpenCode runtime
- **CI Pipeline:** None — `AGENTS.md` explicitly states "no build/test/lint pipeline"
- **Deployment Config:** None exists

### Webhooks & Callbacks

- **Incoming:** None designed or implemented
- **Outgoing:** None designed or implemented

## Environment Configuration

**Required env vars:**
- None — no environment variables are defined or documented anywhere in the repo

**Secrets location:**
- Not applicable — no secrets management system is designed

---

*Integration audit: 2026-07-25*
