#!/bin/bash
set -e

echo "AlphaEdge — Deploy"
echo "==================="
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# ---------- 1. Prerequisites ----------
echo -e "${BLUE}[1/5] Checking prerequisites...${NC}"
command -v node >/dev/null 2>&1 || { echo -e "${RED}Node.js required. Install from https://nodejs.org${NC}"; exit 1; }
echo "  Node.js $(node -v)"

# ---------- 2. Turso database ----------
echo -e "${BLUE}[2/5] Setting up Turso database...${NC}"
if ! command -v turso >/dev/null 2>&1; then
  echo "  Installing Turso CLI..."
  curl -sSfL https://get.tur.so/install.sh | bash
  export PATH="$HOME/.turso:$PATH"
fi

if ! turso auth status >/dev/null 2>&1; then
  echo "  Logging in to Turso (opens browser)..."
  turso auth login
fi

DB_NAME="alphaedge"
if turso db show "$DB_NAME" >/dev/null 2>&1; then
  echo "  Database '$DB_NAME' already exists"
else
  echo "  Creating database '$DB_NAME'..."
  turso db create "$DB_NAME"
fi

TURSO_DATABASE_URL=$(turso db show "$DB_NAME" --url)
TURSO_AUTH_TOKEN=$(turso db tokens create "$DB_NAME")
echo "  Database URL: $TURSO_DATABASE_URL"

echo "  Pushing schema..."
TURSO_DATABASE_URL="$TURSO_DATABASE_URL" TURSO_AUTH_TOKEN="$TURSO_AUTH_TOKEN" npx prisma db push --accept-data-loss
echo -e "  ${GREEN}Database ready${NC}"

# ---------- 3. API keys ----------
echo ""
echo -e "${BLUE}[3/5] API keys...${NC}"

if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo -e "${YELLOW}  Get your key from: https://console.anthropic.com/settings/keys${NC}"
  read -rp "  ANTHROPIC_API_KEY: " ANTHROPIC_API_KEY
fi
[ -z "$ANTHROPIC_API_KEY" ] && { echo -e "${RED}ANTHROPIC_API_KEY is required${NC}"; exit 1; }
echo "  Anthropic key set"

if [ -z "$FINNHUB_API_KEY" ]; then
  echo -e "${YELLOW}  (Optional) Get a free key from: https://finnhub.io/register${NC}"
  read -rp "  FINNHUB_API_KEY (Enter to skip): " FINNHUB_API_KEY
fi
if [ -n "$FINNHUB_API_KEY" ]; then
  echo "  Finnhub key set"
else
  echo "  Skipped Finnhub (Yahoo Finance only)"
fi

# ---------- 4. Vercel setup ----------
echo ""
echo -e "${BLUE}[4/5] Setting up Vercel...${NC}"
if ! command -v vercel >/dev/null 2>&1; then
  echo "  Installing Vercel CLI..."
  npm install -g vercel
fi

if ! vercel whoami >/dev/null 2>&1; then
  echo "  Logging in to Vercel..."
  vercel login
fi

# Link project if needed
if [ ! -d ".vercel" ]; then
  echo "  Linking project..."
  vercel link --yes
fi

# Set env vars for all environments (production + preview + development)
echo "  Setting environment variables..."
set_env() {
  local name=$1 value=$2
  # Remove existing, then add for all environments
  vercel env rm "$name" production 2>/dev/null || true
  vercel env rm "$name" preview 2>/dev/null || true
  vercel env rm "$name" development 2>/dev/null || true
  echo "$value" | vercel env add "$name" production preview development
}

set_env "TURSO_DATABASE_URL" "$TURSO_DATABASE_URL"
set_env "TURSO_AUTH_TOKEN" "$TURSO_AUTH_TOKEN"
set_env "ANTHROPIC_API_KEY" "$ANTHROPIC_API_KEY"
[ -n "$FINNHUB_API_KEY" ] && set_env "FINNHUB_API_KEY" "$FINNHUB_API_KEY"
echo -e "  ${GREEN}Environment variables set for all environments${NC}"

# ---------- 5. Deploy ----------
echo ""
echo -e "${BLUE}[5/5] Deploying...${NC}"
DEPLOY_URL=$(vercel --prod --yes 2>&1 | tail -1)

echo ""
echo -e "${GREEN}==================="
echo "Deployed!"
echo "==================="
echo ""
echo "URL: $DEPLOY_URL"
echo ""
echo "Next steps:"
echo "  1. Open $DEPLOY_URL"
echo "  2. Complete onboarding"
echo "  3. Tap 'Refresh Recommendations'"
echo ""
echo "Install as PWA:"
echo "  iOS:     Safari > Share > Add to Home Screen"
echo "  Android: Chrome > Menu > Install App"
echo "===================${NC}"
