# DevOps Troubleshooting Lab Cleanup Script (Windows)

Write-Host "Cleaning up DevOps Troubleshooting Lab..." -ForegroundColor Yellow

# Delete the production namespace
Write-Host "Deleting production namespace..." -ForegroundColor Cyan
kubectl delete namespace production --ignore-not-found=true

if ($LASTEXITCODE -eq 0) {
    Write-Host "Production namespace deleted" -ForegroundColor Green
}

Write-Host ""
Write-Host "Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Optional: Delete kind cluster" -ForegroundColor Yellow
Write-Host "  kind delete cluster --name devops-lab" -ForegroundColor White
