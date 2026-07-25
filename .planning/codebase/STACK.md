# Technology Stack

**Analysis Date:** 2026-07-25

## Languages

**Primary:**
- TypeScript (ES2022) - SDK (`/home/khuchinque/.opencode/.opencode/sdk/`)
- JavaScript (NodeNext ESM) - GSD-OpenCode framework (`/home/khuchinque/.opencode/.opencode/get-shit-done/`)

**Secondary:**
- JavaScript (CommonJS) - Legacy CJS tools (`/home/khuchinque/.opencode/.opencode/get-shit-done/bin/lib/`)

## Runtime

**Environment:**
- Node.js v24.18.0 (engine: >=22.0.0 for SDK, >=18.0.0 for GSD-OpenCode)
- Runtime: v8 JavaScript engine

**Package Manager:**
- npm 11.16.0
- Lockfile: `package-lock.json` present in root, `.opencode/sdk/`, `.opencode/get-shit-done/`, and `.opencode/` dirs

## Frameworks

**Core:**
- opencode v1.18.4 — AI coding assistant platform (`/home/khuchinque/.opencode/opencode.json`)
- GSD-OpenCode v1.38.5 — Project lifecycle framework (`/home/khuchinque/.opencode/.opencode/get-shit-done/`)
- `@gsd-build/sdk` v0.1.0 — Programmatic GSD plan execution API (`/home/khuchinque/.opencode/.opencode/sdk/`)
- `@opencode-ai/plugin` v1.18.4 — Plugin system for opencode (`/home/khuchinque/.opencode/node_modules/@opencode-ai/plugin/`)

**Testing:**
- Vitest v3.1.1 (SDK) / v3.2.4 (GSD-OpenCode) — Test runner with unit/integration project split
- Test config: `/home/khuchinque/.opencode/.opencode/sdk/vitest.config.ts`

**Build/Dev:**
- TypeScript v5.7.x / v5.8.x — Compilation (`tsconfig.json` targets ES2022/NodeNext)
- `tsc` — Build command (`npm run build` maps to `tsc`)

## Key Dependencies

**Critical:**
- `@anthropic-ai/claude-agent-sdk` ^0.2.84 — Agent SDK for Claude-powered AI agent sessions (`/home/khuchinque/.opencode/.opencode/sdk/dist/session-runner.js`)
- `@opencode-ai/sdk` 1.18.4 — Core opencode SDK for tool execution, permissions, MCP (`/home/khuchinque/.opencode/node_modules/@opencode-ai/sdk/`)
- `effect` 4.0.0-beta.83 — TypeScript effect system (used by plugin system)
- `zod` 4.1.8 — Runtime schema validation

**Infrastructure:**
- `commander` ^12.1.0 — CLI argument parsing (`/home/khuchinque/.opencode/.opencode/get-shit-done/package.json`)
- `ws` ^8.20.0 — WebSocket transport for SDK event streaming (`/home/khuchinque/.opencode/.opencode/sdk/dist/ws-transport.js`)
- `chalk` ^5.6.2 — Terminal string coloring
- `ora` ^9.3.0 — Terminal spinner for async operations
- `@inquirer/prompts` ^8.2.0 — Interactive CLI prompts
- `@iarna/toml` ^2.2.5 — TOML parsing (plan frontmatter format)
- `@opencode-ai/plugin` 1.18.4 — Plugin hook system (event bus, tool execute, config mutation)

**Skill Dependencies:**
- `@dietrichgebert/ponytail` ^4.8.4 — Lazy-coding skill (npm package, auto-loaded)

## Configuration

**Environment:**
- `.env` file at `/home/khuchinque/.opencode/.opencode/.env` — GSD-OpenCode environment configuration
- Environment vars: `GSD_HOME` (optional home override for `.gsd/` defaults)
- API keys detection: `BRAVE_API_KEY`, `FIRECRAWL_API_KEY`, `EXA_API_KEY`, `MEM0_API_KEY`

**Build:**
- `/home/khuchinque/.opencode/.opencode/sdk/tsconfig.json` — TypeScript config (ES2022, NodeNext module, strict)
- `/home/khuchinque/.opencode/opencode.json` — opencode platform config (plugins, MCP servers, skills, references)
- `/home/khuchinque/.opencode/opencode.config.json` — Config schema definition (JSON Schema draft 2020-12)
- `/home/khuchinque/.opencode/opencode-schema.json` — OpenCode config validation schema

**Project Planning:**
- `/home/khuchinque/.opencode/.planning/config.json` — GSD workflow configuration (workflow flags, gates, safety settings)
- `/home/khuchinque/.opencode/.planning/STATE.md` — Project state tracking

## Platform Requirements

**Development:**
- Node.js >=18.0.0 (GSD-OpenCode) or >=22.0.0 (SDK)
- npm (any modern version)
- Git (for snapshot/version control features)
- opencode CLI installed

**Production:**
- Not a deployed application — operates as a development-environment AI framework
- Deployment target: N/A (local execution environment)

---

*Stack analysis: 2026-07-25*
