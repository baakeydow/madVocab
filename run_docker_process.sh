#!/usr/bin/dumb-init /bin/sh

mongod \
  --port ${MONGO_PORT} \
  --dbpath ${MONGO_HOME} \
  --logpath ${MONGO_LOGFILE} \
  --logappend \
  -${MONGO_LOGLEVEL} &

cd ${RUNTIME_FOLDER} && \
rm -rf node_modules packages/backend/node_modules packages/frontend/node_modules ; \
yarn start