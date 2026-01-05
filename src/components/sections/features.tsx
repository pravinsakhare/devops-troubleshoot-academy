"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Terminal,
  Target,
  Award,
  Zap,
  Shield,
  Users,
  Code2,
  LineChart,
  Clock,
  Lightbulb,
  Rocket,
  BookOpen,
} from "lucide-react";

const features = [
  {
    icon: Terminal,
    title: "Realistic Scenarios",
    description:
      "Practice with broken K8s clusters that mirror real production issues. No sandbox limits.",
    color: "from-cyan-500 to-blue-600",
    glowClass: "glow-cyan",
  },
  {
    icon: Target,
    title: "Progressive Hints",
    description:
      "Stuck? Get contextual hints that guide you without giving away the answer immediately.",
    color: "from-green-500 to-emerald-600",
    glowClass: "glow-green",
  },
  {
    icon: Award,
    title: "Track Progress",
    description:
      "Earn achievements, maintain streaks, and see your troubleshooting skills improve over time.",
    color: "from-yellow-500 to-orange-600",
    glowClass: "glow-cyan",
  },
  {
    icon: Code2,
    title: "Live Terminal",
    description:
      "Full terminal emulator with kubectl, vim, and all tools you need. Real command execution.",
    color: "from-purple-500 to-pink-600",
    glowClass: "glow-purple",
  },
  {
    icon: Shield,
    title: "Safe Environment",
    description:
      "Break things without consequences. Each scenario runs in an isolated sandbox environment.",
    color: "from-red-500 to-rose-600",
    glowClass: "glow-magenta",
  },
  {
    icon: LineChart,
    title: "Skill Analytics",
    description:
      "Track your proficiency across different K8s areas with detailed analytics and insights.",
    color: "from-blue-500 to-indigo-600",
    glowClass: "glow-blue",
  },
];

const additionalFeatures = [
  {
    icon: Clock,
    title: "Timed Challenges",
    description: "Test yourself under pressure with optional time limits.",
  },
  {
    icon: Lightbulb,
    title: "Solution Explanations",
    description: "Understand why solutions work with detailed explanations.",
  },
  {
    icon: Users,
    title: "Community Forum",
    description: "Connect with other engineers and share knowledge.",
  },
  {
    icon: Rocket,
    title: "Career Paths",
    description: "Structured learning paths for different DevOps roles.",
  },
  {
    icon: BookOpen,
    title: "Documentation",
    description: "Comprehensive docs and cheat sheets for quick reference.",
  },
  {
    icon: Zap,
    title: "Daily Challenges",
    description: "New scenarios every day to keep your skills sharp.",
  },
];

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-transparent via-card/10 to-transparent relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider mb-4 block">
            Why Choose Us
          </span>
          <h2 className="text-responsive-section font-display font-bold mb-4">
            Everything you need to{" "}
            <span className="text-gradient-cyan">master K8s debugging</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform provides the most comprehensive and realistic Kubernetes
            troubleshooting experience available.
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="group h-full p-6 rounded-2xl border border-cyan-500/10 bg-card/30 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-300 card-hover">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 ${feature.glowClass}`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-display font-semibold mb-3 group-hover:text-cyan-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="rounded-2xl border border-cyan-500/10 bg-card/30 backdrop-blur-sm p-8"
        >
          <h3 className="text-2xl font-display font-bold mb-8 text-center">
            And so much more...
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.05 }}
                className="text-center group"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-secondary/50 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-muted-foreground group-hover:text-cyan-400 transition-colors" />
                </div>
                <h4 className="font-semibold text-sm mb-1 group-hover:text-cyan-400 transition-colors">
                  {feature.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
