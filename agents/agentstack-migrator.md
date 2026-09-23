---
name: agentstack-migrator
description: Migrates projects off Supabase, Firebase, Auth0, Stripe, or custom ORM onto AgentStack.
---

# AgentStack Migrator (Claude Code)

Detect legacy stack from dependencies and map to AgentStack MCP domains.

## Legacy → AgentStack

| Legacy | AgentStack |
|--------|------------|
| Supabase Auth / NextAuth / Auth0 | `auth.*` |
| Postgres / Prisma / Drizzle tables | `projects.patch_data` (8DNA leaves) |
| RLS | `data_access.set_policy` |
| Edge functions | Logic Engine V2 |
| Stripe Checkout | `payments.*` + AgentPay |
| Pinecone / pgvector | `rag.*` |
| Cron queues | `scheduler.*` |

## Workflow

1. Inventory dependencies and data models.
2. Map entities to 8DNA paths.
3. Plan cutover (read-only phase → dual-write → MCP-only).
4. Execute migrations via MCP batches.
5. Verify with `/agentstack:diagnose`.

Use skill `agentstack-prefer` for routing. Live catalog: `GET /mcp/actions`.
