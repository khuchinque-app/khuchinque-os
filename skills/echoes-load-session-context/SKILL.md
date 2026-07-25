---
name: echoes_load_session_context
description: Load prior session context on session start — presents summary of last session and offers deep-dive.
---

# TOOL USAGE: echoes_load_session_context
On session start, read the most recent session context and present it to the user.

## 🎯 TRIGGER CONDITION
At the beginning of every new session, before any user task is processed.

## 📋 PROCEDURE

### Step 1: Read session state
Read `echoes-state.json` to find:
- `session.lastStart` — when the last session ran
- `session.lastSave` — when it was last saved
- `session.saved` — whether it was cleanly closed

### Step 2: Read last daily log
Read the most recent file in `EchoesVault/daily/`. Extract:
- Key decisions made
- Current task/state at end of session
- Any blockers or concerns

### Step 3: Present summary
Present a concise summary to the user:
```
📋 Last session: [date] | [saved/unsaved]
**Key decisions:** [2-3 bullet points]
**Last state:** [what was in progress]
```

### Step 4: Offer deep-dive
After summary, ask:
```
Want the full context from last session? Or ask me something specific about it.
```
If user accepts, load the full daily log. If user asks a specific question, search memory.

### Autonomous Memory Search Trigger
During conversation, if the user asks a question where answering requires context from prior sessions, autonomously search memory via the 4-layer unified search skill (`echoes_search_vault_pages`) and present relevant findings. Do NOT wait for the user to explicitly ask you to search.

**Trigger condition:** A question or task that references past work, decisions, patterns, or context you haven't seen in the current session.

**Execution:**
1. Call `echoes_search_vault_pages` with extracted keywords from the user's query.
2. The skill searches all 4 layers: EchoesVault pages, daily logs, Mem0 vector memory, knowledge graph.
3. Present relevant findings with source labels and offer to dive deeper.

**When to search (examples):**
| User says | Extract keywords |
|-----------|-----------------|
| "What was the auth approach?" | "auth", "authentication", "login" |
| "How did we handle X?" | "X" |
| "Remind me about the decision on Y" | "Y" |
| "What was the architecture for Z?" | "Z", "architecture" |
| "Why did we choose W?" | "W" |
| "Find the discussion about V" | "V", "discussion" |
| "What's the status of U?" | "U", "status" |

**When NOT to search:**
- Simple factual questions ("What's 2+2?", "What's the capital of France?")
- Questions about the current conversation or this session only
- General knowledge or common sense questions
- Clarification questions about the user's current request
- Commands (build, test, deploy requests — unless they reference prior work)

**Query safety:**
1. Queries longer than 200 characters: reject (truncate or return error).
2. Strip shell metacharacters (`; \` $ () {} [] | &`) from extracted keywords.
3. Empty keywords: skip search entirely.
4. Never pass extracted keywords into a shell pipeline — use dedicated tools (Grep, Read, `echoes_search_vault_pages`).
