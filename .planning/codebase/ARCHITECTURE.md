<!-- refreshed: 2026-07-25 -->
# Architecture

**Analysis Date:** 2026-07-25

**System:** OpenCode personal configuration + GSD-OpenCode project lifecycle framework
**Root:** `/home/khuchinque/.opencode/`

## System Overview

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                        OpenCode Configuration Layer                        │
│  `opencode.json`  `opencode.config.json`  `skills-lock.json`               │
├──────────────────────┬──────────────────────┬────────────────────────────┤
│   GSD CLI Manager    │   GSD Workflow Cmds  │   Echoes Vault (Memory)    │
│  `.config/opencode/` │  `.opencode/commands/`│  `EchoesVault/`            │
│  (ESM + Node.js)     │  (Markdown agent      │  (Markdown daily logs +   │
│   install/repair/    │   instructions)       │   persistent pages)        │
│   update tooling)    │                       │                            │
├──────────────────────┼──────────────────────┼────────────────────────────┤
│       GSD SDK        │    Agents (33)        │    Skills (15)             │
│  `.opencode/sdk/`    │  `.opencode/agents/`  │  `.opencode/skills/`       │
│  (TypeScript lib)    │  (Markdown agent      │  (SKILL.md workflows)      │
│                       │   definitions)        │                            │
└──────────┬───────────┴──────────┬────────────┴─────────────┬──────────────┘
           │                      │                          │
           ▼                      ▼                          ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                      GSD Tools Execution Layer                             │
│  `.opencode/get-shit-done/bin/gsd-tools.cjs` (CJS CLI utility)            │
│  `.opencode/get-shit-done/bin/gsd-oc-tools.cjs` (OpenCode-specific tools) │
│  `get-shit-done/bin/lib/*.cjs` (shared libraries, 33 modules)             │
│  `get-shit-done/workflows/*.md` (89 orchestration workflows)              │
│  `get-shit-done/references/*.md` (52 reference documents)                 │
└──────────────────────────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  Project Planning / Phase Storage                                         │
│  `.planning/`  —  PROJECT.md  ROADMAP.md  STATE.md  phases/  codebase/   │
└──────────────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| GSD CLI Manager | Install, repair, update GSD framework. ESM Node.js | `.config/opencode/src/` |
| GSD Workflow Commands | 88+ GSD commands as markdown agent instructions | `.opencode/.opencode/commands/gsd/` |
| GSD Agents | 33 agent definitions (planner, executor, verifier, etc.) | `.opencode/.opencode/agents/` |
| GSD Skills | 15 SKILL.md workflow definitions | `.opencode/.opencode/skills/` |
| GSD Tools | CJS CLI utility (~1255 lines) for state, phases, milestones | `.opencode/.opencode/get-shit-done/bin/gsd-tools.cjs` |
| GSD Workflows | 89 orchestration markdown files | `.opencode/.opencode/get-shit-done/workflows/` |
| GSD References | 52 reference documents (anti-patterns, verification, etc.) | `.opencode/.opencode/get-shit-done/references/` |
| Echoes Vault | Session memory, daily logs, knowledge pages | `EchoesVault/` |
| GSD SDK | TypeScript SDK with handover docs | `.opencode/.opencode/sdk/` |
| User Skills | Local skills (echoes, graphify, memory-info) | `skills/` |

## Pattern Overview

**Overall:** Meta-configuration + lifecycle management system. Two parallel frameworks:

1. **GSD-OpenCode Framework** (in `.opencode/.opencode/get-shit-done/`) — The project lifecycle management engine. CJS-based tools called by markdown workflow files. Provides phase planning, execution, verification, milestones, and state management.

2. **GSD CLI Manager** (in `.config/opencode/src/`) — ESM-based Node.js CLI for installing, repairing, updating, and checking the GSD framework itself. Separate toolchain from the GSD framework it manages.

**Key Characteristics:**
- Markdown-as-configuration: agents, commands, skills, and workflows are markdown files consumed by OpenCode's AI
- CJS tooling backend (`gsd-tools.cjs`) for filesystem/state operations called by markdown workflows
- Dual-scope installation (global `~/.config/opencode/` / local `./.opencode/`)
- Structure migration support from legacy `command/` (singular) to `commands/` (plural)
- Security-first path validation to prevent traversal attacks

## Layers

**OpenCode Configuration Layer:**
- Purpose: Top-level OpenCode plugin/skill/config registration
- Location: `/home/khuchinque/.opencode/opencode.json`
- Contains: Plugin references (`echoes-vault-opencode`, `ponytail`), MCP server config, skill paths, snapshot/compaction settings

