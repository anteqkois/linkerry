FROM node:lts-buster as builder

ARG NODE_ENV
ARG BUILD_FLAG

WORKDIR /app/builder

COPY . .

RUN npm install -g pnpm@9.0.6

RUN pnpm install
