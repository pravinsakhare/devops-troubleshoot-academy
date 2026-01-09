# DevOps Troubleshooting Academy

Interactive platform for learning Kubernetes troubleshooting through hands-on scenarios.

## Prerequisites

- Node.js 18+ 
- Docker (for kind clusters)
- kubectl (for interacting with Kubernetes)
- kind (for creating local Kubernetes clusters) - [Install](https://kind.sigs.k8s.io/docs/user/quick-start/)

## Quick Start

### 1. Install Dependencies

```bash
npm install
npm install xterm xterm-addon-fit node-pty
```

### 2. Setup Kubernetes Lab Environment

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Create cluster and scenario
./scripts/setup-k8s-lab.sh
```

This will:
- Create a local Kubernetes cluster (if needed)
- Create the `production` namespace
- Deploy the `payment-service` pod with CrashLoopBackOff issue

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000/workspace/1](http://localhost:3000/workspace/1)

## Available Scenarios

### Scenario 1: Pod CrashLoopBackOff Mystery

**Objective:** Fix a pod that keeps crashing and restarting.

**What's wrong:**
- The payment-service pod has an incorrect command (`exit 1`)
- Container immediately exits, causing Kubernetes to restart it
- This creates a CrashLoopBackOff state

**How to fix:**
1. Check pod status: `kubectl get pods -n production`
2. View logs: `kubectl logs payment-service -n production`
3. Describe pod: `kubectl describe pod payment-service -n production`
4. Edit and fix the pod manifest
5. Redeploy the corrected pod

## Useful Commands

### View Pod Status
```bash
kubectl get pods -n production
kubectl describe pod payment-service -n production
```

### View Logs
```bash
kubectl logs payment-service -n production
kubectl logs payment-service -n production --previous  # Previous restart logs
```

### Get Events
```bash
kubectl get events -n production
```

### Reset Scenario
```bash
./scripts/reset-scenario.sh
```

### Cleanup Lab
```bash
./scripts/cleanup-k8s-lab.sh
```

## Architecture

- **Frontend:** Next.js + React + Tailwind CSS
- **Terminal:** xterm.js for interactive shell
- **Backend:** Node.js with WebSocket support
- **Shell:** node-pty for PTY (pseudo-terminal) spawning
- **Kubernetes:** kind/k3s/minikube for local clusters

## Development

### File Structure

