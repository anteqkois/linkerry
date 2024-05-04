#!/bin/bash

set -e

# # Build images
# docker build -t linkerry/test -f ./apps/web/Dockerfile-test .

# # Push docker image to container registry
# docker login -u "$CONTAINER_REGISTRY_USERNAME" -p "$CONTAINER_REGISTRY_PASSWORD" "$CONTAINER_REGISTRY_ADDRESS"

# docker tag linkerry/test registry.digitalocean.com/linkerry/web:"$ENV"
# docker push registry.digitalocean.com/linkerry/web:"$ENV"

# prepare env file

# sshpass -p "$SSH_PASSPHRASE" ssh root@64.226.97.74 "mkdir test2 && exit\r"
# sshpass -p "pass" ssh -o StrictHostKeyChecking=no root@64.226.97.74  << EOSSH
# mkdir test2
# EOSSH
# sshpass -p "pass" ssh -v -o StrictHostKeyChecking=no root@64.226.97.74 "mkdir test2 2>&1"
sshpass -p "pass" ssh -v -o StrictHostKeyChecking=no root@64.226.97.74 < ./apps/web/script.sh

# expect -c "
# spawn ssh root@64.226.97.74
# expect \"Enter passphrase for key '/Users/anteqkois/.ssh/id_rsa':\"
# send \"$SSH_PASSPHRASE\r\"
# interact
# "

# # Use expect to interact with the SSH command
# expect -c "
# spawn ssh root@64.226.97.74
# expect {
#     \"Enter passphrase for key '$SSH_KEY_PATH':\" {
#         send \"$SSH_PASSPHRASE\r\"
#         exp_continue
#     }
#     \"assword:\" {
#         send \"$SSH_PASSPHRASE\r\"
#         exp_continue
#     }
#     \"yes/no\" {
#         send \"yes\r\"
#         exp_continue
#     }
#     eof
#     # Run commands on the remote server
#     send \"mkdir test2 && exit\r\"
#     expect eof
# }
# "
