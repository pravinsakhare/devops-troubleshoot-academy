"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Terminal, Users, Trophy, Clock, TrendingUp, Zap } from "lucide-react";

interface StatItemProps {
  value: number;
  suffix?: string;
  label: string;
  icon: React.ReactNode;
  delay?: number;
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (v) => setDisplayValue(Math.floor(v)),
      });
      return controls.stop;
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {displayValue.toLocaleString()}{suffix}
    </span>
  );
}

function StatItem({ value, suffix, label, icon, delay = 0 }: StatItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="relative"
    >
      <div className="p-8 rounded-2xl border border-cyan-500/10 bg-card/30 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-300 text-center card-hover">
        {/* Icon */}
        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
          {icon}
        </div>

        {/* Value */}
        <div className="text-4xl md:text-5xl font-display font-bold text-gradient-cyan mb-2">
          <AnimatedCounter value={value} suffix={suffix} />
        </div>

        {/* Label */}
        <p className="text-muted-foreground font-medium">{label}</p>
      </div>
    </motion.div>
  );
}

const stats = [
  {
    value: 500,
    suffix: "+",
    label: "Troubleshooting Scenarios",
    icon: <Terminal className="w-7 h-7 text-cyan-400" />,
  },
  {
    value: 10000,
    suffix: "+",
    label: "Active Engineers",
    icon: <Users className="w-7 h-7 text-blue-400" />,
  },
  {
    value: 95,
    suffix: "%",
    label: "Success Rate",
    icon: <Trophy className="w-7 h-7 text-yellow-400" />,
  },
  {
    value: 12,
    suffix: " min",
    label: "Avg. Solve Time",
    icon: <Clock className="w-7 h-7 text-green-400" />,
  },
];

export function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/20 via-transparent to-card/20" />

      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider mb-4 block">
            By The Numbers
          </span>
          <h2 className="text-responsive-section font-display font-bold mb-4">
            Trusted by <span className="text-gradient-cyan">thousands</span> of engineers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join a growing community of DevOps professionals mastering Kubernetes
            troubleshooting skills.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              icon={stat.icon}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span>Growing 20% monthly</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>New scenarios added weekly</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span>Active community support</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
