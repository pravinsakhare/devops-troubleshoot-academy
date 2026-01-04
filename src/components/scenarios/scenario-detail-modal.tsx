"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Target, Trophy, Play, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface ScenarioDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: {
    id: number;
    title: string;
    description: string;
    difficulty: string;
    duration: string;
    category: string;
    completed: boolean;
  };
}

export function ScenarioDetailModal({ isOpen, onClose, scenario }: ScenarioDetailModalProps) {
  const difficultyColors: Record<string, string> = {
    Beginner: "bg-green-500/20 text-green-400 border-green-500/30",
    Intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Advanced: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card/95 backdrop-blur-xl border-cyan-500/30 max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between mb-2">
            <DialogTitle className="text-2xl font-display pr-8">
              {scenario.title}
            </DialogTitle>
            {scenario.completed && (
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge className={difficultyColors[scenario.difficulty]}>
              {scenario.difficulty}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-3 h-3 mr-1" />
              {scenario.duration}
            </div>
            <Badge variant="outline" className="text-xs">
              {scenario.category}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <h3 className="font-display font-semibold mb-2">Overview</h3>
            <DialogDescription className="text-base leading-relaxed">
              {scenario.description}
            </DialogDescription>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-3">What You'll Learn</h3>
            <ul className="space-y-2">
              <LearningPoint text="Diagnose pod crash issues using kubectl commands" />
              <LearningPoint text="Analyze container logs and error messages" />
              <LearningPoint text="Understand pod lifecycle and restart policies" />
              <LearningPoint text="Debug common configuration mistakes" />
            </ul>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <StatBox
              icon={<Target className="w-5 h-5 text-cyan-400" />}
              label="Success Rate"
              value="73%"
            />
            <StatBox
              icon={<Trophy className="w-5 h-5 text-yellow-400" />}
              label="Attempts"
              value="1.2k"
            />
            <StatBox
              icon={<Clock className="w-5 h-5 text-green-400" />}
              label="Avg. Time"
              value="12 min"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Link href={`/workspace/${scenario.id}`} className="flex-1">
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 glow-cyan h-12">
                <Play className="w-4 h-4 mr-2" />
                {scenario.completed ? "Try Again" : "Start Scenario"}
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LearningPoint({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
      <span className="text-sm text-muted-foreground">{text}</span>
    </li>
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-secondary/50 border border-border/20 text-center">
      <div className="flex justify-center mb-1">{icon}</div>
      <div className="text-lg font-display font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
