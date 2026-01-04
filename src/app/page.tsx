import Link from "next/link";
import { Terminal, Zap, Target, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] noise-texture">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

        {/* Header */}
        <nav className="relative border-b border-border/20 bg-card/30 backdrop-blur-xl">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center glow-cyan">
                  <Terminal className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-display font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  K8sTroubleshoot
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 glow-cyan">
                    Start Learning
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative container mx-auto px-6 py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm">
              <span className="text-sm text-cyan-400 font-medium">
                🚀 Master Kubernetes Troubleshooting
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-display font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                Debug Like a
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                DevOps Pro
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Practice real-world Kubernetes troubleshooting scenarios in an immersive terminal environment. 
              Learn by doing, track your progress, and earn achievements.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 glow-cyan text-lg px-8 h-14">
                  <Zap className="w-5 h-5 mr-2" />
                  Start Learning Free
                </Button>
              </Link>
              <Link href="/scenarios">
                <Button size="lg" variant="outline" className="border-cyan-500/30 hover:bg-cyan-500/10 text-lg px-8 h-14">
                  Browse Scenarios
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-24 bg-gradient-to-b from-transparent via-card/20 to-transparent">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Terminal className="w-8 h-8 text-cyan-400" />}
              title="Realistic Scenarios"
              description="Practice with broken K8s clusters that mirror real production issues. No sandbox limits."
            />
            <FeatureCard
              icon={<Target className="w-8 h-8 text-green-400" />}
              title="Progressive Hints"
              description="Stuck? Get contextual hints that guide you without giving away the answer immediately."
            />
            <FeatureCard
              icon={<Award className="w-8 h-8 text-yellow-400" />}
              title="Track Progress"
              description="Earn achievements, maintain streaks, and see your troubleshooting skills improve over time."
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-12 glow-cyan">
            <h2 className="text-4xl font-display font-bold mb-4">
              Ready to Level Up?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join engineers mastering Kubernetes troubleshooting through hands-on practice.
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 glow-cyan text-lg px-8 h-14">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group p-6 rounded-xl border border-border/20 bg-card/50 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1">
      <div className="mb-4 w-14 h-14 rounded-lg bg-gradient-to-br from-card to-secondary/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-display font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
