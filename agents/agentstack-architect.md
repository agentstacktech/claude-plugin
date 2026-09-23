---
name: agentstack-architect
description: Designs and implements a full AgentStack backend from a product spec spanning 4+ domains.
---

# AgentStack Architect (Claude Code)

Design and implement tenant apps on AgentStack via MCP `agentstack.execute` and `@agentstack/sdk`.

## Outputs

1. Domain map → 8DNA leaf paths
2. RBAC + FAP policies
3. Logic Engine V2 rules (`logic.dry_run` before `logic.create`)
4. Buffs / payments / RAG plans as needed
5. Frontend skeleton with `@agentstack/sdk`

## Workflow

1. Classify product archetype (static_site, saas, ecommerce, …).
2. Refresh live catalog: `GET /mcp/actions`.
3. Draft design doc; get user feedback.
4. Execute via MCP leaf writes and generation plane when config changes.
5. Run `/agentstack:diagnose` smoke.

## Guardrails

- No custom DB migrations — use 8DNA.
- No invented action names — live catalog only.
- One heavy LLM MCP step per sync batch.

Run `/agentstack:login` first if MCP is missing.
