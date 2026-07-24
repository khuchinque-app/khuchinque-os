# Codebase Structure

**Analysis Date:** 2026-07-25

## Directory Layout

```
.opencode/
├── .agents/             # Agent definitions (caveman suite)
│   └── skills/          # 7 caveman sub-skills
├── .claude/             # Claude Code config
│   └── settings.local.json  # Permission allowlist
├── .config/opencode/    # Global OpenCode config
│   └── opencode.jsonc   # mem0-mcp MCP server
├── .letta/              # Local agent memory (Letta)
├── .opencode/           # OpenCode internal files (gitignored)
│   ├── .env            # GSD agent dir override
│   ├── agents/         # 33 GSD agent definitions
│   ├── commands/       # 89 GSD slash commands
│   ├── get-shit-done/  # GSD-OpenCode framework (v1.38.5)
│   │   ├── references/ # 40+ principle documents
│   │   ├── templates/  # 30+ file templates
│   │   └── workflows/  # 89 multi-step procedures
│   ├── rules/          # Enforcement rules
│   ├── sdk/            # TypeScript SDK (gsd-sdk)
│   ├── skills/         # GSD skills (12)
│   └── node_modules/   # SDK dependencies
├── .planning/          # Project planning artifacts
├── .vscode/            # VS Code config
│   └── mcp.json        # Membase MCP server
├── EchoesVault/        # Markdown knowledge base
│   ├── pages/          # Encyclopedia pages
│   ├── daily/          # Work logs
│   ├── index.md        # Master registry
│   └── raw/            # Source materials
├── bin/                # Executable scripts
│   └── opencode        # OpenCode binary
├── commands/           # User-defined command definitions
│   └── echoes-end.md, echoes-init.md, etc.
├── graphify-out/        # Knowledge graph output
├── khuchinque-os/      # Personal project (concept/design)
├── skills/             # User-defined skills
│   ├── echoes-append-to-daily-log/
│   ├── echoes-create-or-update-page/
│   ├── echoes-search-vault-pages/
│   ├── graphify/
│   └── memory-info/
├── opencode.json       # Main project config
├── opencode.config.json # Schema (29092 bytes)
├── opencode-schema.json # Empty schema placeholder
├── skills-lock.json    # Skill hash manifest
├── memory-list.md      # Memory tools reference
├── memory-protocol.md  # 4-layer cognitive protocol
├── so-far.md           # Full installation inventory
├── 4-layer-cognitive.md # Architecture description
├── echoes-state.json   # Echoes vault state
└── package.json        # Root npm manifest
```

## Directory Purposes

**.opencode/:**
- Purpose: OpenCode's own internal configuration, framework, and tools
- Contains: GSD framework, agents, commands, skills, SDK, rules
- Key files: `.env`, `package.json`, `.gitignore`

**.opencode/get-shit-done/:**
- Purpose: GSD-OpenCode framework — project lifecycle management
- Contains: workflows/, references/, templates/, VERSION
- Workflows: 89 multi-step procedures for project lifecycle

**.opencode/sdk/:**
- Purpose: TypeScript SDK for GSD operations
- Contains: `src/` (source), `dist/` (compiled), `scripts/`, `prompts/`
- Build: tsc → dist/cli.js (called as `gsd-sdk`)
- Tests: Vitest with unit and integration projects

**.opencode/agents/:**
- Purpose: Specialized subagent definitions
- Contains: 33 `gsd-*.md` agent definition files
- Sizes: 4.5KB to 47KB per agent, ~614KB total

**.opencode/commands/gsd/:**
- Purpose: Project lifecycle slash commands
- Contains: 89 `gsd-*.md` command files
- Examples: new-project, plan-phase, execute-phase, code-review

**EchoesVault/:**
- Purpose: Persistent markdown knowledge base
- Contains: pages/ (encyclopedia), daily/ (work logs), index.md, raw/

**khuchinque-os/:**
- Purpose: Personal "Agent Mission Control" project (planning phase)
- Contains: README.md, components.md, plan-secondbrain.md, AGENTS.md, CONTRIBUTING.md, LICENSE
- Has its own `.git` repo and `.venv`

## Key File Locations

**Entry Points:**
- `opencode.json` — Main OpenCode configuration
- `.opencode/sdk/dist/cli.js` — GSD SDK CLI entry
- `bin/opencode` — OpenCode runtime binary

**Configuration:**
- `opencode.json` — Project-level config (plugins, MCP, skills, references)
- `.config/opencode/opencode.jsonc` — Global config (mem0-mcp)
- `.claude/settings.local.json` — Permission allowlist
- `.vscode/mcp.json` — VS Code MCP servers
- `.opencode/.env` — GSD agent dir override

**Core Logic:**
- `.opencode/get-shit-done/workflows/*.md` — All workflow procedures
- `.opencode/get-shit-done/templates/*.md` — All document templates
- `.opencode/sdk/src/` — SDK source code

**Skills:**
- `.agents/skills/` — Caveman compressed output suite (7 skills)
- `skills/` — Echoes vault + graphify skills (5 skills)
- `.opencode/skills/` — GSD workflow skills (12 skills)
- npm plugins: ponytail skills (6) from `@dietrichgebert/ponytail`

**Memory:**
- `memory-list.md` — All memory tools reference
- `memory-protocol.md` — 4-layer cognitive protocol
- `EchoesVault/` — Markdown knowledge base
- `graphify-out/` — Knowledge graph output

## Naming Conventions

**Files:**
- `kebab-case.md` — All markdown files (commands, workflows, templates)
- `kebab-case.ts` — TypeScript source files (SDK)
- `kebab-case.cjs` — CommonJS bridge files
- PascalCase for config file names: `opencode.json`
- `DOT-prefix` — Hidden/config directories (.opencode, .claude, .letta)

**Directories:**
- kebab-case for all directories
- `commands/`, `skills/`, `reports/` — plural for collections

**Special Patterns:**
- `gsd-*.md` — All GSD agent definitions and command definitions
- `echoes-*.md` — Echoes vault commands
- `*.json` and `*.jsonc` — Configuration files
- `SKILL.md` — Skill definition files

## Where to Add New Code

**New GSD Command:**
- Definition: `.opencode/commands/gsd/<name>.md`
- Workflow: `.opencode/get-shit-done/workflows/<name>.md`
- Template (if needed): `.opencode/get-shit-done/templates/<name>.md`

**New Skill:**
- SKILL.md in `skills/` (user) or `.opencode/skills/` (GSD) or `.agents/skills/` (caveman)

**New Template:**
- Implementation: `.opencode/get-shit-done/templates/<name>.md`

**New Reference Document:**
- Implementation: `.opencode/get-shit-done/references/<name>.md`

## Special Directories

**node_modules/:**
- Purpose: npm dependencies
- Source: npm install
- Committed: No (in .gitignore)

**.planning/:**
- Purpose: Project planning artifacts (PROJECT.md, config.json, research/, codebase/, etc.)
- Created by: GSD workflows during project initialization
- Committed: Configurable (commit_docs in config.json)

**.opencode/:**
- Purpose: GSD framework and OpenCode internal files
- Source: Installed by `npx gsd-opencode` and OpenCode
- Committed: Yes (core framework)

**graphify-out/:**
- Purpose: Knowledge graph output files
- Source: Generated by `/graphify` command
- Committed: TBD (may be gitignored)

---

*Structure analysis: 2026-07-25*
*Update when directory structure changes*
