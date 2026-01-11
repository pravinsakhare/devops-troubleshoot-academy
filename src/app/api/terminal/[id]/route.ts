import { NextRequest, NextResponse } from "next/server";

// Store terminal sessions in memory
const sessions = new Map<string, { commandBuffer: string; lastCommand: string; history: string[] }>();

export async function POST(request: NextRequest) {
  try {
    const { sessionId, input, command } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: "No session ID" }, { status: 400 });
    }

    // Create session if doesn't exist
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, { commandBuffer: "", lastCommand: "", history: [] });
    }

    const session = sessions.get(sessionId)!;
    let output = "";
    let isCommand = false;

    // Handle command execution (new enhanced way)
    if (command !== undefined && (input === "\r" || input === "\n" || input === "\r\n")) {
      const cmd = command.trim();
      if (cmd) {
        // Add to session history
        if (session.history.length === 0 || session.history[session.history.length - 1] !== cmd) {
          session.history.push(cmd);
          // Limit history size
          if (session.history.length > 100) {
            session.history = session.history.slice(-100);
          }
        }
        session.lastCommand = cmd;
        output = handleCommand(cmd);
        isCommand = true;
      }
      // Note: Prompt is handled by client
    } else if (input === "\r" || input === "\n" || input === "\r\n") {
      // Legacy support - execute command from buffer
      const cmd = session.commandBuffer.trim();
      session.commandBuffer = "";

      if (cmd) {
        if (session.history.length === 0 || session.history[session.history.length - 1] !== cmd) {
          session.history.push(cmd);
          if (session.history.length > 100) {
            session.history = session.history.slice(-100);
          }
        }
        session.lastCommand = cmd;
        output = handleCommand(cmd);
        isCommand = true;
      }
    } else if (input === "\u007F" || input === "\b") {
      // Backspace
      if (session.commandBuffer.length > 0) {
        session.commandBuffer = session.commandBuffer.slice(0, -1);
      }
      output = input;
    } else if (input === "\u0003") {
      // Ctrl+C
      session.commandBuffer = "";
      output = "\x1b[1;31m^C\x1b[0m";
    } else if (input === "\u0015") {
      // Ctrl+U - clear line
      session.commandBuffer = "";
      output = "";
    } else {
      // Regular character
      session.commandBuffer += input;
      output = input;
    }

    return NextResponse.json({ output, isCommand, history: session.history });
  } catch (error) {
    console.error("Terminal API error:", error);
    return NextResponse.json(
      { error: "Terminal error", output: "\x1b[1;31mError: Command execution failed\x1b[0m" },
      { status: 500 }
    );
  }
}

