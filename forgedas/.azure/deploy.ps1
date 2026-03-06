# Forgedas Azure Deployment Script
# This script automates the deployment of the Forgedas React+Vite app to Azure

param(
    [Parameter(Mandatory=$true)]
    [string]$SubscriptionId,
    
    [Parameter(Mandatory=$false)]
    [string]$Location = "eastus",
    
    [Parameter(Mandatory=$false)]
    [string]$ResourceGroupName = "forge-rg",
    
    [Parameter(Mandatory=$false)]
    [string]$AppServiceName = "forgedas-app",
    
    [Parameter(Mandatory=$false)]
    [string]$AppServicePlanName = "forge-plan"
)

# Color output functions
function Write-Success { Write-Host "✓ $args" -ForegroundColor Green }
function Write-Error { Write-Host "✗ $args" -ForegroundColor Red }
function Write-Info { Write-Host "ℹ $args" -ForegroundColor Cyan }
function Write-Warning { Write-Host "⚠ $args" -ForegroundColor Yellow }

Write-Info "=== Forgedas Azure Deployment Script ===" 

# Step 1: Verify Azure CLI is installed
Write-Info "Step 1: Checking Azure CLI..."
try {
    $AzVersion = az --version 2>$null
    Write-Success "Azure CLI is installed"
} catch {
    Write-Error "Azure CLI not found. Please install it first:"
    Write-Warning "Download: https://aka.ms/installazurecliwindows"
    exit 1
}

# Step 2: Set subscription
Write-Info "Step 2: Setting Azure subscription..."
try {
    az account set --subscription $SubscriptionId 2>$null
    Write-Success "Subscription set successfully"
} catch {
    Write-Error "Failed to set subscription. Verify your subscription ID."
    exit 1
}

# Step 3: Build React app
Write-Info "Step 3: Building React+Vite application..."
try {
    npm install
    npm run build
    Write-Success "Application built successfully. Output: dist/"
} catch {
    Write-Error "Failed to build application"
    exit 1
}

# Step 4: Create resource group
Write-Info "Step 4: Creating resource group..."
try {
    az group create `
        --name $ResourceGroupName `
        --location $Location 2>$null | Out-Null
    Write-Success "Resource group '$ResourceGroupName' created"
} catch {
    Write-Warning "Resource group may already exist, continuing..."
}

# Step 5: Create App Service Plan
Write-Info "Step 5: Creating App Service Plan..."
try {
    az appservice plan create `
        --name $AppServicePlanName `
        --resource-group $ResourceGroupName `
        --sku S1 `
        --is-linux 2>$null | Out-Null
    Write-Success "App Service Plan created"
} catch {
    Write-Warning "App Service Plan may already exist, continuing..."
}

# Step 6: Create Web App
Write-Info "Step 6: Creating web app..."
try {
    az webapp create `
        --resource-group $ResourceGroupName `
        --plan $AppServicePlanName `
        --name $AppServiceName `
        --runtime "NODE|22-lts" 2>$null | Out-Null
    Write-Success "Web app '$AppServiceName' created"
} catch {
    Write-Warning "Web app may already exist, continuing..."
}

# Step 7: Configure app settings
Write-Info "Step 7: Configuring application settings..."
try {
    az webapp config appsettings set `
        --resource-group $ResourceGroupName `
        --name $AppServiceName `
        --settings NODE_ENV=production ENABLE_DIAGNOSTICS=true 2>$null | Out-Null
    Write-Success "App settings configured"
} catch {
    Write-Error "Failed to configure app settings"
    exit 1
}

# Step 8: Deploy application
Write-Info "Step 8: Creating deployment package..."
try {
    if (Test-Path "deploy.zip") {
        Remove-Item "deploy.zip" -Force
    }
    Compress-Archive -Path dist/* -DestinationPath deploy.zip -Force
    Write-Success "Deployment package created"
} catch {
    Write-Error "Failed to create deployment package"
    exit 1
}

Write-Info "Step 9: Deploying to Azure App Service..."
try {
    az webapp deployment source config-zip `
        --resource-group $ResourceGroupName `
        --name $AppServiceName `
        --src deploy.zip 2>$null | Out-Null
    Write-Success "Application deployed successfully!"
} catch {
    Write-Error "Failed to deploy application"
    exit 1
}

# Step 10: Get app URL
Write-Info "Step 10: Getting application URL..."
try {
    $AppUrl = az webapp show `
        --resource-group $ResourceGroupName `
        --name $AppServiceName `
        --query "defaultHostName" -o tsv
    
    Write-Success "Deployment complete!"
    Write-Info ""
    Write-Info "========== DEPLOYMENT SUMMARY =========="
    Write-Info "Resource Group: $ResourceGroupName"
    Write-Info "App Service: $AppServiceName"
    Write-Info "Location: $Location"
    Write-Info "App URL: https://$AppUrl"
    Write-Info "========================================"
    Write-Info ""
    Write-Info "Opening application in browser in 5 seconds..."
    Start-Sleep -Seconds 5
    Start-Process "https://$AppUrl"
} catch {
    Write-Error "Failed to retrieve application URL"
    Write-Info "Check the Azure Portal at: https://portal.azure.com"
    exit 1
}

Write-Success "Deployment script completed!"
