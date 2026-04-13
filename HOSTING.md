# Hosting m0x-context (Docker)

One **`Dockerfile`** at the repo root builds and runs the MCP HTTP server. Works the same on your laptop, a VPS, Railway (choose **Dockerfile** as the build method), Fly.io, AWS, EasyPanel, etc.

**Important:** Build with **`Dockerfile`**, not `docker-compose.yml`. The compose file is only for `docker compose up` on your machine.

## EasyPanel / panels that ask for a “Dockerfile path”

If the build fails with:

`unknown instruction: services:` (line 1)

then the panel is using **`docker-compose.yml` as the Dockerfile**. That is invalid: Compose files start with `services:`; Dockerfiles use `FROM`, `RUN`, etc.

**Fix in EasyPanel (App from Dockerfile):**

| Setting | Value |
|--------|--------|
| Dockerfile path | **`Dockerfile`** (repo root) |
| Build context | **`.`** (repository root) |

Do **not** set Dockerfile path to `docker-compose.yml`.

If the product has a separate **“Docker Compose”** app type, use that and supply `docker-compose.yml` there instead of a raw `docker build -f docker-compose.yml`.

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
