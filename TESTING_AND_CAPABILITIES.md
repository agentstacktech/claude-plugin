# AgentStack plugin (Claude Code) — testing and capabilities

## Verify the plugin

### 1. Install

**Marketplace (after publish):** Claude Code → Plugins → search "AgentStack" → Install.

**Local:**

```bash
claude --plugin-dir ./provided_plugins/claude-plugin
```

### 2. Structural validate

```bash
node provided_plugins/claude-plugin/scripts/validate-plugin.mjs
claude plugin validate ./provided_plugins/claude-plugin --strict   # optional, needs CLI
```

Monorepo gate:

```bash
node provided_plugins/scripts/audit-claude-plugin.mjs
```

### 3. MCP connection (required for tool calls)

1. **OAuth (preferred):** `/agentstack:login` or `node scripts/device-login.mjs --scope-preset=full`
2. Run printed `claude mcp add agentstack …`
3. Verify: `claude mcp list` and `/mcp`

**API key fallback:** see [MCP_QUICKSTART.md](MCP_QUICKSTART.md).

### 4. Skills namespace

After `/reload-plugins`, expect **30 skills** (29 gen3 mirror + `agentstack-prefer`) under namespace `agentstack`.

### 5. Domain smoke matrix

| Domain | Example prompt | Expected MCP domain |
|--------|----------------|---------------------|
| Projects | "List my projects" | `projects.*` |
| Data | "Store config at config.theme" | `projects.patch_data` |
| Logic | "Create a signup rule" | `logic.*` |
| Hosting | "Publish my static site" | `hosting.*` |
| Commerce | "Create a payment" | `payments.*` |
| Support | "Open support channel" | `social.support.*` |

### 6. Commands smoke

| Command | Purpose |
|---------|---------|
| `/agentstack:login` | Device Code + MCP setup |
| `/agentstack:status` | auth.get_profile smoke |
| `/agentstack:init` | First-time bootstrap |
| `/agentstack:diagnose` | Health + discovery table |
| `/agentstack:discover` | Intent → actions |
| `/agentstack:safe-cycle` | generation.* tenant flow |

## Artifact reference

| Artifact | Role |
|----------|------|
| `.claude-plugin/plugin.json` | Manifest (version SoT) |
| `.claude-plugin/marketplace.json` | Marketplace index |
| `skills/*/SKILL.md` | Domain routing (live catalog) |
| `skills/agentstack-prefer/SKILL.md` | MCP-first router |
| `commands/*.md` | Slash command playbooks |
| `agents/*.md` | Long-running presets |
| `scripts/device-login.mjs` | OAuth Device Code helper |

## Intent smoke (manual)

From Cursor intent eval — verify routing in chat:

1. "store user preferences" → `projects.patch_data`
2. "create a payment" → `payments.*`
3. "publish static site" → `hosting.*`
4. "list digital goods" → commerce-assets skill
5. "support ticket" → support skill

## Monorepo CI

```bash
node provided_plugins/scripts/validate-all-plugins.mjs
node provided_plugins/scripts/sync-claude-skill-stubs.mjs --check
node provided_plugins/scripts/check-claude-skills-parity.mjs --strict
```
