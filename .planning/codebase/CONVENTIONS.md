# Testing Patterns

**Analysis Date:** 2026-07-25

## Test Framework

**Runner:**
- Vitest v3.1.1
- Config: `sdk/vitest.config.ts` (also at `gsd-opencode/sdk/vitest.config.ts`)

**Assertion Library:**
- Built-in Vitest `expect` API

**Run Commands** (from `sdk/package.json`):
```bash
npm test                    # vitest run — all projects
npm run test:unit           # vitest run --project unit
npm run test:integration    # vitest run --project integration
```

## Vitest Configuration

**File:** `sdk/vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['src/**/*.test.ts'],
          exclude: ['src/**/*.integration.test.ts'],
        },
      },
      {
        test: {
          name: 'integration',
          include: ['src/**/*.integration.test.ts'],
          testTimeout: 120_000,
        },
      },
    ],
  },
});
```

Two project scopes: `unit` and `integration`, distinguished by file naming — `*.test.ts` vs `*.integration.test.ts`.

## Test File Organization

**Location:**
- Co-located with source: `src/[module].test.ts` and `src/[module].integration.test.ts`
- Test files sit next to source files in `src/`, not in a separate `__tests__/` directory

**Naming:**
- Unit tests: `[module].test.ts` — e.g., `plan-parser.test.ts`, `logger.test.ts`, `event-stream.test.ts`
- Integration tests: `[module].integration.test.ts` — e.g., `phase-runner.integration.test.ts`, `e2e.integration.test.ts`, `lifecycle-e2e.integration.test.ts`
- E2E tests: `e2e.integration.test.ts`, `lifecycle-e2e.integration.test.ts`
- Submodule tests: `query/[handler].test.ts` — e.g., `query/registry.test.ts`, `query/frontmatter.test.ts`

**Structure:**
```
sdk/src/
├── index.ts
├── plan-parser.ts           # Source
├── plan-parser.test.ts       # Unit test
├── phase-runner.ts
├── phase-runner.test.ts      # Unit test
├── phase-runner.integration.test.ts  # Integration test
├── query/
│   ├── registry.ts
│   └── registry.test.ts
```

## Test Structure

**Suite Organization:**
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

// ─── Section comments ───────────────────────────────────────────────────

describe('ModuleName', () => {
  let sharedState: Type;

  beforeEach(() => {
    sharedState = setup();
  });

  describe('nestedMethod()', () => {
    it('expected behavior description', () => {
      // Arrange
      const input = makeInput();
      // Act
      const result = module.function(input);
      // Assert
      expect(result).toEqual(expected);
    });
  });
});
```

**Patterns:**
- Top-level `describe` matches the class or module name
- Nested `describe` for methods or sub-features
- `beforeEach` for test-local state setup (new instances per test)
- `afterEach` for cleanup (temp dir deletion)

**File header pattern:**
```typescript
/**
 * Unit tests for [ModuleName].
 */
// or
/**
 * Integration test — proves [ModuleName] works against real [dependency].
 */
```

## Mocking

**Framework:** `vi` from Vitest

**Pattern:**
- Module-level mocking with `vi.mock('./module.js', () => ({ ... }))` at the top of the file
- Import the mocked function after the mock declaration
- Use `vi.mocked(mockedFunction)` for type-safe mock access

Example from `sdk/src/phase-runner.test.ts`:
```typescript
// Mock session-runner to avoid real SDK calls
vi.mock('./session-runner.js', () => ({
  runPhaseStepSession: vi.fn(),
  runPlanSession: vi.fn(),
}));

// Mock plan-parser to avoid real file I/O
vi.mock('./plan-parser.js', () => ({
  parsePlanFile: vi.fn().mockResolvedValue({
    frontmatter: { phase: '01-auth', plan: '01', ... },
    objective: 'Test plan objective',
    ...
  }),
}));

