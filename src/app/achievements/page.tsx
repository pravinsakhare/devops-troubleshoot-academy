"use client";

import { Navigation } from "@/components/layout/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Lock, CheckCircle2, Target, Zap, Flame, Star, Award } from "lucide-react";

const achievements = [
  {
    id: 1,
    title: "First Steps",
    description: "Complete your first troubleshooting scenario",
    icon: "🎯",
    unlocked: true,
    progress: 100,
    rarity: "common",
    unlockedDate: "2 days ago",
  },
  {
    id: 2,
    title: "Speed Demon",
    description: "Solve 5 scenarios under 10 minutes each",
    icon: "⚡",
    unlocked: true,
    progress: 100,
    rarity: "rare",
    unlockedDate: "1 day ago",
  },
  {
    id: 3,
    title: "No Hints Needed",
    description: "Complete 3 scenarios without using any hints",
    icon: "🎯",
    unlocked: true,
    progress: 100,
    rarity: "rare",
    unlockedDate: "3 hours ago",
  },
  {
    id: 4,
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "🔥",
    unlocked: true,
    progress: 100,
    rarity: "epic",
    unlockedDate: "Just now",
  },
  {
    id: 5,
    title: "Beginner Master",
    description: "Complete all beginner scenarios",
    icon: "🌟",
    unlocked: false,
    progress: 80,
    rarity: "common",
  },
  {
    id: 6,
    title: "Intermediate Expert",
    description: "Complete all intermediate scenarios",
    icon: "💫",
    unlocked: false,
    progress: 33,
    rarity: "rare",
  },
  {
    id: 7,
    title: "Advanced Ace",
    description: "Complete all advanced scenarios",
    icon: "🏆",
    unlocked: false,
    progress: 0,
    rarity: "legendary",
  },
  {
    id: 8,
    title: "Perfect Score",
    description: "Complete any scenario with 100% accuracy",
    icon: "✨",
    unlocked: false,
    progress: 0,
    rarity: "epic",
  },
  {
    id: 9,
    title: "Marathon Runner",
    description: "Maintain a 30-day streak",
    icon: "🏃",
    unlocked: false,
    progress: 23,
    rarity: "legendary",
  },
  {
    id: 10,
    title: "Kubectl Master",
    description: "Execute 1000 kubectl commands",
    icon: "⌨️",
    unlocked: false,
    progress: 45,
    rarity: "epic",
  },
  {
    id: 11,
    title: "Community Helper",
    description: "Help 10 other users in discussions",
    icon: "🤝",
    unlocked: false,
    progress: 0,
    rarity: "rare",
  },
  {
    id: 12,
    title: "Completionist",
    description: "Complete every scenario in the platform",
    icon: "👑",
    unlocked: false,
    progress: 40,
    rarity: "legendary",
  },
];

export default function AchievementsPage() {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionRate = Math.round((unlockedCount / totalCount) * 100);

  const legendaryCount = achievements.filter(a => a.rarity === "legendary" && a.unlocked).length;
  const epicCount = achievements.filter(a => a.rarity === "epic" && a.unlocked).length;
  const rareCount = achievements.filter(a => a.rarity === "rare" && a.unlocked).length;

  return (
    <div className="min-h-screen bg-[#0a0e1a] noise-texture">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold mb-2">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Achievements
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your progress and unlock badges as you master K8s troubleshooting
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-card/50">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-display font-bold">{unlockedCount}/{totalCount}</p>
                <p className="text-sm text-muted-foreground">Achievements Unlocked</p>
                <div className="flex items-center gap-2 mt-2">
                  <Progress value={completionRate} className="h-2" />
                  <span className="text-xs text-yellow-400 font-semibold">{completionRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-card/50">
                  <Star className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-display font-bold">{legendaryCount}</p>
                <p className="text-sm text-muted-foreground">Legendary Badges</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-card/50">
                  <Zap className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-display font-bold">{epicCount}</p>
                <p className="text-sm text-muted-foreground">Epic Badges</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-card/50">
                  <Award className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-display font-bold">{rareCount}</p>
                <p className="text-sm text-muted-foreground">Rare Badges</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AchievementCard({ achievement }: { achievement: typeof achievements[0] }) {
  const rarityColors: Record<string, { border: string; bg: string; text: string; glow: string }> = {
    common: {
      border: "border-gray-500/30",
      bg: "from-gray-500/10 to-gray-600/10",
      text: "text-gray-400",
      glow: "",
    },
    rare: {
      border: "border-blue-500/30",
      bg: "from-blue-500/10 to-blue-600/10",
      text: "text-blue-400",
      glow: "glow-cyan",
    },
    epic: {
      border: "border-purple-500/30",
      bg: "from-purple-500/10 to-purple-600/10",
      text: "text-purple-400",
      glow: "glow-magenta",
    },
    legendary: {
      border: "border-yellow-500/30",
      bg: "from-yellow-500/10 to-orange-600/10",
      text: "text-yellow-400",
      glow: "animate-pulse-glow",
    },
  };

  const colors = rarityColors[achievement.rarity];

  return (
    <Card 
      className={`
        bg-gradient-to-br ${colors.bg} ${colors.border} backdrop-blur-sm
        transition-all duration-300 hover:-translate-y-1
        ${achievement.unlocked ? colors.glow : "opacity-60"}
      `}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`
            text-4xl w-16 h-16 flex items-center justify-center rounded-xl
            ${achievement.unlocked ? "bg-card/50" : "bg-secondary/30 grayscale"}
          `}>
            {achievement.unlocked ? achievement.icon : "🔒"}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={`${colors.border} ${colors.bg} ${colors.text} capitalize`}>
              {achievement.rarity}
            </Badge>
            {achievement.unlocked && (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            )}
          </div>
        </div>

        <h3 className={`font-display font-semibold text-lg mb-1 ${achievement.unlocked ? "" : "text-muted-foreground"}`}>
          {achievement.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {achievement.description}
        </p>

        {achievement.unlocked ? (
          <div className="flex items-center gap-2 text-sm text-green-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Unlocked {achievement.unlockedDate}</span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold">{achievement.progress}%</span>
            </div>
            <Progress value={achievement.progress} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
