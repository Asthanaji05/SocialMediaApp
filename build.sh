#!/bin/bash
set -e  # Exit on error

echo "🚀 Building Moscownpur Circles..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm ci --production=false

# Install frontend dependencies and build
echo "📦 Installing frontend dependencies..."
cd ../Frontend
npm ci --production=false

echo "🔨 Building frontend..."
npm run build

# Move built files to backend's public directory for serving
echo "📁 Moving built files to backend/public..."
mkdir -p ../backend/public
cp -r dist/* ../backend/public/

echo "✅ Build complete! Frontend is ready to be served by backend."
