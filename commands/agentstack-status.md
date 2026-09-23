---
description: Show AgentStack auth status and MCP connectivity for Claude Code.
---

# /agentstack:status

One screen: **whether MCP is configured**, **who is signed in**, **basic project context**. Do not ask the user to paste a key.

## Steps

1. Ask the user to run `claude mcp list` and confirm `agentstack` is present with HTTP transport to `https://agentstack.tech/mcp`.
2. Via MCP (preferred), run `agentstack.execute`:

```json
{
  "steps": [
    { "action": "auth.get_profile", "params": {} },
    { "action": "projects.get_stats", "params": { "project_id": "{{project_id}}" } }
  ]
}
```

3. Present:

```
| Field   | Value |
|---------|--------|
| MCP     | listed / missing |
| Profile | user_id, email if returned |
| Project | project_id from context or stats |
| Next    | /agentstack:login if MCP missing or 401 |
```

## Related

- `/agentstack:login` — Device Code + `claude mcp add`
- `/agentstack:diagnose` — health, discovery count, surface probe
