#!/bin/bash

# Configuration
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
IMAGE="ghcr.io/lafloridaapps/feriados-app:latest"
CONTAINER_NAME="feriados-app-container"
PORT="80"
NETWORK="laflorida"

# Environment Selection
ENV=${1:-local} # Default to local if not specified

case $ENV in
  local)
    BACKEND_URL="http://localhost:8081/"
    ;;
  dev)
    BACKEND_URL="https://appd2.laflorida.cl/"
    ;;
  prod)
    BACKEND_URL="https://appx.laflorida.cl/"
    ;;
  *)
    echo "Usage: $0 [local|dev|prod]"
    exit 1
    ;;
esac

echo "Deploying for environment: $ENV (Backend: $BACKEND_URL)"

echo "Pulling latest image: $IMAGE..."
docker pull $IMAGE

echo "Stopping and removing existing container (if any)..."
docker stop $CONTAINER_NAME 2>/dev/null
docker rm $CONTAINER_NAME 2>/dev/null

# Ensure network exists (useful if not already created)
docker network create $NETWORK 2>/dev/null || true

echo "Running new container on port $PORT (Network: $NETWORK)..."
# Check if nginx.conf is a file
if [ ! -f "$SCRIPT_DIR/nginx.conf" ]; then
    echo "Error: $SCRIPT_DIR/nginx.conf not found or is a directory. Please ensure it's a file."
    exit 1
fi

# We mount the local nginx.conf as a template to override the one in the image
docker run -d \
  --name $CONTAINER_NAME \
  --network $NETWORK \
  -p $PORT:80 \
  -v "$SCRIPT_DIR/nginx.conf:/etc/nginx/templates/default.conf.template:ro" \
  -e BACKEND_URL=$BACKEND_URL \
  $IMAGE

echo "--------------------------------------------------------"
echo "Application deployed successfully!"
echo "Accessible at: http://localhost/feriados/"
echo "To check specific RUT: http://localhost/feriados/home?rut=XXXXXXXX"
echo "--------------------------------------------------------"
