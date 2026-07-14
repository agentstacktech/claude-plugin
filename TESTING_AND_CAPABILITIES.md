# AgentStack plugin (Claude Code) — testing and capabilities

## How to verify the plugin works

### 1. Install the plugin

**Option A: from marketplace (after publish)**  
- Claude Code → Plugin manager / Discover → search "AgentStack" → Install.

**Option B: locally (before publish)**  
- Run with plugin directory:
  ```bash
  claude --plugin-dir ./provided_plugins/claude-plugin
  ```
  Or copy the plugin to the directory Claude Code loads plugins from (see [Claude Code — Plugins](https://code.claude.com/docs/en/plugins)).

### 2. MCP connection (required for calling tools)

The plugin provides Skills, but **calls to projects, logic, buffs, etc. go through MCP**. Without MCP configured, tools will not be called.

1. **Preferred: OAuth Device Code**  
   Run `/agentstack:login`, approve in the browser, then add MCP with the returned Bearer token:
   ```bash
   claude mcp add agentstack --transport http https://agentstack.tech/mcp \
     --header "Authorization: Bearer <access_token>" \
     --header "Content-Type: application/json"
   ```

2. **Fallback: API key**  
   Create an anonymous project/API key and configure:
   ```bash
   claude mcp add agentstack --transport http https://agentstack.tech/mcp \
     --header "X-API-Key: YOUR_KEY" \
     --header "Content-Type: application/json"
   ```

3. Verify:
   ```bash
   claude mcp list
   /mcp
   ```

4. Reload plugins after local edits:
   ```text
   /reload-plugins
   ```

Details: [MCP_QUICKSTART.md](MCP_QUICKSTART.md).

### 3. Testing in chat

In Claude Code chat ask the agent:

- "Create a project in AgentStack named Test Project"  
  → Expected: call to `projects.create_project_anonymous` (or `projects.create_project` when authenticated).
- "Show my AgentStack projects"  
  → Expected: `projects.get_projects`.
- "Get stats for project &lt;project_id&gt;"  
  → Expected: `projects.get_stats`.

If the agent calls MCP tools and returns a sensible answer — the plugin and MCP are working.

### 4. Checking Skills

- **Skills** are picked up by Claude Code and available under the plugin namespace (e.g. `/agentstack:agentstack-8dna`, `/agentstack:agentstack-projects`, `/agentstack:agentstack-rules-engine`, `/agentstack:agentstack-payments`, `/agentstack:agentstack-auth`). Run `/help` and `/reload-plugins` after local edits. The plugin ships 8 skills.

### 5. Common issues

| Symptom | What to check |
|--------|----------------|
| Agent does not call MCP | MCP added via `claude mcp add`, correct URL and `Authorization` or `X-API-Key` header, `claude mcp list` shows `agentstack`. |
| 401 / 403 on call | Key is valid, not expired; some operations require a subscription (e.g. Professional for add_user). |
| "Tool not found" | Tool name matches `docs/MCP_CAPABILITY_MATRIX.md` or `GET https://agentstack.tech/mcp/actions`. |
| Skills not visible | Plugin is loaded (`--plugin-dir` or installed from marketplace). Run `/reload-plugins`; check `/help` and namespace (e.g. `/agentstack:agentstack-8dna`). |

---

## Plugin capabilities

### What the plugin includes

| Component | Purpose |
|-----------|------------|
| **Manifest** (`.claude-plugin/plugin.json`) | Name, description, keywords for Claude Code and marketplace. |
| **Skills** (8) | Teach the agent *when* and *how* to use AgentStack: 8DNA, projects, Rules Engine, auth, RBAC, payments, buffs, assets. |
| **Commands** (`commands/agentstack-login.md`) | Device Code login and Claude MCP setup instructions. |
| **Documentation** | README, MCP_QUICKSTART, this file. |

### Capabilities via MCP (after MCP setup)

The plugin does not call the backend itself — the **AgentStack MCP server** does. After adding MCP in Claude Code the agent gets access to tools such as:

- **Projects:** create (including anonymous), list, details, update, delete, stats, users, settings, activity, API keys, attach anonymous project to user.
- **Logic and rules:** create/update/delete rules, list, execute, processors, commands.
- **Buffs:** create, apply, extend, rollback, cancel, list active, effective limits, temporary and persistent effects.
- **Payments:** create, get, refund, list transactions, balance.
- **Auth:** login, register, assign role, profile.
- **Scheduler:** create/cancel/get/list tasks, etc.
- **Analytics:** usage, metrics.
- **API keys:** create, list, delete, etc.
- **Webhooks, notifications, wallets** — as implemented on backend and in MCP.

Full tool list and parameters: generated **MCP_CAPABILITY_MATRIX** in the AgentStack repo or `GET https://agentstack.tech/mcp/actions`.

### Skills capabilities

- **agentstack-8dna:** design and query data with hierarchy (`parent_uuid`) and evolution (`generation`), work with `data`/`config`/`protected` structure and genetic coding.
- **agentstack-projects:** create and manage projects and API keys via MCP, anonymous projects, attach to user.
- **agentstack-rules-engine:** configure server logic without code (when/do), use Logic Engine and rules via MCP, link with buffs and commands.
- **agentstack-auth:** login, register, profile, session.
- **agentstack-rbac:** roles, permissions, membership.
- **agentstack-payments:** payments, refunds, balance, transactions.
- **agentstack-buffs:** trials, subscriptions, temporary/persistent effects.
- **agentstack-assets:** assets, inventory, digital goods.

### Summary

- **Testing:** install plugin → run `/reload-plugins` → configure MCP via Device Code or API key → verify `claude mcp list` and `/mcp` → ask to create/list projects and verify MCP calls.
- **Capabilities:** access to the live AgentStack MCP action catalog (projects, logic, buffs, payments, auth, scheduler, analytics, agents, storage, support, etc.), plus eight Skills for consistent use of 8DNA, projects, Rules Engine, auth, RBAC, payments, buffs, and assets.

## Latest Local Smoke Snapshot

2026-05-11:

- `node provided_plugins/scripts/validate-all-plugins.mjs` — passed with 3 warnings for Cursor placeholder screenshots.
- Claude manifest and eight-skill count were checked by the shared validator.
- Manual runtime checks still require Claude Code: `/reload-plugins`, `/agentstack:login`, `claude mcp list`, and `/mcp`.
