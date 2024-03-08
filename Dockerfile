FROM node:20-alpine as build-stage

WORKDIR /home/node/app

RUN apk add --no-cache python3 git build-base nasm zlib-dev libpng-dev autoconf automake
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

COPY --chown=node:node package*.json ./
USER 1000
RUN npm install typescript
RUN npm install

COPY --chown=node:node webpack.config.js .
COPY --chown=node:node tsconfig.json .
COPY --chown=node:node webpack.config.production.js .
COPY --chown=node:node config config
COPY --chown=node:node common/services/frameworks.js common/services/frameworks.js
COPY --chown=node:node common/assets common/assets
COPY --chown=node:node common/components common/components
COPY --chown=node:node mocks/assessment.js mocks/assessment.js
COPY --chown=node:node app/home/development-tools.ts app/home/development-tools.ts
COPY --chown=node:node . .
# needed until hard-coded
ENV API_VERSION default
RUN npx tsc
RUN NODE_ENV=production npm run build
############### End of Build step ###############

FROM node:20-alpine

WORKDIR /home/node/app
USER 1000

COPY --chown=node:node --from=build-stage /home/node/app /home/node/app

RUN npx tsc

ARG APP_BUILD_DATE
ENV APP_BUILD_DATE ${APP_BUILD_DATE}

ARG APP_BUILD_TAG
ENV APP_BUILD_TAG ${APP_BUILD_TAG}

ARG APP_GIT_COMMIT
ENV APP_GIT_COMMIT ${APP_GIT_COMMIT}

ARG APP_BUILD_BRANCH
ENV APP_BUILD_BRANCH ${APP_BUILD_BRANCH}

COPY --chown=node:node start.js .
COPY --chown=node:node server.js .
COPY --chown=node:node locales locales
COPY --chown=node:node common common
COPY --chown=node:node app app
COPY --chown=node:node tasks tasks

EXPOSE 3000
CMD [ "node", "start.js" ]
