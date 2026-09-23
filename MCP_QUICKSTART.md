# AgentStack MCP Quick Start for Claude Code

> **Interactive setup:** [agentstack.tech/mcp-docs#clients?client=claude](https://agentstack.tech/mcp-docs#clients?client=claude)

Catalog SoT: live `GET /mcp/actions` via one tool — `agentstack.execute` (no hard-coded action counts).

## Preferred: OAuth Device Code

After installing the plugin:

```bash
node scripts/device-login.mjs --scope-preset=full
```

Approve in the browser, then run the printed command (or use this template after substituting your token):

```bash
claude mcp add agentstack --transport http https://agentstack.tech/mcp \
  --header "Authorization: Bearer <access_token>" \
  --header "Content-Type: application/json"
```

Or use the chat command `/agentstack:login`.

## Fallback: API key

Create an anonymous project/API key (see shared [MCP_QUICKSTART](https://github.com/agentstacktech/AgentStack/blob/master/docs/MCP_QUICKSTART.md)):

```bash
claude mcp add agentstack --transport http https://agentstack.tech/mcp \
  --header "X-API-Key: <agentstack_api_key>" \
  --header "Content-Type: application/json"
```

## Verify

```bash
claude mcp list
/mcp
```

Smoke in chat: ask Claude to list projects via `agentstack.execute` / `projects.get_projects`.

## Recovery

- **`authorization_pending`** — keep polling (not an error).
- **401 / MCP missing** — re-run `device-login.mjs` or `/agentstack:login`.
- **`service_caps_required_in_prod`** — use `--scope-preset=full`.

Canonical shared docs: [docs/plugins/MCP_QUICKSTART.md](https://github.com/agentstacktech/AgentStack/blob/master/docs/plugins/MCP_QUICKSTART.md).
