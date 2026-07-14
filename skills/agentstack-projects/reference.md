# AgentStack Claude Skill Routing Reference

Use the generated capability matrix as the source of truth:

- `docs/MCP_CAPABILITY_MATRIX.md`
- Runtime discovery: `GET https://agentstack.tech/mcp/actions`

Decision-first flow:

1. Match the user intent to a domain skill.
2. Confirm the exact action name and required cap in the live catalog.
3. Prefer read/preview actions before mutations.
4. For destructive or money-moving actions, ask for explicit confirmation.
5. Never invent project, user, stats, payment, or support data. Answer from tool results only.

Current high-value domains include `agents.*`, `ai_builder.*`, `generation.*`, `social.support.*`, `storage.*`, `data_access.*`, `rag.*`, `payments.*`, `buffs.*`, `logic.*`, `projects.*`, and `apikeys.*`.
