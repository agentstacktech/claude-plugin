# AgentStack MCP — Quick Start (Claude Code)

Get the AgentStack MCP server working in Claude Code in under 2 minutes.

**Flow:** Create an anonymous project (no account) → get API key → add key in Claude Code → use 60+ tools in chat. The MCP server allows `GET /mcp/tools` and `projects.create_project_anonymous` **without X-API-Key** so you can get a key before configuring Claude.

## Step 1: Get an API key

**Option A — No account (try first):**

1. Create an anonymous project to get keys (no signup). From a terminal:

```bash
curl -X POST https://agentstack.tech/mcp/tools/projects.create_project_anonymous \
  -H "Content-Type: application/json" \
  -d '{"params": {"name": "My Claude Project"}}'
```

2. From the response, copy `user_api_key` (or `api_key` / `project_api_key`) — use it as your API key below.

**Option B — With account:**

1. Sign in at [AgentStack](https://agentstack.tech) and create a project.
2. In the project settings, create an API key.
3. Use that key as `X-API-Key` below.

## Step 2: Add MCP server in Claude Code

Claude Code connects to remote MCP servers via HTTP. Run once (replace `YOUR_API_KEY_HERE` with your key):

```bash
claude mcp add --transport http agentstack https://agentstack.tech/mcp --header "X-API-Key: YOUR_API_KEY_HERE"
```

Options (`--transport`, `--header`) must come **before** the server name.

To use a different scope (e.g. project-level), add `--scope project`. See [Claude Code MCP docs](https://code.claude.com/docs/en/mcp) for details.

## Step 3: Use in chat

In Claude Code you can say:

- "Create a new project called Test via AgentStack MCP"
- "List my AgentStack projects"
- "Get stats for project 1025"

The agent will call tools like `projects.create_project_anonymous`, `projects.get_projects`, `projects.get_stats`, etc.

## If MCP doesn’t work

- **Check API key** — valid key, no extra spaces in the header.
- **Check URL** — use `https://agentstack.tech/mcp` in the `claude mcp add` command.
- Restart Claude Code after changing MCP config.

## Full tool list and docs

For all 60+ tools (Auth, Payments, Projects, Scheduler, Analytics, Rules, Webhooks, Notifications, Wallets), see the main docs:

- [MCP Server Capabilities](https://github.com/agentstacktech/AgentStack/blob/main/docs/MCP_SERVER_CAPABILITIES.md) (in the AgentStack repo)

