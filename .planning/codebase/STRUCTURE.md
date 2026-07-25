# Codebase Structure

**Analysis Date:** 2026-07-25

## Directory Layout

```
/home/khuchinque/.opencode/          # Workspace root — OpenCode personal config + GSD framework
├── .agents/skills/                  # Agent skills (caveman, caveman-compress, etc.)
├── .claude/                         # Claude config
├── .opencode/                       # LOCAL GSD installation (project-specific)
│   ├── .env                         # Environment config (DO NOT read)
│   ├── agents/                      # 33 GSD agent definitions (gsd-planner.md, gsd-executor.md, etc.)
│   ├── commands/                    # GSD workflow commands
│   │   ├── gsd/                     # 88+ command markdown files (gsd-plan-phase.md, gsd-execute-phase.md, etc.)
│   │   └── echoes-*.md             # Echoes vault commands
│   ├── get-shit-done/               # GSD-OpenCode framework engine
│   │   ├── VERSION                  # Installed version marker
│   │   ├── INSTALLED_FILES.json     # Installation manifest
│   │   ├── bin/                     # CJS tooling
│   │   │   ├── gsd-tools.cjs        # Main CLI utility (~1255 lines)
│   │   │   ├── gsd-oc-tools.cjs     # OpenCode-specific tooling
│   │   │   ├── lib/                 # 33 shared library modules
│   │   │   ├── gsd-oc-lib/          # OpenCode-specific library modules
│   │   │   ├── gsd-oc-commands/     # OpenCode-specific commands
│   │   │   └── test/                # Tests (set-profile, get-profile, etc.)
│   │   ├── workflows/               # 89 orchestration workflow markdown files
│   │   └── references/              # 52 reference documents
│   ├── rules/                       # GSD-specific rules (gsd-oc-work-hard.md)
│   ├── sdk/                         # TypeScript SDK with handover docs
│   │   ├── dist/                    # Compiled output
│   │   ├── docs/                    # SDK documentation
│   │   ├── prompts/                 # SDK prompts
│   │   └── scripts/                 # Build scripts
│   ├── skills/                      # 15 GSD skill SKILL.md files
│   ├── node_modules/                # Dependencies
│   ├── package.json                 # Deps: ponytail, opencode plugin
│   └── opencode.json                # Local opencode config (MCP, skills paths)
│
├── .planning/                       # Project planning (GSD phases, state)
│   ├── codebase/                    # Codebase mapping docs (produced by gsd-map-codebase)
│   ├── config.json                  # Planning config (sub_repos, workspace info)
│   ├── phases/                      # Phase directories (N-slug-name/)
│   ├── PROJECT.md                   # Project overview
│   ├── ROADMAP.md                   # All phases with status
│   └── STATE.md                     # Current state (phase, milestone, progress)
│
├── EchoesVault/                     # Session memory/knowledge base
│   ├── daily/                       # Daily session logs (YYYY-MM-DD.md)
│   ├── pages/                       # Knowledge base pages
│   ├── index.md                     # Vault index
│   ├── assets/                      # Media assets
│   └── raw/                         # Raw data
│
├── skills/                          # User-installed skills
│   ├── echoes-append-to-daily-log/
│   ├── echoes-create-or-update-page/
│   ├── echoes-load-session-context/
│   ├── echoes-search-vault-pages/
│   ├── graphify/
│   └── memory-info/
│
├── commands/                        # User command definitions
│   ├── echoes-end.md
│   ├── echoes-init.md
│   ├── echoes-start.md
│   └── echoes-status.md
│
├── agents/                          # User agent definitions (echoes)
├── node_modules/                    # Dependencies (ponytail)
├── opencode.json                    # ROOT opencode config
├── opencode.config.json             # Additional config
├── package.json                     # Root deps
└── skills-lock.json                 # Installed skills manifest

/home/khuchinque/.config/opencode/   # GLOBAL GSD installation (system-wide)
├── .backups/                        # Pre-repair backup files
├── agents/                          # GSD agents (global copy)
├── commands/                        # GSD commands (global copy)
├── get-shit-done/                   # GSD framework (global copy)
│   └── bin/lib/                     # Same lib modules as local
├── lib/
│   └── constants.js                 # Central constants (DEFAULT_CONFIG_DIR, PATH_PATTERNS, etc.)
├── rules/                           # GSD rules
├── sdk/                             # GSD SDK
├── skills/                          # GSD skills
├── src/                             # GSD CLI Manager source (ESM)
│   ├── commands/                    # 7 CLI commands
│   ├── services/                    # 11 service modules
│   └── utils/                       # 5 utility modules
├── opencode.jsonc                   # Global opencode config (MCP: mem0-mcp)
└── package.json                     # Deps: opencode plugin
```

