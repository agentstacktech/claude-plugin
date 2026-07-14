# Claude Code Marketplace Notes

AgentStack ships as one Claude Code plugin with eight decision-first skills and an MCP setup guide.

## Marketplace File

Use `marketplace.json` at this folder root. It intentionally uses the simple string `source` form (`"."`) for compatibility with Claude Code clients that may not yet accept object-style marketplace sources.

## Install Test

```bash
claude plugin marketplace add agentstack ./marketplace.json
claude plugin install agentstack@agentstack
claude plugin list
```

For remote distribution, host this folder in git and replace `source` with the hosted plugin path after testing against the target Claude Code release.

## Release Checklist

- Bump `.claude-plugin/plugin.json` and `marketplace.json` versions together.
- Run `/reload-plugins` after local install.
- Run `/mcp` and `claude mcp list` after following `MCP_QUICKSTART.md`.
- Confirm the eight skills appear under the AgentStack namespace.
