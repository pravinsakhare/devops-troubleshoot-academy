#!/bin/bash

set -e

echo "🚀 Setting up DevOps Troubleshooting Lab..."

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed. Please install it first."
    exit 1
fi

# Check if cluster is accessible
if ! kubectl cluster-info &> /dev/null; then
    echo "⚠️  No cluster found. Creating one with kind..."
    
    if ! command -v kind &> /dev/null; then
        echo "❌ kind is not installed. Install it from: https://kind.sigs.k8s.io/"
        exit 1
    fi
    
    kind create cluster --name devops-lab
    echo "✓ Cluster created with kind"
else
    echo "✓ Cluster is accessible"
fi

# Create production namespace
echo "Creating production namespace..."
kubectl create namespace production --dry-run=client -o yaml | kubectl apply -f -
echo "✓ Production namespace ready"

# Create the CrashLoopBackOff scenario
echo "Creating payment-service pod with CrashLoopBackOff issue..."
kubectl apply -f - <<'YAML'
apiVersion: v1
kind: Pod
metadata:
  name: payment-service
  namespace: production
  labels:
    app: payment-service
    version: v1.2.0
spec:
  containers:
  - name: payment
    image: alpine:latest
    command: ["sh", "-c", "exit 1"]
    ports:
    - containerPort: 8080
    resources:
      limits:
        memory: "128Mi"
        cpu: "500m"
      requests:
        memory: "64Mi"
        cpu: "250m"
    env:
    - name: DATABASE_URL
      value: "postgres://db:5432/payments"
    - name: API_KEY
      value: "test-key-12345"
    livenessProbe:
      httpGet:
        path: /health
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 10
YAML

echo "✓ Payment service pod created"

# Verify pod status
echo ""
echo "Pod Status:"
kubectl get pods -n production

echo ""
echo "✅ Lab setup complete!"
echo ""
echo "📚 Next steps:"
echo "  1. Start the dev server: npm run dev"
echo "  2. Navigate to: http://localhost:3000/workspace/1"
echo "  3. Use kubectl commands to troubleshoot the payment-service pod"
echo ""
echo "🔍 Try these commands in the terminal:"
echo "  • kubectl get pods -n production"
echo "  • kubectl describe pod payment-service -n production"
echo "  • kubectl logs payment-service -n production"
echo ""
echo "For Windows users, run the setup script using:"
echo "  scripts\\setup-k8s-lab.bat"