## Directory Purposes

**`.opencode/get-shit-done/`:**
- Purpose: GSD-OpenCode lifecycle framework engine
- Contains: CJS tools, workflows, references, SDK
- Key files: `bin/gsd-tools.cjs` (main CLI dispatcher), `bin/lib/core.cjs` (1733-line shared utilities)

**`.opencode/agents/`:**
- Purpose: Agent definitions for GSD workflow roles
- Contains: 33 markdown agent files
- Pattern: Each file has objective, process, context sections

**`.opencode/commands/gsd/`:**
- Purpose: GSD workflow command definitions consumed by OpenCode AI
- Contains: 88+ markdown files, each defining one command
- Pattern: Each file has process, validation, and references sections

**`.opencode/get-shit-done/workflows/`:**
- Purpose: Detailed orchestration workflows for each GSD command
- Contains: 89 `.md` files with executable process steps
- Pattern: Referenced by SKILL.md files, call `gsd-tools.cjs` for state/phase operations

**`.opencode/get-shit-done/references/`:**
- Purpose: Reference documents for workflow/agent context
- Contains: 52 files covering anti-patterns, verification, model profiles, git integration, etc.

**`.config/opencode/src/services/`:**
- Purpose: GSD CLI Manager business logic
- Contains: 11 service classes (BackupManager, ScopeManager, ConfigManager, HealthChecker, FileOperations, MigrationService, RepairService, UpdateService, ManifestManager, SettingsManager, StructureDetector)

**`.config/opencode/src/utils/`:**
- Purpose: Shared utilities for CLI manager
- Contains: 5 modules (logger, hash, interactive, npm-registry, path-resolver)

**`.config/opencode/lib/`:**
- Purpose: Shared constants for CLI manager
- Contains: `constants.js` — all configuration values, path patterns, structure types, error codes

**`EchoesVault/`:**
- Purpose: Persistent memory and knowledge base
- Contains: Daily log files, knowledge pages, index

## Key File Locations

**Entry Points:**
- `opencode.json`: Root OpenCode configuration (plugin registration, MCP servers, skill paths)
- `.config/opencode/opencode.jsonc`: Global OpenCode config (mem0 MCP integration)
- `.config/opencode/src/commands/install.js`: GSD CLI Manager entry — framework installation logic
- `.opencode/.opencode/get-shit-done/bin/gsd-tools.cjs`: GSD Tools CLI dispatcher
- `.opencode/.opencode/get-shit-done/bin/gsd-oc-tools.cjs`: OpenCode-specific tools dispatcher

**Configuration:**
- `/home/khuchinque/.opencode/opencode.json`: Plugins, MCP servers, skills paths, compaction, tool output limits
- `.config/opencode/opencode.jsonc`: Global MCP (mem0-mcp remote)
- `.config/opencode/lib/constants.js`: All GSD CLI constants (paths, patterns, error codes, structure types)
- `.opencode/.opencode/get-shit-done/bin/lib/config-schema.cjs`: Config schema validation

**Core Logic:**
- `.opencode/.opencode/get-shit-done/bin/lib/core.cjs`: Shared utilities (1733 lines — path helpers, project root detection, config loading, git operations, planning directory resolution, model resolution, milestone functions)
- `.opencode/.opencode/get-shit-done/bin/lib/commands.cjs`: Standalone utility commands (1023 lines — slug generation, todo management, phase operations)
- `.opencode/.opencode/get-shit-done/bin/lib/phase.cjs`: Phase CRUD operations (planning, summarizing, verification)
- `.config/opencode/src/services/file-ops.js`: Atomic file installation with path replacement (884 lines)
- `.config/opencode/src/services/repair-service.js`: Issue detection + repair with backups (848 lines)
- `.config/opencode/src/services/update-service.js`: Version check + update orchestration (863 lines)

**Planning:**
- `.planning/PROJECT.md`: Project overview
- `.planning/ROADMAP.md`: Phase roadmap with status
- `.planning/STATE.md`: Current state tracking

**Testing:**
- `.opencode/.opencode/get-shit-done/bin/gsd-tools.test.cjs`: Main test file
- `.opencode/.opencode/get-shit-done/bin/test/`: 5 test files (get-profile, pivot-profile, allow-read-config, oc-profile-config, set-profile)
- `.opencode/.opencode/sdk/vitest.config.ts`: SDK test config

