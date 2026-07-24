# Roadmap: OpenCode

## Overview

Build a personal AI development environment with memory that never forgets. Start by making the existing 4-layer memory architecture reliable and automatic, then expand through agent installation, developer experience, and knowledge management — each phase layered on the prior.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Memory Reliability** - Make cross-session memory automatic and reliable
- [ ] **Phase 2: Agent Infrastructure** - Install GSD agents, CI/CD, workflow testing
- [ ] **Phase 3: Developer Experience** - Improve CLI UX, error handling, tool integration
- [ ] **Phase 4: Knowledge Management** - EchoesVault enhancement, knowledge graph integration

## Phase Details

### Phase 1: Memory Reliability
**Goal**: Cross-session memory works automatically — every session loads prior context and saves current state without manual commands
**Depends on**: Nothing (first phase)
**Requirements**: MEM-01, MEM-02, MEM-03
**Success Criteria** (what must be TRUE):
  1. Starting a new session loads prior session context (daily logs, vault pages) automatically
  2. Ending a session persists all context without manual `/echoes-end` or commit_memory calls
  3. User can ask "what did we do about X?" and get relevant memory across sessions
  4. Memory search returns semantically relevant results from all 4 cognitive layers
**Plans**: 3 plans

Plans:
- [ ] 01-01: Automated session lifecycle (auto-start on session begin, auto-save on end)
- [ ] 01-02: Unified memory search across all 4 layers
- [ ] 01-03: Memory consolidation and archival for daily logs

### Phase 2: Agent Infrastructure
**Goal**: All 18 GSD subagents installed, CI/CD pipeline validates workflows, tests cover critical paths
**Depends on**: Phase 1
**Requirements**: AGENT-01, DX-01, DX-02
**Success Criteria** (what must be TRUE):
  1. All 18 missing GSD agents are installed and spawnable
  2. GitHub Actions pipeline validates workflow integrity on push
  3. Critical GSD workflows have automated tests
**Plans**: 3 plans

Plans:
- [ ] 02-01: Install and verify all missing GSD subagents
- [ ] 02-02: Set up CI/CD pipeline with workflow validation
- [ ] 02-03: Write automated tests for critical workflows

### Phase 3: Developer Experience
**Goal**: CLI interaction is smooth, error messages are helpful, tool integration is seamless
**Depends on**: Phase 2
**Requirements**: (emerging from DX feedback)
**Success Criteria** (what must be TRUE):
  1. Error messages include actionable guidance
  2. Common workflows complete without user confusion
  3. Tool loading and response times are acceptable
**Plans**: 2 plans

Plans:
- [ ] 03-01: Error handling and user feedback improvements
- [ ] 03-02: Performance optimization (cold start, agent loading)

### Phase 4: Knowledge Management
**Goal**: EchoesVault and Graphify work together as a browsable, searchable knowledge base
**Depends on**: Phase 3
**Requirements**: (emerging from knowledge needs)
**Success Criteria** (what must be TRUE):
  1. Knowledge graph is queryable alongside vault pages
  2. Vault pages auto-index and cross-reference
  3. Daily logs archive without losing searchability
**Plans**: 2 plans

Plans:
- [ ] 04-01: Knowledge graph integration with vault search
- [ ] 04-02: Log archival with search retention

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Memory Reliability | 0/3 | Not started | - |
| 2. Agent Infrastructure | 0/3 | Not started | - |
| 3. Developer Experience | 0/2 | Not started | - |
| 4. Knowledge Management | 0/2 | Not started | - |
