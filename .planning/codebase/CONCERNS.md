# Codebase Concerns

**Analysis Date:** 2026-07-25

## Tech Debt

**Git repository has no commits:**
- Issue: Git repo initialized but zero commits — all files untracked
- Why: Project setup in progress, no baseline established
- Impact: Cannot rollback, no history, all files at risk
- Fix approach: Initial commit establishing baseline

**Missing GSD subagents:**
- Issue: 18 GSD agent types not installed (gsd-planner, gsd-roadmapper, gsd-executor, etc.)
- Why: `npx gsd-opencode --global` not yet run; agents exist in `.opencode/agents/` but aren't registered
- Impact: All subagent spawns fail; planning/research/execution agents unavailable
- Fix approach: Run `npx gsd-opencode@latest --global`

**Duplicate npm package.json at root:**
- Issue: `package.json` at root only has 2 dependencies but also `package-lock.json` and `node_modules/`
- Why: Root-level packages installed, but .gitignore excludes package.json and lockfile
- Impact: Confusing — root package.json is gitignored, other projects' package.jsons are tracked
- Fix approach: Clean up root-level npm artifacts if not needed

**Echoes vault session never started:**
- Issue: echoes-state.json shows Initialized=true but Session started=false
- Why: `/echoes-start` never run after init
- Impact: Session context not loaded, daily logs not active
- Fix approach: Run `/echoes-start` at session beginning

**So-far.md at risk of staleness:**
- Issue: `so-far.md` documents full installation inventory manually
- Why: Written as snapshot during setup
- Impact: Will become outdated as tooling evolves; no automated update mechanism
- Fix approach: Consider auto-generated inventory or periodic refresh

## Known Bugs

**No known bugs detected:**
- Codebase is a configuration/personal dev environment, not a shipped application
- GSD framework is installed as a dependency, not actively developed here

## Security Considerations

**API keys in config files:**
- Risk: `opencode.jsonc` at `~/.config/opencode/` contains plaintext `MEM0_API_KEY` bearer token
- Files: `~/.config/opencode/opencode.jsonc` (line 9, Authorization header)
- Current mitigation: File is outside git repo (in `~/.config/`), but permissions may be world-readable
- Recommendations: Use environment variable substitution `${MEM0_API_KEY}` instead of hardcoded value, restrict file permissions

**Environment variable exposure:**
- Risk: `ANTHROPIC_API_KEY` and `MEM0_API_KEY` set as env vars — potentially accessible to subprocesses
- Current mitigation: OpenCode Deny permissions can restrict access
- Recommendations: Audit which tools/processes can read env vars

**MCP servers exposed to agents:**
- Risk: ruflo MCP server provides 260+ tools (memory_store, browser, agent management, etc.)
- Files: `opencode.json` — ruflo MCP configured with `enabled: true`
- Current mitigation: OpenCode permission system controls tool access
- Recommendations: Review which tools are exposed; use OpenCode "Deny" rules for destructive tools

## Performance Bottlenecks

**GSD SDK cold start:**
- Problem: gsd-sdk runs as Node subprocess for every query
- Measurement: ~500ms-2s per gsd-sdk invocation (Node startup + module loading)
- Cause: Fresh Node.js process per query
- Improvement path: None practical — CLI tool, startup cost inherent

**Large agent definition files:**
- Problem: Some agent files are 47KB (gsd-debugger.md) — significant context when loaded
- Measurement: 33 agent files total ~614KB
- Cause: Comprehensive instructions in single files
- Improvement path: Streamline agent prompts, load only needed portions

## Fragile Areas

**GSD workflow dependencies:**
- Files: `.opencode/get-shit-done/workflows/*.md` (89 workflows)
- Why fragile: Cross-references between workflows, commands, templates, and references via @-links
- Common failures: Workflow references document that moved or was renamed
- Safe modification: Update cross-references when renaming/moving files; use git mv for renames
- Test coverage: No automated tests for workflow integrity

**gsd-sdk as subprocess:**
- Files: `.opencode/sdk/dist/cli.js`
- Why fragile: Called as subprocess via `gsd-sdk query <json>` — JSON parsing errors if schema changes
- Common failures: JSON serialization mismatch, path resolution issues
- Safe modification: Add error checking around gsd-sdk calls; ensure JSON always wraps arrays
- Test coverage: Minimal

## Scaling Limits

**Echoes vault daily logs:**
- Current capacity: ~1 log file (2026-07-25.md with scratchpad entries)
- Limit: Daily logs accumulate indefinitely; no archival mechanism
- Symptoms at limit: Large daily logs consume context window
- Scaling path: Implement log rotation/archival, limit context loading to last N days

**GSD agent directory:**
- Current capacity: 33 agent definitions (~614KB total)
- Limit: Each agent loaded when spawned — more agents = more potential context
- Symptoms at limit: Slower spawn times, more context consumed
- Scaling path: Lazy-load agent definitions, streamline prompt content

## Dependencies at Risk

**@dietrichgebert/ponytail (npm):**
- Risk: Third-party community plugin
- Impact: Skills become unavailable if package removed or incompatible with newer OpenCode versions
- Migration plan: Inline skill logic if needed

**gsd-opencode (GitHub):**
- Risk: Single-maintainer project (rokicool)
- Impact: Workflows, agents, and commands depend on this framework
- Migration plan: Fork or vendor the framework

## Missing Critical Features

**Automated testing for GSD workflows:**
- Problem: 89 workflows have no automated tests
- Current workaround: Manual execution testing
- Blocks: Confident refactoring, regression detection
- Implementation complexity: Medium (workflow simulation + validation)

**CI/CD:**
- Problem: No CI pipeline, no automated validation
- Current workaround: Manual review
- Blocks: Cannot validate GSD workflow integrity automatically
- Implementation complexity: Low (GitHub Actions + basic test script)

## Test Coverage Gaps

**GSD workflows:**
- What's not tested: All 89 workflow procedures
- Risk: Workflow breakage from cross-reference drift, command changes
- Priority: Medium

**GSD SDK:**
- What's not tested: Integration with actual OpenCode runtime
- Risk: gsd-sdk query failures in real context
- Priority: Low (tested via manual execution)

---

*Concerns audit: 2026-07-25*
*Update as issues are fixed or new ones discovered*
