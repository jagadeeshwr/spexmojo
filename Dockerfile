FROM node:12.18-alpine

RUN addgroup -S nupp && adduser -S -g nupp nupp

ENV HOME=/home/nupp

WORKDIR $HOME/app

COPY package*.json $HOME/app/

COPY . $HOME/app/

RUN chown -R nupp:nupp $HOME/* /usr/local/ && \
    npm install --silent --production&& \
    chown -R nupp:nupp $HOME/*

USER nupp

EXPOSE 3000

CMD ["npm", "start"]
