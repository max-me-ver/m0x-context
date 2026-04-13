# m0x-context MCP Server

**Up-to-date documentation and code examples for any programming library, right in your AI coding assistant.**

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)

*Fork based on [Context7](https://github.com/upstash/context7).*

---

## Why m0x-context?

AI coding assistants often generate outdated code because they rely on old training data. **m0x-context** solves this by providing real-time access to current library documentation.

### The Problem
- ❌ Outdated code examples from year-old training data
- ❌ Hallucinated APIs that don't exist
- ❌ Generic answers for old package versions

### The Solution
- ✅ Current, version-specific documentation
- ✅ Real working code examples from official sources
- ✅ No hallucinations - actual API documentation

---

## Features

Context7 pulls up-to-date, version-specific documentation and code examples straight from the source — and this MCP server places them into your assistant’s context.

- **🔍 Library Search** - Find any programming library or framework
- **📚 Current Documentation** - Fetch up-to-date docs and code examples
- **🎯 Version-Specific** - Get documentation for specific library versions
- **🔌 MCP Protocol** - Works with any MCP-compatible AI assistant
- **🚀 Multiple Transports** - Supports both stdio and HTTP modes

```txt
Configure a Cloudflare Worker script to cache
JSON API responses for five minutes. use context7
```

```txt
Show me the Supabase auth API for email/password sign-up.
```

Context7 fetches up-to-date code examples and documentation right into your LLM's context. No tab-switching, no hallucinated APIs that don't exist, no outdated code generation.

---

Works in two modes:

- **CLI + Skills** — installs a skill that guides your agent to fetch docs using `ctx7` CLI commands (no MCP required)
- **MCP** — registers a Context7 MCP server so your agent can call documentation tools natively

## Installation

### Prerequisites

- Node.js 18 or higher
- pnpm (recommended) or npm

### Official Context7 setup (hosted)

Set up Context7 for your coding agents with a single command:

```bash
npx ctx7 setup
```

Authenticates via OAuth, generates an API key, and installs the appropriate skill. You can choose between CLI + Skills or MCP mode. Use `--cursor`, `--claude`, or `--opencode` to target a specific agent.

To configure manually, use the Context7 server URL `https://mcp.context7.com/mcp` with your MCP client and pass your API key via the `CONTEXT7_API_KEY` header.

**[Manual Installation / Other Clients →](https://context7.com/docs/resources/all-clients)**

### Self-hosted: this repository (m0x-context)

1. **Clone the repository**
```bash
git clone https://github.com/xlyres-00/m0x-context.git
cd m0x-context
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Build the packages**
```bash
pnpm build
```

4. **Run the MCP server**

**HTTP Mode:**
```bash
node packages/mcp/dist/index.js --transport http --port 8080
```

**stdio Mode (for direct MCP integration):**
```bash
node packages/mcp/dist/index.js --transport stdio
```

---

## Integration with AI Assistants

### LM Studio

Add to your LM Studio MCP configuration:

**studio mode:**
```json
{
  "mcpServers": {
    "m0x-context": {
      "command": "node",
      "args": ["/path/to/m0x-context/packages/mcp/dist/index.js", "--transport", "stdio"]
    }
  }
}
```

**HTTP mode:**
```json
{
  "mcpServers": {
    "m0x-context": {
      "url": "http://localhost:8080/mcp"
    }
  }
}
```

### Cursor

Add to `~/.cursor/mcp.json` or `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "m0x-context": {
      "command": "node",
      "args": ["/absolute/path/to/m0x-context/packages/mcp/dist/index.js", "--transport", "stdio"]
    }
  }
}
```

### Claude Code

```bash
claude mcp add m0x-context -- node /path/to/m0x-context/packages/mcp/dist/index.js --transport stdio
```

---

## Usage

Once integrated with your AI assistant, simply mention it in your prompts:

**Example prompts:**
```
How do I create middleware in Next.js? use m0x-context
```

```
Show me React useState hook examples. use m0x-context
```

```
Configure Cloudflare Worker with KV storage. use m0x-context
```

The AI will automatically:
1. Search for the relevant library
2. Fetch current documentation
3. Provide accurate, up-to-date code examples

---

## Important Tips

### Use library ID

If you already know exactly which library you want to use, add its Context7 library ID to your prompt. That way, the tools can skip the library-matching step and directly retrieve docs.

```txt
Implement basic authentication with Supabase. use library /supabase/supabase for API and docs.
```

The slash syntax tells the assistant exactly which library to load docs for.

### Specify a version

To get documentation for a specific library version, mention the version in your prompt:

```txt
How do I set up Next.js 14 middleware? use context7
```

Context7 will automatically match the appropriate version.

### Add a Rule

If you installed via `ctx7 setup`, a skill is configured automatically that triggers Context7 for library-related questions. To set up a rule manually instead, add one to your coding agent:

- **Cursor**: `Cursor Settings > Rules`
- **Claude Code**: `CLAUDE.md`
- Or the equivalent in your coding agent

**Example rule:**

```txt
Always use Context7 when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.
```

## Available Tools

### CLI commands (official `ctx7` CLI)

- `ctx7 library <name> <query>`: Searches the Context7 index by library name and returns matching libraries with their IDs.
- `ctx7 docs <libraryId> <query>`: Retrieves documentation for a library using a Context7-compatible library ID (e.g., `/mongodb/docs`, `/vercel/next.js`).

### MCP tools (this server)

- `resolve-library-id`: Resolves a general library name into a m0x-context-compatible library ID.
  - `query` (required): The user's question or task (used to rank results by relevance)
  - `libraryName` (required): The name of the library to search for
- `query-docs`: Retrieves documentation for a library using a m0x-context-compatible library ID.
  - `libraryId` (required): Exact library ID (e.g., `/mongodb/docs`, `/vercel/next.js`)
  - `query` (required): The question or task to get relevant documentation for

### `query-docs` details

**Parameters:**
- `libraryId` - m0x-context-compatible library ID (from `resolve-library-id`)
- `query` - Specific question about the library

**More documentation:**
- [CLI Reference](https://context7.com/docs/clients/cli) - Full CLI documentation
- [MCP Clients](https://context7.com/docs/resources/all-clients) - Manual MCP installation for 30+ clients
- [Adding Libraries](https://context7.com/docs/adding-libraries) - Submit your library to Context7
- [Troubleshooting](https://context7.com/docs/resources/troubleshooting) - Common issues and solutions
- [API Reference](https://context7.com/docs/api-guide) - REST API documentation
- [Developer Guide](https://context7.com/docs/resources/developer) - Run Context7 MCP locally

**Returns:**
- Current documentation
- Code examples
- Best practices

---

## Deploy (Docker)

See **[HOSTING.md](./HOSTING.md)** for building and running with Docker or Docker Compose (local or any cloud that supports containers).

**Quick start:**

```bash
docker compose up --build
```

Then open `http://localhost:8080/mcp` from your MCP client, or expose the same image on a VPS / PaaS with **Dockerfile** build.

