@echo off
REM ============================================================
REM BounceLab CloudBase 部署脚本
REM 前端: https://bouncelab-d5glxli5o912776b1-1442336510.tcloudbaseapp.com
REM API:  https://bouncelab-d5glxli5o912776b1.service.tcloudbase.com/api
REM ============================================================
setlocal enabledelayedexpansion

set ENV_ID=bouncelab-d5glxli5o912776b1

echo === BounceLab CloudBase 部署 ===
echo.

echo [1/4] Building Next.js...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo BUILD FAILED!
    exit /b 1
)
echo Build completed.
echo.

echo [2/4] Deploying API cloud function...
call npx @cloudbase/cli fn deploy bouncelab-api --path /api --force -e %ENV_ID%
if %ERRORLEVEL% neq 0 exit /b 1
echo.

echo [3/4] Deploying static assets (JS/CSS/fonts)...
call npx @cloudbase/cli hosting deploy .next/static /_next/static -e %ENV_ID%
if %ERRORLEVEL% neq 0 exit /b 1
echo.

echo [4/4] Deploying HTML pages...
call npx @cloudbase/cli hosting deploy .next/server/app / -e %ENV_ID%
if %ERRORLEVEL% neq 0 exit /b 1
echo.

echo === 部署完成! ===
echo 前端: https://bouncelab-d5glxli5o912776b1-1442336510.tcloudbaseapp.com
echo API:  https://bouncelab-d5glxli5o912776b1.service.tcloudbase.com/api
echo 注意: CDN 缓存可能需要几分钟刷新

echo [3/3] Deploying HTML pages and server files...
call npx @cloudbase/cli hosting deploy .next/server/app / -e %ENV_ID%
if %ERRORLEVEL% neq 0 exit /b 1
echo.

echo === 部署完成! ===
echo 访问: https://bouncelab-d5glxli5o912776b1-1442336510.tcloudbaseapp.com
echo 注意: CDN 缓存可能需要几分钟刷新
