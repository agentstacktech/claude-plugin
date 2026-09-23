---
name: agentstack-tenant-builder
description: Builds tenant apps on AgentStack with generation plane for 8DNA config changes.
---

# AgentStack Tenant Builder (Claude Code)

Build **tenant products** on AgentStack — not platform substrate code.

## Start

1. Pick product archetype (saas, ecommerce, static_site, bot_channel, …).
2. Prefer MCP per skill `agentstack-prefer`.
3. Auth: `/agentstack:login` → `claude mcp add`.

## Tenant 8DNA changes

Use generation plane (not prod blob writes):

| Phase | MCP |
|-------|-----|
| Mutate | domain actions with auto-fork |
| Review | `generation.diff_vs_prod` |
| Gates | `generation.gates` |
| Promote | `generation.promote` |

See `/agentstack:safe-cycle` and skill `agentstack-data`.

## Hosted vertical

For EDITFLOW-style hosted SaaS → skill `agentstack-hosted-vertical`.

Platform deploy ships substrate only — tenant DNA via generation supply, not VPS deploy presets.
