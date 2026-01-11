"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Terminal as TerminalIcon, Loader2, Download, Copy, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types
interface TerminalState {
  history: string[];
  historyIndex: number;
  currentInput: string;
  isExecuting: boolean;
  executionStartTime: number | null;
  output: Array<{
    type: 'command' | 'output' | 'error' | 'system';
    content: string;
    timestamp: Date;
    executionTime?: number;
  }>;
  theme: 'dark' | 'light';
  promptPrefix: string;
  reverseSearchQuery: string;
  isReverseSearching: boolean;
}

interface TerminalEmulatorProps {
  workspaceId: string;
  onCommandSubmit: () => void;
  onProgressUpdate: (progress: number | ((prev: number) => number)) => void;
}

interface CommandSuggestion {
  command: string;
  description: string;
  category: 'kubectl' | 'system' | 'other';
}

// Available commands for auto-completion
const AVAILABLE_COMMANDS: CommandSuggestion[] = [
  { command: 'clear', description: 'Clear the terminal screen', category: 'system' },
  { command: 'cls', description: 'Clear the terminal screen', category: 'system' },
  { command: 'help', description: 'Show available commands', category: 'system' },
  { command: 'echo', description: 'Print text to terminal', category: 'system' },
  { command: 'pwd', description: 'Print working directory', category: 'system' },
  { command: 'ls', description: 'List files', category: 'system' },
  { command: 'kubectl get pods', description: 'List all pods', category: 'kubectl' },
  { command: 'kubectl get pods -n production', description: 'List pods in production namespace', category: 'kubectl' },
  { command: 'kubectl describe pod', description: 'Describe a pod', category: 'kubectl' },
  { command: 'kubectl logs', description: 'View pod logs', category: 'kubectl' },
  { command: 'kubectl get events', description: 'List cluster events', category: 'kubectl' },
  { command: 'kubectl get namespaces', description: 'List all namespaces', category: 'kubectl' },
  { command: 'kubectl get ns', description: 'List all namespaces', category: 'kubectl' },
];

// Command history management
class CommandHistoryManager {
  private static readonly STORAGE_KEY = 'terminal_history';
  private static readonly MAX_HISTORY = 100;

