# AgentStack — Full Backend Ecosystem (Claude Code Plugin)

Plugin for [Claude Code](https://code.claude.com): 8DNA data, Logic Engine, Buffs, payments, hosting, Agents Fleet, RAG, messenger — one MCP tool (`agentstack.execute`) backed by the live `GET /mcp/actions` catalog.

## Quick Start

1. **Install** the plugin (marketplace or `claude --plugin-dir .`).
2. **Sign in:** `/agentstack:login` or `node scripts/device-login.mjs --scope-preset=full`
3. **Configure MCP** with the printed `claude mcp add agentstack …` command.
4. **Verify:** `claude mcp list` and `/mcp`

Details: [MCP_QUICKSTART.md](MCP_QUICKSTART.md)

## What's included

| Layer | Count | Notes |
|-------|------:|-------|
| **Skills** | 29 mirrored + 1 prefer | Gen3 domain routers synced from Cursor SoT |
| **Commands** | 7 | login, status, init, diagnose, discover, safe-cycle |
| **Agents** | 3 | architect, migrator, tenant-builder |

### Domain skills (gen3)

`agentstack-data`, `agentstack-logic`, `agentstack-auth-rbac`, `agentstack-commerce`, `agentstack-commerce-assets`, `agentstack-projects`, `agentstack-hosting`, `agentstack-rag`, `agentstack-agents-ai`, `agentstack-bots`, `agentstack-crm`, `agentstack-messenger`, `agentstack-support`, `agentstack-integrations`, `agentstack-signals`, `agentstack-storage`, `agentstack-sdk`, `agentstack-discovery`, `agentstack-guidance`, `agentstack-agentnet`, `agentstack-business`, `agentstack-capability-tasks`, `agentstack-hosted-vertical`, `agentstack-knowledge`, `agentstack-messaging`, `agentstack-openapi`, `agentstack-project-wallet`, `agentstack-services`, `agentstack-storefront-studio`, plus Claude-only **`agentstack-prefer`** (MCP-first router).

Legacy gen1 folders (`agentstack-8dna`, `agentstack-payments`, …) are retired.

## Plugin structure

```
.claude-plugin/
  plugin.json
  marketplace.json
commands/
skills/
agents/
scripts/
  device-login.mjs
  validate-plugin.mjs
MCP_QUICKSTART.md
```

## Requirements

- Claude Code 1.0.33+ (`claude --version`)

## Local development

From repo root:

```bash
claude --plugin-dir ./provided_plugins/claude-plugin
```

Skills appear under the `agentstack` namespace (e.g. `/agentstack:agentstack-data`). MCP is configured separately — see MCP_QUICKSTART.md.

## Documentation

- Plugin repo: [github.com/agentstacktech/claude-plugin](https://github.com/agentstacktech/claude-plugin)
- Capability matrix: [docs/plugins/CAPABILITY_MATRIX.md](https://github.com/agentstacktech/AgentStack/blob/master/docs/plugins/CAPABILITY_MATRIX.public.md)
- Plugins index: [docs/plugins/README.md](https://github.com/agentstacktech/AgentStack/blob/master/docs/plugins/README.md)

## Links

- [agentstack.tech](https://agentstack.tech)
- [GitHub](https://github.com/agentstacktech)

*Maintainers:* [TESTING_AND_CAPABILITIES.md](TESTING_AND_CAPABILITIES.md) · [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md)

MIT — see [LICENSE](LICENSE).
