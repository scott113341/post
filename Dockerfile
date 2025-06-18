FROM node:latest AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY /bin ./bin
COPY /build ./build
COPY /config ./config
COPY /src ./src
COPY /babel.config.json ./
RUN yarn run build

FROM ghcr.io/static-web-server/static-web-server:2
COPY --from=builder /app/dist /public
