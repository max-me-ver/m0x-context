#!/usr/bin/env node

/**
 * Smoke-test an HTTP-deployed m0x-context MCP server.
 * Usage: node test-http-mcp.js https://your-host.example.com
 *        node test-http-mcp.js http://localhost:8080
 */

const base = process.argv[2] || "http://127.0.0.1:8080";
const origin = base.replace(/\/$/, "");
const MCP_ENDPOINT = `${origin}/mcp`;
const PING_ENDPOINT = `${origin}/ping`;

async function run() {
  console.log("Testing m0x-context (HTTP)...");
  console.log(`Base URL: ${origin}\n`);

  console.log("1) GET /ping");
  try {
    const pingResponse = await fetch(PING_ENDPOINT);
    const pingText = await pingResponse.text();
    console.log(`   ${pingResponse.status} ${pingText.slice(0, 200)}\n`);
  } catch (error) {
    console.error(`   Failed: ${error.message}`);
    console.error("   Is the server running and reachable?\n");
    process.exit(1);
  }

  console.log("2) MCP tools/list");
  try {
    const toolsResponse = await fetch(MCP_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/list",
      }),
    });
    const toolsData = await toolsResponse.json();
    const n = toolsData.result?.tools?.length ?? 0;
    console.log(`   tools: ${n}`);
    toolsData.result?.tools?.forEach((t) => console.log(`   - ${t.name}`));
    console.log();
  } catch (error) {
    console.error(`   Failed: ${error.message}\n`);
  }

  console.log("Done. Use this URL in your MCP client:");
  console.log(`   ${MCP_ENDPOINT}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
