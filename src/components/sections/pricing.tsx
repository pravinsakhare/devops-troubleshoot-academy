"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Check, X, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { name: "10 Beginner scenarios", included: true },
      { name: "Basic terminal access", included: true },
      { name: "Community forum access", included: true },
      { name: "Progress tracking", included: true },
      { name: "Email support", included: true },
      { name: "Intermediate scenarios", included: false },
      { name: "Advanced scenarios", included: false },
      { name: "Hints system", included: false },
      { name: "Certificates", included: false },
    ],
    cta: "Get Started",
    href: "/auth/register",
    popular: false,
  },
  {
    name: "Pro",
    description: "For serious learners",
    monthlyPrice: 29,
    yearlyPrice: 290,
    features: [
      { name: "All 500+ scenarios", included: true },
      { name: "Full terminal access", included: true },
      { name: "Community forum access", included: true },
      { name: "Advanced progress analytics", included: true },
      { name: "Priority email support", included: true },
      { name: "Progressive hints system", included: true },
      { name: "Completion certificates", included: true },
      { name: "Daily challenges", included: true },
      { name: "Team features", included: false },
    ],
    cta: "Start Pro Trial",
    href: "/auth/register?plan=pro",
    popular: true,
  },
  {
    name: "Team",
    description: "For organizations",
    monthlyPrice: 199,
    yearlyPrice: 1990,
    features: [
      { name: "Everything in Pro", included: true },
      { name: "Unlimited team members", included: true },
      { name: "Admin dashboard", included: true },
      { name: "Custom scenarios", included: true },
      { name: "SSO/SAML integration", included: true },
      { name: "Dedicated support", included: true },
      { name: "API access", included: true },
      { name: "Team analytics", included: true },
      { name: "Custom onboarding", included: true },
    ],
    cta: "Contact Sales",
    href: "/contact?plan=team",
    popular: false,
  },
];

export function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px]" />

      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider mb-4 block">
            Pricing
          </span>
          <h2 className="text-responsive-section font-display font-bold mb-4">
            Simple, transparent <span className="text-gradient-cyan">pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the plan that fits your needs. Upgrade or downgrade at any time.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`text-sm ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
              Yearly
            </span>
            {isYearly && (
              <Badge className="bg-green-500/20 text-green-400 border-none">
                Save 17%
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl border p-8 ${
                plan.popular
                  ? "border-cyan-500/50 bg-gradient-to-b from-cyan-500/10 to-transparent"
                  : "border-cyan-500/10 bg-card/30"
              } backdrop-blur-sm`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-none px-4 py-1">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              {/* Plan Info */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-display font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-display font-bold">
                    ${isYearly ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                {isYearly && plan.yearlyPrice > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Billed ${plan.yearlyPrice}/year
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature.name} className="flex items-center gap-3">
                    {feature.included ? (
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-400" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-muted/20 flex items-center justify-center">
                        <X className="w-3 h-3 text-muted-foreground/50" />
                      </div>
                    )}
                    <span
                      className={
                        feature.included ? "text-foreground" : "text-muted-foreground/50"
                      }
                    >
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href={plan.href}>
                <Button
                  className={`w-full h-12 ${
                    plan.popular
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 glow-cyan"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                >
                  {plan.popular && <Zap className="w-4 h-4 mr-2" />}
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* FAQ Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Have questions? Check out our{" "}
            <Link href="/faq" className="text-cyan-400 hover:underline">
              FAQ
            </Link>{" "}
            or{" "}
            <Link href="/contact" className="text-cyan-400 hover:underline">
              contact us
            </Link>
            .
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>14-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>Secure payments</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
