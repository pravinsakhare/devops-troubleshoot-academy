import { NextRequest, NextResponse } from "next/server";

// Store terminal sessions in memory
const sessions = new Map<string, { commandBuffer: string; lastCommand: string }>();

export async function POST(request: NextRequest) {
  try {
    const { sessionId, input } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: "No session ID" }, { status: 400 });
    }

    // Create session if doesn't exist
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, { commandBuffer: "", lastCommand: "" });
    }

    const session = sessions.get(sessionId)!;
    let output = "";
    let isCommand = false;

    // Handle input
    if (input === "\r" || input === "\n" || input === "\r\n") {
      // Execute command
      const command = session.commandBuffer.trim();
      session.commandBuffer = "";

      if (command) {
        session.lastCommand = command;
        output = handleCommand(command);
        isCommand = true;
      }

      output += "\r\n$ ";
    } else if (input === "\u007F" || input === "\b") {
      // Backspace
      if (session.commandBuffer.length > 0) {
        session.commandBuffer = session.commandBuffer.slice(0, -1);
      }
      output = input;
    } else if (input === "\u0003") {
      // Ctrl+C
      session.commandBuffer = "";
      output = "^C\r\n$ ";
    } else if (input === "\u0015") {
      // Ctrl+U - clear line
      session.commandBuffer = "";
      output = "\r\n$ ";
    } else {
      // Regular character
      session.commandBuffer += input;
      output = input;
    }

    return NextResponse.json({ output, isCommand });
  } catch (error) {
    console.error("Terminal API error:", error);
    return NextResponse.json(
      { error: "Terminal error" },
      { status: 500 }
    );
  }
}

function handleCommand(command: string): string {
  const trimmed = command.trim().toLowerCase();

  // Clear command
  if (trimmed === "clear" || trimmed === "cls") {
    return "\x1b[2J\x1b[H"; // ANSI clear screen code
  }

  // Echo command
  if (trimmed.startsWith("echo ")) {
    const text = command.trim().substring(5);
    return text;
  }

  // pwd command
  if (trimmed === "pwd") {
    return "/workspace";
  }

  // ls command
  if (trimmed === "ls" || trimmed === "ls -la") {
    return `total 48
drwxr-xr-x  3 user user  4096 Jan  9 20:00 .
drwxr-xr-x  1 user user  4096 Jan  9 19:00 ..
-rw-r--r--  1 user user   256 Jan  9 19:00 kubeconfig
-rw-r--r--  1 user user   512 Jan  9 19:00 config.yaml
drwxr-xr-x  2 user user  4096 Jan  9 19:00 manifests`;
  }

  // kubectl get pods
  if (trimmed.includes("get pods") && trimmed.includes("production")) {
    return `NAME              READY   STATUS             RESTARTS       AGE
payment-service   0/1     CrashLoopBackOff   5 (22s ago)   10m
web-frontend      1/1     Running            0              2h
auth-service      1/1     Running            0              2h`;
  }

  // kubectl describe pod
  if (trimmed.includes("describe pod") && trimmed.includes("payment-service")) {
    return `Name:         payment-service
Namespace:    production
Status:       CrashLoopBackOff
Image:        alpine:latest
Command:      sh,-c,exit 1
State:        Waiting
Reason:       CrashLoopBackOff
Last State:   Terminated
Reason:       Error
Exit Code:    1
Message:      Container failed to run`;
  }

  // kubectl logs
  if (trimmed.includes("logs") && trimmed.includes("payment-service")) {
    return `Error: exit 1`;
  }

  // kubectl get events
  if (trimmed.includes("get events")) {
    return `LAST SEEN   TYPE      REASON            OBJECT                     MESSAGE
10m         Normal    Created           pod/payment-service       Created container payment
10m         Warning   BackOff           pod/payment-service       Back-off restarting failed container`;
  }

  // kubectl get ns / namespaces
  if (trimmed.includes("get ns") || trimmed.includes("get namespace")) {
    return `NAME                 STATUS   AGE
default              Active   35m
kube-node-lease      Active   35m
kube-public          Active   35m
kube-system          Active   35m
production           Active   35m`;
  }

  // Help command
  if (trimmed === "help" || trimmed === "?") {
    return `Available commands:
  clear                                        Clear screen
  echo <text>                                  Print text
  pwd                                          Print working directory
  ls                                           List files
  
Available kubectl commands:
  kubectl get pods -n production              List all pods
  kubectl describe pod payment-service -n production  Get pod details
  kubectl logs payment-service -n production   View pod logs
  kubectl get events -n production             View cluster events
  kubectl get namespaces                       List namespaces
  help                                         Show this help message`;
  }

  // Unknown command
  if (trimmed) {
    return `bash: ${command}: command not found`;
  }

  return "";
}
