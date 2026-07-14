---
description: Sign in to AgentStack with OAuth Device Code and configure Claude Code MCP.
---

# /agentstack:login

Use this command when the user needs first-time setup, re-login, project switching, or a wider AgentStack scope.

## Flow

1. Start OAuth Device Code from AgentStack:

```bash
curl -X POST https://agentstack.tech/api/oauth2/device/authorize \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=claude-code-plugin" \
  -d "scope=mcp:execute projects:read projects:write 8dna:read 8dna:write logic:write rag:read storage:read storage:write"
```

2. Open `verification_uri_complete` if present, otherwise open `verification_uri` and enter `user_code`.
3. Poll the token endpoint until the user approves:

```bash
curl -X POST https://agentstack.tech/api/oauth2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=urn:ietf:params:oauth:grant-type:device_code" \
  -d "device_code=<device_code>" \
  -d "client_id=claude-code-plugin"
```

4. Configure Claude Code MCP with the returned Bearer token:

```bash
claude mcp add agentstack --transport http https://agentstack.tech/mcp \
  --header "Authorization: Bearer <access_token>" \
  --header "Content-Type: application/json"
```

5. Verify:

```bash
claude mcp list
```

## Fallback

If OAuth is unavailable, use the anonymous project/API-key flow in `MCP_QUICKSTART.md` and configure:

```bash
claude mcp add agentstack --transport http https://agentstack.tech/mcp \
  --header "X-API-Key: <agentstack_api_key>" \
  --header "Content-Type: application/json"
```

Do not print real tokens in chat. If troubleshooting is needed, provide HTTP status and trace id only.
