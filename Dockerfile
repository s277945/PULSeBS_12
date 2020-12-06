FROM alpine:latest
RUN apk update
RUN apk add nodejs npm
RUN apk add --no-cash --upgrade bash
COPY . /pulsebs_12
WORKDIR /pulsebs_12/server
RUN npm install
WORKDIR /pulsebs_12/frontend
RUN npm install
WORKDIR /pulsebs_12
CMD bash -C "./start_script.sh"
