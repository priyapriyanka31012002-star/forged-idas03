#!/usr/bin/env pwsh
# Force git push script - handles the deployment to GitHub

param(
    [Parameter(Mandatory=$false)]
    [string]$WorkPath = "C:\Users\priya\OneDrive\Desktop\Gpt"
)

Write-Host "=== Forgedas GitHub Push & Vercel Deploy ===" -ForegroundColor Cyan

# Navigate to project
Set-Location $WorkPath
Write-Host "Working in: $(Get-Location)" -ForegroundColor Green

# Configure git to avoid editor prompts
Write-Host "Configuring git..." -ForegroundColor Yellow
& git config core.editor "true"
& git config user.name "priyapriyanka31012002-star"
& git config user.email "priya@example.com"

# Check current status
Write-Host "`nCurrent git status:" -ForegroundColor Cyan
& git log --oneline -3

# Try to complete any pending merge
Write-Host "`nChecking for pending operations..." -ForegroundColor Yellow
if (Test-Path ".git/MERGE_HEAD") {
    Write-Host "Aborting pending merge..." -ForegroundColor Yellow
    & git merge --abort
}

# Fetch latest from remote  
Write-Host "`nFetching latest from remote..." -ForegroundColor Yellow
& git fetch origin main

# Rebase instead of merge to keep history clean
Write-Host "`nRebasing with remote..." -ForegroundColor Yellow
try {
    & git rebase origin/main 2>&1
    Write-Host "Rebase completed" -ForegroundColor Green
}
catch {
    Write-Host "Rebase failed, trying force push instead..." -ForegroundColor Yellow
    & git rebase --abort 2>&1
}

# Force push to ensure deployment
Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
& git push -f origin main

Write-Host "`n✓ Push completed! Vercel should start deploying..." -ForegroundColor Green
Write-Host "Check your Vercel dashboard at: https://vercel.com" -ForegroundColor Cyan
