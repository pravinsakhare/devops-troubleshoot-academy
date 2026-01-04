"use client";

import { Navigation } from "@/components/layout/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Clock, 
  Play,
  Filter,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

type Difficulty = "All" | "Beginner" | "Intermediate" | "Advanced";

const scenarios = [
  {
    id: 1,
    title: "Pod CrashLoopBackOff Mystery",
    description: "A critical application pod keeps restarting. Investigate logs, resource limits, and container configuration to identify the root cause.",
    difficulty: "Beginner",
    duration: "15 min",
    category: "Debugging",
    completed: false,
  },
  {
    id: 2,
    title: "Service Cannot Reach Pods",
    description: "Internal service communication has broken. Users can't access the application. Check selectors, endpoints, and network policies.",
    difficulty: "Intermediate",
    duration: "25 min",
    category: "Networking",
    completed: true,
  },
  {
    id: 3,
    title: "ConfigMap Changes Not Applied",
    description: "You've updated a ConfigMap but the pods aren't seeing the new values. Debug the configuration propagation issue.",
    difficulty: "Beginner",
    duration: "10 min",
    category: "Configuration",
    completed: true,
  },
  {
    id: 4,
    title: "PersistentVolume Claim Stuck Pending",
    description: "Storage provisioning has failed and pods can't mount volumes. Investigate PVCs, storage classes, and provisioner logs.",
    difficulty: "Advanced",
    duration: "30 min",
    category: "Storage",
    completed: false,
  },
  {
    id: 5,
    title: "Ingress Returns 503 Errors",
    description: "External traffic isn't reaching your services. Debug ingress controller configuration, backend services, and TLS setup.",
    difficulty: "Intermediate",
    duration: "20 min",
    category: "Networking",
    completed: false,
  },
  {
    id: 6,
    title: "Node Running Out of Resources",
    description: "A node is under resource pressure causing pod evictions. Identify resource-hungry workloads and optimize allocation.",
    difficulty: "Advanced",
    duration: "35 min",
    category: "Resource Management",
    completed: false,
  },
  {
    id: 7,
    title: "Deployment Rollout Stuck",
    description: "A new deployment isn't progressing. Investigate readiness probes, image pull issues, and rolling update strategy.",
    difficulty: "Beginner",
    duration: "12 min",
    category: "Deployments",
    completed: false,
  },
  {
    id: 8,
    title: "Secret Mount Permission Denied",
    description: "Pods fail to start due to secret mounting issues. Debug RBAC permissions, service accounts, and secret configuration.",
    difficulty: "Intermediate",
    duration: "18 min",
    category: "Security",
    completed: false,
  },
];

export default function ScenariosPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredScenarios = scenarios.filter(scenario => {
    const matchesDifficulty = selectedDifficulty === "All" || scenario.difficulty === selectedDifficulty;
    const matchesSearch = scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scenario.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scenario.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  const difficultyOptions: Difficulty[] = ["All", "Beginner", "Intermediate", "Advanced"];

  return (
    <div className="min-h-screen bg-[#0a0e1a] noise-texture">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold mb-2">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Troubleshooting Scenarios
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose a broken K8s cluster to debug and learn from
          </p>
        </div>

        {/* Filter Bar */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/20 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search scenarios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border/20 focus:border-cyan-500/50"
                />
              </div>

              {/* Difficulty Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <div className="flex gap-2">
                  {difficultyOptions.map((difficulty) => (
                    <Button
                      key={difficulty}
                      variant={selectedDifficulty === difficulty ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className={
                        selectedDifficulty === difficulty
                          ? "bg-cyan-500 hover:bg-cyan-600"
                          : "border-border/20 hover:border-cyan-500/30"
                      }
                    >
                      {difficulty}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/30 backdrop-blur-sm border-border/20">
            <CardContent className="p-4">
              <div className="text-2xl font-display font-bold text-cyan-400">
                {scenarios.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Scenarios</div>
            </CardContent>
          </Card>
          <Card className="bg-card/30 backdrop-blur-sm border-border/20">
            <CardContent className="p-4">
              <div className="text-2xl font-display font-bold text-green-400">
                {scenarios.filter(s => s.completed).length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card className="bg-card/30 backdrop-blur-sm border-border/20">
            <CardContent className="p-4">
              <div className="text-2xl font-display font-bold text-yellow-400">
                {scenarios.filter(s => !s.completed).length}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </CardContent>
          </Card>
          <Card className="bg-card/30 backdrop-blur-sm border-border/20">
            <CardContent className="p-4">
              <div className="text-2xl font-display font-bold text-purple-400">
                {Math.round((scenarios.filter(s => s.completed).length / scenarios.length) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredScenarios.map((scenario) => (
            <ScenarioCard key={scenario.id} scenario={scenario} />
          ))}
        </div>

        {/* Empty State */}
        {filteredScenarios.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-2">No scenarios found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search query
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedDifficulty("All");
                setSearchQuery("");
              }}
              className="border-cyan-500/30 hover:bg-cyan-500/10"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ScenarioCard({ scenario }: { scenario: typeof scenarios[0] }) {
  const difficultyColors: Record<string, string> = {
    Beginner: "bg-green-500/20 text-green-400 border-green-500/30",
    Intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Advanced: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/20 hover:border-cyan-500/30 transition-all duration-300 group overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <CardTitle className="font-display text-xl mb-2 group-hover:text-cyan-400 transition-colors">
              {scenario.title}
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              {scenario.description}
            </CardDescription>
          </div>
          {scenario.completed && (
            <div className="flex-shrink-0 ml-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge className={difficultyColors[scenario.difficulty]}>
              {scenario.difficulty}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-3 h-3 mr-1" />
              {scenario.duration}
            </div>
            <Badge variant="outline" className="text-xs">
              {scenario.category}
            </Badge>
          </div>
          <Link href={`/workspace/${scenario.id}`}>
            <Button 
              size="sm" 
              className={
                scenario.completed
                  ? "bg-secondary hover:bg-secondary/80"
                  : "bg-cyan-500 hover:bg-cyan-600 glow-cyan"
              }
            >
              <Play className="w-4 h-4 mr-1" />
              {scenario.completed ? "Retry" : "Start"}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
