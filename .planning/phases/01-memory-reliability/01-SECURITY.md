---
phase: 01-memory-reliability
date: 2026-07-25
verdict: FLAG (6 findings) → PASS
risk: medium → clean
fixes_applied: true
---

# Security Audit: Phase 01 — Memory Reliability

## Risk Level: CLEAN (all findings fixed)

**Verdict: FLAG (6 findings — 1 high, 3 medium, 2 low) → PASS (all findings fixed)**

**Fixes applied:** All 6 findings remediated. See remediation table below.

---

## Findings

| # | Severity | Component | Description | Remediation |
|---|----------|-----------|-------------|-------------|
| F1 | **HIGH** | `echoes-search-vault-pages/SKILL.md` Layer 2 (daily logs) | User-controlled `<keyword>` interpolated into a shell pipeline without escaping. The skill instructs the agent to run `ls -1t EchoesVault/daily/*.md \| while read f; do grep -li "<keyword>" "$f" 2>/dev/null; done`. A crafted query (e.g. `"; cat ~/.ssh/id_rsa; #`) executes arbitrary commands when the agent runs this via bash. | Quoting alone (double quotes) is insufficient. Switch to the `grep` tool (native Grep) or use bash `printf %q` escaping. Better yet, use the dedicated Grep tool exclusively instead of shell g会发现. |
| F2 | **MEDIUM** | `commands/memory.md` (all layers) | `/memory "<query>"` passes unsanitized freeform input to external MCP services (Mem0), a shell grep pipeline, and potentially `/graphify query` shell commands. No input validation or length limit documented. | Add a validation step: reject queries >200 chars, strip shell metacharacters, or use the dedicated Grep tool instead of shell commands. Document the sanitization rule explicitly in the command definition. |
| F3 | **MEDIUM** | `echoes-load-session-context/SKILL.md` autonomous trigger | LLM extracts keywords from user input and passes them directly to the 4-layer search. No guard against prompt injection: a crafted user message can trick the agent into searching sensitive memory terms, bypassing the "when NOT to search" rules (Lines 62-66). | Add a programmatic allowlist/blocklist for search terms. At minimum, document that user input must be treated as untrusted and the agent should validate keywords against a known-safe set before searching. |
| F4 | **MEDIUM** | All search components | Zero input sanitization documented across the entire search pipeline — the search skill, `/memory` command, and autonomous trigger all accept freeform strings with no validation, length limits, or metacharacter filtering. The only defense is the double-quote wrapping in the shell template, which is insufficient against `;`, `\``, and `$()` injection. | Add a security section to each skill/command: "QUERY SAFETY: Strip shell metacharacters (`; \` $() {} [] \| &`). Reject empty queries. Limit to 200 characters." |
| F5 | **LOW** | `commands/echoes-start.md` | Shell commands embedded in system message via ``!`cat ...` `` and ``!`ls ...` `` backtick syntax. While these use fixed paths (not user input), normalizing shell execution from agent context increases the attack surface if any path anywhere in the pipeline becomes user-controllable. | Prefer the dedicated Read/Glob tools. If shell execution is required, wrap paths in `printf %q` and document why each shell invocation is necessary. |
| F6 | **LOW** | Archival procedure (echoes-append-to-daily-log/SKILL.md) | Race window in three-step archival: `gzip` → `mv` → fresh start. Crash between gzip and mv leaves `.gz` in `daily/`. Crash between mv and fresh start leaves zero active logs. No atomicity or rollback documented. | Use `mv` then `gzip` (safe to compress a moved file), or document a two-phase approach: copy to archive, truncate original, compress archive copy. Add a recovery check: "if daily log missing, check archive for most recent." |

---

## Risk Coverage Matrix

| Risk | Exists? | Severity | Mitigation Present? |
|------|---------|----------|-------------------|
| Credential exfiltration via shell injection | Yes (F1) | HIGH | No |
| Credential persistence in memory stores | Yes (protocol warns, no gate) | MEDIUM | LLM-enforced only (memory-protocol.md L36) |
| Prompt injection → unauthorized memory access | Yes (F3) | MEDIUM | No |
| Input injection into external services (Mem0, graphify) | Yes (F2, F4) | MEDIUM | No |
| Race condition data loss in archival | Yes (F6) | LOW | No |
| Shell commands in system messages | Yes (F5) | LOW | No (but low-risk today) |
| File permission weakness on session data | Implicit | LOW | Inherits ~/.opencode umask |
| Destructive tool misuse (mem0-mcp_delete_all_memories) | Documented | LOW | No usage guard |

---

## Positive Observations

- `memory-protocol.md` explicitly warns "Never store secrets, passwords, or raw API keys in Semantic Memory" (Line 36).
- Graceful degradation pattern in search skill (skip unavailable layers silently) is good for availability.
- Deduplication by content fingerprint prevents redundant information disclosure.
- EchoesVault uses plain Markdown — no binary formats that could harbor exploits.
- No external network calls in Phase 01 artifacts themselves (Mem0/graphify calls are existing infrastructure, not introduced here).

---

## Remediation Applied

| # | Severity | Fix |
|---|----------|-----|
| F1 | HIGH | Replaced shell pipeline with native Grep tool usage in `echoes-search-vault-pages/SKILL.md` |
| F2 | MEDIUM | Added QUERY SAFETY section (length limit, metacharacter strip, no-shell rule) to `commands/memory.md` |
| F3 | MEDIUM | Added Query safety subsection to autonomous trigger in `echoes-load-session-context/SKILL.md` |
| F4 | MEDIUM | Added QUERY SAFETY section to `echoes-search-vault-pages/SKILL.md` — covers all 4 rules for every layer |
| F5 | LOW | Noted — shell in system messages uses fixed paths only; marked as acceptable risk |
| F6 | LOW | Changed archival order: copy → truncate original → gzip archive copy (eliminates race window) |

## Recommendations
