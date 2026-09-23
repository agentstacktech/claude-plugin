---
description: Bootstrap AgentStack in this project — OAuth login, SDK hint, capability discovery, next commands.
---

# /agentstack:init

Run **in this order**.

## 1. Auth

If MCP is not configured (`claude mcp list` missing `agentstack`), run `/agentstack:login`:

```bash
node scripts/device-login.mjs --scope-preset=full
```

Then run the printed `claude mcp add` command.

## 2. Smoke

```json
{
  "steps": [{ "action": "auth.get_profile", "params": {} }]
}
```

If this fails → `/agentstack:diagnose`.

## 3. SDK (optional)

If the repo has `package.json`, suggest `npm install @agentstack/sdk` and a thin `createSDK({ baseUrl: 'https://agentstack.tech' })` wrapper. See skill `agentstack-sdk`.

## 4. Discovery

Call `GET https://agentstack.tech/mcp/actions` with the same Bearer. Summarize top domains — full list via skill `agentstack-discovery`.

## 5. Next commands

```
/agentstack:status
/agentstack:discover
/agentstack:safe-cycle   — tenant DNA changes via generation.*
/agentstack:diagnose
```
