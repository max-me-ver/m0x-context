# Hosting m0x-context (Docker)

One **Dockerfile** at the repo root builds and runs the MCP HTTP server. Works the same on your laptop, a VPS, Railway (choose **Dockerfile** as the build method), Fly.io, AWS, etc.

## Requirements

- Docker (and Docker Compose for the commands below)
- Optional: `CONTEXT7_API_KEY` or comma-separated `CONTEXT7_API_KEYS` for higher rate limits and rotation

## Local production-like run

From the repository root:

```bash
docker compose up --build
```

- HTTP MCP: `http://localhost:8080/mcp`
- Health: `http://localhost:8080/ping` (should return JSON with `"message":"pong"` or similar)

Put keys in a `.env` file next to `docker-compose.yml`:

```env
CONTEXT7_API_KEY=ctx7sk-your-key
# or
# CONTEXT7_API_KEYS=key1,key2,key3
```

Map a different port on your machine (container still listens on **8080** inside):

```bash
set HOST_PORT=3000
docker compose up --build
```

(On Linux/macOS: `HOST_PORT=3000 docker compose up --build`.)

## Build and run without Compose

```bash
docker build -t m0x-context .
docker run --rm -p 8080:8080 ^
  -e CONTEXT7_API_KEY=your_key ^
  m0x-context
```

(Linux/macOS: use `\` line continuation instead of `^`.)

## MCP client config

Point your client at your public URL:

```json
{
  "mcpServers": {
    "m0x-context": {
      "url": "https://your-domain.com/mcp"
    }
  }
}
```

If the host expects auth headers, set them per your client’s docs (e.g. `CONTEXT7_API_KEY` header for HTTP).

## Troubleshooting

- **Build fails:** Run `pnpm install && pnpm build` locally first; fix any TypeScript errors.
- **Container exits:** Check logs with `docker compose logs -f`.
- **429 / rate limits:** Add `CONTEXT7_API_KEY` or multiple keys in `CONTEXT7_API_KEYS`.
