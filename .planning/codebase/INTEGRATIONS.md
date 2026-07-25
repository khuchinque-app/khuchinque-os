# External Integrations

**Analysis Date:** 2026-07-25

## APIs & External Services

**AI Agent SDK:**
- `@anthropic-ai/claude-agent-sdk` ^0.2.84 — Core agent runtime for executing GSD plan sessions (`/home/khuchinque/.opencode/.opencode/sdk/dist/session-runner.js`)
  - SDK/Client: `@anthropic-ai/claude-agent-sdk` npm package
  - Usage: `query()` function invoked in `runPlanSession()` and `runPhaseStepSession()`
  - Model resolution via config `model_profile`: balanced→`claude-sonnet-4-6`, quality→`claude-opus-4-6`, speed→`claude-haiku-4-5` (`/home/khuchinque/.opencode/.opencode/sdk/dist/session-runner.js:22-29`)

**Skill Registry (External Sources):**
- GitHub (`JuliusBrussee/caveman`) — Caveman family skills loaded via `skills-lock.json` (`/home/khuchinque/.opencode/skills-lock.json`)
  - Skills cached locally at `/home/khuchinque/.cache/opencode/packages/@dietrichgebert/ponytail/`
  - Loading mechanism: opencode skill scanner fetches from GitHub source

## MCP Servers

**Local MCP:**
- **ruflo** — Helper-agent MCP server
  - Type: local subprocess
  - Command: `npx -y ruflo@latest mcp start`
  - Enabled: yes
  - Config: `/home/khuchinque/.opencode/opencode.json:7-18`

**Remote MCP:**
- **mem0-mcp** — Memory persistence layer
  - Type: remote HTTP/SSE
  - URL: `https://mcp.mem0.ai/mcp`
  - Auth: Bearer token via `MEM0_API_KEY` environment variable (`${MEM0_API_KEY}`)
  - Enabled: yes
  - Config: `/home/khuchinque/.opencode/opencode.json:19-26`

**VSCode MCP:**
- **membase** — Long-term memory via Membase
  - Type: streamable-http
  - URL: `https://mcp.membase.so/mcp`
  - Config: `/home/khuchinque/.opencode/.vscode/mcp.json:3-7`

## Data Storage

**File System:**
- **EchoesVault** — Local markdown knowledge base at `/home/khuchinque/.opencode/EchoesVault/`
  - Daily logs stored in `daily/` directory (e.g., `2026-07-25.md`)
  - Structured pages in `pages/` directory (e.g., `caveman-skill.md`, `ponytail-skill.md`)
  - Index maintained at `index.md`

**Memory/State:**
- `echoes-state.json` — Plugin state file (`/home/khuchinque/.opencode/echoes-state.json`)
- `~/.gsd/defaults.json` — User-level GSD config defaults (optional)
- File-system based state management via GSDTools (`/home/khuchinque/.opencode/.opencode/sdk/dist/gsd-tools.js`)

**Caching:**
- `~/.cache/opencode/packages/` — Package/skill cache directory
- No external caching service (Redis, Memcached, etc.)

## Authentication & Identity

**Auth Provider:**
- Custom — No external auth provider integrated
  - Implementation: Bearer token-based for MCP remote servers (mem0-mcp)
  - Token sourced from environment variables (`MEM0_API_KEY`)
  - Used in MCP header interpolation: `{env:MEM0_API_KEY}` pattern

## Monitoring & Observability

**Error Tracking:**
- None — No Sentry, DataDog, or similar integrated

**Logs:**
- opencode internal logging via `logLevel` config (`INFO` level set in `opencode.json`)
- GSD Logger module: `/home/khuchinque/.opencode/.opencode/sdk/dist/logger.js`
- No external log aggregation service

## CI/CD & Deployment

**Hosting:**
- N/A — Local development environment only; no production deployment

**CI Pipeline:**
- None detected — No GitHub Actions, CircleCI, or other CI configs found

**Git Integration:**
- Git version control with optional branching strategies configured in `.planning/config.json`
  - Branching: `none` (default), `phase`, or `milestone` strategy
  - Branch templates: `gsd/phase-{phase}-{slug}`, `gsd/{milestone}-{slug}`
  - Config in `/home/khuchinque/.opencode/.planning/config.json` and documented in `/home/khuchinque/.opencode/.opencode/get-shit-done/references/planning-config.md`

## Environment Configuration

**Required env vars:**
- `MEM0_API_KEY` — Bearer token for mem0-mcp MCP server (memory persistence)

**Optional env vars:**
- `GSD_HOME` — Override home directory for GSD user defaults (`~/.gsd/`)
- `BRAVE_API_KEY` — Brave web search integration (not currently enabled in config)
- `FIRECRAWL_API_KEY` — Firecrawl page scraping (not currently enabled in config)
- `EXA_API_KEY` — Exa semantic search (not currently enabled in config)

**Secrets location:**
- Environment variables (shell session or shell profile)
- `.env` file at `/home/khuchinque/.opencode/.opencode/.env` (GSD-OpenCode env config — contains paths, not actual secrets)
- Bearer token interpolated via `{env:MEM0_API_KEY}` in MCP headers

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected

## Plugins

**OpenCode plugins registered:**
- `echoes-vault-opencode` — Session memory persistence plugin (echoes system)
- `@dietrichgebert/ponytail` — YAGNI/lazy coding mode skill plugin
- Both registered in `/home/khuchinque/.opencode/opencode.json:3-6`

---

*Integration audit: 2026-07-25*
