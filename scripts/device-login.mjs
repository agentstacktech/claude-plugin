#!/usr/bin/env node
/**
 * RFC 8628 Device Code login for Claude Code plugin.
 * Prints `claude mcp add` command after approval (no ~/.cursor writer).
 * @see repo.plugins.oauth_device_code.gen1
 */
import { exec } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { platform } from 'node:os';
import {
  pollDeviceToken,
  loadConfidentialClient,
  deviceCodeActivateUrl,
} from './lib/plugin-kernel/deviceCodeClient.mjs';
import { resolveScopePreset, SCOPE_PRESETS } from './lib/plugin-kernel/oauthScopePresets.mjs';
import { MCP_RECOVERY_HINTS } from './lib/plugin-kernel/canonicalCopy.mjs';

const BASE_URL = process.env.AGENTSTACK_BASE_URL || 'https://agentstack.tech';
const CLIENT_ID = 'claude-plugin';
const MCP_URL = `${BASE_URL.replace(/\/$/, '')}/mcp`;

function parseArgs(argv) {
  const out = { scopes: resolveScopePreset('full'), headless: false };
  for (const a of argv.slice(2)) {
    if (a === '--help' || a === '-h') {
      out.help = true;
    } else if (a === '--headless') {
      out.headless = true;
    } else if (a.startsWith('--scope-preset=')) {
      out.scopes = resolveScopePreset(a.slice('--scope-preset='.length));
    } else if (a.startsWith('--scopes=')) {
      out.scopes = a.slice('--scopes='.length).replace(/^"|"$/g, '');
    }
  }
  return out;
}

function printHelp() {
  console.log(`Usage: node scripts/device-login.mjs [options]

OAuth Device Code login for AgentStack Claude Code plugin.

Options:
  --help                 Show help
  --headless             Do not open browser
  --scope-preset=NAME    ${Object.keys(SCOPE_PRESETS).join(' | ')} (default: full)
  --scopes="a b c"       Explicit scopes

After approval, run the printed claude mcp add command once.
Fallback: MCP_QUICKSTART.md (X-API-Key).
`);
}

function openBrowser(url) {
  const cmd =
    platform() === 'win32'
      ? `start "" "${url}"`
      : platform() === 'darwin'
        ? `open "${url}"`
        : `xdg-open "${url}"`;
  try {
    exec(cmd);
  } catch {
    /* best effort */
  }
}

async function authorize(scopes, traceId) {
  const { clientId, clientSecret, source } = await loadConfidentialClient({
    builtinClientId: CLIENT_ID,
  });
  const params = { client_id: clientId, scope: scopes };
  if (clientSecret) params.client_secret = clientSecret;
  else if (source === 'builtin') {
    console.warn('  Using public client_id=claude-plugin (RFC 8628; no client_secret).');
  }
  const res = await fetch(`${BASE_URL}/api/oauth2/device/authorize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Trace-Id': traceId,
    },
    body: new URLSearchParams(params),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`device/authorize failed: HTTP ${res.status} — ${body} (trace ${traceId})`);
  }
  const json = await res.json();
  json.__client_id = clientId;
  json.__client_secret = clientSecret;
  return json;
}

function printMcpAddCommand(accessToken) {
  console.log('\nConfigure Claude Code MCP (run once):\n');
  console.log(
    `claude mcp add agentstack --transport http ${MCP_URL} ` +
      `--header "Authorization: Bearer ${accessToken}" ` +
      `--header "Content-Type: application/json"`,
  );
  console.log('\nVerify: claude mcp list\n/mcp\n');
}

async function main() {
  const { scopes, headless, help } = parseArgs(process.argv);
  if (help) {
    printHelp();
    process.exit(0);
  }

  const traceId = randomUUID();
  console.log('\nRequesting device code from AgentStack...');
  console.log('  Trace: ' + traceId);

  const init = await authorize(scopes, traceId);
  const activateLink = deviceCodeActivateUrl(BASE_URL, init.user_code);
  console.log('\n  Open: ' + activateLink);
  console.log('  Code: ' + init.user_code + '\n');

  if (!headless) openBrowser(activateLink);

  const token = await pollDeviceToken({
    tokenUrl: `${BASE_URL}/api/oauth2/token`,
    clientId: init.__client_id || CLIENT_ID,
    deviceCode: init.device_code,
    intervalSec: init.interval,
    expiresInSec: init.expires_in,
    traceId,
    clientSecret: init.__client_secret || null,
  });

  const preview = String(token.access_token || '').slice(0, 8);
  console.log(`\n  Approved. Token prefix: ${preview}…`);
  printMcpAddCommand(token.access_token);
  console.log('  Smoke: ask Claude to run auth.get_profile via agentstack.execute.\n');
}

main().catch((err) => {
  console.error('\nAgentStack device login failed:\n  ' + err.message);
  if (err.message?.includes('authorization_pending')) {
    console.error('  ' + (MCP_RECOVERY_HINTS.mcp_sync_heavy_limit || 'Keep polling — not an error.'));
  }
  console.error('\nFallback: MCP_QUICKSTART.md (anonymous project + X-API-Key).\n');
  process.exit(1);
});
