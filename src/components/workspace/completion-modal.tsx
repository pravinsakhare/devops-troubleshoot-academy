"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, Lightbulb, Share2, ArrowRight, RotateCcw } from "lucide-react";
import Link from "next/link";

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenarioTitle: string;
  timeElapsed: number;
  hintsUsed: number;
  commandCount: number;
}

export function CompletionModal({
  isOpen,
  onClose,
  scenarioTitle,
  timeElapsed,
  hintsUsed,
  commandCount,
}: CompletionModalProps) {
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);

  useEffect(() => {
    if (isOpen && !hasTriggeredConfetti) {
      // Trigger confetti animation
      const duration = 3000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ["#0ea5e9", "#10b981", "#fbbf24"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ["#0ea5e9", "#10b981", "#fbbf24"],
        });
      }, 50);

      setHasTriggeredConfetti(true);

      return () => clearInterval(interval);
    }
  }, [isOpen, hasTriggeredConfetti]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getPerformanceRating = () => {
    if (hintsUsed === 0 && timeElapsed < 600) return { text: "Outstanding!", color: "text-yellow-400" };
    if (hintsUsed <= 2 && timeElapsed < 900) return { text: "Excellent", color: "text-green-400" };
    if (hintsUsed <= 4) return { text: "Good Job", color: "text-cyan-400" };
    return { text: "Completed", color: "text-blue-400" };
  };

  const rating = getPerformanceRating();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card/95 backdrop-blur-xl border-cyan-500/30 max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 flex items-center justify-center animate-scale-in">
              <Trophy className="w-10 h-10 text-yellow-400" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-display">
            <span className={rating.color}>{rating.text}</span>
          </DialogTitle>
          <DialogDescription className="text-center">
            You've successfully completed <span className="text-foreground font-semibold">{scenarioTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-secondary/50 border border-border/20">
              <Clock className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
              <div className="text-lg font-display font-bold">{formatTime(timeElapsed)}</div>
              <div className="text-xs text-muted-foreground">Time</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/50 border border-border/20">
              <Lightbulb className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
              <div className="text-lg font-display font-bold">{hintsUsed}</div>
              <div className="text-xs text-muted-foreground">Hints</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/50 border border-border/20">
              <RotateCcw className="w-5 h-5 mx-auto mb-1 text-green-400" />
              <div className="text-lg font-display font-bold">{commandCount}</div>
              <div className="text-xs text-muted-foreground">Commands</div>
            </div>
          </div>

          {/* Achievement Unlocked */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🏆</div>
              <div className="flex-1">
                <div className="font-semibold text-sm mb-0.5">Achievement Unlocked!</div>
                <div className="text-xs text-muted-foreground">Pod Debugger - Fixed your first CrashLoopBackOff</div>
              </div>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                +50 XP
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Link href="/scenarios" className="w-full">
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 glow-cyan">
                <ArrowRight className="w-4 h-4 mr-2" />
                Next Scenario
              </Button>
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="border-border/20">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retry
              </Button>
              <Button variant="outline" className="border-border/20">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
