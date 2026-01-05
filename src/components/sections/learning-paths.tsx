"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Play,
  BookOpen,
  Trophy,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const learningPaths = [
  {
    id: "beginner",
    title: "K8s Fundamentals",
    description: "Start your journey with basic pod debugging, container logs, and resource management.",
    scenarios: 15,
    completed: 8,
    duration: "~6 hours",
    level: "Beginner",
    color: "from-emerald-500 to-green-600",
    steps: [
      { title: "Pod Basics", completed: true },
      { title: "Container Logs", completed: true },
      { title: "Resource Limits", completed: true },
      { title: "ConfigMaps", completed: false },
      { title: "Secrets", completed: false },
    ],
  },
  {
    id: "intermediate",
    title: "Network Mastery",
    description: "Deep dive into service discovery, ingress controllers, and network policies.",
    scenarios: 20,
    completed: 4,
    duration: "~10 hours",
    level: "Intermediate",
    color: "from-amber-500 to-orange-600",
    steps: [
      { title: "Services", completed: true },
      { title: "Endpoints", completed: true },
      { title: "Ingress", completed: false },
      { title: "Network Policies", completed: false },
      { title: "DNS Debugging", completed: false },
    ],
  },
  {
    id: "advanced",
    title: "Production Ready",
    description: "Master complex scenarios involving multi-cluster, security, and performance tuning.",
    scenarios: 25,
    completed: 0,
    duration: "~15 hours",
    level: "Advanced",
    color: "from-red-500 to-rose-600",
    steps: [
      { title: "RBAC & Security", completed: false },
      { title: "Resource Quotas", completed: false },
      { title: "Horizontal Pod Autoscaling", completed: false },
      { title: "Custom Resources", completed: false },
      { title: "Operators", completed: false },
    ],
    locked: true,
  },
];

export function LearningPathsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px]" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]" />

      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider mb-4 block">
            Learning Paths
          </span>
          <h2 className="text-responsive-section font-display font-bold mb-4">
            Your roadmap to <span className="text-gradient-cyan">K8s mastery</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Structured learning paths that take you from beginner to expert. Complete
            scenarios in order to unlock achievements.
          </p>
        </motion.div>

        {/* Learning Paths */}
        <div className="space-y-6">
          {learningPaths.map((path, index) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div
                className={`relative rounded-2xl border border-cyan-500/10 bg-card/30 backdrop-blur-sm overflow-hidden ${
                  path.locked ? "opacity-60" : "hover:border-cyan-500/30"
                } transition-all`}
              >
                {/* Locked overlay */}
                {path.locked && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        Complete Intermediate path to unlock
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-6 md:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Path info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge
                          className={`bg-gradient-to-r ${path.color} text-white border-none`}
                        >
                          {path.level}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {path.duration}
                        </span>
                      </div>
                      <h3 className="text-2xl font-display font-bold mb-2">
                        {path.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">{path.description}</p>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">
                            {path.completed} of {path.scenarios} scenarios completed
                          </span>
                          <span className="font-medium text-cyan-400">
                            {Math.round((path.completed / path.scenarios) * 100)}%
                          </span>
                        </div>
                        <Progress
                          value={(path.completed / path.scenarios) * 100}
                          className="h-2"
                        />
                      </div>
                    </div>

                    {/* Steps preview */}
                    <div className="lg:w-80">
                      <p className="text-sm font-medium text-muted-foreground mb-3">
                        Next Steps
                      </p>
                      <div className="space-y-2">
                        {path.steps.map((step, stepIndex) => (
                          <div
                            key={step.title}
                            className={`flex items-center gap-3 p-2 rounded-lg ${
                              step.completed
                                ? "bg-green-500/10"
                                : stepIndex === path.steps.findIndex((s) => !s.completed)
                                ? "bg-cyan-500/10 border border-cyan-500/20"
                                : "bg-secondary/30"
                            }`}
                          >
                            {step.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : stepIndex === path.steps.findIndex((s) => !s.completed) ? (
                              <Play className="w-4 h-4 text-cyan-400" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-muted-foreground/30" />
                            )}
                            <span
                              className={`text-sm ${
                                step.completed
                                  ? "text-green-400"
                                  : stepIndex === path.steps.findIndex((s) => !s.completed)
                                  ? "text-cyan-400 font-medium"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {step.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="lg:w-40 flex flex-col items-center">
                      <Link href={`/scenarios?path=${path.id}`}>
                        <Button
                          className={`w-full ${
                            path.locked
                              ? "bg-secondary"
                              : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 glow-cyan"
                          }`}
                          disabled={path.locked}
                        >
                          {path.completed === path.scenarios ? (
                            <>
                              <Trophy className="w-4 h-4 mr-2" />
                              Review
                            </>
                          ) : path.completed > 0 ? (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Continue
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4 mr-2" />
                              Start
                            </>
                          )}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-10"
        >
          <Link
            href="/paths"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium"
          >
            <BookOpen className="w-4 h-4" />
            Explore all learning paths
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
