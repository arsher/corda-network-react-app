FROM node:12.13-buster-slim

RUN apt update && apt -y install git && mkdir -p /opt/onboarding

WORKDIR /opt/onboarding

RUN npm install -g npm

COPY . .

EXPOSE 80

RUN rm -f package-lock.json

RUN npm rebuild node-sass --force
RUN npm install && npm run build 

ENTRYPOINT npm run start
