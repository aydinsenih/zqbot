FROM node:current-alpine

WORKDIR /zqbot

COPY . .

CMD ["node", "index.js"]