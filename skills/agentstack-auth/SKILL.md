---
name: agentstack-auth
description: Handles authentication and profile management in AgentStack via MCP (auth.*). Use when the user asks to login, sign in, register, create user, get or update profile, session, or identity. For assigning roles use skill agentstack-rbac.
disable-model-invocation: false
---

# AgentStack Auth — Login, Register, Profile

Enables **authentication** and **profile** management via MCP tools under `auth.*`: sign in, register, get and update profile. Role assignment is covered by the **agentstack-rbac** skill (auth.assign_role and projects.*).

## When to use

- User asks to "login", "sign in", "register", "create user", or "get/update profile".
- User needs to verify session or identity (who is the current user).
- For assigning or changing **roles**, use skill **agentstack-rbac** instead.

## Why auth matters

- **Single entry point:** quick_auth (or login) returns token and user info; no custom auth tables.
- **User creation:** create_user (register) for new accounts.
- **Profile:** get_profile and update_profile for display name and other profile data without custom user table.

## Capabilities (MCP tools)

| Tool | Purpose |
|------|--------|
| `auth.login` | Sign in with email and password. Returns access token and user info. |
| `auth.register` | Register a new user (email, password, optional display_name). |
| `auth.get_profile` | Get current user profile. |
| `auth.update_profile` | Update profile (e.g. display_name). |

**Roles:** Assigning roles to users is done via **agentstack-rbac** (auth.assign_role, projects.update_user_role, projects.add_user). Use that skill when the user asks about roles or permissions.

For full parameters, see **MCP_CAPABILITY_MATRIX** (repo docs). Use the tool names as registered in `GET /mcp/actions`.

## Instructions

1. **Sign in:** Use `auth.login` with email and password; use returned token for subsequent requests.
2. **Register:** Use `auth.register` with email, password, optional display_name.
3. **Profile:** Use `auth.get_profile` to read; use `auth.update_profile` to change profile fields.
4. **Roles and permissions:** Use skill **agentstack-rbac** (assign role, list users by role, add/remove from project).

## Examples (natural language → tool)

- "Log in as user@example.com" → `auth.login` with email and password.
- "Register new user with email X" → `auth.register` with email, password, optional display_name.
- "Get my profile" → `auth.get_profile`.
- "Update my display name to Y" → `auth.update_profile` with new display_name (or equivalent fields).

## References

- **MCP_CAPABILITY_MATRIX** — auth.* tools and parameters. See repo docs/MCP_CAPABILITY_MATRIX.md.
- **agentstack-rbac** — for roles and permissions (assign_role, project membership, list by role).
- **MCP_QUICKSTART.md** (plugin root) — how to get an API key and add MCP in Claude Code.
