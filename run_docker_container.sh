#!/usr/bin/env bash

# Clean env
docker rmi -f mad-vocab-game:latest &>/dev/null || true 
docker stop runningMadVocabGame &>/dev/null || true 

# Build fresh Image
docker build \
--build-arg _AWS_ACCESS_KEY_ID="replace me !" \
--build-arg _AWS_SECRET_ACCESS_KEY="replace me !" \
-t mad-vocab-game:latest .

# Run Container
docker run \
-p 9999:9999 \
-v /tmp/mongo-data:/data/db \
-d --rm --name runningMadVocabGame mad-vocab-game
docker logs -f runningMadVocabGame