**GSD CLI Manager Layer (`.config/opencode/src/`):**
- Purpose: ESM-based CLI for installing/repairing/updating the GSD framework
- Location: `.config/opencode/src/`
- Contains: 7 commands (check, config, install, list, repair, uninstall, update), 11 services, 5 utils
- Depends on: `@opencode-ai/plugin` v1.18.4, chalk, ora, inquirer
- Used by: User directly via `gsd-opencode` CLI or by GSD workflows during install/update

**GSD Tools Layer (`.opencode/.opencode/get-shit-done/bin/`):**
- Purpose: CJS CLI utility and shared libraries for all GSD workflow operations
- Location: `.opencode/.opencode/get-shit-done/bin/`
- Contains: `gsd-tools.cjs` (CLI dispatcher, ~1255 lines), `gsd-oc-tools.cjs`, 33 lib modules, 4 gsd-oc-commands
- Depends on: core.cjs (1733 lines, shared utilities), model-profiles.cjs, frontmatter.cjs, and other lib modules
- Used by: All 89 workflow markdown files via inline bash calls

**GSD Workflow Layer:**
- Purpose: Markdown workflow files that orchestrate the GSD lifecycle
- Location: `.opencode/.opencode/get-shit-done/workflows/`
- Contains: 89 `.md` files covering all lifecycle phases
- Depends on: GSD Tools layer for state/phase/milestone operations
- Pattern: Each workflow.md contains process/validation/references sections consumed by agents

**GSD Agent Layer:**
- Purpose: Agent definitions for each GSD role (planner, executor, verifier, etc.)
- Location: `.opencode/.opencode/agents/`
- Contains: 33 agent `.md` files, each with objective, process, and context sections

**Echoes Vault:**
- Purpose: Persistent session memory — daily logs, knowledge base pages, index
- Location: `EchoesVault/`
- Structure: `daily/` (daily log files), `pages/` (knowledge base), `index.md`, `raw/`

## Data Flow

### Primary Request Path — GSD Command Execution

1. User invokes GSD command (e.g., `/gsd-plan-phase`) → OpenCode loads the corresponding skill SKILL.md (`.opencode/.opencode/skills/gsd-plan-phase/SKILL.md`)
2. Skill file references its workflow (`.opencode/.opencode/get-shit-done/workflows/plan-phase.md`)
3. Workflow file references reference docs (`.opencode/.opencode/get-shit-done/references/`) and GSD agents (`.opencode/.opencode/agents/gsd-planner.md`)
4. Workflow calls `gsd-tools.cjs` via bash for state/phase/commit operations: `node gsd-tools.cjs state load`, `node gsd-tools.cjs find-phase N`, etc.
5. GSD tools read/write `.planning/` directory (PROJECT.md, ROADMAP.md, STATE.md, phases/)

### GSD CLI Manager Flow — Install/Update/Repair

1. User runs `gsd-opencode install` → `.config/opencode/src/commands/install.js`
2. Command creates `ScopeManager` → determines global vs local path
3. `FileOperations` copies `DIRECTORIES_TO_COPY` (agents, commands, get-shit-done, rules, sdk, skills) to target
4. `ManifestManager` tracks all installed files for safe uninstall
5. `ConfigManager` writes VERSION file to track installation
6. Post-install verification via `HealthChecker`

**State Management:**
- Project state: `.planning/STATE.md` (YAML frontmatter with current phase, milestones, progress)
- Roadmap: `.planning/ROADMAP.md` (all phases with status, ordered)
- Phase state: `.planning/phases/N-name/` (PLAN.md, SUMMARY.md, VERIFICATION.md, CONTEXT.md)
- Memory: `EchoesVault/daily/YYYY-MM-DD.md` and `EchoesVault/pages/*.md`

## Key Abstractions

**ScopeManager:**
- Purpose: Centralizes global vs local path resolution for GSD installations
- Location: `.config/opencode/src/services/scope-manager.js`
- Pattern: Service class with dependency validation in constructor, delegates path building

**GSD Tools CJS:**
- Purpose: CLI utility dispatching ~30+ atomic commands for state/phase/milestone operations
- Location: `.opencode/.opencode/get-shit-done/bin/gsd-tools.cjs`
- Pattern: Command dispatch pattern — `node gsd-tools.cjs <command> [args] [--raw] [--pick <field>]`

**StructureDetector:**
- Purpose: Detects old (command/) vs new (commands/) directory structure
- Location: `.config/opencode/src/services/structure-detector.js`
- Pattern: Strategy with `detect()`, `getDetails()`, and convenience `detectStructure()` function

**BackupManager:**
- Purpose: Date-stamped backups with retention policy for safe repair operations
- Location: `.config/opencode/src/services/backup-manager.js`
- Pattern: Backup with cleanup — `backupFile()` then `cleanupOldBackups()`

