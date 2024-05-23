Run loccally `nx run web:docker-compose`

Connect to server `ssh root@64.226.97.74`

Install docker `https://docs.docker.com/engine/install/ubuntu/`

Setup proxy
`git clone --recurse-submodules https://github.com/evertramos/nginx-proxy-automation.git proxy`
`cd proxy/bin && ./fresh-start.sh --yes --skip-docker-image-check -e anteqkois@gmail.com`
test
`./test.sh api.linkerry.com`

Create dir like a domaina: `mkdir api.linkerry.com`

Create docker-compose file: `cd api.linkerry.com && touch docker-compose.yml`

Copy and create env file

Login to docker container registry
`docker login -u "$CONTAINER_REGISTRY_USERNAME" -p "$CONTAINER_REGISTRY_PASSWORD" "$CONTAINER_REGISTRY_ADDRESS"`

Docker compose:

```
version: '3.8'
services:
  web:
    image: registry.digitalocean.com/linkerry/web:latest
    ports:
      - ${VIRTUAL_PORT}:${VIRTUAL_PORT}
    env_file:
      - .env
    environment:
      - VIRTUAL_HOST=${VIRTUAL_HOST}
      - LETSENCRYPT_HOST=${LETSENCRYPT_HOST}
      - LETSENCRYPT_EMAIL=anteqkois@gmail.com
      - VIRTUAL_PORT=${VIRTUAL_PORT}
    restart: unless-stopped
networks:
  default:
    external:
      name: ${NETWORK:-proxy}
```

start docker compose
`docker compose -f ./docker-compose.yml up -d`

Update docker compose images: https://stackoverflow.com/questions/49316462/how-to-update-existing-images-with-docker-compose
