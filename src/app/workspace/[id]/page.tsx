"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  X, 
  Save, 
  Clock, 
  Lightbulb, 
  Terminal as TerminalIcon,
  FileCode,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { MobileWarning } from "@/components/common/mobile-warning";
import TerminalEmulator from "./terminal-emulator";

export default function WorkspacePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [commandCount, setCommandCount] = useState(0);
  const [progress, setProgress] = useState(15);
  const [currentHintLevel, setCurrentHintLevel] = useState(0);
  const [isHintDrawerOpen, setIsHintDrawerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const hintDrawerRef = useRef<HTMLDivElement>(null);

  const hints = [
    "Start by checking the pod status using `kubectl get pods -n production`",
    "Look at the pod logs to identify any error messages using `kubectl logs payment-service -n production`",
    "Check if the container is crashing immediately - review the container command",
    "The issue is with the container's command - it's set to `exit 1` which immediately crashes",
    "Fix the pod manifest to use a proper working command instead of `exit 1`",
  ];

  // Close hint drawer with ESC key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && isHintDrawerOpen) {
      setIsHintDrawerOpen(false);
    }
  }, [isHintDrawerOpen]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Close hint drawer when clicking outside
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsHintDrawerOpen(false);
    }
  };

  useEffect(() => {
    // Get user ID from localStorage (set after Supabase auth)
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }

    // Load progress from Supabase
    loadProgress(storedUserId || "");
  }, [params.id]);

  const loadProgress = async (userId: string) => {
    if (!userId) return;
    try {
      const response = await fetch(
        `/api/progress?userId=${userId}&scenarioId=${params.id}`
      );
      const data = await response.json();
      if (data.progress) {
        setHintsUsed(data.progress.hints_used);
        setCommandCount(data.progress.commands_executed);
        setTimeElapsed(data.progress.time_spent_seconds);
      }
    } catch (error) {
      console.error("Failed to load progress:", error);
    }
  };

  const saveProgress = async () => {
    if (!userId) return;
    
    setIsSaving(true);
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          scenarioId: params.id,
          status: progress === 100 ? "completed" : "in_progress",
          hintsUsed,
          commandsExecuted: commandCount,
          timeSpentSeconds: timeElapsed,
        }),
      });
      
      if (response.ok) {
        console.log("Progress saved successfully");
      }
    } catch (error) {
      console.error("Failed to save progress:", error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    const saveTimer = setInterval(() => {
      if (userId) {
        saveProgress();
      }
    }, 30000);

    return () => clearInterval(saveTimer);
  }, [userId, hintsUsed, commandCount, timeElapsed, progress]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExit = () => {
    if (confirm("Are you sure you want to exit? Your progress will be saved.")) {
      if (userId) {
        saveProgress();
      }
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
      <div className="h-screen bg-[#050810] flex flex-col overflow-hidden">
        {/* Animated Background Grid */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(14, 165, 233, 0.5) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
        
        {/* Header */}
        <div className="relative z-10 border-b border-cyan-500/10 bg-gradient-to-r from-[#0a0e1a]/95 via-[#0d1220]/95 to-[#0a0e1a]/95 backdrop-blur-xl">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left Section - Title & Stats */}
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <h2 className="font-display font-bold text-xl tracking-tight text-white">
                    Pod CrashLoopBackOff Mystery
                  </h2>
                </div>
                
                <div className="flex items-center gap-1 h-8">
                  <div className="h-full w-px bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span className="font-mono text-sm font-medium text-slate-200">{formatTime(timeElapsed)}</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-slate-200">{hintsUsed} hints used</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <TerminalIcon className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-slate-200">{commandCount} commands</span>
                  </div>
                </div>
              </div>
              
              {/* Right Section - Progress & Actions */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-slate-800/70 to-slate-800/50 border border-slate-700/50">
                  <span className="text-sm font-medium text-slate-400">Progress</span>
                  <div className="w-40 h-2.5 bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-white min-w-[40px]">{progress}%</span>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 hover:text-white transition-all duration-200"
                  onClick={saveProgress}
                  disabled={isSaving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-slate-400 hover:text-white hover:bg-red-500/10 transition-all duration-200"
                  onClick={handleExit}
                >
                  <X className="w-4 h-4 mr-2" />
                  Exit
                </Button>
              </div>
            </div>
          </div>
        </div>

      {/* Main Workspace */}
      <div className="flex-1 overflow-hidden relative z-10">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Panel - Problem Description */}
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="h-full flex flex-col bg-gradient-to-b from-[#0a0e1a] to-[#0d1220]">
              <Tabs defaultValue="description" className="flex-1 flex flex-col">
                <div className="border-b border-slate-700/50 px-6 pt-5 pb-4">
                  <TabsList className="bg-slate-800/50 border border-slate-700/50 p-1">
                    <TabsTrigger 
                      value="description" 
                      className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/30 transition-all duration-200"
                    >
                      Description
                    </TabsTrigger>
                    <TabsTrigger 
                      value="manifests"
                      className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/30 transition-all duration-200"
                    >
                      Manifests
                    </TabsTrigger>
                    <TabsTrigger 
                      value="resources"
                      className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/30 transition-all duration-200"
                    >
                      Resources
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-auto p-6">
                  <TabsContent value="description" className="mt-0 space-y-6">
                    {/* Problem Statement Card */}
                    <div className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        </div>
                        <h3 className="font-display font-bold text-lg text-white">Problem Statement</h3>
                      </div>
                      <p className="text-slate-300 leading-relaxed mb-4">
                        A critical application pod named <code className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 font-mono text-sm border border-cyan-500/20">payment-service</code> in the <code className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 font-mono text-sm border border-cyan-500/20">production</code> namespace keeps restarting. 
                        Users are reporting intermittent payment failures.
                      </p>
                      <p className="text-slate-400 leading-relaxed">
                        Your task is to identify why the pod is crashing and fix the issue. The cluster is accessible via the terminal on the right.
                      </p>
                    </div>

                    {/* Success Criteria Card */}
                    <div className="rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                          <Lightbulb className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <h4 className="font-display font-semibold text-amber-400 mb-3">Success Criteria</h4>
                          <ul className="space-y-2.5">
                            <li className="flex items-center gap-2.5 text-sm text-slate-300">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              Pod must be in Running state
                            </li>
                            <li className="flex items-center gap-2.5 text-sm text-slate-300">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              Container must not be restarting
                            </li>
                            <li className="flex items-center gap-2.5 text-sm text-slate-300">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              Application must pass health checks
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Environment Details Card */}
                    <div className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-5">
                      <h4 className="font-display font-semibold text-white mb-4">Environment Details</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-700/30">
                          <span className="text-slate-400">Namespace:</span>
                          <code className="font-mono text-cyan-400 font-medium">production</code>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-700/30">
                          <span className="text-slate-400">Pod Name:</span>
                          <code className="font-mono text-cyan-400 font-medium">payment-service</code>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-700/30">
                          <span className="text-slate-400">Cluster Version:</span>
                          <code className="font-mono text-cyan-400 font-medium">1.28</code>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="manifests" className="mt-0 space-y-4">
                    <div className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 overflow-hidden">
                      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700/50">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                          <FileCode className="w-4 h-4 text-cyan-400" />
                        </div>
                        <h3 className="font-display font-semibold text-white">Pod Manifest</h3>
                      </div>
                      <div className="p-1">
                        <div className="bg-[#0d0d0d] rounded-lg p-4 overflow-x-auto">
                          <pre className="font-mono text-sm leading-relaxed">
                            <code className="text-slate-300">
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
                    <div className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-5">
                      <h3 className="font-display font-semibold text-white mb-4">Useful Commands</h3>
                      <div className="space-y-3">
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

          <ResizableHandle className="w-1.5 bg-slate-800 hover:bg-cyan-500/50 transition-colors duration-200" />

          {/* Right Panel - Terminal */}
          <ResizablePanel defaultSize={60} minSize={30}>
            <div className="h-full flex flex-col">
              <TerminalEmulator 
                workspaceId={params.id}
                onCommandSubmit={() => setCommandCount(prev => prev + 1)}
                onProgressUpdate={(newProgress) => setProgress(newProgress)}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Hint Button - Floating Action Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
        <Button
          className={`
            group relative h-14 px-8 rounded-full shadow-2xl font-semibold text-base
            transition-all duration-300 ease-out transform hover:scale-105
            ${currentHintLevel < hints.length 
              ? "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:via-orange-400 hover:to-amber-400 text-black shadow-amber-500/25" 
              : "bg-slate-700 text-slate-400 cursor-not-allowed shadow-none"
            }
          `}
          onClick={handleGetHint}
          disabled={currentHintLevel >= hints.length}
        >
          {currentHintLevel < hints.length && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
          )}
          <div className="relative flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentHintLevel < hints.length ? "bg-black/20" : "bg-slate-600"}`}>
              <Lightbulb className="w-4 h-4" />
            </div>
            <span>
              {currentHintLevel === 0 ? "Get Hint" : `Hint ${currentHintLevel}/${hints.length}`}
            </span>
            {currentHintLevel > 0 && currentHintLevel < hints.length && (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
        </Button>
      </div>

      {/* Hint Drawer with Overlay */}
      {isHintDrawerOpen && (
        <>
          {/* Backdrop overlay - click to close */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
            onClick={handleOverlayClick}
          />
          
          {/* Hint Drawer */}
          <div 
            ref={hintDrawerRef}
            className="fixed top-0 right-0 h-full w-[420px] max-w-full bg-gradient-to-b from-[#0f1419] to-[#0a0e14] border-l border-cyan-500/20 shadow-2xl shadow-cyan-500/5 z-50 animate-in slide-in-from-right duration-300"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/30">
                      <Lightbulb className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-white">Hints</h3>
                      <p className="text-xs text-slate-400">{currentHintLevel} of {hints.length} revealed</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsHintDrawerOpen(false)}
                    className="h-9 w-9 p-0 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-slate-400">
                  Progressive clues to help you solve the scenario. Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-mono">ESC</kbd> to close.
                </p>
              </div>

              {/* Hints List */}
              <div className="flex-1 overflow-auto p-6 space-y-4">
                {hints.slice(0, currentHintLevel).map((hint, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 animate-in slide-in-from-right duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <Badge className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30 font-semibold px-3 py-1">
                        {index + 1}
                      </Badge>
                      <p className="text-sm text-slate-200 leading-relaxed flex-1">{hint}</p>
                    </div>
                  </div>
                ))}
                
                {/* Remaining hints indicator */}
                {currentHintLevel < hints.length && (
                  <div className="flex items-center gap-2 text-slate-500 text-sm pt-2">
                    <Sparkles className="w-4 h-4" />
                    <span>{hints.length - currentHintLevel} more hint{hints.length - currentHintLevel > 1 ? 's' : ''} available</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-700/50">
                <Button
                  className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold rounded-xl transition-all duration-200"
                  onClick={() => {
                    handleGetHint();
                  }}
                  disabled={currentHintLevel >= hints.length}
                >
                  {currentHintLevel >= hints.length ? (
                    "All hints revealed"
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Reveal Next Hint
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
      </div>
    </>
  );
}

function CommandCard({ command, description }: { command: string; description: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="group p-4 rounded-lg bg-slate-900/50 border border-slate-700/30 hover:border-cyan-500/40 hover:bg-slate-800/50 transition-all duration-200 cursor-pointer"
      onClick={handleCopy}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <code className="font-mono text-sm text-cyan-400 block mb-1.5 break-all">{command}</code>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
        <div className={`text-xs px-2 py-1 rounded transition-all duration-200 ${copied ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400 opacity-0 group-hover:opacity-100"}`}>
          {copied ? "Copied!" : "Copy"}
        </div>
      </div>
    </div>
  );
}