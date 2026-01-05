"use client";

import { motion } from "framer-motion";
import { Navigation } from "@/components/layout/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Clock, 
  Target, 
  TrendingUp, 
  Flame, 
  ArrowRight,
  Terminal,
  CheckCircle2,
  Play,
  Calendar,
  Zap,
  Star
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-display font-bold mb-2">
            Welcome back, <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Engineer</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Continue your journey to mastering Kubernetes troubleshooting
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8"
        >
          <StatCard
            icon={<Trophy className="w-6 h-6 text-cyan-400" />}
            label="Scenarios Completed"
            value="12"
            change="+3 this week"
            color="cyan"
          />
          <StatCard
            icon={<Flame className="w-6 h-6 text-orange-400" />}
            label="Current Streak"
            value="7 days"
            change="Keep it up!"
            color="orange"
          />
          <StatCard
            icon={<Clock className="w-6 h-6 text-green-400" />}
            label="Avg. Solve Time"
            value="18 min"
            change="-4 min improved"
            color="green"
          />
          <StatCard
            icon={<Target className="w-6 h-6 text-purple-400" />}
            label="Accuracy Rate"
            value="87%"
            change="+5% this month"
            color="purple"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Continue Learning */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/20">
              <CardHeader>
                <CardTitle className="font-display flex items-center">
                  <Play className="w-5 h-5 mr-2 text-cyan-400" />
                  Continue Learning
                </CardTitle>
                <CardDescription>Pick up where you left off</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <InProgressScenario
                  title="Debugging CrashLoopBackOff Pods"
                  difficulty="Intermediate"
                  progress={65}
                  timeSpent="12 min"
                  hintsUsed={2}
                />
                <InProgressScenario
                  title="Service Discovery Issues"
                  difficulty="Advanced"
                  progress={30}
                  timeSpent="8 min"
                  hintsUsed={1}
                />
              </CardContent>
            </Card>

            {/* Recommended Scenarios */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/20">
              <CardHeader>
                <CardTitle className="font-display flex items-center justify-between">
                  <span className="flex items-center">
                    <Terminal className="w-5 h-5 mr-2 text-cyan-400" />
                    Recommended for You
                  </span>
                  <Link href="/scenarios">
                    <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                      View All
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScenarioCard
                  title="ConfigMap Update Not Reflecting"
                  difficulty="Intermediate"
                  duration="20 min"
                  category="Configuration"
                />
                <ScenarioCard
                  title="Persistent Volume Claims Stuck"
                  difficulty="Advanced"
                  duration="30 min"
                  category="Storage"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Chart */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/20">
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ProgressItem label="Beginner" completed={8} total={10} />
                  <ProgressItem label="Intermediate" completed={4} total={12} />
                  <ProgressItem label="Advanced" completed={0} total={8} />
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/20">
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <AchievementItem
                  title="Speed Demon"
                  description="Solved 5 scenarios under 10 minutes"
                  icon="⚡"
                />
                <AchievementItem
                  title="No Hints Needed"
                  description="Completed 3 scenarios without hints"
                  icon="🎯"
                />
                <AchievementItem
                  title="Week Warrior"
                  description="7-day streak achieved"
                  icon="🔥"
                />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="font-display text-lg">Quick Start</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/scenarios?difficulty=beginner" className="block">
                  <Button variant="outline" className="w-full justify-start border-cyan-500/30 hover:bg-cyan-500/10">
                    <Target className="w-4 h-4 mr-2" />
                    Start Beginner Scenario
                  </Button>
                </Link>
                <Link href="/scenarios" className="block">
                  <Button variant="outline" className="w-full justify-start border-cyan-500/30 hover:bg-cyan-500/10">
                    <Terminal className="w-4 h-4 mr-2" />
                    Browse All Scenarios
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, change, color }: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  change: string;
  color: string;
}) {
  const colorClasses: Record<string, { bg: string; accent: string }> = {
    cyan: { bg: "from-cyan-500/10 to-cyan-600/5 border-cyan-500/20 hover:border-cyan-500/40", accent: "text-cyan-400" },
    orange: { bg: "from-orange-500/10 to-orange-600/5 border-orange-500/20 hover:border-orange-500/40", accent: "text-orange-400" },
    green: { bg: "from-green-500/10 to-green-600/5 border-green-500/20 hover:border-green-500/40", accent: "text-green-400" },
    purple: { bg: "from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:border-purple-500/40", accent: "text-purple-400" },
  };
  
  const styles = colorClasses[color] || colorClasses.cyan;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className={`bg-gradient-to-br ${styles.bg} backdrop-blur-sm transition-all duration-300`}>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-lg bg-card/50">
              {icon}
            </div>
            <Star className={`w-4 h-4 ${styles.accent} opacity-50`} />
          </div>
          <div className="space-y-1">
            <p className="text-2xl md:text-3xl font-display font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className={`text-xs ${styles.accent}`}>{change}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function InProgressScenario({ title, difficulty, progress, timeSpent, hintsUsed }: {
  title: string;
  difficulty: string;
  progress: number;
  timeSpent: string;
  hintsUsed: number;
}) {
  return (
    <div className="p-4 rounded-lg border border-border/20 bg-secondary/30 hover:border-cyan-500/30 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold mb-1 group-hover:text-cyan-400 transition-colors">{title}</h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline" className="text-xs">
              {difficulty}
            </Badge>
            <span>•</span>
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {timeSpent}
            </span>
            <span>•</span>
            <span>{hintsUsed} hints used</span>
          </div>
        </div>
        <Link href="/workspace/demo">
          <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600">
            Resume
          </Button>
        </Link>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
}

function ScenarioCard({ title, difficulty, duration, category }: {
  title: string;
  difficulty: string;
  duration: string;
  category: string;
}) {
  const difficultyColors: Record<string, string> = {
    Beginner: "bg-green-500/20 text-green-400 border-green-500/30",
    Intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Advanced: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <div className="p-4 rounded-lg border border-border/20 bg-secondary/20 hover:border-cyan-500/30 hover:bg-secondary/40 transition-all duration-300 group cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold group-hover:text-cyan-400 transition-colors flex-1">{title}</h4>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Badge className={difficultyColors[difficulty]}>
          {difficulty}
        </Badge>
        <span className="text-muted-foreground">•</span>
        <span className="text-muted-foreground">{duration}</span>
        <span className="text-muted-foreground">•</span>
        <span className="text-muted-foreground">{category}</span>
      </div>
    </div>
  );
}

function ProgressItem({ label, completed, total }: {
  label: string;
  completed: number;
  total: number;
}) {
  const percentage = (completed / total) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{completed}/{total}</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}

function AchievementItem({ title, description, icon }: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border/10">
      <div className="text-2xl">{icon}</div>
      <div className="flex-1 min-w-0">
        <h5 className="font-semibold text-sm mb-0.5">{title}</h5>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
    </div>
  );
}
