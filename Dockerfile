FROM node:11.14

WORKDIR /home/node/app

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
COPY package*.json ./
USER 1000
RUN npm install

COPY --chown=node:node . .

RUN npm run build

ARG APP_BUILD_DATE
ENV APP_BUILD_DATE ${APP_BUILD_DATE}

ARG APP_BUILD_TAG
ENV APP_BUILD_TAG ${APP_BUILD_TAG}

ARG APP_GIT_COMMIT
ENV APP_GIT_COMMIT ${APP_GIT_COMMIT}

EXPOSE 3000

CMD [ "node", "start.js" ]
