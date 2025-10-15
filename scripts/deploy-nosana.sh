#!/bin/bash

# ZigsAI ULTRA Agent - Nosana Deployment Script
# For Nosana Builders Challenge #102

set -e

echo "🚀 ZigsAI ULTRA Agent - Nosana Deployment"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if required environment variables are set
if [ -z "$GROQ_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  Warning: GROQ_API_KEY is not set${NC}"
    read -p "Enter your GROQ API key: " GROQ_API_KEY
    export GROQ_API_KEY=$GROQ_API_KEY
fi

# Docker Hub username
read -p "Enter your Docker Hub username: " DOCKER_USERNAME
if [ -z "$DOCKER_USERNAME" ]; then
    echo -e "${RED}❌ Docker Hub username is required${NC}"
    exit 1
fi

IMAGE_NAME="${DOCKER_USERNAME}/zigsai-ultra-agent"
IMAGE_TAG="latest"

echo ""
echo "📦 Building Docker image..."
echo "Image: ${IMAGE_NAME}:${IMAGE_TAG}"

# Build the Docker image
docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Docker build successful${NC}"
else
    echo -e "${RED}❌ Docker build failed${NC}"
    exit 1
fi

echo ""
echo "🔐 Logging in to Docker Hub..."
docker login

echo ""
echo "⬆️  Pushing image to Docker Hub..."
docker push ${IMAGE_NAME}:${IMAGE_TAG}

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Image pushed successfully${NC}"
else
    echo -e "${RED}❌ Failed to push image${NC}"
    exit 1
fi

# Update nosana.yaml with the correct image name
echo ""
echo "📝 Updating nosana.yaml with image name..."
sed -i "s|image: \"zigsai/ultra-agent:latest\"|image: \"${IMAGE_NAME}:${IMAGE_TAG}\"|g" nosana.yaml

echo ""
echo "🌐 Deploying to Nosana Network..."
echo ""
echo "Choose deployment method:"
echo "1) Nosana CLI"
echo "2) Nosana Dashboard (Web UI)"
read -p "Select option (1 or 2): " DEPLOY_METHOD

if [ "$DEPLOY_METHOD" == "1" ]; then
    # Check if Nosana CLI is installed
    if ! command -v nosana &> /dev/null; then
        echo -e "${YELLOW}Installing Nosana CLI...${NC}"
        npm install -g @nosana/cli
    fi
    
    echo ""
    echo "🚀 Deploying with Nosana CLI..."
    nosana deploy --config nosana.yaml --env GROQ_API_KEY=$GROQ_API_KEY
    
elif [ "$DEPLOY_METHOD" == "2" ]; then
    echo ""
    echo "📋 Deployment Instructions for Dashboard:"
    echo "1. Go to: https://dashboard.nosana.com/deploy"
    echo "2. Upload the nosana.yaml file"
    echo "3. Set environment variable:"
    echo "   GROQ_API_KEY = $GROQ_API_KEY"
    echo "4. Docker image: ${IMAGE_NAME}:${IMAGE_TAG}"
    echo "5. Click Deploy"
    echo ""
    echo "Press Enter to open the Nosana Dashboard..."
    read
    
    # Try to open browser
    if command -v xdg-open &> /dev/null; then
        xdg-open https://dashboard.nosana.com/deploy
    elif command -v open &> /dev/null; then
        open https://dashboard.nosana.com/deploy
    else
        echo "Please open: https://dashboard.nosana.com/deploy"
    fi
fi

echo ""
echo -e "${GREEN}🎉 Deployment process completed!${NC}"
echo ""
echo "📝 Next Steps:"
echo "1. Verify deployment is running on Nosana"
echo "2. Get the deployment URL"
echo "3. Record video demo (1-3 minutes)"
echo "4. Update README with deployment URL"
echo "5. Submit on SuperTeam: https://earn.superteam.fun/listing/nosana-builders-challenge-agents-102"
echo "6. Post on social media with #NosanaAgentChallenge"
echo ""
echo "Good luck with the challenge! 🚀"
