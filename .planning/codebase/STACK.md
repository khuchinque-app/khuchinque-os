# Technology Stack

**Analysis Date:** 2026-07-25

## Languages

**Primary:**
- TypeScript 5.7+ — GSD SDK (`sdk/src/`) and installer CLI (`bin/`), all application-level code
- JavaScript — Build scripts, config files, CJS bridge (`bin/gsd-sdk.cjs`)
- Markdown — 89 GSD commands (`commands/`), 40+ references, 30+ templates, all workflow definitions

**Secondary:**
- Python 3.x — `khuchinque-os/` project (`.venv/`), `.hound-venv/` environment
- Shell (bash) — GSD SDK queries via shell, git hooks, install scripts

## Runtime

**Environment:**
- Node.js >=22.0.0 (GSD SDK), >=18.0.0 (GSD-OpenCode distribution)
- Runtime detected: Node.js v24.18.0 (via nvm)
- No browser runtime (CLI/agent tooling only)

**Package Manager:**
- npm 10.x (or current with Node 24)
- Lockfiles: `package-lock.json` present at root and `.opencode/` and `.opencode/sdk/`
- No monorepo manager (pnpm workspaces, nx, turborepo)

## Frameworks

**Core:**
- Commander.js v12.x — CLI argument parsing in GSD distribution
- OpenCode Plugin SDK `@opencode-ai/plugin` v1.18.4 — Plugin system at root and `.opencode/`

**Testing:**
- Vitest v3.x — GSD SDK and distribution test runner
- tsx — TypeScript execution without build step

**Build/Dev:**
- TypeScript compiler (tsc) — Compilation for SDK
- `tsconfig.json` with ES2022 target, NodeNext module resolution, strict mode

## Key Dependencies

**Critical:**
- `@anthropic-ai/claude-agent-sdk` ^0.2.84 — Agent SDK integration (used in both GSD SDK and distribution)
- `commander` ^12.1.0 — CLI framework for GSD distribution commands
- `ws` ^8.20.0 — WebSocket transport for agent communication
- `@inquirer/prompts` ^8.2.0 — Interactive prompts in GSD distribution
- `@iarna/toml` ^2.2.5 — TOML parsing for config files
- `chalk` ^5.6.2 — Terminal output styling

**Infrastructure:**
- Node.js built-ins — fs, path, child_process for file operations
- `@opencode-ai/plugin` v1.18.4 — Core OpenCode plugin SDK

## Configuration

**Environment:**
- `.env` at `.opencode/.env` — GSD agent directory override
- Environment variables: `MEM0_API_KEY`, `ANTHROPIC_API_KEY`, `CODEX_HOME`, `OPENCODE_CONFIG_DIR`
- MCP configurations in `opencode.json`, `opencode.jsonc`, and `.vscode/mcp.json`

**Build:**
- `tsconfig.json` — TypeScript compiler options
- `vitest.config.ts` — Test runner configuration

## Platform Requirements

**Development:**
- Linux (VPS — host "deneuve")
- Node.js >= 18.x
- No Docker or container runtime required
- nvm for Node version management

**Production:**
- Not a deployed application (personal AI assistant development environment)
- Runs in OpenCode/Claude Code CLI runtime
- MCP servers: ruflo (local), mem0-mcp (remote), membase (remote)

---

*Stack analysis: 2026-07-25*
*Update after major dependency changes*
