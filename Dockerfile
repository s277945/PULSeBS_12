FROM alpine:latest
RUN apk update
RUN apk add nodejs npm
RUN apk add --no-cash --upgrade bash
COPY . /pulsebs_12
WORKDIR /pulsebs_12
RUN bash -C "./install_script.sh"
CMD bash -C "./start_script.sh"
