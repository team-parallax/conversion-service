FROM teamparallax/ffmpeg-alpine:1.0.3-rc

ARG host=localhost:3000
ENV HOST=$host

WORKDIR /app

ADD . /app

RUN apk add --no-cache bash curl \
    && yarn install \
    && yarn tsoa:create:host

CMD [ "yarn", "start" ]