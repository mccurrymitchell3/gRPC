FROM node:8-alpine

WORKDIR ${HOME}/app

ADD . ${HOME}/app/

RUN npm rebuild

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]