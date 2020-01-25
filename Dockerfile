FROM mhart/alpine-node:12.14.1

ARG _AWS_ACCESS_KEY_ID="don't change ! this is overriden by run_docker_container.sh"
ARG _AWS_SECRET_ACCESS_KEY="don't change ! this is overriden by run_docker_container.sh"

ENV AWS_ACCESS_KEY_ID=$_AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY=$_AWS_SECRET_ACCESS_KEY
ENV RUNTIME_FOLDER /root/app
ENV MONGO_USER mongo
ENV MONGO_HOME /data/db
ENV MONGO_PORT 27017
ENV MONGO_LOGFILE /data/log/mongod.log
ENV MONGO_LOGLEVEL v

RUN apk --update add --no-cache bash python build-base

WORKDIR ${RUNTIME_FOLDER}

COPY vocab-game ${RUNTIME_FOLDER}
COPY run_docker_process.sh /usr/local/bin

RUN chmod +x /usr/local/bin/run_docker_process.sh

RUN mkdir -p ${MONGO_HOME} $(dirname ${MONGO_LOGFILE}) && \
  adduser -h ${MONGO_HOME} -s /sbin/nologin -u 1000 -D ${MONGO_USER} && \
  chown -R ${MONGO_USER}:${MONGO_USER} ${MONGO_HOME} $(dirname ${MONGO_LOGFILE}) && \
  echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/main' >> /etc/apk/repositories && \
  echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/community' >> /etc/apk/repositories && \
  apk add --no-cache dumb-init mongodb

RUN npm install --global yarn@1.19.1 lerna@3.17.0

EXPOSE 9999

VOLUME ${MONGO_HOME}

ENTRYPOINT [ "/bin/bash" ]

CMD [ "run_docker_process.sh" ]