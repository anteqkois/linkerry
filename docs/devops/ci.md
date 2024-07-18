# build base docker image

`docker build . -t registry.digitalocean.com/maxdata/base:latest`

# build and run server docker compose

`docker compose -f ./apps/api-gateway/docker-compose.local.yml up -d`

# Get info which apps were affected and should be redeployed

`nx show projects --type=app --affected --base=[commit SHA | nothing -> check last commit] --head=[commit SHA | nothing -> current commit]`
