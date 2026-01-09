#!/bin/bash

set -e

echo "🧹 Cleaning up DevOps Troubleshooting Lab..."

# Delete the production namespace (removes all pods)
echo "Deleting production namespace..."
kubectl delete namespace production --ignore-not-found=true

echo "✓ Production namespace deleted"

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "Optional: Delete kind cluster"
echo "  kind delete cluster --name devops-lab"