  static loadHistory(workspaceId: string): string[] {
    try {
      const key = `${this.STORAGE_KEY}_${workspaceId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load command history:', error);
    }
    return [];
  }

  static saveHistory(workspaceId: string, history: string[]): void {
    try {
      const key = `${this.STORAGE_KEY}_${workspaceId}`;
      // Limit history size
      const limitedHistory = history.slice(-this.MAX_HISTORY);
      localStorage.setItem(key, JSON.stringify(limitedHistory));
    } catch (error) {
      console.error('Failed to save command history:', error);
    }
  }

  static addCommand(workspaceId: string, command: string): void {
    if (!command.trim()) return;
    
    const history = this.loadHistory(workspaceId);
    // Don't add duplicate consecutive commands
    if (history.length === 0 || history[history.length - 1] !== command) {
      history.push(command);
      this.saveHistory(workspaceId, history);
    }
  }

  static clearHistory(workspaceId: string): void {
    try {
      const key = `${this.STORAGE_KEY}_${workspaceId}`;
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to clear command history:', error);
    }
  }
}

// Auto-completion helper
function getCommandSuggestions(input: string): CommandSuggestion[] {
  if (!input.trim()) return AVAILABLE_COMMANDS.slice(0, 5);
  
  const lowerInput = input.toLowerCase();
  return AVAILABLE_COMMANDS
    .filter(cmd => cmd.command.toLowerCase().includes(lowerInput))
    .slice(0, 10);
}

export default function TerminalEmulator({ 
  workspaceId,
  onCommandSubmit, 
  onProgressUpdate 
}: TerminalEmulatorProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstanceRef = useRef<any>(null);
  const fitAddonRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Terminal state
  const [state, setState] = useState<TerminalState>(() => ({
    history: CommandHistoryManager.loadHistory(workspaceId),
    historyIndex: -1,
    currentInput: '',
    isExecuting: false,
    executionStartTime: null,
    output: [],
    theme: 'dark',
    promptPrefix: 'user@devops:~$',
    reverseSearchQuery: '',
    isReverseSearching: false,
  }));

  const commandBufferRef = useRef('');
  const isProcessingRef = useRef(false);
  const cursorPositionRef = useRef(0);
  const completionIndexRef = useRef(-1);
  const currentSuggestionsRef = useRef<CommandSuggestion[]>([]);

  // Load terminal libraries
  const loadScript = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        setTimeout(resolve, 100);
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = true;

      script.onload = () => {
        console.log(`Loaded: ${src}`);
        setTimeout(resolve, 100);
      };

      script.onerror = () => {
        reject(new Error(`Failed to load ${src}`));
      };

      document.head.appendChild(script);
    });
  }, []);

  const loadCSS = useCallback((href: string): Promise<void> => {
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
  }, []);

  // Initialize terminal
  useEffect(() => {
    let isMounted = true;

    const initTerminal = async () => {
      try {
        if (!terminalRef.current) return;

        // Load xterm and addons
        await loadScript("https://unpkg.com/xterm@5.2.1/lib/xterm.js");
        await loadScript("https://unpkg.com/xterm-addon-fit@0.7.0/lib/xterm-addon-fit.js");
        await loadCSS("https://unpkg.com/xterm@5.2.1/css/xterm.css");

        if (!isMounted) return;

        await new Promise(resolve => setTimeout(resolve, 300));

        const Terminal = (window as any).Terminal;
        const FitAddon = (window as any).FitAddon;
        
        if (!Terminal || !FitAddon) {
          throw new Error("Terminal library failed to load");
        }

        const term = new Terminal({
          cursorBlink: true,
          cursorStyle: "block",
          fontSize: 13,
          fontFamily: '"Fira Code", "Monaco", "Courier New", monospace',
          fontWeight: 400,
          lineHeight: 1.5,
          theme: {
            background: "#0a0a0a",
            foreground: "#e0e0e0",
            cursor: "#10b981",
            cursorAccent: "#0a0a0a",
            selection: "rgba(14, 165, 233, 0.3)",
            black: "#000000",
            red: "#ef4444",
            green: "#10b981",
            yellow: "#f59e0b",
            blue: "#3b82f6",
            magenta: "#8b5cf6",
            cyan: "#06b6d4",
            white: "#e5e7eb",
            brightBlack: "#4b5563",
            brightRed: "#f87171",
            brightGreen: "#34d399",
            brightYellow: "#fbbf24",
            brightBlue: "#60a5fa",
            brightMagenta: "#a78bfa",
            brightCyan: "#22d3ee",
            brightWhite: "#f9fafb",
          },
          scrollback: 10000,
          tabStopWidth: 4,
          allowProposedApi: true,
        });

        const fitAddon = new FitAddon.FitAddon();
        term.loadAddon(fitAddon);
        fitAddonRef.current = fitAddon;

        term.open(terminalRef.current);
        fitAddon.fit();

        terminalInstanceRef.current = { term };

        // Welcome message
        const welcomeMessage = `\x1b[1;32mWelcome to DevOps Troubleshoot Academy Terminal\x1b[0m
\x1b[1;36mConnected to cluster: production-cluster\x1b[0m
\x1b[1;33mType 'help' for available commands\x1b[0m
\x1b[1;90mKeyboard shortcuts: Ctrl+L (clear), Ctrl+C (interrupt), Ctrl+R (reverse search)\x1b[0m
\x1b[1;90mArrow Up/Down: Navigate history | Tab: Auto-complete\x1b[0m

`;
        term.write(welcomeMessage);
        term.write(`\x1b[1;36m${state.promptPrefix}\x1b[0m `);

        // Setup input handling
        setupTerminalInput(term, workspaceId, onCommandSubmit, onProgressUpdate);

        // Handle resize
        const handleResize = () => {
          if (fitAddonRef.current && terminalRef.current) {
            try {
              fitAddonRef.current.fit();
            } catch (e) {
              console.error("Terminal fit error:", e);
            }
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
  }, [workspaceId, loadScript, loadCSS, onCommandSubmit, onProgressUpdate, state.promptPrefix]);

  // Setup terminal input with all keyboard shortcuts
  const setupTerminalInput = useCallback((
    term: any,
    workspaceId: string,
    onCommandSubmit: () => void,
    onProgressUpdate: (progress: number | ((prev: number) => number)) => void
  ) => {
    let commandBuffer = '';
    let isProcessing = false;
    let historyIndex = -1;
    let reverseSearchQuery = '';
    let isReverseSearching = false;
    let completionIndex = -1;
    let currentSuggestions: CommandSuggestion[] = [];
    let lastInput = '';

    const getPrompt = () => `\x1b[1;36m${state.promptPrefix}\x1b[0m `;

    const updateCursor = () => {
      // Cursor position is handled by xterm automatically
    };

    const showSuggestions = (input: string) => {
      if (!input.trim()) {
        currentSuggestions = [];
        return;
      }
      currentSuggestions = getCommandSuggestions(input);
      if (currentSuggestions.length > 0 && input.length > 0) {
        // Show first suggestion inline (xterm doesn't support overlays easily)
        // We'll handle this via the output
      }
    };

    const handleTabCompletion = () => {
      if (currentSuggestions.length === 0) {
        currentSuggestions = getCommandSuggestions(commandBuffer);
      }

      if (currentSuggestions.length > 0) {
        completionIndex = (completionIndex + 1) % currentSuggestions.length;
        const suggestion = currentSuggestions[completionIndex];
        
        // Save old buffer length for clearing
        const oldBufferLength = commandBuffer.length;
        
        // Clear current input
        const backspaces = '\b'.repeat(oldBufferLength);
        const spaces = ' '.repeat(oldBufferLength);
        term.write(backspaces + spaces + backspaces);
        
        // Write completed command
        commandBuffer = suggestion.command;
        // Fix Bug 1: Update cursor position to match new command length
        cursorPositionRef.current = commandBuffer.length;
        term.write(commandBuffer);
        updateCursor();
      }
    };

    const handleHistoryNavigation = (direction: 'up' | 'down') => {
      const history = CommandHistoryManager.loadHistory(workspaceId);
      
      // Fix Bug 2: Save old buffer length BEFORE updating commandBuffer
      const oldBufferLength = commandBuffer.length;
      
      if (direction === 'up') {
        if (historyIndex === -1) {
          lastInput = commandBuffer; // Save current input
        }
        if (historyIndex < history.length - 1) {
          historyIndex++;
          commandBuffer = history[history.length - 1 - historyIndex];
        }
      } else {
        if (historyIndex > 0) {
          historyIndex--;
          commandBuffer = history[history.length - 1 - historyIndex];
        } else if (historyIndex === 0) {
          historyIndex = -1;
          commandBuffer = lastInput;
        }
      }

      // Clear current line and rewrite using old buffer length
      // Fix Bug 2: Use oldBufferLength instead of commandBuffer.length || 100
      const backspaces = '\b'.repeat(oldBufferLength);
      const spaces = ' '.repeat(oldBufferLength);
      term.write(backspaces + spaces + backspaces);
      term.write(commandBuffer);
      
      // Fix Bug 3: Update cursor position to match new command length
      cursorPositionRef.current = commandBuffer.length;
      updateCursor();
    };

    const handleReverseSearch = () => {
      if (!isReverseSearching) {
        isReverseSearching = true;
        reverseSearchQuery = '';
        term.write('\r\n\x1b[1;33m(reverse-i-search)\'\x1b[0m: ');
        return;
      }
    };

    const executeCommand = async (command: string) => {
      if (!command.trim() || isProcessing) return;

      isProcessing = true;
      const startTime = Date.now();
      
      setState(prev => ({
        ...prev,
        isExecuting: true,
        executionStartTime: startTime,
      }));

      try {
        // Add to history
        CommandHistoryManager.addCommand(workspaceId, command);
        const updatedHistory = CommandHistoryManager.loadHistory(workspaceId);
        historyIndex = -1;

        // Show command in terminal
        term.write(`\r\n${getPrompt()}${command}\r\n`);

        const response = await fetch(`/api/terminal/${workspaceId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: workspaceId,
            input: "\r",
            command: command,
          }),
        });

        if (!response.ok) throw new Error("Terminal request failed");

        const result = await response.json();
        const executionTime = Date.now() - startTime;

        // Handle clear command
        if (result.output.includes("\x1b[2J\x1b[H") || command.trim().toLowerCase() === 'clear' || command.trim().toLowerCase() === 'cls') {
          term.clear();
          term.write(getPrompt());
          commandBuffer = '';
          isProcessing = false;
          setState(prev => ({
            ...prev,
            isExecuting: false,
            executionStartTime: null,
          }));
          return;
        }

        // Write output with ANSI color support
        if (result.output) {
          term.write(result.output);
        }

        // Track command execution
        onCommandSubmit();

        // Detect progress
        detectProgress(command, result.output, onProgressUpdate);

        // Auto-scroll to bottom
        term.scrollToBottom();

        commandBuffer = '';
        completionIndex = -1;
        currentSuggestions = [];
        isProcessing = false;

        setState(prev => ({
          ...prev,
          isExecuting: false,
          executionStartTime: null,
          history: updatedHistory,
        }));

      } catch (error) {
        console.error("Terminal error:", error);
        term.write("\r\n\x1b[1;31mError: Command failed\x1b[0m\r\n");
        term.write(getPrompt());
        commandBuffer = '';
        isProcessing = false;
        setState(prev => ({
          ...prev,
          isExecuting: false,
          executionStartTime: null,
        }));
      }
    };

    term.onData(async (data: string) => {
      if (isProcessing && data !== "\u0003") return; // Allow Ctrl+C during processing

      try {
        // Handle Enter key
        if (data === "\r" || data === "\n" || data === "\r\n") {
          const command = commandBuffer.trim();
          // Fix Bug 1: Clear commandBuffer even if command is only whitespace
          commandBuffer = '';
          cursorPositionRef.current = 0;
          if (command) {
            await executeCommand(command);
          } else {
            term.write("\r\n" + getPrompt());
          }
          return;
        }

        // Handle Tab - Auto-completion
        if (data === "\t") {
          handleTabCompletion();
          return;
        }

        // Handle Ctrl+C
        if (data === "\u0003") {
          if (isProcessing) {
            isProcessing = false;
            setState(prev => ({ ...prev, isExecuting: false }));
          }
          commandBuffer = '';
          // Fix Bug 1: Reset cursor position to 0 for consistency
          cursorPositionRef.current = 0;
          term.write("^C\r\n" + getPrompt());
          return;
        }

        // Handle Ctrl+L - Clear screen
        if (data === "\f" || (data.charCodeAt(0) === 12)) {
          term.clear();
          term.write(getPrompt());
          commandBuffer = '';
          // Fix Bug 1: Reset cursor position to 0 for consistency
          cursorPositionRef.current = 0;
          return;
        }

        // Handle Ctrl+D - Exit/EOF or Delete character at cursor
        if (data === "\u0004") {
          if (commandBuffer.length === 0) {
            term.write("\r\n\x1b[1;33mUse 'exit' command or close the tab to exit\x1b[0m\r\n" + getPrompt());
          } else {
            // Fix Bug 2: Delete character at cursor position, not last character
            if (cursorPositionRef.current < commandBuffer.length) {
              const before = commandBuffer.slice(0, cursorPositionRef.current);
              const after = commandBuffer.slice(cursorPositionRef.current + 1);
              commandBuffer = before + after;
              
              // Redraw remaining characters after cursor
              if (after) {
                term.write(after);
                term.write('\b'.repeat(after.length));
              } else {
                // If at end, just erase the character
                term.write(' ');
                term.write('\b');
              }
            }
          }
          return;
        }

        // Handle Ctrl+R - Reverse search
        if (data === "\u0012") {
          handleReverseSearch();
          return;
        }

        // Handle Ctrl+A - Move to start
        if (data === "\u0001") {
          // Fix Bug 3: Use cursorPositionRef.current instead of commandBuffer.length
          const backspaces = '\b'.repeat(cursorPositionRef.current);
          term.write(backspaces);
          cursorPositionRef.current = 0;
          return;
        }

        // Handle Ctrl+E - Move to end
        if (data === "\u0005") {
          term.write(commandBuffer.slice(cursorPositionRef.current));
          cursorPositionRef.current = commandBuffer.length;
          return;
        }

        // Handle Ctrl+K - Delete from cursor to end
        if (data === "\u000B") {
          const toDelete = commandBuffer.slice(cursorPositionRef.current);
          commandBuffer = commandBuffer.slice(0, cursorPositionRef.current);
          // Use ANSI escape sequence to erase from cursor to end of line
          // \x1b[K erases from cursor to end of line (more reliable than spaces)
          term.write('\x1b[K');
          return;
        }

        // Handle Ctrl+U - Delete entire line
        if (data === "\u0015") {
          const backspaces = '\b'.repeat(commandBuffer.length);
          const spaces = ' '.repeat(commandBuffer.length);
          term.write(backspaces + spaces + backspaces);
          commandBuffer = '';
          cursorPositionRef.current = 0;
          return;
        }

        // Handle Arrow keys (xterm escape sequences)
        // Arrow keys come as \x1b[A, \x1b[B, etc.
        if (data.startsWith('\x1b[')) {
          if (data === '\x1b[A' || data === '\u001b[A') { // Arrow Up
            handleHistoryNavigation('up');
            return;
          }
          if (data === '\x1b[B' || data === '\u001b[B') { // Arrow Down
            handleHistoryNavigation('down');
            return;
          }
          if (data === '\x1b[C' || data === '\u001b[C') { // Arrow Right
            // xterm handles cursor movement, but we track position
            if (cursorPositionRef.current < commandBuffer.length) {
              cursorPositionRef.current++;
            }
            return;
          }
          if (data === '\x1b[D' || data === '\u001b[D') { // Arrow Left
            if (cursorPositionRef.current > 0) {
              cursorPositionRef.current--;
            }
            return;
          }
          // Other escape sequences - let xterm handle them
          return;
        }

        // Handle backspace
        if (data === "\u007F" || data === "\b") {
          if (commandBuffer.length > 0 && cursorPositionRef.current > 0) {
            const before = commandBuffer.slice(0, cursorPositionRef.current - 1);
            const after = commandBuffer.slice(cursorPositionRef.current);
            commandBuffer = before + after;
            cursorPositionRef.current--;
            
            // Redraw line
            const backspaces = '\b'.repeat(1);
            const remaining = after;
            const spaces = ' '.repeat(1);
            term.write(backspaces);
            if (remaining) {
              term.write(remaining + spaces);
              term.write('\b'.repeat(remaining.length + 1));
            } else {
              term.write(' ');
              term.write('\b');
            }
          }
          showSuggestions(commandBuffer);
          return;
        }

        // Handle reverse search input
        if (isReverseSearching) {
          if (data === "\r" || data === "\n") {
            // Execute search
            const history = CommandHistoryManager.loadHistory(workspaceId);
            const match = history.find(cmd => cmd.includes(reverseSearchQuery));
            if (match) {
              commandBuffer = match;
              // Fix Bug 4: Update cursor position to match new command length
              cursorPositionRef.current = commandBuffer.length;
              term.write(`\r\n${getPrompt()}${commandBuffer}`);
            } else {
              term.write(`\r\n\x1b[1;31mNo match found\x1b[0m\r\n${getPrompt()}`);
              // Reset cursor position when no match found
              cursorPositionRef.current = 0;
            }
            isReverseSearching = false;
            reverseSearchQuery = '';
            return;
          }
          if (data === "\u007F" || data === "\b") {
            if (reverseSearchQuery.length > 0) {
              reverseSearchQuery = reverseSearchQuery.slice(0, -1);
              term.write("\b \b");
            }
            return;
          }
          reverseSearchQuery += data;
          term.write(data);
          return;
        }

        // Regular character input
        if (data.length === 1 && data.charCodeAt(0) >= 32) {
          const before = commandBuffer.slice(0, cursorPositionRef.current);
          const after = commandBuffer.slice(cursorPositionRef.current);
          commandBuffer = before + data + after;
          cursorPositionRef.current++;
          
          term.write(data);
          if (after) {
            // Redraw remaining characters
            term.write(after);
            term.write('\b'.repeat(after.length));
          }
          
          showSuggestions(commandBuffer);
          updateCursor();
        }

      } catch (error) {
        console.error("Terminal input error:", error);
        term.write("\r\n\x1b[1;31mError processing input\x1b[0m\r\n" + getPrompt());
        commandBuffer = '';
        isProcessing = false;
      }
    });
  }, [workspaceId, onCommandSubmit, onProgressUpdate, state.promptPrefix]);

  // Export terminal session
  const exportSession = useCallback(() => {
    // Fix Bug 2: Use xterm's buffer to get actual terminal content instead of empty state.output
    let output = '';
    
    try {
      if (terminalInstanceRef.current?.term) {
        const term = terminalInstanceRef.current.term;
        
        // Try to get content from xterm buffer
        // Use both active and normal buffers for complete export
        const buffers = [term.buffer.active, term.buffer.normal].filter(Boolean);
        
        for (const buffer of buffers) {
          if (!buffer) continue;
          
          // Extract text from xterm buffer
          // Start from baseY to get scrollback + visible content
          const baseY = buffer.baseY;
          const length = buffer.length;
          
          for (let i = 0; i < length; i++) {
            try {
              const line = buffer.getLine(i);
              if (line) {
                // translateToString(false) preserves trailing whitespace for accurate export
                const lineText = line.translateToString(false);
                output += lineText + '\n';
              }
            } catch (err) {
              // Skip lines that can't be read
              console.warn('Failed to read line', i, err);
            }
          }
          
          // Only use first buffer (active) to avoid duplicates
          break;
        }
      }
    } catch (error) {
      console.error('Error exporting terminal session:', error);
      output = `Terminal session export error: ${error instanceof Error ? error.message : 'Unknown error'}\n`;
    }
    
    // If no content, provide a helpful message
    if (!output.trim()) {
      output = 'Terminal session export\nNo terminal output available yet.\nPlease run some commands first.\n';
    } else {
      // Add header with timestamp
      const header = `Terminal Session Export\nWorkspace: ${workspaceId}\nExported: ${new Date().toISOString()}\n${'='.repeat(50)}\n\n`;
      output = header + output;
    }

    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `terminal-session-${workspaceId}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [workspaceId]);

  // Clear history
  const clearHistory = useCallback(() => {
    CommandHistoryManager.clearHistory(workspaceId);
    setState(prev => ({ ...prev, history: [] }));
  }, [workspaceId]);

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
          {state.isExecuting && (
            <div className="flex items-center gap-2 text-xs text-cyan-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Executing...</span>
            </div>
          )}
          <div className={`w-2 h-2 rounded-full animate-pulse ${isLoading ? "bg-yellow-500" : isConnected ? "bg-green-500" : "bg-red-500"}`} />
          <span className="text-xs text-slate-400">
            {isLoading ? "Loading..." : isConnected ? "Connected" : "Disconnected"}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={exportSession}>
                <Download className="w-4 h-4 mr-2" />
                Export Session
              </DropdownMenuItem>
              <DropdownMenuItem onClick={clearHistory}>
                <Copy className="w-4 h-4 mr-2" />
                Clear History
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Terminal Container */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-hidden"
        tabIndex={0}
        onFocus={(e) => {
          // Ensure terminal gets focus
          if (terminalInstanceRef.current?.term) {
            terminalInstanceRef.current.term.focus();
          }
        }}
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
          scrollbar-width: thin;
          scrollbar-color: rgba(14, 165, 233, 0.3) transparent;
        }

        .xterm-viewport::-webkit-scrollbar {
          width: 8px;
        }

        .xterm-viewport::-webkit-scrollbar-track {
          background: transparent;
        }

        .xterm-viewport::-webkit-scrollbar-thumb {
          background: rgba(14, 165, 233, 0.3);
          border-radius: 4px;
        }

        .xterm-viewport::-webkit-scrollbar-thumb:hover {
          background: rgba(14, 165, 233, 0.5);
        }

        .xterm-cursor-layer {
          opacity: 1 !important;
        }

        .xterm .xterm-cursor {
          background-color: #10b981 !important;
          border: none !important;
          opacity: 1 !important;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0.3; }
        }

        .xterm .xterm-selection div {
          background-color: rgba(14, 165, 233, 0.4) !important;
        }

        .xterm .xterm-rows {
          padding: 0 !important;
        }

        .xterm:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}

function detectProgress(
  command: string,
  output: string,
  onProgressUpdate: (progress: number | ((prev: number) => number)) => void
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
