FROM alpine:latest
RUN apk update
RUN apk add nodejs npm
EXPOSE 3001
COPY . /pulsebs_12
WORKDIR /pulsebs_12/PULSeBS_12/server
RUN npm install
CMD ["npm", "start"]
