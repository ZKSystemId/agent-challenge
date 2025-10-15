@echo off
setlocal enabledelayedexpansion

REM ZigsAI ULTRA Agent - Nosana Deployment Script (Windows)
REM For Nosana Builders Challenge #102

echo.
echo ========================================
echo   ZigsAI ULTRA Agent - Nosana Deployment
echo ========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop first.
    echo Download from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Check environment variable
if "%GROQ_API_KEY%"=="" (
    echo [WARNING] GROQ_API_KEY is not set
    set /p GROQ_API_KEY="Enter your GROQ API key: "
)

REM Get Docker Hub username
set /p DOCKER_USERNAME="Enter your Docker Hub username: "
if "%DOCKER_USERNAME%"=="" (
    echo [ERROR] Docker Hub username is required
    pause
    exit /b 1
)

set IMAGE_NAME=%DOCKER_USERNAME%/zigsai-ultra-agent
set IMAGE_TAG=latest

echo.
echo Building Docker image...
echo Image: %IMAGE_NAME%:%IMAGE_TAG%
echo.

REM Build the Docker image
docker build -t %IMAGE_NAME%:%IMAGE_TAG% .

if %errorlevel% equ 0 (
    echo [SUCCESS] Docker build successful
) else (
    echo [ERROR] Docker build failed
    pause
    exit /b 1
)

echo.
echo Logging in to Docker Hub...
docker login

echo.
echo Pushing image to Docker Hub...
docker push %IMAGE_NAME%:%IMAGE_TAG%

if %errorlevel% equ 0 (
    echo [SUCCESS] Image pushed successfully
) else (
    echo [ERROR] Failed to push image
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Deployment Options
echo ========================================
echo.
echo Choose deployment method:
echo 1) Nosana Dashboard (Recommended for Windows)
echo 2) Nosana CLI (Requires Node.js)
echo.
set /p DEPLOY_METHOD="Select option (1 or 2): "

if "%DEPLOY_METHOD%"=="1" (
    echo.
    echo ========================================
    echo   Deployment Instructions for Dashboard
    echo ========================================
    echo.
    echo 1. Go to: https://dashboard.nosana.com/deploy
    echo 2. Upload the nosana.yaml file from this project
    echo 3. Set environment variable:
    echo    GROQ_API_KEY = %GROQ_API_KEY%
    echo 4. Docker image: %IMAGE_NAME%:%IMAGE_TAG%
    echo 5. Click Deploy
    echo.
    echo Press any key to open Nosana Dashboard...
    pause >nul
    start https://dashboard.nosana.com/deploy
) else if "%DEPLOY_METHOD%"=="2" (
    echo.
    echo Installing/Updating Nosana CLI...
    npm install -g @nosana/cli
    
    echo.
    echo Deploying with Nosana CLI...
    nosana deploy --config nosana.yaml --env GROQ_API_KEY=%GROQ_API_KEY%
)

echo.
echo ========================================
echo   Deployment Process Completed!
echo ========================================
echo.
echo Next Steps:
echo 1. Verify deployment on Nosana network
echo 2. Get your deployment URL
echo 3. Record video demo (1-3 minutes)
echo 4. Update README.md with deployment URL
echo 5. Submit on SuperTeam
echo 6. Post on social media with #NosanaAgentChallenge
echo.
echo Good luck with the challenge!
echo.
pause
