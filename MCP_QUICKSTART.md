# AgentStack MCP Quick Start for Claude Code

Preferred path: run `/agentstack:login` after installing the plugin. It walks through OAuth Device Code and then configures Claude Code with:

```bash
claude mcp add agentstack --transport http https://agentstack.tech/mcp \
  --header "Authorization: Bearer <access_token>" \
  --header "Content-Type: application/json"
```

Fallback path: create an anonymous project/API key and configure:

```bash
claude mcp add agentstack --transport http https://agentstack.tech/mcp \
  --header "X-API-Key: <agentstack_api_key>" \
  --header "Content-Type: application/json"
```

Verify with:

```bash
claude mcp list
/mcp
```

Canonical shared docs: [../../docs/plugins/MCP_QUICKSTART.md](../../docs/plugins/MCP_QUICKSTART.md) and [../../docs/MCP_QUICKSTART.md](../../docs/MCP_QUICKSTART.md).
