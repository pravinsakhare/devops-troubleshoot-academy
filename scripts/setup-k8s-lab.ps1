# DevOps Troubleshooting Lab Setup Script (Windows)
# Simple version without embedded YAML

Write-Host "Setup starting..." -ForegroundColor Cyan

# Check if kubectl is installed
if (-not (Get-Command kubectl -ErrorAction SilentlyContinue)) {
    Write-Host "kubectl is not installed." -ForegroundColor Red
    exit 1
}

# Check if cluster is accessible
$clusterInfo = kubectl cluster-info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "No cluster found. Checking for kind..." -ForegroundColor Yellow
    
    if (-not (Get-Command kind -ErrorAction SilentlyContinue)) {
        Write-Host "kind is not installed." -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Creating cluster with kind..." -ForegroundColor Cyan
    kind create cluster --name devops-lab
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Cluster created with kind" -ForegroundColor Green
    }
} else {
    Write-Host "Cluster is accessible" -ForegroundColor Green
}

# Create production namespace
Write-Host "Creating production namespace..." -ForegroundColor Cyan
kubectl create namespace production --dry-run=client -o yaml | kubectl apply -f -
Write-Host "Production namespace ready" -ForegroundColor Green

# Create the CrashLoopBackOff scenario using kubectl apply
Write-Host "Creating payment-service pod with CrashLoopBackOff issue..." -ForegroundColor Cyan

$yamlFile = [System.IO.Path]::Combine($PSScriptRoot, "payment-service.yaml")

kubectl apply -f $yamlFile
if ($LASTEXITCODE -eq 0) {
    Write-Host "Payment service pod created" -ForegroundColor Green
} else {
    Write-Host "Failed to create payment service pod" -ForegroundColor Red
}

# Verify pod status
Write-Host ""
Write-Host "Pod Status:" -ForegroundColor Cyan
kubectl get pods -n production

Write-Host ""
Write-Host "Lab setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Start the dev server: npm run dev" -ForegroundColor White
Write-Host "  2. Navigate to: http://localhost:3000/workspace/1" -ForegroundColor White
Write-Host "  3. Use kubectl commands to troubleshoot the payment-service pod" -ForegroundColor White
Write-Host ""
Write-Host "Try these commands in the terminal:" -ForegroundColor Cyan
Write-Host "  - kubectl get pods -n production" -ForegroundColor White
Write-Host "  - kubectl describe pod payment-service -n production" -ForegroundColor White
Write-Host "  - kubectl logs payment-service -n production" -ForegroundColor White