**GSD Phase Directory:**
- Purpose: Each roadmap phase gets a directory with standardized documents
- Location: `.planning/phases/N-slug-name/`
- Contains: PLAN.md, SUMMARY.md (one per plan), VERIFICATION.md, CONTEXT.md, UAT.md

## Entry Points

**GSD CLI Manager:**
- Location: `.config/opencode/src/commands/install.js`
- Triggers: User runs `gsd-opencode install`
- Responsibilities: Framework installation, path replacement, VERSION tracking

**GSD Tools:**
- Location: `.opencode/.opencode/get-shit-done/bin/gsd-tools.cjs`
- Triggers: Called by workflow markdown files via `node gsd-tools.cjs <command>`
- Responsibilities: State management, phase CRUD, milestone operations, commit, verification

**GSD OC Tools:**
- Location: `.opencode/.opencode/get-shit-done/bin/gsd-oc-tools.cjs`
- Triggers: Called by OpenCode-specific commands
- Responsibilities: Profile management, model resolution, opencode.json validation

**OpenCode Configuration:**
- Location: `/home/khuchinque/.opencode/opencode.json`
- Triggers: OpenCode startup
- Responsibilities: Plugin registration, MCP config, skill paths, snapshot settings

## Architectural Constraints

- **Threading:** Single-threaded Node.js (both ESM and CJS). No worker threads used.
- **Global state:** Logger uses module-level `verboseMode` flag (`.config/opencode/src/utils/logger.js:17`). GSD tools use `cachedControllingTtyToken` and `didProbeControllingTtyToken` (`.opencode/.opencode/get-shit-done/bin/lib/core.cjs:27-28`). `_heldPlanningLocks` Set for lock cleanup on exit (core.cjs:33-38).
- **Circular imports:** Not detected between the two frameworks (CJS GSD tools vs ESM CLI manager are separate).
- **Dual runtime:** ESM (`import/export`) for CLI manager under `.config/opencode/`. CJS (`require/module.exports`) for GSD tools under `.opencode/.opencode/get-shit-done/bin/`.

## Anti-Patterns

### Class Constructor Dependency Grid

**What happens:** Multiple service classes (BackupManager, RepairService, FileOperations, MigrationService) validate every dependency method in the constructor, e.g. checking `typeof scopeManager.getTargetDir !== 'function'`.
**Why it's wrong:** Duplicates the same duck-type checks across 6+ files. If ScopeManager interface changes, all constructors must update. Adds ~15-30 lines of noise per class.
**Do this instead:** Use a single validation utility or TypeScript interfaces. See `.config/opencode/src/services/backup-manager.js:67-91` for the repeated pattern.

### Mixed CJS/ESM Within Same System

**What happens:** GSD tools use CJS (`require/module.exports` in `.cjs` files) while CLI manager uses ESM (`import/export` in `.js` files). Both in the same repo but different runtimes.
**Why it's wrong:** Cannot cross-import between the two layers without dynamic import() shims. Adds cognitive overhead.
**Do this instead:** Not a practical fix here — CJS is deliberate because workflow files call `node gsd-tools.cjs` directly and CJS avoids top-level-await issues.

## Error Handling

**Strategy:** Guard clauses with early returns. Async functions return error codes (from `ERROR_CODES` constant) or throw descriptive errors.

**Patterns:**
- Error codes as constants: `.config/opencode/lib/constants.js:176-191` (SUCCESS=0, GENERAL_ERROR=1, PERMISSION_ERROR=2, PATH_TRAVERSAL=3, INTERRUPTED=130)
- Async error returns with result objects: BackupManager returns `{ success, backupPath, error }` objects instead of throwing (`.config/opencode/src/services/backup-manager.js:133-141`)
- Worker-service error wrapping: Command functions catch errors, log via logger, return ERROR_CODES (`.config/opencode/src/commands/config.js:142-155`)
- Ctrl+C/SIGINT handled via `AbortPromptError` check in all commands

## Cross-Cutting Concerns

**Logging:** Custom logger utility using chalk — all output to stderr, levels: info/success/warning/error/debug/heading/dim/code. `.config/opencode/src/utils/logger.js`
**Validation:** Service classes validate constructor dependencies eagerly (duck-type checks). Path validation via `path-resolver.js` with traversal protection. No centralized schema validation.
**Authentication:** Not applicable (local CLI tool, no auth).
**Security:** Path traversal prevention in `validatePath()` and `validatePathSafe()`. Null byte injection check. `ALLOWED_NAMESPACES` regex patterns for safe uninstall scope.

---

*Architecture analysis: 2026-07-25*