#!/bin/bash

# Verification script for examples
# Run this to verify all examples can install and build

set -e

echo "🔍 Verifying Examples..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Build the library first
echo "📦 Building library..."
npm run build
echo ""

# Test Vite starter
echo "🧪 Testing vite-starter..."
cd examples/vite-starter
if npm install &> /dev/null; then
  echo -e "${GREEN}✓ vite-starter: npm install succeeded${NC}"
else
  echo -e "${RED}✗ vite-starter: npm install failed${NC}"
  exit 1
fi
cd ../..
echo ""

# Test PostCSS starter
echo "🧪 Testing postcss-starter..."
cd examples/postcss-starter
if npm install &> /dev/null; then
  echo -e "${GREEN}✓ postcss-starter: npm install succeeded${NC}"
  if npm run build &> /dev/null; then
    echo -e "${GREEN}✓ postcss-starter: build succeeded${NC}"
  else
    echo -e "${RED}✗ postcss-starter: build failed${NC}"
    exit 1
  fi
else
  echo -e "${RED}✗ postcss-starter: npm install failed${NC}"
  exit 1
fi
cd ../..
echo ""

# Verify basic example has required files
echo "🧪 Checking basic example..."
if [ -f "examples/basic/index.html" ] && [ -f "dist/index.css" ]; then
  echo -e "${GREEN}✓ basic: required files present${NC}"
else
  echo -e "${RED}✗ basic: missing files${NC}"
  exit 1
fi
echo ""

# Check that key documentation exists
echo "📚 Checking documentation..."
docs=(
  "README.md"
  "GETTING_STARTED.md"
  "COMPONENTS.md"
  "TROUBLESHOOTING.md"
  "QUICK_REFERENCE.md"
  "examples/README.md"
  "examples/vite-starter/README.md"
  "examples/postcss-starter/README.md"
)

for doc in "${docs[@]}"; do
  if [ -f "$doc" ]; then
    echo -e "${GREEN}✓ $doc${NC}"
  else
    echo -e "${RED}✗ $doc missing${NC}"
    exit 1
  fi
done
echo ""

echo -e "${GREEN}🎉 All checks passed!${NC}"
echo ""
echo "To test the examples manually:"
echo "  cd examples/vite-starter && npm run dev"
echo "  cd examples/postcss-starter && npm run build && npm run serve"
echo "  open examples/basic/index.html"
