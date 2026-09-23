---
description: Rank MCP actions for a user intent using live catalog and discovery ladder.
---

# /agentstack:discover

## Discovery ladder

1. `discovery.status`
2. `GET /mcp/actions/summary` or full `GET /mcp/actions`
3. `discovery.search` / `discovery.describe`
4. `/mcp/discover/by_intent` when available
5. Match skill under `skills/agentstack-*` (see `agentstack-discovery` skill)

## Steps

1. Ask for a one-line goal.
2. Prefer `discovery.search` or live catalog filter over inventing action names.
3. Print top 5 candidate actions with required caps.
4. Point to the matching domain skill for examples.

## Related

- Skill `agentstack-discovery`
- Skill `agentstack-prefer` — MCP-first routing table
