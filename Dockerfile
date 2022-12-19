FROM node:19-alpine3.17 as build
WORKDIR /app

COPY package.json yarn.lock tsconfig.json ./
COPY src/ ./src/
RUN yarn install --frozen-lockfile && \
  yarn run build


FROM node:19-alpine3.17 as run
WORKDIR /app

ENV NODE_ENV production

COPY package.json yarn.lock ./
RUN yarn install --prod --frozen-lockfile
COPY --from=build /app/dist ./dist

CMD ["node", "dist/index.js"]
