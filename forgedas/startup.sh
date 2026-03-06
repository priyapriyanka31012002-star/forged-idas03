#!/bin/bash

# Forgedas Deployment Startup Script for Azure App Service (Linux)
# This script serves the built React+Vite static files

set -e

echo "Starting Forgedas Application..."

# Set environment variables
export NODE_ENV=production
export PORT=8080

# Navigate to app directory
cd /home/site/wwwroot

# List available files (for debugging)
echo "Files in current directory:"
ls -la

# Check if dist folder exists
if [ ! -d "dist" ]; then
  echo "Error: dist folder not found!"
  echo "Building application..."
  npm install
  npm run build
fi

# Install http-server globally to serve static files
echo "Installing HTTP Server..."
npm install -g http-server

# Serve the dist directory
echo "Serving application on port $PORT..."
http-server dist -p $PORT -g --cors

# Keep process alive
tail -f /dev/null
