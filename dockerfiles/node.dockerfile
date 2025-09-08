FROM node:22-slim

WORKDIR /app

COPY src .

RUN npm install