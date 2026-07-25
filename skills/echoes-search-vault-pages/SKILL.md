---
name: echoes_search_vault_pages
description: Search all 4 memory layers (EchoesVault pages, daily logs, Mem0 vector memory, knowledge graph) for specific concepts, keywords, or implementation details.
---

# TOOL USAGE: echoes_search_vault_pages (4-Layer Unified Search)
You are the EchoesVault Keeper. If you encounter a concept, API, or architectural pattern in our conversation that you suspect is documented but you lack the full context, use this tool BEFORE generating code. This skill searches ALL 4 cognitive memory layers and returns deduplicated results with source labels.

## 🎯 WHEN TO USE
- The user asks to modify an existing component, but its structure is not in your current context window.
- You need to verify if an Architectural Decision Record (ADR) exists for a specific technology.
- You want to fulfill the "Read-Before-Write" core rule.
- The user asks a question requiring context from prior sessions ("What did we decide about X?").
- You are starting a task that may reference prior decisions, patterns, or code.

## 📥 PAYLOAD PARAMETERS
- `query`: (String) The specific keyword or short phrase to search for across all memory layers.

## 🔍 4-LAYER SEARCH PROCEDURE

### Layer 1: EchoesVault Pages (Episodic/Semantic)
Use `echoes_search_vault_pages` tool directly — searches `EchoesVault/pages/` for matching keywords in file content.
```
echoes_search_vault_pages { query: "<keyword>" }
```

### Layer 2: Daily Logs (Episodic)
Search `EchoesVault/daily/` directory for matching entries. Use the native Grep tool with `grep -li "<keyword>" EchoesVault/daily/*.md` or read files sorted by date (newest first). Do NOT construct a shell pipeline — use the dedicated tools to avoid injection risk.
```
grep -li "<keyword>" EchoesVault/daily/*.md
```
For each matching file, extract the relevant sections around matches.

### Layer 3: Mem0 Vector Memory (Semantic)
Use `mem0-mcp_search_memories` to semantically search over stored vector memories. This catches context stored via Mem0's add_memory that may not be in EchoesVault.
```
mem0-mcp_search_memories { query: "<keyword>" }
```
Apply filters (`user_id`, `agent_id`, `app_id`, `run_id`) to narrow results where available.

### Layer 4: Knowledge Graph (Procedural)
If a knowledge graph exists at `graphify-out/graph.json`, use `/graphify query "<keyword>"` or read the graph file directly. This captures codebase relationships and procedural workflows.
```
graphify query "<keyword>"
```

## 🧩 RESULT MERGING
1. Search each layer independently in order (pages → daily → Mem0 → graph).
2. Deduplicate results by content fingerprint (same file/path/source ID = duplicate).
3. Label each result with its source layer:
   - `[EchoesVault Page]` — from `pages/`
   - `[Daily Log]` — from `daily/`
   - `[Mem0 Vector]` — from Mem0 semantic search
   - `[Knowledge Graph]` — from graphify
4. Present results grouped by layer, most relevant first.
5. If results are found, offer to read the full content of any result.

## ⚠️ QUERY SAFETY
1. **No shell execution:** Never pass the query string into a shell pipeline. Use dedicated tools (Grep, Read) only.
2. **Length limit:** Reject queries longer than 200 characters.
3. **No metacharacters:** Strip shell metacharacters (`; \` $ () {} [] | &`) from the query before use. Use `printf %q` if shell escaping is unavoidable — but prefer tool-based approaches.
4. **Empty check:** If the query is empty or whitespace-only, return an error.

## ⚠️ RULES
1. **Targeted Queries:** Use specific technical keywords (e.g., "AuthGuard", "esp32 pinout", "database schema") rather than natural language questions for EchoesVault pages and daily logs. For Mem0 and graph, natural language is fine (they support semantic search).
2. **Handle Deprecations:** If the search returns a file marked with `> [!warning] DEPRECATED`, look for the link to the new relevant file and read that instead.
3. **Graceful Degradation:** If a layer is unavailable (Mem0 MCP offline, graph file missing), skip it silently and continue with available layers.
4. **Layer Limit:** Do NOT search a layer if the query clearly doesn't apply (e.g., codebase relationships don't need daily log search).
