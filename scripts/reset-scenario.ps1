# DevOps Troubleshooting Scenario Reset Script (Windows)

Write-Host "Resetting scenario..." -ForegroundColor Yellow

# Delete the pod
Write-Host "Deleting payment-service pod..." -ForegroundColor Cyan
kubectl delete pod payment-service -n production --ignore-not-found=true

if ($LASTEXITCODE -eq 0) {
    Write-Host "Pod deleted" -ForegroundColor Green
}

# Wait for deletion
Start-Sleep -Seconds 2

# Recreate the pod using YAML file
Write-Host "Recreating payment-service pod..." -ForegroundColor Cyan

$yamlFile = [System.IO.Path]::Combine($PSScriptRoot, "payment-service.yaml")

kubectl apply -f $yamlFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "Scenario reset complete" -ForegroundColor Green
}

Write-Host ""
kubectl get pods -n production
