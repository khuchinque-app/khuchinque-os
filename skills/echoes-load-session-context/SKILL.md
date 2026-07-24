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

### Autonomous Search Trigger
During conversation, if the user asks a question where answering requires context from prior sessions, autonomously search memory across all 4 layers (EchoesVault pages, daily logs, Mem0, knowledge graph) and present relevant findings.

**When to search:**
- "What was the auth approach?" → search memory for "auth", "authentication", "login"
- "How did we handle X?" → search memory for "X"
- "Remind me about the decision on Y" → search memory for "Y"

**When NOT to search:**
- Simple factual questions ("What's 2+2?")
- Questions about the current conversation
- General knowledge questions
