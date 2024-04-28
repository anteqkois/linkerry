# build base docker image 
`docker build . -t linkerry-base:base`

# build server codebase
`npx nx run-many --target=build --projects=api-gateway --configuration production`

# build docker-compose for server
RUN npx nx run-many --target=build --projects=api-gateway --configuration production
