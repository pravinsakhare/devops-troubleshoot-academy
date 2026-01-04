"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  X, 
  Save, 
  Clock, 
  Lightbulb, 
  Terminal as TerminalIcon,
  FileCode,
  AlertCircle,
  ChevronRight,
  Play
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { MobileWarning } from "@/components/common/mobile-warning";

export default function WorkspacePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [commandCount, setCommandCount] = useState(0);
  const [progress, setProgress] = useState(15);
  const [currentHintLevel, setCurrentHintLevel] = useState(0);
  const [isHintDrawerOpen, setIsHintDrawerOpen] = useState(false);

  const hints = [
    "Start by checking the pod status using `kubectl get pods`",
    "Look at the pod logs to identify any error messages",
    "Check if the container image is correct and accessible",
    "Verify resource limits and requests are properly configured",
    "The issue is with the container's command - check the pod spec",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExit = () => {
    if (confirm("Are you sure you want to exit? Your progress will be saved.")) {
      router.push("/dashboard");
    }
  };

  const handleGetHint = () => {
    if (currentHintLevel < hints.length) {
      setHintsUsed(prev => prev + 1);
      setCurrentHintLevel(prev => prev + 1);
      setIsHintDrawerOpen(true);
    }
  };

  return (
    <>
      <MobileWarning />
      <div className="h-screen bg-[#0a0e1a] flex flex-col overflow-hidden noise-texture">
        {/* Header */}
        <div className="border-b border-border/20 bg-card/50 backdrop-blur-xl">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h2 className="font-display font-semibold text-lg">
                Pod CrashLoopBackOff Mystery
              </h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono">{formatTime(timeElapsed)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Lightbulb className="w-4 h-4" />
                  <span>{hintsUsed} hints used</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TerminalIcon className="w-4 h-4" />
                  <span>{commandCount} commands</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-secondary/50">
                <span className="text-sm text-muted-foreground">Progress</span>
                <div className="w-32">
                  <Progress value={progress} className="h-2" />
                </div>
                <span className="text-sm font-semibold">{progress}%</span>
              </div>
              <Button variant="outline" size="sm" className="border-border/20">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="ghost" size="sm" onClick={handleExit}>
                <X className="w-4 h-4 mr-2" />
                Exit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Panel - Problem Description */}
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="h-full flex flex-col bg-secondary/20">
              <Tabs defaultValue="description" className="flex-1 flex flex-col">
                <div className="border-b border-border/20 px-6 pt-4">
                  <TabsList className="bg-secondary/50">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="manifests">Manifests</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-auto p-6">
                  <TabsContent value="description" className="mt-0 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <h3 className="font-display font-semibold text-lg">Problem Statement</h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        A critical application pod named <code className="px-2 py-1 rounded bg-black/50 text-cyan-400 font-mono text-sm">payment-service</code> in the <code className="px-2 py-1 rounded bg-black/50 text-cyan-400 font-mono text-sm">production</code> namespace keeps restarting. 
                        Users are reporting intermittent payment failures.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Your task is to identify why the pod is crashing and fix the issue. The cluster is accessible via the terminal on the right.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-yellow-400 mb-1">Success Criteria</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Pod must be in Running state</li>
                            <li>• Container must not be restarting</li>
                            <li>• Application must pass health checks</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-display font-semibold mb-2">Environment Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between p-2 rounded bg-secondary/30">
                          <span className="text-muted-foreground">Namespace:</span>
                          <code className="font-mono text-cyan-400">production</code>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-secondary/30">
                          <span className="text-muted-foreground">Pod Name:</span>
                          <code className="font-mono text-cyan-400">payment-service</code>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-secondary/30">
                          <span className="text-muted-foreground">Cluster Version:</span>
                          <code className="font-mono text-cyan-400">1.28</code>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="manifests" className="mt-0 space-y-4">
                    <div>
                      <h3 className="font-display font-semibold text-lg mb-3 flex items-center">
                        <FileCode className="w-5 h-5 mr-2 text-cyan-400" />
                        Pod Manifest
                      </h3>
                      <div className="rounded-lg overflow-hidden border border-border/20">
                        <div className="bg-black/80 p-4 overflow-x-auto">
                          <pre className="font-mono text-sm">
                            <code className="text-gray-300">
{`apiVersion: v1
kind: Pod
metadata:
  name: payment-service
  namespace: production
spec:
  containers:
  - name: payment
    image: payment-app:v1.2.0
    ports:
    - containerPort: 8080
    resources:
      limits:
        memory: "128Mi"
        cpu: "500m"
      requests:
        memory: "64Mi"
        cpu: "250m"
    env:
    - name: DATABASE_URL
      value: "postgres://db:5432/payments"
    - name: API_KEY
      valueFrom:
        secretKeyRef:
          name: payment-secrets
          key: api-key`}
                            </code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="resources" className="mt-0 space-y-4">
                    <div>
                      <h3 className="font-display font-semibold text-lg mb-3">Useful Commands</h3>
                      <div className="space-y-2">
                        <CommandCard
                          command="kubectl get pods -n production"
                          description="List all pods in the production namespace"
                        />
                        <CommandCard
                          command="kubectl describe pod payment-service -n production"
                          description="Get detailed information about the pod"
                        />
                        <CommandCard
                          command="kubectl logs payment-service -n production"
                          description="View container logs"
                        />
                        <CommandCard
                          command="kubectl get events -n production"
                          description="Check recent cluster events"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </ResizablePanel>

          <ResizableHandle className="w-1 bg-border/20 hover:bg-cyan-500/30 transition-colors" />

          {/* Right Panel - Terminal */}
          <ResizablePanel defaultSize={60} minSize={30}>
            <div className="h-full flex flex-col">
              <TerminalEmulator 
                onCommandSubmit={() => setCommandCount(prev => prev + 1)}
                onProgressUpdate={(newProgress) => setProgress(newProgress)}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Hint Button */}
      <Button
        className={`
          fixed bottom-6 right-6 h-14 px-6 rounded-full shadow-lg
          ${currentHintLevel < hints.length 
            ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 animate-pulse-glow" 
            : "bg-secondary cursor-not-allowed"
          }
        `}
        onClick={handleGetHint}
        disabled={currentHintLevel >= hints.length}
      >
        <Lightbulb className="w-5 h-5 mr-2" />
        {currentHintLevel === 0 ? "Get Hint" : `Hint ${currentHintLevel + 1}/${hints.length}`}
      </Button>

      {/* Hint Drawer */}
      {isHintDrawerOpen && (
        <div 
          className={`
            fixed top-0 right-0 h-full w-96 bg-card/95 backdrop-blur-xl border-l border-border/20 
            shadow-2xl z-50 transform transition-transform duration-400
            ${isHintDrawerOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-border/20">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-semibold text-lg flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                  Hints
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setIsHintDrawerOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Progressive clues to help you solve the scenario
              </p>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-4">
              {hints.slice(0, currentHintLevel).map((hint, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg bg-secondary/50 border border-border/20 animate-fade-in"
                >
                  <div className="flex items-start gap-2">
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 flex-shrink-0">
                      Hint {index + 1}
                    </Badge>
                    <p className="text-sm text-foreground flex-1">{hint}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}

function CommandCard({ command, description }: { command: string; description: string }) {
  return (
    <div className="p-3 rounded-lg bg-secondary/30 border border-border/20 hover:border-cyan-500/30 transition-colors group cursor-pointer">
      <code className="font-mono text-sm text-cyan-400 block mb-1">{command}</code>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function TerminalEmulator({ 
  onCommandSubmit, 
  onProgressUpdate 
}: { 
  onCommandSubmit: () => void;
  onProgressUpdate: (progress: number) => void;
}) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Array<{ type: 'input' | 'output' | 'error'; text: string }>>([
    { type: 'output', text: 'Welcome to K8s Troubleshooting Terminal' },
    { type: 'output', text: 'Connected to cluster: production-cluster' },
    { type: 'output', text: 'Type your kubectl commands below...\n' },
  ]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setHistory(prev => [...prev, { type: 'input', text: input }]);
    onCommandSubmit();

    // Simulate command execution
    setTimeout(() => {
      const output = simulateCommand(input);
      setHistory(prev => [...prev, ...output]);
      
      // Update progress based on correct commands
      if (input.includes('get pods') || input.includes('describe') || input.includes('logs')) {
        onProgressUpdate(Math.min(100, Math.random() * 30 + 20));
      }
    }, 300);

    setInput("");
  };

  const simulateCommand = (cmd: string): Array<{ type: 'input' | 'output' | 'error'; text: string }> => {
    if (cmd.includes('get pods')) {
      return [
        { type: 'output', text: 'NAME               READY   STATUS             RESTARTS   AGE' },
        { type: 'output', text: 'payment-service    0/1     CrashLoopBackOff   5          10m' },
        { type: 'output', text: 'web-frontend       1/1     Running            0          2h' },
        { type: 'output', text: 'auth-service       1/1     Running            0          2h\n' },
      ];
    } else if (cmd.includes('describe pod')) {
      return [
        { type: 'output', text: 'Name:         payment-service' },
        { type: 'output', text: 'Namespace:    production' },
        { type: 'output', text: 'Status:       CrashLoopBackOff' },
        { type: 'output', text: 'Reason:       Error' },
        { type: 'output', text: 'Message:      Back-off restarting failed container\n' },
      ];
    } else if (cmd.includes('logs')) {
      return [
        { type: 'error', text: 'Error: database connection failed' },
        { type: 'error', text: 'panic: unable to connect to postgres://db:5432/payments' },
        { type: 'output', text: 'goroutine 1 [running]:\n' },
      ];
    } else {
      return [{ type: 'output', text: `Command executed: ${cmd}\n` }];
    }
  };

  return (
    <div className="h-full flex flex-col bg-black border-l-2 border-cyan-500/30">
      <div className="px-6 py-2 bg-secondary/30 border-b border-border/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-sm text-muted-foreground">kubectl terminal</span>
        </div>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
      </div>

      <div 
        ref={terminalRef}
        className="flex-1 overflow-auto p-4 font-mono text-sm"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((item, index) => (
          <div key={index} className="mb-1">
            {item.type === 'input' ? (
              <div className="flex items-center">
                <span className="text-cyan-400 mr-2">$</span>
                <span className="text-gray-300">{item.text}</span>
              </div>
            ) : item.type === 'error' ? (
              <div className="text-red-400">{item.text}</div>
            ) : (
              <div className="text-matrix-green">{item.text}</div>
            )}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="flex items-center mt-2">
          <span className="text-cyan-400 mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-300"
            placeholder="Enter kubectl command..."
            autoFocus
          />
        </form>
        <div className="w-2 h-4 bg-matrix-green inline-block animate-pulse ml-1" />
      </div>
    </div>
  );
}
