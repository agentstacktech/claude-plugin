# Claude Code Marketplace Notes

AgentStack ships as one Claude Code plugin with **29 gen3 mirrored skills**, **1 prefer router skill**, **7 commands**, and **3 agents**.

## Marketplace file

Official layout: [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json) at the plugin root (not a root-level `marketplace.json`).

Plugin manifest: [`.claude-plugin/plugin.json`](.claude-plugin/plugin.json) — version SoT.

## Validate locally

```bash
claude plugin validate .
claude plugin validate . --strict
node scripts/validate-plugin.mjs
```

## Install test

```bash
claude plugin marketplace add ./provided_plugins/claude-plugin
claude plugin install agentstack@agentstack-plugins
claude plugin list
/reload-plugins
/mcp
```

For GitHub distribution, users add the repo:

```bash
claude plugin marketplace add agentstacktech/claude-plugin
claude plugin install agentstack@agentstack-plugins
```

## Community marketplace

Submit via the in-app Claude Code community plugin form after:

1. `claude plugin validate . --strict`
2. `node provided_plugins/scripts/audit-claude-plugin.mjs` (from monorepo)
3. Push to [github.com/agentstacktech/claude-plugin](https://github.com/agentstacktech/claude-plugin)

See monorepo [docs/plugins/CLAUDE_PLUGIN_PUBLISH.md](../../docs/plugins/CLAUDE_PLUGIN_PUBLISH.md).

## Release checklist

- Bump `.claude-plugin/plugin.json` version (Lance order only) and sync CHANGELOG
- Run `/reload-plugins` after local install
- Run `/agentstack:login` → `claude mcp list` → `/mcp`
- Confirm **30 skills** (29 mirror + prefer) under the `agentstack` namespace
