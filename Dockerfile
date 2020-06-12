FROM node:14.4-alpine as build-stage

WORKDIR /home/node/app

RUN apk add --no-cache git build-base nasm zlib-dev libpng-dev autoconf automake
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

COPY package*.json ./
USER 1000
RUN npm install

COPY --chown=node:node . .

RUN NODE_ENV=production npm run build
############### End of Build step ###############

FROM node:14.4-alpine

ARG APP_BUILD_DATE
ENV APP_BUILD_DATE ${APP_BUILD_DATE}

ARG APP_BUILD_TAG
ENV APP_BUILD_TAG ${APP_BUILD_TAG}

ARG APP_GIT_COMMIT
ENV APP_GIT_COMMIT ${APP_GIT_COMMIT}

WORKDIR /home/node/app
USER 1000

COPY --chown=node:node --from=build-stage /home/node/app /home/node/app

EXPOSE 3000
CMD [ "node", "start.js" ]
