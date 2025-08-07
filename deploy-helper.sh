#!/bin/bash

# Kuna Deployment Helper Script
# This script helps prepare the project for Coolify deployment

set -e

echo "🚀 Kuna Deployment Helper"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "packages" ]; then
    print_error "Please run this script from the kuna-monorepo root directory"
    exit 1
fi

print_status "Checking project structure..."

# Check required files
required_files=(
    "packages/backend/Dockerfile"
    "packages/backend/docker-compose.yml"
    "packages/backend/main.py"
    "packages/backend/requirements.txt"
    "packages/frontend/Dockerfile"
    "packages/frontend/docker-compose.yml"
    "packages/frontend/package.json"
    "COOLIFY_DEPLOYMENT_GUIDE.md"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    print_error "Missing required files:"
    for file in "${missing_files[@]}"; do
        echo "  - $file"
    done
    exit 1
fi

print_status "All required files present"

# Check environment files
print_status "Checking environment configuration..."

if [ ! -f "packages/backend/.env" ]; then
    print_warning "Backend .env file not found"
    if [ -f "packages/backend/.env.example" ]; then
        echo "Copying .env.example to .env..."
        cp packages/backend/.env.example packages/backend/.env
        print_warning "Please edit packages/backend/.env with your actual values"
    fi
fi

if [ ! -f "packages/frontend/.env" ]; then
    print_warning "Frontend .env file not found"
    if [ -f "packages/frontend/.env.example" ]; then
        echo "Copying .env.example to .env..."
        cp packages/frontend/.env.example packages/frontend/.env
        print_warning "Please edit packages/frontend/.env with your actual values"
    fi
fi

# Check Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed or not in PATH"
    exit 1
fi

print_status "Docker is available"

# Test Docker builds (optional)
read -p "Do you want to test Docker builds locally? (y/N): " test_builds

if [[ $test_builds =~ ^[Yy]$ ]]; then
    print_status "Testing backend Docker build..."
    cd packages/backend
    if docker build -t kuna-backend-test .; then
        print_status "Backend Docker build successful"
        docker rmi kuna-backend-test
    else
        print_error "Backend Docker build failed"
        exit 1
    fi
    cd ../..
    
    print_status "Testing frontend Docker build..."
    cd packages/frontend
    if docker build -t kuna-frontend-test .; then
        print_status "Frontend Docker build successful"
        docker rmi kuna-frontend-test
    else
        print_error "Frontend Docker build failed"
        exit 1
    fi
    cd ../..
fi

# Generate deployment checklist
echo ""
echo "📋 Deployment Checklist"
echo "======================="
echo ""
echo "Before deploying to Coolify:"
echo ""
echo "1. Environment Variables:"
echo "   □ Set GEMINI_API_KEY in backend environment"
echo "   □ Set VITE_API_URL in frontend environment"
echo "   □ Configure production domains"
echo ""
echo "2. Repository:"
echo "   □ Push code to Git repository (GitHub/GitLab)"
echo "   □ Ensure main branch is up to date"
echo ""
echo "3. Coolify Setup:"
echo "   □ Create backend application (packages/backend/docker-compose.yml)"
echo "   □ Create frontend application (packages/frontend/docker-compose.yml)"
echo "   □ Configure persistent volume for database"
echo "   □ Set up domains and SSL certificates"
echo ""
echo "4. Testing:"
echo "   □ Test health endpoints: /health"
echo "   □ Test therapist registration"
echo "   □ Test patient questionnaire"
echo ""

# Generate quick deploy commands
cat > deploy-commands.txt << EOF
# Coolify Deployment Commands
# Copy these commands to use in Coolify

# Backend Service
Repository: https://github.com/your-username/kuna-therapist-matching
Branch: main
Docker Compose Location: packages/backend/docker-compose.yml

Environment Variables:
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=sqlite:///./data/therapist_matching.db
PORT=8002
FRONTEND_URL=https://kuna.yourdomain.com

# Frontend Service  
Repository: https://github.com/your-username/kuna-therapist-matching
Branch: main
Docker Compose Location: packages/frontend/docker-compose.yml

Environment Variables:
VITE_API_URL=https://api.yourdomain.com
PORT=80
EOF

print_status "Deployment commands saved to deploy-commands.txt"

echo ""
print_status "Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Review and update environment variables"
echo "2. Push code to your Git repository"
echo "3. Follow the COOLIFY_DEPLOYMENT_GUIDE.md"
echo "4. Use the commands in deploy-commands.txt for Coolify setup"
echo ""
echo "Good luck with your deployment! 🚀"