// Get command history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "No session ID" }, { status: 400 });
    }

    const session = sessions.get(sessionId);
    return NextResponse.json({ history: session?.history || [] });
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
  const originalCommand = command.trim();

  // Clear command
  if (trimmed === "clear" || trimmed === "cls") {
    return "\x1b[2J\x1b[H"; // ANSI clear screen code
  }

  // Exit command
  if (trimmed === "exit" || trimmed === "quit") {
    return "\x1b[1;33mUse the browser's back button or close the tab to exit\x1b[0m";
  }

  // History command
  if (trimmed === "history") {
    // This would need session access, but for now return a message
    return "\x1b[1;36mUse Arrow Up/Down keys to navigate command history\x1b[0m";
  }

  // Echo command with ANSI support
  if (trimmed.startsWith("echo ")) {
    const text = originalCommand.substring(5);
    // Support echo -e for escape sequences
    if (text.startsWith("-e ")) {
      return text.substring(3);
    }
    return text;
  }

  // pwd command
  if (trimmed === "pwd") {
    return "\x1b[1;32m/workspace\x1b[0m";
  }

  // ls command with color
  if (trimmed === "ls" || trimmed === "ls -la" || trimmed === "ls -l") {
    return `\x1b[1;34mtotal 48\x1b[0m
\x1b[1;34mdrwxr-xr-x\x1b[0m  3 user user  4096 Jan  9 20:00 \x1b[1;36m.\x1b[0m
\x1b[1;34mdrwxr-xr-x\x1b[0m  1 user user  4096 Jan  9 19:00 \x1b[1;36m..\x1b[0m
-rw-r--r--  1 user user   256 Jan  9 19:00 \x1b[1;32mkubeconfig\x1b[0m
-rw-r--r--  1 user user   512 Jan  9 19:00 \x1b[1;32mconfig.yaml\x1b[0m
\x1b[1;34mdrwxr-xr-x\x1b[0m  2 user user  4096 Jan  9 19:00 \x1b[1;36mmanifests\x1b[0m`;
  }

  // kubectl get pods with color
  if (trimmed.includes("get pods") && trimmed.includes("production")) {
    return `NAME              READY   STATUS             RESTARTS       AGE
\x1b[1;31mpayment-service\x1b[0m   0/1     \x1b[1;31mCrashLoopBackOff\x1b[0m   5 (22s ago)   10m
\x1b[1;32mweb-frontend\x1b[0m      1/1     \x1b[1;32mRunning\x1b[0m            0              2h
\x1b[1;32mauth-service\x1b[0m       1/1     \x1b[1;32mRunning\x1b[0m            0              2h`;
  }

  // kubectl get pods (without namespace)
  if (trimmed.includes("get pods") && !trimmed.includes("-n")) {
    return `\x1b[1;33mWarning: Please specify namespace with -n production\x1b[0m
NAME              READY   STATUS             RESTARTS       AGE
\x1b[1;31mpayment-service\x1b[0m   0/1     \x1b[1;31mCrashLoopBackOff\x1b[0m   5 (22s ago)   10m
\x1b[1;32mweb-frontend\x1b[0m      1/1     \x1b[1;32mRunning\x1b[0m            0              2h
\x1b[1;32mauth-service\x1b[0m       1/1     \x1b[1;32mRunning\x1b[0m            0              2h`;
  }

  // kubectl describe pod with color
  if (trimmed.includes("describe pod") && trimmed.includes("payment-service")) {
    return `\x1b[1;36mName:\x1b[0m         payment-service
\x1b[1;36mNamespace:\x1b[0m    production
\x1b[1;36mStatus:\x1b[0m       \x1b[1;31mCrashLoopBackOff\x1b[0m
\x1b[1;36mImage:\x1b[0m        alpine:latest
\x1b[1;36mCommand:\x1b[0m      \x1b[1;31msh,-c,exit 1\x1b[0m
\x1b[1;36mState:\x1b[0m        Waiting
\x1b[1;36mReason:\x1b[0m       \x1b[1;31mCrashLoopBackOff\x1b[0m
\x1b[1;36mLast State:\x1b[0m   Terminated
\x1b[1;36mReason:\x1b[0m       \x1b[1;31mError\x1b[0m
\x1b[1;36mExit Code:\x1b[0m    \x1b[1;31m1\x1b[0m
\x1b[1;36mMessage:\x1b[0m      \x1b[1;31mContainer failed to run\x1b[0m`;
  }

  // kubectl logs with color
  if (trimmed.includes("logs") && trimmed.includes("payment-service")) {
    return `\x1b[1;31mError: exit 1\x1b[0m
\x1b[1;33mContainer command is set to 'exit 1', causing immediate failure\x1b[0m`;
  }

  // kubectl get events with color
  if (trimmed.includes("get events")) {
    return `LAST SEEN   TYPE      REASON            OBJECT                     MESSAGE
10m         \x1b[1;32mNormal\x1b[0m    Created           pod/payment-service       Created container payment
10m         \x1b[1;33mWarning\x1b[0m   BackOff           pod/payment-service       Back-off restarting failed container`;
  }

  // kubectl get ns / namespaces
  if (trimmed.includes("get ns") || trimmed.includes("get namespace") || trimmed === "kubectl get namespaces") {
    return `NAME                 STATUS   AGE
default              \x1b[1;32mActive\x1b[0m   35m
kube-node-lease      \x1b[1;32mActive\x1b[0m   35m
kube-public          \x1b[1;32mActive\x1b[0m   35m
kube-system          \x1b[1;32mActive\x1b[0m   35m
production           \x1b[1;32mActive\x1b[0m   35m`;
  }

  // Help command with better formatting
  if (trimmed === "help" || trimmed === "?") {
    return `\x1b[1;36m=== Available Commands ===\x1b[0m

\x1b[1;32mSystem Commands:\x1b[0m
  \x1b[1;33mclear\x1b[0m                                        Clear screen
  \x1b[1;33mcls\x1b[0m                                          Clear screen
  \x1b[1;33mecho <text>\x1b[0m                                   Print text
  \x1b[1;33mpwd\x1b[0m                                          Print working directory
  \x1b[1;33mls\x1b[0m                                           List files
  \x1b[1;33mhistory\x1b[0m                                      Show command history
  \x1b[1;33mhelp\x1b[0m                                         Show this help message

\x1b[1;32mKubectl Commands:\x1b[0m
  \x1b[1;33mkubectl get pods -n production\x1b[0m              List all pods
  \x1b[1;33mkubectl describe pod payment-service -n production\x1b[0m  Get pod details
  \x1b[1;33mkubectl logs payment-service -n production\x1b[0m   View pod logs
  \x1b[1;33mkubectl get events -n production\x1b[0m             View cluster events
  \x1b[1;33mkubectl get namespaces\x1b[0m                       List namespaces

\x1b[1;36m=== Keyboard Shortcuts ===\x1b[0m
  \x1b[1;33m↑/↓\x1b[0m         Navigate command history
  \x1b[1;33mTab\x1b[0m         Auto-complete commands
  \x1b[1;33mCtrl+L\x1b[0m      Clear screen
  \x1b[1;33mCtrl+C\x1b[0m      Interrupt command
  \x1b[1;33mCtrl+R\x1b[0m      Reverse search history
  \x1b[1;33mCtrl+A\x1b[0m      Move to start of line
  \x1b[1;33mCtrl+E\x1b[0m      Move to end of line
  \x1b[1;33mCtrl+K\x1b[0m      Delete from cursor to end
  \x1b[1;33mCtrl+U\x1b[0m      Delete entire line`;
  }

  // Unknown command with helpful message
  if (trimmed) {
    return `\x1b[1;31mbash: ${originalCommand}: command not found\x1b[0m

\x1b[1;33mTip:\x1b[0m Type \x1b[1;36mhelp\x1b[0m to see available commands
\x1b[1;33mTip:\x1b[0m Use \x1b[1;36mTab\x1b[0m for command auto-completion`;
  }

  return "";
}
