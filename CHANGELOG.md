# Changelog

All notable changes to the AgentStack Claude Code plugin.

## [0.4.18] — 2026-09-23

### Fixed

- Marketplace layout: `.claude-plugin/marketplace.json` with `source: "./"` (official Claude Code schema).
- Removed invalid root `marketplace.json`.

### Added

- `scripts/validate-plugin.mjs` and `scripts/device-login.mjs` (OAuth Device Code).
- Claude-only skill `agentstack-prefer` (MCP-first router).
- Commands: status, init, diagnose, discover, safe-cycle.
- Agents: architect, migrator, tenant-builder.
- `VERIFICATION_CHECKLIST.md`.

### Changed

- 29 gen3 domain skills synced from Cursor SoT (adaptSkillForClaude leak fixes).
- Documentation refresh (README, TESTING, MARKETPLACE, MCP_QUICKSTART).
- Version SoT: `plugin.json` only (no duplicate marketplace version).
- Manifest copy SoT in `canonicalCopy.mjs` (`PLUGIN_MANIFEST_CLAUDE`, `MARKETPLACE_ENTRY_CLAUDE`); validate-plugin enforces parity.
- `formatClaudeMcpAddCommand` shared helper; status command uses `projects.get_projects` batch (no Cursor template placeholders).

## [0.4.0] — 2026-02-23

- Version aligned to global AgentStack 0.4.0.

## [0.1.0] — 2026-02-23

- Initial release: skills, MCP_QUICKSTART, README, TESTING.
