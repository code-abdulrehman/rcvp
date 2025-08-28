#!/bin/bash

# Update dependencies and lockfile
echo "Updating dependencies..."
pnpm install --no-frozen-lockfile

echo "Cleaning cache..."
pnpm store prune

echo "Reinstalling with frozen lockfile..."
pnpm install --frozen-lockfile

echo "Done! Please commit the updated pnpm-lock.yaml file." 