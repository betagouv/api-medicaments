FROM node:6

RUN mkdir -p /srv/app

EXPOSE 3004

ADD ./package.json /srv/app/
WORKDIR /srv/app
RUN npm install --production

ADD ./data ./data
ADD ./defaults.json ./
ADD ./bin ./bin
ADD ./import ./import

RUN ./bin/import

ADD ./api ./api

CMD npm start
