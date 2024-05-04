FROM linkerry/base:latest AS builder

ARG NODE_ENV
ARG BUILD_FLAG

WORKDIR /app/builder

# RUN ls apps/web/.next -a
RUN npx nx run web:build -d || echo "nx run web:build failed"
# RUN ls apps/web/.next -a
# RUN ls apps/web/.next/standalone

FROM node:lts-alpine AS runner

WORKDIR /app

COPY --from=builder /app/builder/apps/web/.next/standalone ./
COPY --from=builder /app/builder/apps/web/.next/static ./apps/web/.next/static

ENV PORT 3000
ENV NODE_ENV=$NODE_ENV

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD node apps/web/server.js
