"use client";

import { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon } from "lucide-react";

interface TerminalEmulatorProps {
  workspaceId: string;
  onCommandSubmit: () => void;
  onProgressUpdate: (progress: number) => void;
}

export default function TerminalEmulator({ 
  workspaceId,
  onCommandSubmit, 
  onProgressUpdate 
}: TerminalEmulatorProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstanceRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initTerminal = async () => {
      try {
        if (!terminalRef.current) return;

        // Load Terminal and CSS
        await loadScript("https://unpkg.com/xterm@5.2.1/lib/xterm.js");
        await loadCSS("https://unpkg.com/xterm@5.2.1/css/xterm.css");

        if (!isMounted) return;

        await new Promise(resolve => setTimeout(resolve, 300));

        const Terminal = (window as any).Terminal;
        
        if (!Terminal) {
          throw new Error("Terminal library failed to load");
        }

        const term = new Terminal({
          cursorBlink: true,
          cursorStyle: "block",
          fontSize: 13,
          fontFamily: '"Fira Code", "Monaco", "Courier New", monospace',
          fontWeight: 400,
          lineHeight: 1.2,
          theme: {
            background: "#0a0a0a",
            foreground: "#e0e0e0",
            cursor: "#10b981",
            cursorAccent: "#0a0a0a",
            selection: "rgba(14, 165, 233, 0.3)",
          },
          scrollback: 1000,
          tabStopWidth: 4,
        });

        term.open(terminalRef.current);

        // Fit terminal
        fitTerminal(term, terminalRef.current);

        terminalInstanceRef.current = { term };

        term.writeln("Welcome to K8s Troubleshooting Terminal");
        term.writeln("Connected to cluster: production-cluster");
        term.writeln("Type 'help' for available commands\n");
        term.write("$ ");

        // Setup terminal input handling
        setupTerminalInput(term, workspaceId, onCommandSubmit, onProgressUpdate);

        const handleResize = () => {
          if (terminalInstanceRef.current?.term && terminalRef.current) {
            fitTerminal(terminalInstanceRef.current.term, terminalRef.current);
          }
        };

        window.addEventListener("resize", handleResize);
        setIsConnected(true);
        setIsLoading(false);

        return () => {
          window.removeEventListener("resize", handleResize);
          if (terminalInstanceRef.current?.term) {
            try {
              terminalInstanceRef.current.term.dispose();
            } catch (e) {
              console.error("Dispose error:", e);
            }
          }
        };
      } catch (err) {
        console.error("Terminal initialization error:", err);
        if (isMounted) {
          const errorMsg = err instanceof Error ? err.message : "Unknown error occurred";
          setError(errorMsg);
          setIsLoading(false);
        }
      }
    };

    initTerminal();

    return () => {
      isMounted = false;
    };
  }, [workspaceId]);

  const fitTerminal = (term: any, container: HTMLElement) => {
    try {
      const width = container.offsetWidth;
      const height = container.offsetHeight;

      const charWidth = 8;
      const charHeight = 20;

      const cols = Math.floor(width / charWidth);
      const rows = Math.floor(height / charHeight);

      if (cols > 20 && rows > 5) {
        term.resize(cols, rows);
      }
    } catch (e) {
      console.error("Terminal fit error:", e);
    }
  };

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        setTimeout(resolve, 100);
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = true;

      const cleanup = () => {
        script.onload = null;
        script.onerror = null;
      };

      script.onload = () => {
        cleanup();
        console.log(`Loaded: ${src}`);
        setTimeout(resolve, 100);
      };

      script.onerror = () => {
        cleanup();
        reject(new Error(`Failed to load ${src}`));
      };

      document.head.appendChild(script);
    });
  };

  const loadCSS = (href: string): Promise<void> => {
    return new Promise((resolve) => {
      const existing = document.querySelector(`link[href="${href}"]`);
      if (existing) {
        resolve();
        return;
      }

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;

      link.onload = () => {
        console.log(`Loaded CSS: ${href}`);
        resolve();
      };

      link.onerror = () => {
        console.warn(`CSS load warning: ${href}`);
        resolve();
      };

      document.head.appendChild(link);
    });
  };

  const setupTerminalInput = (
    term: any,
    workspaceId: string,
    onCommandSubmit: () => void,
    onProgressUpdate: (progress: number) => void
  ) => {
    let commandBuffer = "";
    let isProcessing = false;

    term.onData(async (data: string) => {
      if (isProcessing) return;

      try {
        // Handle Enter key
        if (data === "\r" || data === "\n" || data === "\r\n") {
          const command = commandBuffer.trim();
          term.write("\r\n");

          if (command) {
            isProcessing = true;

            const response = await fetch("/api/terminal/" + workspaceId, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                sessionId: workspaceId,
                input: data,
              }),
            });

            if (!response.ok) throw new Error("Terminal request failed");

            const result = await response.json();
            
            // Handle clear screen command
            if (result.output.includes("\x1b[2J\x1b[H")) {
              term.clear();
              term.write("$ ");
            } else {
              term.write(result.output);
            }

            // Track command execution
            onCommandSubmit();

            // Detect progress based on command output
            detectProgress(command, result.output, onProgressUpdate);

            commandBuffer = "";
            isProcessing = false;
          } else {
            term.write("$ ");
          }
          return;
        }

        // Handle backspace
        if (data === "\u007F" || data === "\b") {
          if (commandBuffer.length > 0) {
            commandBuffer = commandBuffer.slice(0, -1);
            term.write("\b \b");
          }
          return;
        }

        // Handle Ctrl+C
        if (data === "\u0003") {
          commandBuffer = "";
          term.write("^C\r\n$ ");
          return;
        }

        // Handle Ctrl+U
        if (data === "\u0015") {
          if (commandBuffer.length > 0) {
            const backspaces = "\b".repeat(commandBuffer.length);
            const spaces = " ".repeat(commandBuffer.length);
            term.write(backspaces + spaces + backspaces);
          }
          commandBuffer = "";
          return;
        }

        // Regular character
        commandBuffer += data;
        term.write(data);

      } catch (error) {
        console.error("Terminal error:", error);
        term.write("\r\nError: Command failed\r\n$ ");
        commandBuffer = "";
        isProcessing = false;
      }
    });
  };

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center text-red-400 px-4">
          <p className="font-semibold text-lg">Terminal Error</p>
          <p className="text-sm mt-2 mb-4 text-slate-300">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded text-sm font-medium"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      {/* Terminal Header */}
      <div className="px-5 py-3 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <TerminalIcon className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <span className="font-mono text-sm text-slate-200 font-medium">kubectl terminal</span>
            <span className="text-xs text-slate-500 ml-2">production-cluster</span>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className={`w-2 h-2 rounded-full animate-pulse ${isLoading ? "bg-yellow-500" : isConnected ? "bg-green-500" : "bg-red-500"}`} />
          <span className="text-xs text-slate-400">
            {isLoading ? "Loading..." : isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      {/* Terminal Container */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-hidden"
      />

      {/* Custom xterm styling */}
      <style>{`
        .xterm {
          padding: 10px !important;
          font-family: 'Fira Code', 'Monaco', 'Courier New', monospace !important;
          font-size: 13px !important;
          line-height: 1.5 !important;
        }

        .xterm-screen {
          padding: 0 !important;
        }

        .xterm-viewport {
          background-color: #0a0a0a !important;
        }

        .xterm-cursor-layer {
          opacity: 1 !important;
        }

        .xterm .xterm-cursor {
          background-color: #10b981 !important;
          border: none !important;
          opacity: 1 !important;
        }

        .xterm .xterm-selection div {
          background-color: rgba(14, 165, 233, 0.4) !important;
        }

        .xterm .xterm-rows {
          padding: 0 !important;
        }
      `}</style>
    </div>
  );
}

function detectProgress(
  command: string,
  output: string,
  onProgressUpdate: (progress: number) => void
) {
  const cmd = command.toLowerCase();

  // Detect hints-based progress
  if (cmd.includes("get pods") && cmd.includes("production")) {
    onProgressUpdate(prev => Math.min(30, prev + 5));
  }

  if (cmd.includes("describe pod") && cmd.includes("payment-service")) {
    onProgressUpdate(prev => Math.min(50, prev + 10));
  }

  if (cmd.includes("logs") && cmd.includes("payment-service")) {
    onProgressUpdate(prev => Math.min(70, prev + 10));
  }

  if (cmd.includes("get events")) {
    onProgressUpdate(prev => Math.min(85, prev + 5));
  }

  // Detect if user found the issue (output contains error details)
  if (output.includes("exit 1") || output.includes("sh,-c,exit 1")) {
    onProgressUpdate(prev => Math.min(90, prev + 5));
  }

  if (output.includes("CrashLoopBackOff")) {
    onProgressUpdate(prev => Math.min(75, prev + 3));
  }
}
