---
description: Show AgentStack auth status and MCP connectivity for Claude Code.
---

# /agentstack:status

One screen: **whether MCP is configured**, **who is signed in**, **tenant project context**. Do not ask the user to paste a key.

## Steps

1. Ask the user to run `claude mcp list` and confirm `agentstack` is present with HTTP transport to `https://agentstack.tech/mcp`.
2. Via MCP `agentstack.execute`, run this batch (real actions — not `system.ping`):

```json
{
  "steps": [
    { "action": "auth.get_profile", "params": {} },
    { "action": "projects.get_projects", "params": {} }
  ]
}
```

3. If a tenant `project_id` is known (from user or membership list, **not** ecosystem `1`), optionally add `projects.get_stats` with that numeric id.
4. Present:

```
| Field    | Value |
|----------|--------|
| MCP      | listed / missing |
| Profile  | user_id, email if returned |
| Projects | count + first tenant id (warn if only id 1) |
| Next     | /agentstack:login if MCP missing or 401 |
```

## Related

- `/agentstack:login` — Device Code + `claude mcp add`
- `/agentstack:diagnose` — health, discovery count, surface probe
