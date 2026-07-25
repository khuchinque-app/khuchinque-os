# Deferred Items — Phase 02 Plan 02 (02-02)

| Category | Item | Discovered During | Why Deferred |
|----------|------|-------------------|--------------|
| Pre-existing workflow issues | 8 workflow files lack `<objective>` or `<process>/<step>` sections: forensics.md, graduation.md, help.md, import.md, ingest-docs.md, milestone-summary.md, oc-check-profile.md, oc-set-profile.md, sync-skills.md, ultraplan-phase.md | task 2 verification | Pre-existing — not caused by this plan. CI will now detect these. Future plan should fix. |
| Pre-existing cross-ref issues | `planner-antipatterns.md` references 01-foundation summaries that don't exist in this project | task 2 verification | Pre-existing — not caused by this plan. CI will detect. |
| Pre-existing cross-ref issues | `verification-patterns.md` has `@./.opencode/get-shit-done/references/checkpoints.md**` with trailing `**` | task 2 verification | Pre-existing — CI will detect. |