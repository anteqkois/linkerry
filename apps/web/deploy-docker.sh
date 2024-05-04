#!/bin/bash

set -e

# Build images
docker build -t linkerry/web -f ./apps/web/Dockerfile . --platform=linux/amd64 --progress=plain

# Push docker image to container registry
docker login -u "$CONTAINER_REGISTRY_USERNAME" -p "$CONTAINER_REGISTRY_PASSWORD" "$CONTAINER_REGISTRY_ADDRESS"

docker tag linkerry/web registry.digitalocean.com/linkerry/web:"$ENV"
docker push registry.digitalocean.com/linkerry/web:"$ENV"