## Naming Conventions

**Files:**
- ESM JS: kebab-case (`.config/opencode/src/services/backup-manager.js`, `scope-manager.js`, `path-resolver.js`)
- CJS: kebab-case `.cjs` extension (`.opencode/.opencode/get-shit-done/bin/lib/config-schema.cjs`, `gsd-tools.cjs`)
- Markdown agents: kebab-case `gsd-role.md` (`.opencode/.opencode/agents/gsd-planner.md`)
- Markdown commands: kebab-case `gsd-command.md` (`.opencode/.opencode/commands/gsd/gsd-plan-phase.md`)
- Markdown skills: SKILL.md (always)
- GSD workflows: kebab-case `verb-noun.md` (`.opencode/.opencode/get-shit-done/workflows/execute-phase.md`)
- GSD references: kebab-case with hyphens (`.opencode/.opencode/get-shit-done/references/planner-antipatterns.md`)
- Phase directories: `N-slug-name/` (`.planning/phases/1-setup-foundation/`)

**Directories:**
- Services: lowercase with hyphens (`.config/opencode/src/services/`)
- Commands: lowercase (`.config/opencode/src/commands/`)
- Utils: lowercase (`.config/opencode/src/utils/`)
- GSD commands: `gsd/` under commands
- Phase dirs: `N-{slug}/` with numeric prefix

**Classes:**
- PascalCase with 'Manager' or 'Service' or 'Checker' suffix (`ScopeManager`, `BackupManager`, `HealthChecker`, `RepairService`, `ConfigManager`, `MigrationService`, `StructureDetector`, `ManifestManager`, `SettingsManager`)

**Functions:**
- Exported commands: camelCase with 'Command' suffix (`configGetCommand`, `configSetCommand`, `configResetCommand`, `configListCommand`)
- Internal helpers: camelCase (`flattenObject`, `formatValue`, `parseValue`, `detectStructure`)

**ESM Exports:**
- Named exports for classes/functions (`export class BackupManager`, `export async function detectStructure`)
- Default export object aggregating all named exports at end of file

## Where to Add New Code

**New GSD Command:**
- Primary code: `.opencode/.opencode/commands/gsd/gsd-command-name.md`
- Workflow: `.opencode/.opencode/get-shit-done/workflows/command-name.md`
- Skill (if needed): `.opencode/.opencode/skills/gsd-command-name/SKILL.md`
- Agent (if needed): `.opencode/.opencode/agents/gsd-role-name.md`

**New GSD CLI Manager Feature:**
- Command handler: `.config/opencode/src/commands/feature.js`
- Business logic: `.config/opencode/src/services/feature-service.js`
- Constants: Update `.config/opencode/lib/constants.js`
- Utils (if needed): `.config/opencode/src/utils/feature-util.js`

**New GSD Tools Feature:**
- CJS module: `.opencode/.opencode/get-shit-done/bin/lib/module-name.cjs`
- Wire into dispatcher: Update `gsd-tools.cjs` with new command handler

**New Reference Document:**
- File: `.opencode/.opencode/get-shit-done/references/doc-name.md`

**New Skill:**
- Directory: `skills/skill-name/`
- Entry point: `skills/skill-name/SKILL.md`

**New Agent:**
- File: `.opencode/.opencode/agents/gsd-role-name.md`

## Special Directories

**`.planning/`:**
- Purpose: Project planning state — phases, roadmap, state, codebase maps
- Generated: No (hand-authored + partially auto-generated)
- Committed: Yes

**`.opencode/get-shit-done/bin/lib/`:**
- Purpose: Shared CJS library modules for GSD tools
- Generated: No (installed by GSD CLI Manager during install/update)
- Committed: Yes

**`EchoesVault/daily/`:**
- Purpose: Daily session log files
- Generated: Yes (auto-created on session end via `echoes-end`)
- Committed: Yes

**`EchoesVault/pages/`:**
- Purpose: Persistent knowledge base pages
- Generated: Author-created + auto-generated
- Committed: Yes

**`node_modules/` and `.opencode/node_modules/`:**
- Purpose: Package dependencies
- Generated: Yes (npm install)
- Committed: No (gitignored)

**`.config/opencode/.backups/`:**
- Purpose: Pre-repair backup files with date stamps
- Generated: Yes (auto-created by RepairService/BackupManager)
- Committed: No

---

*Structure analysis: 2026-07-25*