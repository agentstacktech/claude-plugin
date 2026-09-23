---
description: Sign in to AgentStack with OAuth Device Code and configure Claude Code MCP.
---

# /agentstack:login

Use when the user needs first-time setup, re-login, project switching, or a wider AgentStack scope.

## Primary flow

1. From the plugin root, run:

```bash
node scripts/device-login.mjs --scope-preset=full
```

2. Approve in the browser at the printed Activate URL.
3. Run the printed `claude mcp add agentstack …` command once.
4. Verify:

```bash
claude mcp list
/mcp
```

## Fallback (API key)

If OAuth is unavailable, create an anonymous project/API key per `MCP_QUICKSTART.md`:

```bash
claude mcp add agentstack --transport http https://agentstack.tech/mcp \
  --header "X-API-Key: <agentstack_api_key>" \
  --header "Content-Type: application/json"
```

## Recovery

- **`authorization_pending`** — keep polling (not an error).
- **`invalid_client`** — use `client_id=claude-plugin` (alias `claude-code-plugin` also works on prod).
- **`service_caps_required_in_prod`** — re-run with `--scope-preset=full`.
- **Browser did not open** — open the Activate URL manually and enter the user code.

Do not print full tokens in chat. For troubleshooting, provide HTTP status and trace id only.

## Related

- `/agentstack:status` — auth + profile smoke
- `/agentstack:diagnose` — deeper MCP surface check
