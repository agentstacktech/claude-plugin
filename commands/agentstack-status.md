---
description: Show AgentStack auth status and MCP connectivity for Claude Code.
---

# /agentstack:status

One screen: **whether MCP is configured**, **who is signed in**, **tenant project context**, **auth ladder**. Do not ask the user to paste a key or create a scoped API key as step 1.

## Auth ladder (interactive users)

| Client | Preferred | Last resort |
|--------|-----------|-------------|
| Claude Code (CLI) | `device-login.mjs --scope-preset=full` → `claude mcp add` Bearer | Scoped `X-API-Key` for CI only |
| Claude web / connector | OAuth **Connect** at agentstack.tech (same server as ChatGPT) | Device Code full preset |
| Automation / CI | `apikeys.create` preset `agent_runner` | — |

Read `auth.get_profile` → `auth_surface` (`auth_transport`, `service_caps_scoped`, `recommended_reauth`).

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
| Auth     | auth_surface.auth_transport, service_caps_scoped |
| Projects | count + first tenant id (warn if only id 1) |
| Next     | /agentstack:login if MCP missing or 401 |
```

## Related

- `/agentstack:login` — Device Code full + `claude mcp add`
- `/agentstack:diagnose` — health, discovery count, surface probe
- `MCP_QUICKSTART.md` — Connect vs Device Code ordering
