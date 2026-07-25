# Codebase Structure

**Analysis Date:** 2026-07-25

## Directory Layout

```
khuchinque-os/
├── .git/                              # Git metadata (auto-generated)
├── .opencode/                         # OpenCode plugin & skill configurations
│   ├── commands/                      # EchoesVault command definitions (4 files)
│   │   ├── echoes-init.md             # Initialize EchoesVault: create dirs + index
│   │   ├── echoes-start.md            # Start session: restore context from last 3 logs
│   │   ├── echoes-end.md              # End session: save via commit_memory_to_echoes_vault
│   │   └── echoes-status.md           # Health dashboard: topic count, scale alerts
│   ├── skills/                        # EchoesVault skill definitions (3 dirs)
│   │   ├── echoes-append-to-daily-log/SKILL.md   # Append mid-session notes to daily log
│   │   ├── echoes-create-or-update-page/SKILL.md # Create/update encyclopedia pages
│   │   └── echoes-search-vault-pages/SKILL.md    # Search knowledge base by keyword
│   └── echoes-state.json              # Plugin state: version 1.2.2, session timestamps
├── .venv/                             # Python 3.12 virtualenv (system-level, not project-specific)
├── EchoesVault/                       # Persistent memory knowledge base
│   └── index.md                       # Master page registry (0 pages, 5 lines)
├── AGENTS.md                          # Agent entry point: "No code yet," 6-pillar reference (40 lines)
├── CONTRIBUTING.md                    # Contribution guidelines (5 lines)
├── LICENSE                            # CC BY 4.0 (3 lines)
├── README.md                          # Project overview + architecture diagram (46 lines)
├── components.md                      # 30+ candidate tools/libraries per pillar (94 lines)
└── plan-secondbrain.md                # Deepest architecture doc: 6 pillars, priorities (167 lines)

Total: 15 source files, ~560 lines across all project files
```

## Directory Purposes

**Root (`/`):**
- **Purpose:** Design/blueprint repository for Khucinque OS architecture
- **Contains:** 5 Markdown docs (README, AGENTS, components, plan-secondbrain, CONTRIBUTING), LICENSE, EchoesVault directory
- **Contains no:** Implementation code (`.py`, `.ts`, `.js`), build config, dependency manifests
- **Key files:** `README.md` (overview), `plan-secondbrain.md` (detailed architecture), `components.md` (tool evaluations)

**`.opencode/`:**
- **Purpose:** OpenCode-specific plugin and skill configurations — runs inside the OpenCode agent runtime
- **Contains:** 4 command Markdown files, 3 skill subdirectories (each with `SKILL.md`), 1 JSON state file
- **File format:** All commands/skills use YAML frontmatter (`---`) with `description` and `agent` fields
- **Current state:** Fully wired but not yet activated (`echoes-state.json` has `initialized: false`)

**`.opencode/commands/`:**
- **Purpose:** EchoesVault plugin command definitions invoked by the user or agent during sessions
- **Lifecycle:** `echoes-init` (once) → `echoes-start` (per session) → work → `echoes-end` (per session)
- **Monitoring:** `echoes-status` (check health at any point)

**`.opencode/skills/`:**
- **Purpose:** Reusable tool definitions for EchoesVault memory operations
- **Current skills:** `echoes_append_to_daily_log`, `echoes_create_or_update_page`, `echoes_search_vault_pages`
- **Structure:** Each skill is a directory with a single `SKILL.md` containing usage instructions

**`EchoesVault/`:**
- **Purpose:** Persistent Markdown knowledge base enabling session-to-session memory
- **Planned subdirectories (from `echoes-init.md`):**
  - `EchoesVault/pages/` — Project encyclopedia (decisions, architecture, concepts)
  - `EchoesVault/daily/` — Session work logs (`YYYY-MM-DD.md`)
  - `EchoesVault/raw/` — Raw source materials (read-only)
  - `EchoesVault/assets/` — Images, diagrams, schematics
- **Current state:** Only `index.md` exists — no pages, logs, or assets created yet
- **Conventions:** Obsidian-style wiki links (`[[filename]]`), YAML frontmatter required, ADR density

**`.venv/`:**
- **Purpose:** Python 3.12 virtualenv
- **Contains:** Globally installed packages (numpy, httpx, uvicorn, websockets, tqdm, greenlet)
- **Status:** Not project-specific — no dependencies are declared for this project
- **Generated:** Yes (by system/virtualenv)
- **Committed:** Should NOT be committed (local environment artifact)

## Key File Locations

**Entry Points:**
- `README.md` — Project overview, best starting point for humans
- `AGENTS.md` — Agent-oriented entry point, declares "No code yet"
- `plan-secondbrain.md` — Deepest architectural document (167 lines)

**Configuration:**
- `.opencode/echoes-state.json` — Plugin version (1.2.2), session state, page/log counts
- No other configuration files exist

**Core Logic:**
- None — zero implementation files. This is a documentation-only repository

**Testing:**
- None — no test files, test frameworks, or test directories

## Naming Conventions

**Files:**
- `UPPERCASE.md` for root meta-documents: `README.md`, `AGENTS.md`, `CONTRIBUTING.md`, `LICENSE`
- `kebab-case.md` for design documents: `plan-secondbrain.md`, `components.md`
- `.opencode/commands/`: `kebab-case.md` (e.g., `echoes-init.md`)
- `.opencode/skills/`: `kebab-case/SKILL.md` (directory per skill, `SKILL.md` inside)

**Directories:**
- `PascalCase/` for `EchoesVault/` (branded plugin name)
- `kebab-case/` for `.opencode` subdirectories: `commands/`, `skills/`
- Dotted prefix for OpenCode internal: `.opencode/`, `.git/`, `.venv/`

## Where to Add New Code

**New Design Document:**
- Location: root directory (e.g., `kebab-case-name.md`)
- Update `AGENTS.md` if it should be an agent reference entry

**New EchoesVault Page:**
- Location: `EchoesVault/pages/kebab-case-name.md`
- Add entry to `EchoesVault/index.md` as `- [[kebab-case-name]]: One-sentence description.`
- Must include YAML frontmatter (`type`, `stack`, `status` fields required per echoes-init rules)
- Use `> [!warning] DEPRECATED` instead of deleting old pages

**New OpenCode Command:**
- Location: `.opencode/commands/kebab-case-name.md`
- Must include YAML frontmatter with `description` and `agent` fields
- Must include system instructions for the agent in the body

**New OpenCode Skill:**
- Location: `.opencode/skills/kebab-case-name/SKILL.md`
- Must include YAML frontmatter with `name` and `description` fields
- Must include usage instructions, trigger conditions, rules, and payload parameters

**New Candidate Tool:**
- Location: `components.md` — add entry under the appropriate pillar section
- Include GitHub link and brief evaluation note
- Mark with `- done` suffix if evaluated and selected

## Special Directories

**`.venv/`:**
- Generated: Yes (virtualenv create)
- Committed: No (local environment — not in `.gitignore` but should not be tracked)

**`.git/`:**
- Generated: Yes (`git init`)
- Committed: No (git internal metadata)

**`EchoesVault/pages/`, `EchoesVault/daily/`, `EchoesVault/raw/`, `EchoesVault/assets/`:**
- Generated: Yes (by `echoes-init` command)
- Committed: Yes (these are the actual memory data that persist across sessions)
- Current state: Do not exist yet — only `EchoesVault/index.md` exists

---

*Structure analysis: 2026-07-25*
