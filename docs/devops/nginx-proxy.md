## Install and start proxy docker 

Setup proxy
`git clone --recurse-submodules https://github.com/evertramos/nginx-proxy-automation.git proxy`
`cd proxy/bin && ./fresh-start.sh --yes --skip-docker-image-check -e anteqkois@gmail.com`
test
`./test.sh api.linkerry.com`

## For website add two DNS
![DNS records for linkerry](./dns_records.png)

## If you use Cloudflare, change SSL settings
![Cloudflare SSL settings](./ssl_cloudflare.png)
