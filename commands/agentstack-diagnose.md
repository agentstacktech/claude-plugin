---
description: Troubleshoot AgentStack MCP — health, discovery, token, surface probe.
---

# /agentstack:diagnose

Run in order; present as one Markdown table.

## Checks

1. **Health** — `GET https://agentstack.tech/api/health` (expect 200).
2. **MCP listed** — `claude mcp list` shows `agentstack` → `https://agentstack.tech/mcp`.
3. **Discovery** — `GET /mcp/actions` with Bearer (count domains; no hard-coded totals).
4. **Profile** — MCP `auth.get_profile` (list-only is a false green).
5. **Project** — MCP `projects.get_stats` with tenant `project_id` (not ecosystem `1`).
6. **Surface** — `/mcp` in chat; one `agentstack.execute` smoke step.

## Output template

```
| Check       | Status | Detail |
|-------------|--------|--------|
| Health      | OK     | … |
| MCP listed  | OK     | agentstack HTTP |
| Discovery   | OK     | N actions (live GET) |
| Profile     | OK     | user_id=… |
| Project     | OK/WARN| … |
| Surface     | OK     | execute smoke passed |
```

## When wrong

- MCP missing → `/agentstack:login`
- 401 / caps → re-run `device-login.mjs --scope-preset=full`
- Discovery low → widen scopes or re-login
