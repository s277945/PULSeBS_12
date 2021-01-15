FROM node:12
COPY . /pulsebs_12
WORKDIR /pulsebs_12
RUN bash -C "./install_script.sh"
CMD bash -C "./start_script.sh"
