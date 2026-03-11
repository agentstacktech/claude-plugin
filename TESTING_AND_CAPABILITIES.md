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

1. **Get an API key**  
   - Via curl (anonymous project):
     ```bash
     curl -X POST https://agentstack.tech/mcp/tools/projects.create_project_anonymous \
       -H "Content-Type: application/json" \
       -d '{"tool": "projects.create_project_anonymous", "params": {"name": "Test"}}'
     ```
   - From the response take `project_api_key` or `user_api_key`.

2. **Add MCP server in Claude Code**  
   ```bash
   claude mcp add --transport http agentstack https://agentstack.tech/mcp --header "X-API-Key: YOUR_KEY"
   ```

3. Restart Claude Code if needed.

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

- **Skills** are picked up by Claude Code and available under the plugin namespace (e.g. `/agentstack:agentstack-8dna`, `/agentstack:agentstack-projects`, `/agentstack:agentstack-rules-engine`). Run `/help` to see the list. The agent uses them by task context (8DNA, projects, Rules Engine).

### 5. Common issues

| Symptom | What to check |
|--------|----------------|
| Agent does not call MCP | MCP added via `claude mcp add`, correct URL and `X-API-Key` header, Claude Code restarted if needed. |
| 401 / 403 on call | Key is valid, not expired; some operations require a subscription (e.g. Professional for add_user). |
| "Tool not found" | Tool name matches documentation (e.g. `projects.create_project_anonymous`). Check list: `GET https://agentstack.tech/mcp/tools` (with `X-API-Key` header). |
| Skills not visible | Plugin is loaded (`--plugin-dir` or installed from marketplace). Check `/help` and namespace (e.g. `agentstack:agentstack-8dna`). |

---

## Plugin capabilities

### What the plugin includes

| Component | Purpose |
|-----------|------------|
| **Manifest** (`.claude-plugin/plugin.json`) | Name, description, keywords for Claude Code and marketplace. |
| **Skills** (3) | Teach the agent *when* and *how* to use AgentStack: 8DNA, projects, Rules Engine. |
| **Documentation** | README, MCP_QUICKSTART, this file. |

### Capabilities via MCP (after MCP setup)

The plugin does not call the backend itself — the **AgentStack MCP server** does. After adding MCP in Claude Code the agent gets access to tools such as:

- **Projects:** create (including anonymous), list, details, update, delete, stats, users, settings, activity, API keys, attach anonymous project to user.
- **Logic and rules:** create/update/delete rules, list, execute, processors, commands.
- **Buffs:** create, apply, extend, rollback, cancel, list active, effective limits, temporary and persistent effects.
- **Payments:** create, status, refund, list transactions, balance.
- **Auth:** quick sign-in, create user, assign role, profile.
- **Scheduler:** create/cancel/get/list tasks, etc.
- **Analytics:** usage, metrics.
- **API keys:** create, list, revoke, etc.
- **Webhooks, notifications, wallets** — as implemented on backend and in MCP.

Full tool list and parameters: **MCP_SERVER_CAPABILITIES** in the AgentStack repo or `GET https://agentstack.tech/mcp/tools` (with `X-API-Key`).

### Skills capabilities

- **agentstack-8dna:** design and query data with hierarchy (`parent_uuid`) and evolution (`generation`), work with `data`/`config`/`protected` structure and genetic coding.
- **agentstack-projects:** create and manage projects and API keys via MCP, anonymous projects, attach to user.
- **agentstack-rules-engine:** configure server logic without code (when/do), use Logic Engine and rules via MCP, link with buffs and commands.

### Summary

- **Testing:** install plugin → configure MCP with API key → in chat ask to create/list projects and verify MCP calls; optionally verify Skills from behavior.
- **Capabilities:** access to 60+ AgentStack MCP tools (projects, logic, buffs, payments, auth, scheduler, analytics, etc.), plus three Skills for consistent use of 8DNA, projects, and Rules Engine.
