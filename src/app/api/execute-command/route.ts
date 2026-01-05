import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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

// Mock command execution - in production, this would connect to a real kubectl executor
async function executeKubectlCommand(
  command: string
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  // This is a mock implementation
  // In production, you would:
  // 1. Connect to a secure Kubernetes cluster
  // 2. Execute the command in an isolated container
  // 3. Stream the output

  // For now, return mock responses based on common commands
  const mockResponses: Record<string, any> = {
    "kubectl get pods": {
      stdout:
        "NAME                     READY   STATUS    RESTARTS   AGE\npayment-service          0/1     CrashLoopBackOff   5      10m",
      stderr: "",
      exitCode: 0,
    },
    "kubectl get pods -A": {
      stdout:
        "NAMESPACE     NAME                                      READY   STATUS\ndefault       payment-service                           0/1     CrashLoopBackOff\nkube-system   coredns-787d4945fb-xxxxx                  1/1     Running",
      stderr: "",
      exitCode: 0,
    },
    "kubectl describe pod payment-service": {
      stdout: `Name:         payment-service
Namespace:    default
Status:       Running
Events:
  Type     Reason     Age   From               Message
  ----     ------     ---   ----               -------
  Normal   Created    1m    kubelet            Created container payment-service
  Warning  BackOff    30s   kubelet            Back-off restarting failed container`,
      stderr: "",
      exitCode: 0,
    },
    "kubectl logs payment-service": {
      stdout:
        "Error: connection refused\nFailed to connect to database on localhost:5432\nApplication failed to start",
      stderr: "",
      exitCode: 0,
    },
  };

  // Simple matching
  for (const [key, value] of Object.entries(mockResponses)) {
    if (command.includes(key.split(" ")[2] || "")) {
      return value;
    }
  }

  return {
    stdout: `Command executed: ${command}`,
    stderr: "",
    exitCode: 0,
  };
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
