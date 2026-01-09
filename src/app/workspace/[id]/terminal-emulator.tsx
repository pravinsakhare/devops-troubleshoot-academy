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
  const wsRef = useRef<WebSocket | null>(null);
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
          fontSize: 14,
          fontFamily: '"Courier New", monospace',
          theme: {
            background: "#0a0a0a",
            foreground: "#e0e0e0",
            cursor: "#10b981",
          },
        });

        term.open(terminalRef.current);

        // Manual fit - calculate rows and cols based on container
        fitTerminal(term, terminalRef.current);

        terminalInstanceRef.current = { term };

        term.writeln("Welcome to K8s Troubleshooting Terminal");
        term.writeln("Connected to cluster: production-cluster");
        term.writeln("Type your kubectl commands below...\n");

        initializeWebSocket(term, workspaceId);

        const handleResize = () => {
          if (terminalInstanceRef.current?.term && terminalRef.current) {
            fitTerminal(terminalInstanceRef.current.term, terminalRef.current);
          }
        };

        window.addEventListener("resize", handleResize);
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
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [workspaceId]);

  const fitTerminal = (term: any, container: HTMLElement) => {
    try {
      // Get container dimensions
      const width = container.offsetWidth;
      const height = container.offsetHeight;

      // Approximate character dimensions (adjust based on font)
      const charWidth = 8;
      const charHeight = 20;

      // Calculate cols and rows
      const cols = Math.floor(width / charWidth);
      const rows = Math.floor(height / charHeight);

      // Set terminal size (minimum 20x5)
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
      script.type = "text/javascript";
      script.async = true;

      let timeoutId: NodeJS.Timeout;

      const cleanup = () => {
        clearTimeout(timeoutId);
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

      timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error(`Timeout loading ${src}`));
      }, 10000);

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
      link.type = "text/css";

      link.onload = () => {
        console.log(`Loaded CSS: ${href}`);
        resolve();
      };

      link.onerror = () => {
        console.warn(`Failed to load CSS ${href}, continuing anyway`);
        resolve();
      };

      document.head.appendChild(link);
    });
  };

  const initializeWebSocket = (term: any, workspaceId: string) => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/api/terminal/${workspaceId}`;

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
        term.writeln("\x1b[32mTerminal connected\x1b[0m\n");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === "output") {
            term.write(data.data);
            if (data.data.includes("payment-service") || data.data.includes("Running")) {
              onProgressUpdate(prev => Math.min(100, prev + 5));
            }
          }
        } catch (e) {
          console.error("Parse error:", e);
        }
      };

      ws.onerror = (event) => {
        console.error("WebSocket error:", event);
        setIsConnected(false);
      };

      ws.onclose = () => {
        setIsConnected(false);
      };

      wsRef.current = ws;

      term.onData((data: string) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "input", data }));
          onCommandSubmit();
        }
      });
    } catch (err) {
      console.error("WebSocket initialization error:", err);
      setError("Failed to connect to terminal server");
    }
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
        style={{
          backgroundImage: `linear-gradient(rgba(14, 165, 233, 0.02) 1px, transparent 1px)`,
          backgroundSize: '100% 24px'
        }}
      />
    </div>
  );
}
