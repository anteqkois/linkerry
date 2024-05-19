Update docker compose images: https://stackoverflow.com/questions/49316462/how-to-update-existing-images-with-docker-compose

```
docker-compose pull
docker-compose up --force-recreate --build -d
docker image prune -f
```
