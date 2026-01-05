"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, Play, CheckCircle2, Bookmark, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export interface ScenarioCardProps {
  id: number | string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  category: string;
  completed?: boolean;
  progress?: number;
  students?: number;
  rating?: number;
  tags?: string[];
  onClick?: () => void;
}

const difficultyConfig = {
  Beginner: {
    color: "badge-beginner",
    bgGlow: "from-emerald-500/10 to-emerald-500/5",
  },
  Intermediate: {
    color: "badge-intermediate",
    bgGlow: "from-amber-500/10 to-amber-500/5",
  },
  Advanced: {
    color: "badge-advanced",
    bgGlow: "from-red-500/10 to-red-500/5",
  },
};

export function ScenarioCard({
  id,
  title,
  description,
  difficulty,
  duration,
  category,
  completed = false,
  progress,
  students,
  rating,
  tags,
  onClick,
}: ScenarioCardProps) {
  const config = difficultyConfig[difficulty];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative"
    >
      <div
        className={`
          relative h-full rounded-xl border border-cyan-500/10 
          bg-gradient-to-br ${config.bgGlow} 
          backdrop-blur-sm overflow-hidden
          hover:border-cyan-500/30 transition-all duration-300
          card-hover cursor-pointer
        `}
        onClick={onClick}
      >
        {/* Completion indicator */}
        {completed && (
          <div className="absolute top-3 right-3 z-10">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
          </div>
        )}

        {/* Bookmark button */}
        <button
          className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            // Handle bookmark
          }}
        >
          {!completed && (
            <div className="w-8 h-8 rounded-full bg-secondary/80 hover:bg-cyan-500/20 flex items-center justify-center transition-colors">
              <Bookmark className="w-4 h-4 text-muted-foreground hover:text-cyan-400" />
            </div>
          )}
        </button>

        {/* Card content */}
        <div className="p-6">
          {/* Header badges */}
          <div className="flex items-center gap-2 mb-4">
            <Badge className={config.color}>{difficulty}</Badge>
            <Badge variant="outline" className="border-cyan-500/20 text-muted-foreground">
              {category}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="text-lg font-display font-semibold mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {description}
          </p>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded bg-secondary/50 text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-xs px-2 py-0.5 text-muted-foreground">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Progress bar (if in progress) */}
          {progress !== undefined && progress > 0 && progress < 100 && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-cyan-400">{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          )}

          {/* Meta info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {duration}
              </span>
              {students && (
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {students.toLocaleString()}
                </span>
              )}
            </div>

            {/* Rating */}
            {rating && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer with CTA */}
        <div className="px-6 pb-6">
          <Link href={`/workspace/${id}`}>
            <Button
              className={`w-full ${
                completed
                  ? "bg-secondary hover:bg-secondary/80"
                  : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 glow-cyan"
              }`}
            >
              <Play className="w-4 h-4 mr-2" />
              {completed ? "Review" : progress ? "Continue" : "Start Learning"}
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// Grid wrapper for consistent layout
export function ScenarioGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  );
}
