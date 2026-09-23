# Claude plugin verification checklist

**Version:** 0.4.18 · **Gene:** `repo.plugins.claude.gen1`

## Pre-publish (monorepo)

- [ ] `node provided_plugins/scripts/audit-claude-plugin.mjs` passes
- [ ] `node provided_plugins/scripts/sync-plugin-kernel.mjs --check` (Claude kernel vendor)
- [ ] No root `claude-plugin/marketplace.json`
- [ ] `.claude-plugin/marketplace.json` with `source: "./"`
- [ ] `plugin.json` version matches platform line (no unprompted bump)
- [ ] Skill leak scan: no `~/.cursor`, `rules/*.mdc`, `docs/operations/`

## Local Claude CLI

- [ ] `claude plugin validate .` passes
- [ ] `claude plugin validate . --strict` passes (release)
- [ ] `node scripts/device-login.mjs --help` loads
- [ ] `node scripts/validate-plugin.mjs` passes

## Install smoke

- [ ] `claude plugin marketplace add …` / `--plugin-dir` works
- [ ] `/reload-plugins` — 30 skills visible (`agentstack-prefer` + 29 mirror)
- [ ] `/agentstack:login` → `claude mcp list` shows agentstack
- [ ] `/mcp` — tool available in chat
- [ ] Chat smoke: `projects.get_projects` or `auth.get_profile`

## Intent smoke (manual)

- [ ] "store user preferences" → data skill / `projects.patch_data`
- [ ] "create a payment" → commerce skill
- [ ] "publish static site" → hosting skill
- [ ] "list digital goods" → commerce-assets skill
- [ ] "support ticket" → support skill

## Post-publish

- [ ] Push to `github.com/agentstacktech/claude-plugin`
- [ ] Community marketplace submit (in-app form)
- [ ] Verify install from `agentstacktech/claude-plugin`
- [ ] Update [CLAUDE_PLUGIN_POST_RELEASE_CHECKLIST.md](../../docs/plugins/CLAUDE_PLUGIN_POST_RELEASE_CHECKLIST.md)
