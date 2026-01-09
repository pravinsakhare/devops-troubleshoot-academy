"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Search,
  Wrench,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Play,
  Target,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    step: 1,
    title: "Choose Scenario",
    description: "Browse our library of 500+ real-world troubleshooting scenarios covering Kubernetes, Docker, CI/CD, and cloud platforms.",
    icon: Search,
    color: "from-blue-500 to-cyan-500",
    details: [
      "Filter by difficulty level",
      "Search by error messages",
      "Browse by technology stack",
      "View community ratings",
    ],
  },
  {
    step: 2,
    title: "Diagnose & Fix",
    description: "Work in a realistic terminal environment with full access to kubectl, docker, and other DevOps tools.",
    icon: Wrench,
    color: "from-cyan-500 to-green-500",
    details: [
      "Interactive terminal emulator",
      "Real command execution",
      "Progressive hint system",
      "AI-powered assistance",
    ],
  },
  {
    step: 3,
    title: "Learn & Improve",
    description: "Get detailed explanations, best practices, and track your progress with achievements and analytics.",
    icon: BookOpen,
    color: "from-green-500 to-yellow-500",
    details: [
      "Solution walkthroughs",
      "Best practice explanations",
      "Progress tracking",
      "Achievement system",
    ],
  },
];

export function PlatformOverviewSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]" />

      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider mb-4 block">
            How It Works
          </span>
          <h2 className="text-responsive-section font-display font-bold mb-4">
            From <span className="text-gradient-cyan">Problem</span> to Solution
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our proven 3-step process turns complex DevOps issues into learning opportunities.
            Practice in a safe environment that mirrors production reality.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`flex flex-col lg:flex-row items-center gap-8 mb-16 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Step Content */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center glow-cyan`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-cyan-400">Step {step.step}</span>
                    <h3 className="text-2xl font-display font-bold">{step.title}</h3>
                  </div>
                </div>
                <p className="text-muted-foreground text-lg mb-6">{step.description}</p>

                {/* Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {step.details.map((detail, detailIndex) => (
                    <motion.div
                      key={detail}
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: index * 0.2 + detailIndex * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{detail}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Step Visual */}
              <div className="flex-1">
                <div className="relative">
                  <div className="bg-card/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 card-hover">
                    {/* Mock terminal/command interface */}
                    <div className="space-y-3">
                      {step.step === 1 && (
                        <>
                          <div className="flex items-center gap-2 mb-4">
                            <Target className="w-4 h-4 text-cyan-400" />
                            <span className="text-sm font-medium">Scenario Browser</span>
                          </div>
                          <div className="space-y-2">
                            <div className="h-3 bg-secondary/50 rounded animate-pulse" style={{ width: "80%" }} />
                            <div className="h-3 bg-secondary/50 rounded animate-pulse" style={{ width: "60%" }} />
                            <div className="h-3 bg-secondary/50 rounded animate-pulse" style={{ width: "90%" }} />
                          </div>
                        </>
                      )}
                      {step.step === 2 && (
                        <>
                          <div className="flex items-center gap-2 mb-4">
                            <Play className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-medium">Terminal Environment</span>
                          </div>
                          <div className="bg-black/80 rounded-lg p-4 font-mono text-xs">
                            <div className="text-cyan-400">$ kubectl get pods -A</div>
                            <div className="text-muted-foreground">NAMESPACE    NAME    STATUS</div>
                            <div className="text-red-400">default      app-123   CrashLoopBackOff</div>
                            <div className="text-cyan-400">$ kubectl describe pod app-123</div>
                            <div className="text-green-400">Containers:</div>
                            <div className="text-muted-foreground">  app: ImagePullBackOff</div>
                          </div>
                        </>
                      )}
                      {step.step === 3 && (
                        <>
                          <div className="flex items-center gap-2 mb-4">
                            <Lightbulb className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-medium">Solution & Learning</span>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                              <span className="text-sm">Root cause identified</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-blue-400" />
                              <span className="text-sm">Best practices explained</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-purple-400" />
                              <span className="text-sm">Progress tracked</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Connecting arrow for non-last steps */}
                  {index < steps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ duration: 0.6, delay: (index + 1) * 0.2 }}
                      className="hidden lg:block absolute top-full left-1/2 -translate-x-1/2 mt-8"
                    >
                      <ArrowRight className="w-6 h-6 text-cyan-400 animate-bounce" />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 glow-cyan"
          >
            <Play className="w-5 h-5 mr-2" />
            Try Your First Scenario
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}