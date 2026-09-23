---
description: Tenant safe project cycle — sandbox fork, diff, gates, promote via generation.* MCP.
---

# /agentstack:safe-cycle

Work on **tenant project data** through the generation plane — not prod scripts or custom backend tables.

## When to use

- Tenant config (8DNA, bots, knowledge, logic, integrations)
- Before promote after sandbox mutations

## Phases

| # | Phase | MCP |
|---|-------|-----|
| 0 | Session | set `context.project_id` |
| 1 | Mutate | domain action (leaf writes: `projects.patch_data`, `knowledge.config.patch`, …) |
| 2 | Verify | `logic.dry_run` / `bots.simulate` / `knowledge.playground` — **one heavy step per batch** |
| 3 | Review | `generation.diff_vs_prod` |
| 4 | Gates | `generation.gates` |
| 5 | Promote | `generation.promote` with `require_gates_passed: true` |

## Do not

- Full-blob `data=` writes
- Two heavy LLM steps in one sync execute
- Promote from diagnose-only runs

## Related

- Skill `agentstack-data` § sandbox / generation
- Skill `agentstack-bots` for mentor heal flows
