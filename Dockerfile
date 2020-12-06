FROM alpine:latest
RUN apk update
RUN apk add nodejs npm
EXPOSE 3000
COPY . /pulsebs_12
WORKDIR /pulsebs_12/PULSeBS_12/server
RUN npm install
WORKDIR /pulsebs_12/PULSeBS_12/frontend
RUN npm install
WORKDIR /pulsebs_12/PULSeBS_12
RUN chmod +x start_script.sh
CMD ["./start_script.sh", ""]
