"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Shield,
  Lock,
  Users,
  Award,
  CheckCircle2,
  Star,
  Globe,
  Server,
} from "lucide-react";

const trustIndicators = [
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2 Type II compliant with end-to-end encryption",
  },
  {
    icon: Users,
    title: "Built by DevOps Engineers",
    description: "Created by senior engineers from top tech companies",
  },
  {
    icon: Award,
    title: "Industry Recognition",
    description: "Featured in DevOps Weekly and Kubernetes newsletters",
  },
  {
    icon: Globe,
    title: "Global Community",
    description: "Used by engineers at Netflix, Stripe, Google, and more",
  },
];

const certifications = [
  { name: "SOC 2 Type II", icon: Shield },
  { name: "GDPR Compliant", icon: Lock },
  { name: "ISO 27001", icon: Server },
  { name: "HIPAA Ready", icon: CheckCircle2 },
];

export function TrustIndicatorsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/5 to-transparent" />

      <div className="container mx-auto px-6 relative">
        {/* Trust Indicators Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {trustIndicators.map((indicator, index) => (
            <motion.div
              key={indicator.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                <indicator.icon className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-sm mb-2">{indicator.title}</h3>
              <p className="text-xs text-muted-foreground">{indicator.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-cyan-500/10"
            >
              <cert.icon className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium">{cert.name}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Company Logos Placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 pt-8 border-t border-cyan-500/10"
        >
          <p className="text-center text-sm text-muted-foreground mb-6">
            Trusted by engineers at leading tech companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            {/* Placeholder for company logos */}
            <div className="text-lg font-bold text-muted-foreground">Netflix</div>
            <div className="text-lg font-bold text-muted-foreground">Stripe</div>
            <div className="text-lg font-bold text-muted-foreground">Google</div>
            <div className="text-lg font-bold text-muted-foreground">Spotify</div>
            <div className="text-lg font-bold text-muted-foreground">Amazon</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}