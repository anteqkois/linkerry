FROM linkerry-base:base AS builder

ARG NODE_ENV
ARG BUILD_FLAG

WORKDIR /app/builder

COPY . .

RUN npx nx build api-gateway ${BUILD_FLAG}

FROM linkerry-base:base

WORKDIR /app
COPY --from=builder /app/builder ./
ENV NODE_ENV=$NODE_ENV

CMD ["node", "./dist/apps/api-gateway/main.js"]
