import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function websocket(client: any, request: NextRequest) {
  const sessionId = request.nextUrl.pathname.split("/").pop() || "default";

  try {
    console.log(`Terminal session started: ${sessionId}`);

    // Send welcome message
    client.send(
      JSON.stringify({
        type: "output",
        data: "Welcome to K8s Troubleshooting Terminal\r\nConnected to cluster: production-cluster\r\n$ ",
      })
    );

    let commandBuffer = "";

    // Handle incoming messages
    client.on("message", async (message: string) => {
      try {
        const data = JSON.parse(message);

        if (data.type === "input") {
          const input = data.data;

          // Echo input
          client.send(
            JSON.stringify({
              type: "output",
              data: input,
            })
          );

          // Handle Enter key)
          if (input === "\r" || input === "\n" || input === "\r\n") {    );
            const command = commandBuffer.trim();
            commandBuffer = "";essages
on("message", async (message: string) => {
            if (command) {
              const response = simulateKubectlCommand(command);parse(message);
              client.send(
                JSON.stringify({
                  type: "output",nst input = data.data;
                  data: response,
                })nput
              );
            }     JSON.stringify({
       type: "output",
            // Send prompt              data: input,
            client.send(
              JSON.stringify({
                type: "output",
                data: "$ ",
              })          if (input === "\r" || input === "\n" || input === "\r\n") {
            );
          } else if (input === "\u007F" || input === "\b") {on.buffer.trim();
            // Backspace
            if (commandBuffer.length > 0) {
              commandBuffer = commandBuffer.slice(0, -1);   if (command) {
            }cuteCommand(client, command);
          } else {
            // Accumulate input
            commandBuffer += input;     // Send prompt
          }            client.send(
        }
      } catch (error) {,
        console.error("Error processing message:", error);     data: "$ ",
      }
    });
"\b") {
    client.on("close", () => {     // Backspace
      console.log(`Terminal session closed: ${sessionId}`);     if (session.buffer.length > 0) {
    });              session.buffer = session.buffer.slice(0, -1);

    client.on("error", (error: Error) => {
      console.error("WebSocket error:", error); // Add to buffer
    });uffer += input;
  } catch (error) {
    console.error("Failed to initialize terminal session:", error);
  } catch (error) {
} console.error("Error processing message:", error);

function simulateKubectlCommand(command: string): string {
  if (command.includes("get pods") && command.includes("production")) {
    return `NAME              READY   STATUS             RESTARTS       AGEonnect
payment-service   0/1     CrashLoopBackOff   5 (22s ago)   10m) => {
web-frontend      1/1     Running            0              2hnal session closed: ${sessionId}`);
auth-service      1/1     Running            0              2h\r\n`;
  }

  if (command.includes("describe pod") && command.includes("payment-service")) {ror", (error: Error) => {
    return `Name:         payment-service
Namespace:    production sessions.delete(sessionId);
Status:       CrashLoopBackOff });
Image:        alpine:latest } catch (error) {
Command:      sh,-c,exit 1    console.error("Failed to initialize terminal session:", error);





































}  return `Command executed: ${command}\r\n`;  }kubectl get events -n production         - View events\r\n`;kubectl logs <pod-name> -n production    - View logskubectl describe pod <name> -n production - Get pod detailskubectl get pods -n production          - List pods    return `Common kubectl commands:  if (command.includes("help")) {  }production           Active   35m\r\n`;kube-system          Active   35mkube-public          Active   35mkube-node-lease      Active   35mdefault              Active   35m    return `NAME                 STATUS   AGE  if (command.includes("get ns") || command.includes("get namespace")) {  }10m         Warning   BackOff           pod/payment-service       Back-off restarting failed container\r\n`;10m         Normal    Created           pod/payment-service       Created container payment    return `LAST SEEN   TYPE      REASON            OBJECT                     MESSAGE  if (command.includes("get events")) {  }    return `Error: exit 1\r\n`;  if (command.includes("logs") && command.includes("payment-service")) {  }Exit Code:    1\r\n`;Reason:       ErrorLast State:   TerminatedReason:       CrashLoopBackOffState:        Waiting    try {
      client.send(
        JSON.stringify({
          type: "error",
          data: "Failed to initialize terminal",
        })
      );
    } catch (e) {
      console.error("Error sending error message:", e);
    }
  }
}

async function executeCommand(client: any, command: string) {
  try {
    // Safety: only allow specific commands
    const allowedCommands = [
      "kubectl",
      "ls",
      "pwd",
      "echo",
      "cat",
      "grep",
      "help",
    ];
    const firstWord = command.split(" ")[0];

    if (!allowedCommands.includes(firstWord)) {
      client.send(
        JSON.stringify({
          type: "output",
          data: `bash: ${firstWord}: command not found\r\n`,
        })
      );
      return;
    }

    // Execute the command
    const { stdout, stderr } = await execPromise(command, {
      timeout: 30000,
      maxBuffer: 1024 * 1024,
    });

    // Send output
    if (stdout) {
      client.send(
        JSON.stringify({
          type: "output",
          data: stdout + "\r\n",
        })
      );
    }

    if (stderr) {
      client.send(
        JSON.stringify({
          type: "output",
          data: stderr + "\r\n",
        })
      );
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    client.send(
      JSON.stringify({
        type: "output",
        data: `Error: ${errorMsg}\r\n`,
      })
    );
  }
}
