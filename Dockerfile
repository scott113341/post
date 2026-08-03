# syntax=docker/dockerfile:1
FROM node:26-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY scripts ./scripts
COPY src ./src
COPY public ./public
COPY index.html tsconfig.json ./
RUN npm run build

FROM ghcr.io/static-web-server/static-web-server:2
COPY --from=builder /app/dist /public
