# Testing Patterns

**Analysis Date:** 2026-07-25

## Test Framework

**Runner:**
- Vitest v3.x — GSD SDK and distribution
- Config: `vitest.config.ts` in both SDK and distribution

**Assertion Library:**
- Vitest built-in expect
- Standard matchers: toBe, toEqual, toThrow

**Run Commands:**
```bash
npm test                              # Run all tests (vitest run)
npm test -- --watch                   # Watch mode
npm test -- path/to/file.test.ts     # Single file
npm run test:coverage                 # Coverage report (if configured)
npm run test:unit                     # Unit tests only (SDK)
npm run test:integration              # Integration tests only (SDK)
```

## Test File Organization

**Location:**
- `*.test.ts` — Alongside source files in SDK (`src/`)
- `*.integration.test.ts` — Integration tests in SDK
- No separate `tests/` directory

**Naming:**
- `module-name.test.ts` — Unit tests
- `feature-name.integration.test.ts` — Integration tests
- Separate Vitest projects for unit and integration

**Structure:**
```
sdk/src/
  lib/
    parser.ts
    parser.test.ts
  services/
    install-service.ts
    install-service.test.ts
```

## Test Structure

**Suite Organization:**
```typescript
import { describe, it, expect } from 'vitest';

describe('ModuleName', () => {
  describe('functionName', () => {
    it('should handle success case', () => {
      // arrange
      // act
      // assert
    });

    it('should handle error case', () => {
      // test code
    });
  });
});
```

**Patterns:**
- Standard describe/it nesting
- Arrange/Act/Assert pattern

## Mocking

**Framework:**
- Vitest built-in mocking (vi)
- Module mocking via vi.mock()

**Patterns:**
```typescript
import { vi } from 'vitest';
import { externalFunction } from './external';

vi.mock('./external', () => ({
  externalFunction: vi.fn()
}));
```

**What to Mock:**
- External dependencies (ws, filesystem)
- Agent SDK calls
- Network requests

## Fixtures and Factories

**Test Data:**
- Factory functions in test files for creating test objects
- No dedicated tests/fixtures/ directory observed

## Coverage

**Requirements:**
- No enforced coverage target observed
- Coverage tracked for awareness

## Test Types

**Unit Tests:**
- Test single function/module in isolation
- Mock external dependencies
- Run via `npm run test:unit` (SDK project)

**Integration Tests:**
- Test multiple modules together
- Mock at external boundaries only
- Run via `npm run test:integration` (SDK project)

**E2E Tests:**
- Not currently used
- GSD workflows tested via manual execution

## Test Coverage Gaps

- GSD commands (89 markdown workflows) — no formal test suite
- GSD agents (33 definitions) — no formal test suite
- Workflow procedures tested only via manual execution
- No E2E tests for project lifecycle flows

---

*Testing analysis: 2026-07-25*
*Update when test patterns change*
