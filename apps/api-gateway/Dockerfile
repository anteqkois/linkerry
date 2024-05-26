FROM registry.digitalocean.com/linkerry/base:latest AS builder

ARG NODE_ENV
ARG BUILD_FLAG

WORKDIR /app/builder

RUN npx nx run api-gateway:build-with-engine || echo "nx run api-gateway:build failed"
RUN pnpm prune --prod

FROM node:lts-alpine

WORKDIR /app
# optymalize adding node modules, check if it possible to bundle dependencies to output by webpack
COPY --from=builder /app/builder/node_modules ./node_modules
COPY --from=builder /app/builder/dist/apps/api-gateway ./dist/apps/api-gateway
COPY --from=builder /app/builder/dist/libs/connectors/framework ./dist/libs/connectors/framework
COPY --from=builder /app/builder/dist/libs/engine ./dist/libs/engine
COPY --from=builder /app/builder/dist/libs/react-email ./dist/libs/react-email
COPY --from=builder /app/builder/dist/libs/shared ./dist/libs/shared
COPY --from=builder /app/builder/apps/api-gateway/entry.sh ./dist/apps/api-gateway/entry.sh

ENV NODE_ENV=$NODE_ENV

RUN npm install -g pnpm@8.15.2

RUN chmod +x ./dist/apps/api-gateway/entry.sh

ENTRYPOINT ["./dist/apps/api-gateway/entry.sh"]
# CMD ["node", "./dist/apps/api-gateway/main.js"]
# CMD ["node", "./build/index.js"]
