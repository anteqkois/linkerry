# Auth

In config file there should be file "htpasswd" which inculde user auth. It can be generated using docker container.

`docker run --rm -v $(pwd)/config:/config --entrypoint htpasswd httpd:2.4 -B -b /config/htpasswd <yourusername> <yourpassword>`
