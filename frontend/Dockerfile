FROM alpine:latest
RUN apk update
RUN apk add nodejs npm
COPY . /pulsebs_12
WORKDIR /pulsebs_12/PULSeBS_12/frontend
RUN npm install
CMD ["npm", "start"]