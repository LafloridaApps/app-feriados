#!/bin/bash

# Configuration
IMAGE_NAME="feriados-app"
CONTAINER_NAME="feriados-app-container"
PORT="8080"

# Load environment variables from .env if it exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Set API URL to /api (for Nginx proxy)
VITE_API_BASE_URL="/api"
API_HOST=${HOST:-localhost}

echo "Stopping and removing existing container (if any)..."
docker stop $CONTAINER_NAME 2>/dev/null
docker rm $CONTAINER_NAME 2>/dev/null

echo "Building new image with VITE_API_BASE_URL=$VITE_API_BASE_URL..."
docker build --build-arg VITE_API_BASE_URL=$VITE_API_BASE_URL -t $IMAGE_NAME .

echo "Running new container on port $PORT (Network: laflorida, API_HOST: $API_HOST)..."
docker run -d --name $CONTAINER_NAME --network laflorida -p $PORT:80 -e API_HOST=$API_HOST $IMAGE_NAME

echo "--------------------------------------------------------"
echo "Application redeployed successfully!"
echo "Accessible at: http://localhost:$PORT/feriados/"
echo "To check specific RUT: http://localhost:$PORT/feriados/home?rut=XXXXXXXX"
echo "--------------------------------------------------------"
