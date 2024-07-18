FROM registry.digitalocean.com/maxdata/base:latest AS builder

ARG NODE_ENV
ENV NEXT_TELEMETRY_DISABLED=true
ENV NEXT_PUBLIC_API_HOST=$NEXT_PUBLIC_API_HOST
RUN echo $NEXT_PUBLIC_API_HOST

WORKDIR /app/builder

# Copy the correct environment file based on the build argument `ENVIRONMENT`
# COPY .env.${ENVIRONMENT} ./.env
# COPY /app/builder/apps/web/.env.prod-build /app/builder/apps/web/.env
# RUN echo "NEXT_PUBLIC_API_HOST=${NEXT_PUBLIC_API_HOST}" >> /app/builder/apps/web/.env
# RUN echo "NEXT_PUBLIC_API_HOST=https://api.linkerry.com" >> /app/builder/apps/web/.env
# RUN echo "NEXT_TELEMETRY_DISABLED=true" >> /app/builder/apps/web/.env
# RUN echo "TEST=true" >> /app/builder/apps/web/.env
# RUN echo "NEXT_PUBLIC_API_HOST=https://api.linkerry.com" >> /app/builder/apps/web/.env.production
# RUN echo "NEXT_TELEMETRY_DISABLED=true" >> /app/builder/apps/web/.env.production
# RUN echo "TEST=true" >> /app/builder/apps/web/.env.production
# RUN cat /app/builder/apps/web/.env
# RUN ls -a /app/builder/apps/web

RUN npx nx run web:build || echo "nx run web:build failed"
# RUN grep -rn --include="*.js" "process.env.NEXT_PUBLIC_API_HOST" /app/builder/apps/web/.next/standalone
# RUN grep -rn --include="*.js" "https://api.linkerry.com" /app/builder/apps/web/.next/standalone
# RUN find /app/builder/apps/web/.next/standalone -name "*.js" -exec grep -n "process.env.NEXT_PUBLIC_API_HOST" {} + || true
# RUN find /app/builder/apps/web/.next/standalone -name "*.js" -exec grep -n "https://api.linkerry.com" {} + || true

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
