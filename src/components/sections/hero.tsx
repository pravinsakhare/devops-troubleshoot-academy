"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  Zap,
  Play,
  ChevronRight,
  Users,
  Star,
  Trophy,
  Terminal,
  Server,
  Cloud,
  GitBranch,
  Container,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const floatingIcons = [
  { icon: Terminal, delay: 0, x: "10%", y: "20%" },
  { icon: Server, delay: 0.5, x: "85%", y: "15%" },
  { icon: Cloud, delay: 1, x: "75%", y: "70%" },
  { icon: GitBranch, delay: 1.5, x: "15%", y: "75%" },
  { icon: Container, delay: 2, x: "90%", y: "45%" },
];

const stats = [
  { value: "500+", label: "Scenarios", icon: Terminal },
  { value: "10K+", label: "Engineers", icon: Users },
  { value: "95%", label: "Success Rate", icon: Trophy },
];

const popularSearches = [
  "CrashLoopBackOff",
  "Service Discovery",
  "PVC Pending",
  "Ingress 503",
  "Node Pressure",
];

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [typedText, setTypedText] = useState("");
  const fullText = "Master DevOps Troubleshooting";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 80);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-[#0a0e1a]"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div className="absolute inset-0 dot-grid opacity-40" />
        
        {/* Gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-blue-500/15 rounded-full blur-[100px]"
        />

        {/* Floating icons */}
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute"
            style={{ left: item.x, top: item.y }}
          >
            <div className="p-3 rounded-xl bg-secondary/30 backdrop-blur-sm border border-cyan-500/10">
              <item.icon className="w-6 h-6 text-cyan-400/60" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hero Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 container mx-auto px-6 pt-32 pb-24"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-8"
          >
            <Badge
              variant="outline"
              className="px-4 py-2 rounded-full border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm"
            >
              <span className="flex items-center gap-2 text-cyan-400 font-medium">
                <Zap className="w-4 h-4" />
                Realistic Production Scenarios
                <ChevronRight className="w-4 h-4" />
              </span>
            </Badge>
          </motion.div>

          {/* Main Headline with Typing Effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <h1 className="text-responsive-hero font-display font-bold leading-tight">
              <span className="text-gradient-hero">
                {typedText}
                <span className="inline-block w-[3px] h-[1em] bg-cyan-400 ml-1 animate-blink-caret" />
              </span>
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Real-world scenarios. Production-ready solutions.{" "}
            <span className="text-cyan-400 font-medium">Learn by doing.</span>
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search 500+ troubleshooting scenarios..."
                className="w-full h-14 pl-12 pr-4 text-lg bg-secondary/50 border-cyan-500/20 focus:border-cyan-500/50 rounded-xl"
              />
              <Button
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                Search
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
              <span className="text-sm text-muted-foreground">Popular:</span>
              {popularSearches.map((term) => (
                <Badge
                  key={term}
                  variant="secondary"
                  className="cursor-pointer hover:bg-cyan-500/20 hover:text-cyan-400 transition-all text-xs"
                >
                  {term}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 glow-cyan text-lg px-8 h-14 group"
              >
                <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Start Learning Free
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-cyan-500/30 hover:bg-cyan-500/10 text-lg px-8 h-14 group"
            >
              <Play className="w-5 h-5 mr-2 fill-current group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                className="flex flex-col items-center p-4 rounded-xl glass-card"
              >
                <stat.icon className="w-6 h-6 text-cyan-400 mb-2" />
                <p className="text-2xl md:text-3xl font-display font-bold text-gradient-cyan">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-12 flex items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="ml-2">4.9/5 from 2,500+ reviews</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Used by engineers at top tech companies</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Terminal Preview */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="relative z-10 container mx-auto px-6 pb-24"
      >
        <div className="max-w-4xl mx-auto">
          <div className="terminal-bg overflow-hidden shadow-2xl shadow-cyan-500/10">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-black/50 border-b border-cyan-500/20">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-3 text-sm text-muted-foreground font-mono">
                k8s-troubleshoot ~ kubectl
              </span>
            </div>

            {/* Terminal Content */}
            <div className="p-4 font-mono text-sm leading-relaxed">
              <TerminalLine delay={0.2}>
                <span className="text-cyan-400">$</span>{" "}
                <span className="text-white">kubectl get pods -A | grep -v Running</span>
              </TerminalLine>
              <TerminalLine delay={0.6}>
                <span className="text-yellow-400">NAMESPACE</span>
                {"     "}
                <span className="text-yellow-400">NAME</span>
                {"                          "}
                <span className="text-yellow-400">STATUS</span>
              </TerminalLine>
              <TerminalLine delay={1}>
                <span className="text-muted-foreground">production</span>
                {"   "}
                <span className="text-white">api-server-7f9d8c6b5-x2k4m</span>
                {"   "}
                <span className="text-red-400">CrashLoopBackOff</span>
              </TerminalLine>
              <TerminalLine delay={1.4}>
                <span className="text-muted-foreground">production</span>
                {"   "}
                <span className="text-white">worker-node-85b4f7d9c-j8h2p</span>
                {"  "}
                <span className="text-amber-400">Pending</span>
              </TerminalLine>
              <TerminalLine delay={1.8}>
                <span className="text-cyan-400">$</span>{" "}
                <span className="text-white">
                  kubectl describe pod api-server-7f9d8c6b5-x2k4m -n production
                </span>
              </TerminalLine>
              <TerminalLine delay={2.2}>
                <span className="text-green-400">Events:</span>
              </TerminalLine>
              <TerminalLine delay={2.6}>
                <span className="text-muted-foreground">
                  {"  "}Warning{"  "}BackOff{"  "}Back-off restarting failed container
                </span>
              </TerminalLine>
              <TerminalLine delay={3}>
                <span className="text-cyan-400">$</span>{" "}
                <span className="terminal-text animate-blink-caret">_</span>
              </TerminalLine>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-cyan-500/30 flex items-start justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-cyan-500"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function TerminalLine({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className="mb-1"
    >
      {children}
    </motion.div>
  );
}