Set `CONTEXT7_API_KEY` or comma-separated `CONTEXT7_API_KEYS` in the environment for higher limits and automatic rotation when a key hits rate limits.

**Smoke test after deploy:**

```bash
node test-http-mcp.js https://your-public-host.example.com
```

---

## Configuration

### Environment Variables

**`CONTEXT7_API_KEY`** (optional)
- API key for higher rate limits
- Set via environment or `--api-key` flag (stdio mode only)

**`CLIENT_IP_ENCRYPTION_KEY`** (optional)
- 64-character hex string for IP encryption
- Defaults to a standard key if not set

### Command-Line Options

**`--transport <stdio|http>`**
- Communication transport type
- Default: `stdio`

**`--port <number>`**
- Port for HTTP transport
- Default: `8080`

**`--api-key <key>`**
- API key for authentication (stdio mode only)

---

## Development

### Project Structure

```
m0x-context/
├── packages/
│   ├── mcp/           # MCP server implementation
│   ├── sdk/           # JavaScript/TypeScript SDK
│   ├── tools-ai-sdk/  # Vercel AI SDK integration
│   └── cli/           # CLI tools
├── docs/              # Documentation
└── public/            # Static assets
```

### Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm build:mcp
pnpm build:sdk

# Development mode (watch)
cd packages/mcp
pnpm dev
```

### Testing

```bash
# Run all tests
pnpm test

# Test specific package
pnpm test:sdk
```

---

## Supported Libraries

m0x-context works with thousands of libraries across different ecosystems:

- **Frontend:** React, Vue, Angular, Svelte, Next.js
- **Backend:** Express, NestJS, FastAPI, Django, Flask
- **Databases:** MongoDB, PostgreSQL, Supabase, Prisma
- **Cloud:** Cloudflare Workers, Vercel, AWS SDK, Azure
- **Build Tools:** Vite, Webpack, Rollup, esbuild
- **And many more...**

---

## How It Works

1. **AI Assistant** receives your coding question
2. **m0x-context** searches for the relevant library using `resolve-library-id`
3. **Documentation Retrieval** fetches current docs via `query-docs`
4. **AI Response** uses the fresh documentation to provide accurate answers

The server connects to external documentation APIs to retrieve real-time information, ensuring you always get the latest library documentation.

---

## Troubleshooting

### Server won't start
- Check Node.js version (18+)
- Ensure all dependencies are installed: `pnpm install`
- Verify the build completed: `pnpm build`

### AI assistant doesn't use the tools
- Verify MCP configuration is correct
- Restart your AI assistant
- Try explicitly mentioning "use m0x-context" in prompts

### Rate limiting
- The free tier has rate limits
- Consider setting up an API key for higher limits

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Built with [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- Uses the Context7 documentation API as data source
- Inspired by the need for current, accurate AI coding assistance

---

## Links

- **Issues:** [Report a bug](https://github.com/yourusername/m0x-context/issues)
- **Discussions:** [Join the conversation](https://github.com/yourusername/m0x-context/discussions)

---

Made with ❤️ by m0x
