#!/bin/sh

# Run the Node.js application in the background
node ./dist/apps/api-gateway/main.js &

# Capture the PID of the Node.js application
NODE_PID=$!

sleep 15

# Clear file
> ./.env

# Wait for the Node.js application to finish (if needed)
wait $NODE_PID
