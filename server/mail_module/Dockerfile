FROM alpine:latest
RUN apk update
RUN apk add nodejs npm
EXPOSE 3002
COPY . /pulsebs_12
WORKDIR /pulsebs_12/PULSeBS_12/server
RUN npm install
CMD ["npm", "run", "mail_start"]