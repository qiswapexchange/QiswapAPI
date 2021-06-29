FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --no-cache --virtual .gyp \
        python3 \
        make \
        g++ \
    && npm install \
    && apk del .gyp

COPY . .

EXPOSE 3001

CMD ["npm", "run", "prodstart"]