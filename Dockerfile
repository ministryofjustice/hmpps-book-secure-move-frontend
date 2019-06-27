FROM node:11.14

WORKDIR /home/node/app

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
COPY package*.json ./
USER 1000
RUN npm install

COPY --chown=node:node . .

RUN npm run build

EXPOSE 3000

CMD [ "node", "start.js" ]
