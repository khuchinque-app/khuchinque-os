# Technology Stack

**Analysis Date:** 2026-07-25

## Languages

**Primary:**
- **Markdown** — 100% of project files. All design documents, plugin commands, skill definitions, and the EchoesVault knowledge base are plain Markdown (`.md`).
  - Files: `README.md`, `AGENTS.md`, `components.md`, `plan-secondbrain.md`, `CONTRIBUTING.md`, `LICENSE`, all `.opencode/commands/*.md`, all `.opencode/skills/*/SKILL.md`
- **JSON** — One file: `.opencode/echoes-state.json` (15 lines, EchoesVault plugin state tracker)

**Secondary:**
- Not detected — **no source code** (`.py`, `.ts`, `.js`, `.rs`, `.go`) exists in this repository. It is a design/blueprint repo only.

## Runtime

**Environment:**
- No project-level runtime configured. No `requirements.txt`, `pyproject.toml`, `Pipfile`, `package.json`, or equivalent.
- A Python 3.12 virtualenv exists at `.venv/` but is not project-specific — it contains system-installed packages (numpy, greenlet, httpx, uvicorn, websockets, tqdm).

**Package Manager:**
- None configured at project level.

## Frameworks

**Core:**
- **OpenCode** (external, target runtime) — Khucinque OS is designed as an Intelligence Layer on top of the OpenCode agent runtime. Referenced throughout `README.md`, `AGENTS.md`, `plan-secondbrain.md` as the "execution layer" / "kernel."

**Plugin System:**
- **EchoesVault v1.2.2** (`psinetron/echoes-vault-opencode`) — Active persistent memory plugin for OpenCode. Wired via `.opencode/commands/` (4 commands) and `.opencode/skills/` (3 skills). State tracked in `.opencode/echoes-state.json`.

**Testing:**
- None — no test framework configured or used.

**Build/Dev:**
- None — no build, lint, format, or CI pipeline. `CONTRIBUTING.md` states: "Edit docs directly — no build/test/lint pipeline."

## Key Dependencies

**Target Dependencies (Planned — per `components.md`):**

| Pillar | Candidate Dependencies | Category |
|--------|----------------------|----------|
| 1. Memory | Mem0, Letta, Graphiti, Neo4j, KuzuDB, Qdrant, Chroma, Weaviate, pgvector, LlamaIndex, Graphify, EchoesVault, PostgreSQL | Vector DB, Graph DB, Knowledge Graph |
| 2. Execution | Anthropic Claude Agent SDK (Python & TypeScript), Caveman, Ponytail | Agent SDK, Skills |
| 3. MCP/Tools | MCP spec, Browser Use, Stagehand, Brave Search, GitHub MCP, Docker MCP, Postgres MCP, Notion MCP, Slack MCP, Telegram MCP, Google Drive MCP, Gmail MCP, Google Calendar MCP | MCP Servers |
| 4. Workflow | Ruflo, GoopSpec, Pocket Universe, Micode, Temporal, Ray, LangGraph, CrewAI, AutoGen, n8n, Prefect | Orchestration |
| 5. GUI | Vibe Kanban, OpenCode Visualiser, Langfuse, Flowise, Grafana, builderz-labs/mission-control | Visualization/Observability |
| 6. Intelligence | DSPy (standalone building block) | LLM Pipeline Programming |

## Configuration

**Environment:**
- `.opencode/echoes-state.json` — Tracks EchoesVault plugin state: version `1.2.2`, `initialized: false`, session start/save timestamps, total page/log counts.
- No `.env` files present.
- No environment variables defined or documented.

**Build:**
- None — no build config files (e.g., `tsconfig.json`, `vite.config.ts`, `webpack.config.js`) exist.

## Platform Requirements

**Development:**
- OpenCode agent runtime (any version supporting custom commands and skills in `.opencode/`)
- Python 3.12+ (if EchoesVault plugin or candidate dependencies require it)
- Network access to MCP servers (planned)

**Production:**
- Target deployment is an OpenCode-based agent runtime with MCP server connectivity and access to vector DB + graph DB + LLM API endpoints
- No deployment configuration exists yet

---

*Stack analysis: 2026-07-25*
