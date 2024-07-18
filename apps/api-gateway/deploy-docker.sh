#!/bin/bash

set -e

# load env veriables
eval "$(
  cat .env | awk '!/^\s*#/' | awk '!/^\s*$/' | while IFS='' read -r line; do
    key=$(echo "$line" | cut -d '=' -f 1)
    value=$(echo "$line" | cut -d '=' -f 2-)
    echo "export $key=\"$value\""
  done
)"

# Build images
docker build -t linkerry/api-gateway -f ./apps/api-gateway/Dockerfile . --platform=linux/amd64

# Push docker image to container registry
docker login -u "$CONTAINER_REGISTRY_USERNAME" -p "$CONTAINER_REGISTRY_PASSWORD" "$CONTAINER_REGISTRY_ADDRESS"

docker tag linkerry/api-gateway registry.digitalocean.com/maxdata/api-gateway:latest
docker push registry.digitalocean.com/maxdata/api-gateway:latest
