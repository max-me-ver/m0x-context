# m0x-context MCP — HTTP server (production)
# Build: docker build -t m0x-context .
# Run:   docker run -p 8080:8080 -e CONTEXT7_API_KEY=... m0x-context

FROM node:lts-alpine AS builder
RUN corepack enable pnpm
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY packages/mcp ./packages/mcp
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @m0x/context-mcp build

FROM node:lts-alpine
RUN corepack enable pnpm
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/mcp/package.json ./packages/mcp/
RUN pnpm install --frozen-lockfile --prod --filter @m0x/context-mcp

COPY --from=builder /app/packages/mcp/dist ./packages/mcp/dist

EXPOSE 8080

# Cloud platforms set PORT; default 8080 for Docker deploys.
CMD ["sh", "-c", "node packages/mcp/dist/index.js --transport http --port ${PORT:-8080}"]
