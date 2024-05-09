# FROM linkerry/base:latest AS builder
FROM registry.digitalocean.com/linkerry/base:latest AS builder

ARG NODE_ENV
ARG BUILD_FLAG
ENV NEXT_TELEMETRY_DISABLED=true
ENV NEXT_PUBLIC_API_HOST=$NEXT_PUBLIC_API_HOST

WORKDIR /app/builder

RUN npx nx run web:build || echo "nx run web:build failed"

FROM node:lts-alpine AS runner

WORKDIR /app

COPY --from=builder /app/builder/apps/web/.next/standalone ./
COPY --from=builder /app/builder/apps/web/.next/static ./.next/static

ENV PORT 3000
ENV NODE_ENV=$NODE_ENV

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD node apps/web/server.js
