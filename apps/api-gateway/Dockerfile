FROM linkerry-base:latest AS builder

ARG NODE_ENV
ARG BUILD_FLAG

WORKDIR /app/builder

RUN npx nx run api-gateway:build-with-engine ${BUILD_FLAG}
RUN pnpm prune --prod

FROM node:lts-alpine AS runner

WORKDIR /app
# optymalize adding node modules, check if it possible to bundle dependencies to output by webpack
COPY --from=builder /app/builder/node_modules ./node_modules
COPY --from=builder /app/builder/dist/apps/api-gateway ./dist/apps/api-gateway
COPY --from=builder /app/builder/dist/libs/connectors/framework ./dist/libs/connectors/framework
COPY --from=builder /app/builder/dist/libs/engine ./dist/libs/engine
COPY --from=builder /app/builder/dist/libs/react-email ./dist/libs/react-email
COPY --from=builder /app/builder/dist/libs/shared ./dist/libs/shared

ENV NODE_ENV=$NODE_ENV

CMD ["node", "./dist/apps/api-gateway/main.js"]
