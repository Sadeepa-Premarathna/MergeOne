# Frontend Startup Script
Write-Host "Starting Frontend Server..." -ForegroundColor Green
Set-Location "S:\ITP\Inventory\Frontend"
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host "Starting npm run dev..." -ForegroundColor Yellow
& npm run dev