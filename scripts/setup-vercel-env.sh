#!/usr/bin/env bash
# Syncs environment variables from .env.production to Vercel project settings.
# Usage: npm run setup:env
# Requires: vercel CLI installed and authenticated (npx vercel login)
set -euo pipefail

ENV_FILE=".env.production"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: $ENV_FILE not found."
  echo "Create it from .env.example with your actual values, then re-run."
  exit 1
fi

# Check vercel CLI
if ! command -v vercel &> /dev/null && ! npx vercel --version &> /dev/null 2>&1; then
  echo "Installing Vercel CLI..."
  npm install -g vercel
fi

echo "Syncing env vars from $ENV_FILE to Vercel..."
echo ""

while IFS='=' read -r key value; do
  # Skip empty lines and comments
  [[ -z "$key" || "$key" =~ ^# ]] && continue

  # Remove surrounding quotes if present
  value="${value%\"}"
  value="${value#\"}"
  value="${value%\'}"
  value="${value#\'}"

  echo "  Setting $key..."
  # Add to all environments (production, preview, development)
  printf '%s' "$value" | vercel env add "$key" production --force 2>/dev/null || \
    printf '%s' "$value" | vercel env add "$key" production 2>/dev/null || true
  printf '%s' "$value" | vercel env add "$key" preview --force 2>/dev/null || \
    printf '%s' "$value" | vercel env add "$key" preview 2>/dev/null || true
done < "$ENV_FILE"

echo ""
echo "Done! Env vars synced to Vercel."
echo "Trigger a redeploy: vercel --prod"
