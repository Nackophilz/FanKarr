FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

# ── Dépendances prod ───────────────────────────────────────────
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# ── Build ──────────────────────────────────────────────────────
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

# ── Production ─────────────────────────────────────────────────
FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist/server /app/dist/server
COPY --from=build /app/dist/client /app/public

RUN mkdir -p /app/data

EXPOSE 3001
ENV NODE_ENV=production
CMD ["node", "dist/server/index.js"]