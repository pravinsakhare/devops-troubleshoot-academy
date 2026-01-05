"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const tools = [
  {
    name: "Kubernetes",
    category: "Orchestration",
    scenarios: 120,
    color: "#326CE5",
    logo: "https://www.vectorlogo.zone/logos/kubernetes/kubernetes-icon.svg",
  },
  {
    name: "Docker",
    category: "Containers",
    scenarios: 85,
    color: "#2496ED",
    logo: "https://www.vectorlogo.zone/logos/docker/docker-icon.svg",
  },
  {
    name: "Jenkins",
    category: "CI/CD",
    scenarios: 45,
    color: "#D24939",
    logo: "https://www.vectorlogo.zone/logos/jenkins/jenkins-icon.svg",
  },
  {
    name: "GitLab",
    category: "CI/CD",
    scenarios: 35,
    color: "#FC6D26",
    logo: "https://www.vectorlogo.zone/logos/gitlab/gitlab-icon.svg",
  },
  {
    name: "AWS",
    category: "Cloud",
    scenarios: 60,
    color: "#FF9900",
    logo: "https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-icon.svg",
  },
  {
    name: "GCP",
    category: "Cloud",
    scenarios: 40,
    color: "#4285F4",
    logo: "https://www.vectorlogo.zone/logos/google_cloud/google_cloud-icon.svg",
  },
  {
    name: "Azure",
    category: "Cloud",
    scenarios: 35,
    color: "#0078D4",
    logo: "https://www.vectorlogo.zone/logos/microsoft_azure/microsoft_azure-icon.svg",
  },
  {
    name: "Terraform",
    category: "IaC",
    scenarios: 30,
    color: "#7B42BC",
    logo: "https://www.vectorlogo.zone/logos/terraformio/terraformio-icon.svg",
  },
  {
    name: "Ansible",
    category: "Automation",
    scenarios: 25,
    color: "#EE0000",
    logo: "https://www.vectorlogo.zone/logos/ansible/ansible-icon.svg",
  },
  {
    name: "Prometheus",
    category: "Monitoring",
    scenarios: 20,
    color: "#E6522C",
    logo: "https://www.vectorlogo.zone/logos/prometheusio/prometheusio-icon.svg",
  },
  {
    name: "Grafana",
    category: "Monitoring",
    scenarios: 15,
    color: "#F46800",
    logo: "https://www.vectorlogo.zone/logos/grafana/grafana-icon.svg",
  },
  {
    name: "Helm",
    category: "Packaging",
    scenarios: 25,
    color: "#0F1689",
    logo: "https://www.vectorlogo.zone/logos/helmsh/helmsh-icon.svg",
  },
];

export function ToolsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 dot-grid opacity-20" />

      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider mb-4 block">
            DevOps Tools
          </span>
          <h2 className="text-responsive-section font-display font-bold mb-4">
            Master the <span className="text-gradient-cyan">entire stack</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Scenarios covering all major DevOps tools and platforms. Click on any
            tool to see related troubleshooting scenarios.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 md:gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link href={`/scenarios?tool=${tool.name.toLowerCase()}`}>
                <div className="group p-4 rounded-xl border border-cyan-500/10 bg-card/30 backdrop-blur-sm hover:border-cyan-500/30 hover:bg-card/50 transition-all duration-300 text-center card-hover">
                  <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-lg bg-secondary/50 group-hover:bg-secondary transition-colors">
                    {/* Tool Logo - Using text as fallback */}
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center text-2xl font-bold"
                      style={{ color: tool.color }}
                    >
                      {tool.name.charAt(0)}
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-cyan-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {tool.scenarios} scenarios
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-10"
        >
          <Link
            href="/tools"
            className="text-cyan-400 hover:text-cyan-300 text-sm font-medium inline-flex items-center gap-1"
          >
            View all supported tools
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
