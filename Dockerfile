FROM node:lts-alpine as builder
# FROM node:lts-alpine-slim as builder

ARG NODE_ENV
ARG BUILD_FLAG

WORKDIR /app/builder

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm@8.15.2
RUN pnpm install

COPY . .
