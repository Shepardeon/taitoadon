FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# image finale minimale
FROM alpine:3.19

WORKDIR /app
COPY --from=build /app/dist ./dist