import { runPhaseStepSession } from './session-runner.js';
const mockRunPhaseStepSession = vi.mocked(runPhaseStepSession);
```

**What to Mock:**
- External SDK calls (`@anthropic-ai/claude-agent-sdk`)
- File I/O operations
- Subprocess execution (`execFile`, `exec`)
- Complex dependencies not under test

**What NOT to Mock:**
- Pure utility functions
- Type definitions
- Synchronous helpers with no side effects
- Event emitters (test doubles used instead)

## Fixtures and Factories

**Test Data Factories:**
Functions that return typed objects with sensible defaults and partial overrides:

```typescript
// From sdk/src/phase-runner.test.ts
function makePhaseOp(overrides: Partial<PhaseOpInfo> = {}): PhaseOpInfo {
  return {
    phase_found: true,
    phase_dir: '/tmp/project/.planning/phases/01-auth',
    phase_number: '1',
    phase_name: 'Authentication',
    ...overrides,
  };
}

function makePlanResult(overrides: Partial<PlanResult> = {}): PlanResult {
  return {
    success: true,
    totalCostUsd: 0.05,
    totalDurationMs: 1000,
    ...overrides,
  };
}
```

**Inline Fixtures:**
Full test input (like plan files) defined as string literals within the test file:

```typescript
// From sdk/src/plan-parser.test.ts
const FULL_PLAN = `---
phase: 03-features
plan: 01
...
---`;
```

**Event/Message Helpers:**
Functions that construct typed SDK messages for event stream tests:

```typescript
// From sdk/src/event-stream.test.ts
function makeSystemInit(): SDKSystemMessage {
  return {
    type: 'system',
    subtype: 'init',
    agents: [],
    ...
  };
}
```

**Custom Test Doubles:**
Writable stream capture for logger tests:

```typescript
// From sdk/src/logger.test.ts
class BufferStream extends Writable {
  lines: string[] = [];
  _write(chunk: Buffer, _encoding: string, callback: () => void): void {
    const str = chunk.toString();
    this.lines.push(...str.split('\n').filter(l => l.length > 0));
    callback();
  }
}
```

## Coverage

**Requirements:** No coverage thresholds configured in `vitest.config.ts`

**View Coverage:** Not configured — no `--coverage` flag in test scripts. Add with `vitest run --coverage` if needed.

## Test Types

**Unit Tests (`*.test.ts`):**
- Pure unit tests: `query/registry.test.ts`, `query/utils.test.ts`, `workstream-utils.test.ts`
- Mocked dependency tests: `plan-parser.test.ts`, `logger.test.ts`, `phase-runner.test.ts`
- Event stream tests with SDK message fakes: `event-stream.test.ts`
- Isolated by mocking I/O and SDK calls

**Integration Tests (`*.integration.test.ts`):**
- Real `GSDTools` with temp directory structures: `phase-runner.integration.test.ts`
- Full lifecycle end-to-end: `e2e.integration.test.ts`, `lifecycle-e2e.integration.test.ts`
- Init workflow: `init-e2e.integration.test.ts`
- Golden test parity: `golden/golden.integration.test.ts`
- Tests that require real `gsd-tools.cjs` binary present
- Guard with `existsSync(GSD_TOOLS_PATH)` check at top of test

**E2E Tests:**
- In the `integration.test.ts` naming convention
- Test full lifecycle: `lifecycle-e2e.integration.test.ts`

## Common Patterns

**Temp Directory Setup:**
```typescript
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

beforeEach(async () => {
  tmpDir = join(tmpdir(), `gsd-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  await mkdir(tmpDir, { recursive: true });
});

afterEach(async () => {
  await rm(tmpDir, { recursive: true, force: true });
});
```

**Async Testing:**
```typescript
it('parses valid JSON output', async () => {
  const result = await tools.exec('state', ['load']);
  expect(result).toEqual({ status: 'ok', count: 42 });
});
```

**Error Testing:**
```typescript
it('throws on empty input', async () => {
  await expect(generateSlug([], '/project')).rejects.toThrow(GSDError);
  await expect(generateSlug([], '/project')).rejects.toMatchObject({
    classification: ErrorClassification.Validation,
  });
});
```

**Event Testing:**
```typescript
it('emits session init event', () => {
  const stream = new GSDEventStream();
  const handler = vi.fn();
  stream.on('event', handler);
  stream.mapSystemMessage(makeSystemInit());
  expect(handler).toHaveBeenCalledTimes(1);
  expect(handler.mock.calls[0][0].type).toBe(GSDEventType.SessionInit);
});
```

**Mock Return Values:**
```typescript
mockRunPhaseStepSession.mockResolvedValue({
  success: true,
  ...
});
```

---

*Testing analysis: 2026-07-25*