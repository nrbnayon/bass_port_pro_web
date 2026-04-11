#!/bin/bash

echo "Starting deployment..."
cd /var/www/BassInsight-Frontend || exit

echo "Pulling latest code..."
git pull origin main

echo "Installing dependencies..."
npm install

echo "Building Next.js..."
npm run build

echo "Reloading PM2..."
pm2 reload ecosystem.config.js --update-env

echo "Testing Nginx configuration..."
if nginx -t; then
  systemctl reload nginx
else
  echo "Nginx config invalid. Skipping reload."
fi

echo "Saving PM2 process..."
pm2 save

echo "Deployment finished successfully."