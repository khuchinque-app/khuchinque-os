# Coding Conventions

**Analysis Date:** 2026-07-25

## Naming Patterns

**Files:**
- `kebab-case` for all markdown files (commands, workflows, templates, references)
- `kebab-case.ts` for TypeScript source files
- `kebab-case.cjs` for CommonJS files
- `PascalCase.json` for config/schema files
- `DOT.prefix` for hidden configuration files and directories
- `gsd-*.md` naming for all GSD agents and commands
- `SKILL.md` for skill definitions

**Functions:**
- camelCase for all functions (SDK TypeScript code)
- Named exports preferred

**Variables:**
- camelCase for variables
- UPPER_SNAKE_CASE for constants (env var names: MEM0_API_KEY, ANTHROPIC_API_KEY)
- No underscore prefix convention

**Types:**
- PascalCase for interfaces and types, no I prefix
- PascalCase for type aliases

## Code Style

**Formatting:**
- No Prettier config detected — likely default TypeScript formatting
- 2 space indentation
- Single quotes for strings
- Semicolons required
- 100-120 character line length

**Linting:**
- No ESLint config detected
- Strict mode enabled in tsconfig.json
- Enforcement via gsd-oc-work-hard.md rule (no faking tool calls)

**File Structure:**
- Markdown documents follow template structure with frontmatter/guidelines
- Source code organized by domain (commands/, sdk/src/, etc.)

## Import Organization

**SDK TypeScript:**
- External packages first (ws, @anthropic-ai/claude-agent-sdk)
- Internal modules
- Relative imports
- import type for type-only imports

**No path aliases:**
- All imports are relative
- No @/ style aliases

## Error Handling

**Patterns:**
- gsd-sdk: return structured JSON with {success, data, degraded, exitCode}
- Missing agents: display warning, fall back to inline execution
- Workflow gates: user approval checkpoints to prevent incorrect state
- Early validation via gsd-sdk init queries

**Error Types:**
- Missing dependency → warning + fallback path
- Invalid state → error with resolution instructions
- Tool failure → propagated to user context

## Logging

**Framework:**
- OpenCode built-in logging (configurable logLevel in opencode.json)
- Log levels: INFO (default in config)
- GSD SDK: ora spinner/progress for CLI feedback
- No structured logging library (pino, winston, etc.)

**Patterns:**
- Console output for user-facing information
- gsd-sdk runs as subprocess — output captured by agent context
- Terminal styling via chalk (gsd-opencode distribution)

## Comments

**When to Comment:**
- Markdown documents extensively commented (XML-style guidelines within documents)
- SDK source code: standard JSDoc/TSDoc for public APIs

**Pattern:**
- Workflow documents use XML-style `<objective>`, `<process>`, `<step>` tags
- Templates embed `<template>`, `<guidelines>`, `<evolution>` sections
- Rules written as markdown with clear ❌ FORBIDDEN / ✅ REQUIRED sections

## Function Design

**Markdown Documents (GSD commands/workflows):**
- XML-tagged sections for structured parsing
- Bash code blocks for executable command sequences
- question() calls for interactive gates
- Step-based organization in workflows

**TypeScript (SDK):**
- Standard modular design
- Each source file exports a specific functionality
- CLI entry via bin definition in package.json

## Module Design

**Exports:**
- Named exports preferred for TypeScript
- Markdown documents used as @-referenced execution context

---

*Convention analysis: 2026-07-25*
*Update when patterns change*
