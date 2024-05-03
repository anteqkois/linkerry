# build base docker image 
`docker build . -t linkerry-base:latest`

# build and run server docker compose
`docker compose -f ./apps/api-gateway/docker-compose.local.yml up -d`
