"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior SRE at Stripe",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    content:
      "K8sTroubleshoot completely changed how I approach debugging. The scenarios are incredibly realistic - I recognized issues I'd seen in production. Went from junior to senior in 6 months.",
    rating: 5,
    company: "Stripe",
  },
  {
    name: "Marcus Johnson",
    role: "DevOps Engineer at Netflix",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    content:
      "The progressive hint system is genius. It helps you learn without just giving you the answer. I've recommended this to everyone on my team. Must-have for any K8s engineer.",
    rating: 5,
    company: "Netflix",
  },
  {
    name: "Elena Rodriguez",
    role: "Platform Lead at Spotify",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    content:
      "We use this platform for onboarding new engineers. It cut our ramp-up time by 50%. The realistic scenarios prepare them for real incidents better than any documentation could.",
    rating: 5,
    company: "Spotify",
  },
  {
    name: "David Kim",
    role: "Cloud Architect at Google",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    content:
      "Even as an experienced engineer, I learn something new every week. The advanced scenarios push me to think differently about troubleshooting. Excellent quality throughout.",
    rating: 5,
    company: "Google",
  },
  {
    name: "Priya Patel",
    role: "Site Reliability Engineer at Amazon",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    content:
      "The best investment in my career. Passed my CKA on the first try thanks to the hands-on practice here. The scenarios cover everything you need to know and more.",
    rating: 5,
    company: "Amazon",
  },
];

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px]" />

      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider mb-4 block">
            Testimonials
          </span>
          <h2 className="text-responsive-section font-display font-bold mb-4">
            Loved by <span className="text-gradient-cyan">10,000+ engineers</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what DevOps engineers from top tech companies have to say about
            their learning experience.
          </p>
        </motion.div>

        {/* Featured Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="relative">
            {/* Quote icon */}
            <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center glow-cyan">
              <Quote className="w-8 h-8 text-white" />
            </div>

            {/* Testimonial Card */}
            <div className="bg-card/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8 md:p-12">
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>

              <motion.p
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-xl md:text-2xl text-foreground leading-relaxed mb-8"
              >
                &ldquo;{testimonials[activeIndex].content}&rdquo;
              </motion.p>

              <div className="flex items-center justify-between">
                <motion.div
                  key={`author-${activeIndex}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-4"
                >
                  <Avatar className="w-14 h-14 border-2 border-cyan-500/30">
                    <AvatarImage src={testimonials[activeIndex].avatar} />
                    <AvatarFallback>
                      {testimonials[activeIndex].name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonials[activeIndex].name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonials[activeIndex].role}
                    </p>
                  </div>
                </motion.div>

                {/* Navigation */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-cyan-500/20 hover:bg-cyan-500/10"
                    onClick={prevTestimonial}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-cyan-500/20 hover:bg-cyan-500/10"
                    onClick={nextTestimonial}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Pagination dots */}
              <div className="flex items-center justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === activeIndex
                        ? "w-8 bg-cyan-500"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Smaller testimonial cards grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              className="p-6 rounded-xl border border-cyan-500/10 bg-card/30 backdrop-blur-sm hover:border-cyan-500/20 transition-all card-hover"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-4">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={testimonial.avatar} />
                  <AvatarFallback>
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
