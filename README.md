# AgentStack — Full Backend Ecosystem (Claude Code Plugin)

Plugin for [Claude Code](https://code.claude.com) that adds **AgentStack** as a full backend ecosystem: 8DNA hierarchical data, Rules Engine, Buffs (trials/subscriptions), Payments, and **60+ MCP tools** for Projects, Auth, Scheduler, Analytics, Webhooks, Notifications, and Wallets.

JSON-based data store (8DNA: JSON+ with built-in variants, e.g. A/B tests) and server-side logic without boilerplate.

## What this plugin includes

| Component | Description |
|-----------|-------------|
| **Skills** | 8DNA, Projects, Rules Engine, **Assets**, **RBAC**, **Buffs** (trials, subscriptions), **Payments** (payments, wallets), **Auth** (login, profile) — so the agent knows when and how to use AgentStack. |
| **MCP setup guide** | How to connect Claude Code to the AgentStack MCP. |

## Quick Start

1. **Get an API key**  
   Create an anonymous project (no signup) or use your existing project key. See [MCP_QUICKSTART.md](MCP_QUICKSTART.md).

2. **Add MCP in Claude Code**  
   Run once (replace with your API key):
   ```bash
   claude mcp add --transport http agentstack https://agentstack.tech/mcp --header "X-API-Key: YOUR_API_KEY"
   ```
   Full steps are in [MCP_QUICKSTART.md](MCP_QUICKSTART.md).

3. **Use in chat**  
   Ask Claude Code to create a project, list projects, get stats, or use other AgentStack tools. The agent will use the MCP tools automatically.

## AgentStack vs “just a database”

| Capability | AgentStack | Typical DB-only (e.g. Supabase-style) |
|------------|------------|----------------------------------------|
| **Data model** | 8DNA (JSON+): structured JSON; key-value store (`project.data`, `user.data`); built-in support for variants (e.g. A/B tests) | Flat tables, relations |
| **Server logic** | Rules Engine (when/do, no code) | Triggers / custom backend |
| **Trials & subscriptions** | Buffs (temporary/persistent effects) | Custom logic or 3rd party |
| **Payments** | Built-in gateway (Stripe, Tochka, etc.) | Separate integration |
| **API surface** | 60+ MCP tools + /api/projects, /api/logic, /api/neural, /api/buffs, etc. | CRUD + auth |

AgentStack is a full backend platform with a JSON-based data store (8DNA = JSON+ with built-in variants, e.g. A/B tests); this plugin brings it into Claude Code so the AI can create projects, manage keys, use the Rules Engine, and work with the data store.

## Plugin structure

```
.claude-plugin/plugin.json   # Manifest
MCP_QUICKSTART.md            # Get API key + connect Claude Code
skills/
  agentstack-8dna/           # 8DNA (JSON+, data store, variants/A/B)
  agentstack-projects/       # Projects & MCP tools
  agentstack-rules-engine/   # Rules Engine usage
  agentstack-assets/         # Assets (trading, games, inventory)
  agentstack-rbac/            # RBAC (roles, permissions)
  agentstack-buffs/            # Buffs (trials, subscriptions, effects)
  agentstack-payments/         # Payments & wallets
  agentstack-auth/              # Auth (login, register, profile)
```

## Requirements

- Claude Code version 1.0.33 or later (run `claude --version` to check).

## Local development

To load the plugin from the repo without installing: `claude --plugin-dir ./provided_plugins/claude-plugin` (from repo root) or `claude --plugin-dir .` (from this folder). Skills will appear under the `agentstack` namespace (e.g. `/agentstack:agentstack-8dna`). You still need to add the MCP server separately (see MCP_QUICKSTART.md).

## Documentation

- **This plugin:** [github.com/agentstacktech/claude-plugin](https://github.com/agentstacktech/claude-plugin)
- **Quick Start:** [MCP_QUICKSTART.md](MCP_QUICKSTART.md) — API key and MCP setup in a few steps.
- **Full MCP tool list:** [MCP_SERVER_CAPABILITIES](https://github.com/agentstack/agentstack/blob/main/docs/MCP_SERVER_CAPABILITIES.md) in the AgentStack repo.
- **Plugins index (Cursor, Claude, GPT, VS Code):** [docs/plugins/README.md](https://github.com/agentstack/agentstack/blob/main/docs/plugins/README.md).

*For maintainers:* [TESTING_AND_CAPABILITIES.md](TESTING_AND_CAPABILITIES.md).

## License

MIT. See [LICENSE](LICENSE).
