#!/usr/bin/env pwsh
# Deployment script for Reaction Speed Game
# Run this after authenticating with GitHub CLI and Vercel CLI

$ErrorActionPreference = "Stop"
$env:Path = "C:\Program Files\GitHub CLI;C:\Program Files\Git\cmd;$env:Path"

Write-Host "`n=== Step 1: GitHub Authentication ===" -ForegroundColor Cyan
gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please run: gh auth login" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n=== Step 2: Create GitHub Repository ===" -ForegroundColor Cyan
gh repo create reaction-speed-game --public --source=. --remote=origin --push 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Repo may already exist. Trying to add remote and push..." -ForegroundColor Yellow
    git remote add origin https://github.com/fayaz-ms/reaction-speed-game.git 2>&1
    git branch -M main 2>&1
    git push -u origin main 2>&1
}

Write-Host "`n=== Step 3: Deploy to Vercel ===" -ForegroundColor Cyan
npx vercel --prod --yes 2>&1

Write-Host "`n=== Deployment Complete ===" -ForegroundColor Green
Write-Host "GitHub: https://github.com/fayaz-ms/reaction-speed-game"
Write-Host "Run 'npx vercel' to get your deployment URL"
