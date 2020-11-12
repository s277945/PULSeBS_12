FROM alpine:latest
RUN apk update
RUN apk add nodejs npm
COPY . /pulsebs_12
WORKDIR /pulsebs_12/server
RUN npm install
CMD ["node server.js"]
