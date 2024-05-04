#!/bin/bash

set -e

# Build images
docker build -t linkerry/api -f ./apps/api-gateway/Dockerfile . --platform=linux/amd64

# Push docker image to container registry
docker login -u "$CONTAINER_REGISTRY_USERNAME" -p "$CONTAINER_REGISTRY_PASSWORD" "$CONTAINER_REGISTRY_ADDRESS"

docker tag linkerry/api registry.digitalocean.com/linkerry/api:"$ENV"
docker push registry.digitalocean.com/linkerry/api:"$ENV"
