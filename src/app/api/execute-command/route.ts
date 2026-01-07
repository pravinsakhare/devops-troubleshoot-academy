import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Environment configuration for kubectl execution
const KUBECTL_EXECUTION_MODE = process.env.KUBECTL_EXECUTION_MODE || "mock"; // "real" | "mock"
const KUBECTL_TIMEOUT_MS = parseInt(process.env.KUBECTL_TIMEOUT_MS || "30000", 10);

// Whitelist of allowed kubectl commands for safety
const ALLOWED_KUBECTL_COMMANDS = [
  "get",
  "describe",
  "logs",
  "exec",
  "port-forward",
  "apply",
  "delete",
  "rollout",
  "status",
  "events",
  "top",
  "explain",
  "api-resources",
  "config",
  "version",
];

// Blacklist patterns to prevent dangerous operations
const BLOCKED_PATTERNS = [
  /\$\(/g, // Command substitution
  /`/g, // Backticks
  /\|/g, // Pipes (only allow specific safe pipes)
  />/g, // Output redirection
  /</g, // Input redirection
  /;/g, // Command chaining
  /&&/g, // Logical operators
  /\|\|/g, // Logical operators
  /rm\s+-rf/g, // Dangerous rm command
  /mkfs/g, // File system operations
];

const ExecuteCommandSchema = z.object({
  command: z
    .string()
    .min(1, "Command cannot be empty")
    .max(500, "Command too long"),
  workspaceId: z.string().uuid("Invalid workspace ID"),
});

type ExecuteCommandRequest = z.infer<typeof ExecuteCommandSchema>;

// Validate and sanitize kubectl commands
function validateCommand(command: string): { valid: boolean; error?: string } {
  // Check for blocked patterns
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(command)) {
      return { valid: false, error: "Command contains blocked characters" };
    }
  }

  // Parse the command
  const parts = command.split(/\s+/).filter(Boolean);
  if (parts[0] !== "kubectl") {
    return { valid: false, error: "Only kubectl commands are allowed" };
  }

  // Check if second part is in allowed list
  if (parts.length < 2) {
    return { valid: false, error: "Command too short" };
  }

  const action = parts[1].toLowerCase();
  if (!ALLOWED_KUBECTL_COMMANDS.includes(action)) {
    return { valid: false, error: `Command '${action}' is not allowed` };
  }

  // Additional safety checks
  if (action === "delete" && !command.includes("--dry-run")) {
    // Could enforce dry-run for destructive operations
    // return { valid: false, error: "Use --dry-run flag for delete operations" };
  }

  return { valid: true };
}

// Real kubectl command execution
async function executeRealKubectl(
  command: string
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  try {
    const { stdout, stderr } = await execAsync(command, {
      timeout: KUBECTL_TIMEOUT_MS,
      maxBuffer: 1024 * 1024, // 1MB max output
      env: {
        ...process.env,
        // Ensure KUBECONFIG is set if available
        KUBECONFIG: process.env.KUBECONFIG || `${process.env.HOME}/.kube/config`,
      },
    });

    return {
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      exitCode: 0,
    };
  } catch (error: any) {
    // exec throws on non-zero exit codes
    return {
      stdout: error.stdout?.trim() || "",
      stderr: error.stderr?.trim() || error.message,
      exitCode: error.code || 1,
    };
  }
}

// Mock command execution for development/testing
function executeMockKubectl(
  command: string
): { stdout: string; stderr: string; exitCode: number } {
  // Expanded mock responses for comprehensive testing
  const mockResponses: Record<string, any> = {
    "kubectl get pods": {
      stdout:
        "NAME                     READY   STATUS             RESTARTS   AGE\npayment-service          0/1     CrashLoopBackOff   5          10m\napi-gateway-5d7f8c9b    1/1     Running            0          2h\nredis-cache-7f4d9c8     1/1     Running            0          1d",
      stderr: "",
      exitCode: 0,
    },
    "kubectl get pods -A": {
      stdout:
        "NAMESPACE     NAME                                      READY   STATUS             RESTARTS   AGE\ndefault       payment-service                           0/1     CrashLoopBackOff   5          10m\ndefault       api-gateway-5d7f8c9b                      1/1     Running            0          2h\nkube-system   coredns-787d4945fb-xxxxx                  1/1     Running            0          5d\nkube-system   etcd-master                               1/1     Running            0          5d\nmonitoring    prometheus-7f9d8c6b5                      1/1     Running            0          3d",
      stderr: "",
      exitCode: 0,
    },
    "kubectl get services": {
      stdout:
        "NAME              TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE\nkubernetes        ClusterIP   10.96.0.1        <none>        443/TCP        5d\npayment-service   ClusterIP   10.96.45.123     <none>        8080/TCP       10m\napi-gateway       LoadBalancer 10.96.89.45     34.102.136.5  80:30080/TCP   2h",
      stderr: "",
      exitCode: 0,
    },
    "kubectl get deployments": {
      stdout:
        "NAME              READY   UP-TO-DATE   AVAILABLE   AGE\npayment-service   0/1     1            0           10m\napi-gateway       1/1     1            1           2h\nredis-cache       1/1     1            1           1d",
      stderr: "",
      exitCode: 0,
    },
    "kubectl get nodes": {
      stdout:
        "NAME           STATUS   ROLES           AGE   VERSION\nmaster-node    Ready    control-plane   5d    v1.28.0\nworker-node-1  Ready    <none>          5d    v1.28.0\nworker-node-2  Ready    <none>          5d    v1.28.0",
      stderr: "",
      exitCode: 0,
    },
    "kubectl describe pod payment-service": {
      stdout: `Name:         payment-service
Namespace:    default
Priority:     0
Node:         worker-node-1/192.168.1.10
Start Time:   Mon, 01 Jan 2024 10:00:00 +0000
Labels:       app=payment-service
Status:       Running
IP:           10.244.1.5
Containers:
  payment:
    Image:         myregistry/payment-service:v1.2.3
    Port:          8080/TCP
    State:         Waiting
      Reason:      CrashLoopBackOff
    Last State:    Terminated
      Reason:      Error
      Exit Code:   1
    Ready:         False
    Restart Count: 5
    Environment:
      DATABASE_URL:  postgres://localhost:5432/payments
Events:
  Type     Reason     Age                From               Message
  ----     ------     ----               ----               -------
  Normal   Scheduled  10m                default-scheduler  Successfully assigned default/payment-service
  Normal   Pulled     9m (x5 over 10m)   kubelet            Container image pulled
  Normal   Created    9m (x5 over 10m)   kubelet            Created container payment
  Warning  BackOff    30s (x25 over 9m)  kubelet            Back-off restarting failed container`,
      stderr: "",
      exitCode: 0,
    },
    "kubectl logs payment-service": {
      stdout: `2024-01-01 10:00:01 INFO  Starting Payment Service v1.2.3
2024-01-01 10:00:02 INFO  Connecting to database at postgres://localhost:5432/payments
2024-01-01 10:00:05 ERROR Connection refused - localhost:5432
2024-01-01 10:00:05 ERROR Failed to initialize database connection
2024-01-01 10:00:05 FATAL Application startup failed: unable to connect to database
Error: connection refused
Failed to connect to database on localhost:5432
Application failed to start`,
      stderr: "",
      exitCode: 0,
    },
    "kubectl get events": {
      stdout: `LAST SEEN   TYPE      REASON              OBJECT                        MESSAGE
30s         Warning   BackOff             pod/payment-service           Back-off restarting failed container
2m          Normal    Pulled              pod/payment-service           Container image pulled
5m          Normal    Created             pod/payment-service           Created container payment
10m         Normal    Scheduled           pod/payment-service           Successfully assigned default/payment-service
1h          Normal    NodeReady           node/worker-node-1            Node worker-node-1 status is now: NodeReady`,
      stderr: "",
      exitCode: 0,
    },
    "kubectl version": {
      stdout: `Client Version: v1.28.0
Kustomize Version: v5.0.4-0.20230601165947-6ce0bf390ce3
Server Version: v1.28.0`,
      stderr: "",
      exitCode: 0,
    },
    "kubectl top pods": {
      stdout: `NAME                     CPU(cores)   MEMORY(bytes)
payment-service          25m          128Mi
api-gateway-5d7f8c9b     50m          256Mi
redis-cache-7f4d9c8      10m          64Mi`,
      stderr: "",
      exitCode: 0,
    },
    "kubectl top nodes": {
      stdout: `NAME           CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%
master-node    250m         12%    1024Mi          25%
worker-node-1  500m         25%    2048Mi          50%
worker-node-2  300m         15%    1536Mi          38%`,
      stderr: "",
      exitCode: 0,
    },
  };

  // Try exact match first
  if (mockResponses[command]) {
    return mockResponses[command];
  }

  // Fuzzy matching for partial commands
  const commandParts = command.split(" ");
  if (commandParts.length >= 3) {
    const baseCommand = commandParts.slice(0, 3).join(" ");
    if (mockResponses[baseCommand]) {
      return mockResponses[baseCommand];
    }
  }

  // Default response for unmatched commands
  return {
    stdout: `Mock response for: ${command}\n(Set KUBECTL_EXECUTION_MODE=real for actual cluster execution)`,
    stderr: "",
    exitCode: 0,
  };
}

// Main execution function that switches between real and mock
async function executeKubectlCommand(
  command: string
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  if (KUBECTL_EXECUTION_MODE === "real") {
    console.log(`[kubectl] Executing real command: ${command}`);
    return executeRealKubectl(command);
  } else {
    console.log(`[kubectl] Executing mock command: ${command}`);
    return executeMockKubectl(command);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { command, workspaceId } = ExecuteCommandSchema.parse(body);

    // Validate command safety
    const validation = validateCommand(command);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Execute the command
    const result = await executeKubectlCommand(command);

    return NextResponse.json({
      success: true,
      command,
      workspaceId,
      output: result.stdout,
      error: result.stderr,
      exitCode: result.exitCode,
      timestamp: new Date().toISOString(),
      executionMode: KUBECTL_EXECUTION_MODE,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request format", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to execute command" },
      { status: 500 }
    );
  }
}
