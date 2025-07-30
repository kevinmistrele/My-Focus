#!/bin/bash

echo ""
echo "🧼  Cleaning node_modules and lockfiles..."
rm -rf node_modules
rm -f package-lock.json
rm -rf apps/*/node_modules
rm -f apps/*/package-lock.json

echo ""
echo "🧹  Removing only build artifacts..."
rm -rf apps/*/dist

echo ""
echo "📦  Installing fresh dependencies..."
npm install

echo ""
echo "✅  Setup complete! You can now run:"
echo "    → npm run dev     # for development"
echo "    → npm run build:all && npm run prod"
echo ""
