FROM alpine:latest
RUN apk update
RUN sudo apk add nodejs npm build-essential
COPY . /pulsebs_12
WORKDIR /pulsebs_12/frontend
RUN npm install
CMD ["npm start"]