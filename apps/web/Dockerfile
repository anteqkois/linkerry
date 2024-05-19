FROM registry.digitalocean.com/linkerry/base:latest AS builder

ARG NODE_ENV
ENV NEXT_TELEMETRY_DISABLED=true
ENV NEXT_PUBLIC_API_HOST=$NEXT_PUBLIC_API_HOST
RUN echo "API Host: $NEXT_PUBLIC_API_HOST"

WORKDIR /app/builder

# Copy the correct environment file based on the build argument `ENVIRONMENT`
# COPY .env.${ENVIRONMENT} ./.env
COPY /app/builder/apps/web/.env.prod-build /app/builder/apps/web/.env

RUN npx nx run web:build || echo "nx run web:build failed"

FROM node:lts-alpine AS runner

WORKDIR /app

COPY --from=builder /app/builder/apps/web/.next/standalone ./

# https://nextjs.org/docs/pages/api-reference/next-config-js/output#automatically-copying-traced-files
# NextJS does not copy the public or .next/static folders by default as these should ideally be handled by a CDN instead, although these folders can be copied to the standalone/public and standalone/.next/static folders manually, after which server.js file will serve these automatically.
COPY --from=builder /app/builder/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/builder/apps/web/public ./apps/web/public

ENV PORT 3000
ENV NODE_ENV=$NODE_ENV

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD node apps/web/server.js
