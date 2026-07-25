---
name: echoes_append_to_daily_log
description: Append an intermediate technical note or decision to today's daily log immediately after completing a sub-task.
---

# TOOL USAGE: echoes_append_to_daily_log
You are equipped with a scratchpad tool to manage your cognitive load. You MUST use this tool to offload important context into `EchoesVault/daily/YYYY-MM-DD.md`.

## 🔄 AUTO-LOG RULE
After EVERY assistant response that produced meaningful output (code changes, decisions, file edits, research findings), append a concise one-line summary to the daily log. Prefix auto-generated entries with `[auto]` to distinguish from manual entries. Skip if the log entry would be identical to the last entry (avoid duplicate noise).

## 🎯 EXACT TRIGGER CONDITIONS (WHEN TO CALL THIS TOOL)
In addition to the auto-log rule above, you MUST invoke this tool IMMEDIATELY in the current response if ANY of the following specific events occur:
1. **Task Completion:** We successfully finish a logical unit of work (e.g., a script works, a bug is verified as fixed, tests pass) BEFORE starting the next user request.
2. **Context Switch:** The user asks to change focus (e.g., "Now let's work on the frontend" after we just worked on the backend).
3. **Architectural Agreement:** We just agreed on a core rule, library choice, database schema, or API contract.
4. **Explicit User Command:** The user explicitly tells you to "take a note", "remember this", "save our progress", or "log this".

## ⚠️ RULES
1. **Be Concise:** Write ONLY dry facts and bullet points (e.g., "Refactored AuthGuard to use JWT refresh tokens"). No conversational filler.
2. **Do Not Interrupt Flow:** Make the tool call silently or add a brief confirmation in your response like: *"Logged the AuthGuard update to the daily vault. Ready for the frontend."*
3. **No File Overwrites:** This tool ONLY appends to the end of today's file.
4. **Auto-log vs Manual:** Auto-log entries get `[auto]` prefix. Manual entries (from explicit triggers above) have no prefix.

## 📦 ARCHIVAL

Daily logs are archived automatically to bounded context growth.

**Trigger:** When a daily log is 30 days old OR exceeds 100KB uncompressed (whichever comes first).

**Action:**
1. Compress the log: `gzip EchoesVault/daily/YYYY-MM-DD.md`
2. Move to archive: `mv EchoesVault/daily/YYYY-MM-DD.md.gz ~/.opencode/EchoesVault/archive/`
3. Start a fresh daily log for the current date.

**Archive location:** `~/.opencode/EchoesVault/archive/`

Archived logs maintain the original filename and are discoverable via memory search.

## 📥 PAYLOAD PARAMETERS
- `logEntry`: (String) The markdown-formatted bullet points to append.
