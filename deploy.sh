#!/bin/bash
set -e

echo "🚀 AlphaEdge — Automated Deployment"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Step 1: Check prerequisites
echo -e "${BLUE}[1/6] Checking prerequisites...${NC}"
command -v node >/dev/null 2>&1 || { echo "❌ Node.js required. Install from https://nodejs.org"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm required."; exit 1; }
echo "  ✓ Node.js $(node -v)"

# Step 2: Install Turso CLI if not present
echo -e "${BLUE}[2/6] Setting up Turso database...${NC}"
if ! command -v turso >/dev/null 2>&1; then
  echo "  Installing Turso CLI..."
  curl -sSfL https://get.tur.so/install.sh | bash
  export PATH="$HOME/.turso:$PATH"
fi

# Login to Turso (opens browser)
if ! turso auth status >/dev/null 2>&1; then
  echo "  Logging in to Turso (opens browser)..."
  turso auth login
fi

# Create database
DB_NAME="alphaedge"
if turso db show "$DB_NAME" >/dev/null 2>&1; then
  echo "  ✓ Database '$DB_NAME' already exists"
else
  echo "  Creating database '$DB_NAME'..."
  turso db create "$DB_NAME"
fi

# Get credentials
TURSO_DATABASE_URL=$(turso db show "$DB_NAME" --url)
TURSO_AUTH_TOKEN=$(turso db tokens create "$DB_NAME")
echo "  ✓ Database URL: $TURSO_DATABASE_URL"
echo "  ✓ Auth token created"

# Push schema
echo "  Pushing schema to Turso..."
TURSO_DATABASE_URL="$TURSO_DATABASE_URL" TURSO_AUTH_TOKEN="$TURSO_AUTH_TOKEN" npx prisma db push --accept-data-loss
echo -e "  ${GREEN}✓ Database ready${NC}"

# Step 3: Get API keys
echo ""
echo -e "${BLUE}[3/6] API key setup...${NC}"

if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo -e "${YELLOW}  Get your Anthropic API key from: https://console.anthropic.com/settings/keys${NC}"
  read -p "  Paste your ANTHROPIC_API_KEY: " ANTHROPIC_API_KEY
fi
echo "  ✓ Anthropic key set"

if [ -z "$FINNHUB_API_KEY" ]; then
  echo -e "${YELLOW}  Get your Finnhub API key from: https://finnhub.io/register (free)${NC}"
  read -p "  Paste your FINNHUB_API_KEY (or press Enter to skip): " FINNHUB_API_KEY
fi
if [ -n "$FINNHUB_API_KEY" ]; then
  echo "  ✓ Finnhub key set"
else
  echo "  ⏭ Skipped Finnhub (will use Yahoo Finance only)"
fi

# Step 4: Install Vercel CLI if needed
echo ""
echo -e "${BLUE}[4/6] Setting up Vercel...${NC}"
if ! command -v vercel >/dev/null 2>&1; then
  echo "  Installing Vercel CLI..."
  npm install -g vercel
fi

# Login to Vercel
if ! vercel whoami >/dev/null 2>&1; then
  echo "  Logging in to Vercel (opens browser)..."
  vercel login
fi

# Step 5: Deploy
echo ""
echo -e "${BLUE}[5/6] Deploying to Vercel...${NC}"

# Set environment variables and deploy
vercel env rm ANTHROPIC_API_KEY production 2>/dev/null || true
vercel env rm TURSO_DATABASE_URL production 2>/dev/null || true
vercel env rm TURSO_AUTH_TOKEN production 2>/dev/null || true
vercel env rm FINNHUB_API_KEY production 2>/dev/null || true

echo "$ANTHROPIC_API_KEY" | vercel env add ANTHROPIC_API_KEY production
echo "$TURSO_DATABASE_URL" | vercel env add TURSO_DATABASE_URL production
echo "$TURSO_AUTH_TOKEN" | vercel env add TURSO_AUTH_TOKEN production
if [ -n "$FINNHUB_API_KEY" ]; then
  echo "$FINNHUB_API_KEY" | vercel env add FINNHUB_API_KEY production
fi

echo "  Deploying to production..."
DEPLOY_URL=$(vercel --prod --yes 2>&1 | tail -1)

echo ""
echo -e "${GREEN}===================================="
echo "✅ AlphaEdge deployed successfully!"
echo "===================================="
echo ""
echo "🌐 URL: $DEPLOY_URL"
echo ""
echo "Database: $TURSO_DATABASE_URL"
echo ""
echo "Next steps:"
echo "  1. Open $DEPLOY_URL"
echo "  2. Complete the onboarding flow"
echo "  3. Tap 'Refresh Recommendations' on the home screen"
echo ""
echo "To install as PWA:"
echo "  iOS:     Safari → Share → Add to Home Screen"
echo "  Android: Chrome → Menu → Install App"
echo "====================================${NC}"
