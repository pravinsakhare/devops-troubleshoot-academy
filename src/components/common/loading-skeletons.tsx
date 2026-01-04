export function ScenarioCardSkeleton() {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/20 rounded-lg p-6 animate-pulse">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-secondary/50 rounded w-3/4" />
            <div className="h-4 bg-secondary/30 rounded w-full" />
            <div className="h-4 bg-secondary/30 rounded w-5/6" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-6 bg-secondary/50 rounded-full w-20" />
          <div className="h-4 bg-secondary/30 rounded w-16" />
          <div className="h-6 bg-secondary/50 rounded-full w-24" />
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-card/30 backdrop-blur-sm border border-border/20 rounded-lg p-6 animate-pulse">
      <div className="space-y-3">
        <div className="h-8 w-8 bg-secondary/50 rounded-lg" />
        <div className="h-8 bg-secondary/50 rounded w-24" />
        <div className="h-4 bg-secondary/30 rounded w-32" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="h-10 bg-secondary/50 rounded w-64 animate-pulse" />
        <div className="h-6 bg-secondary/30 rounded w-96 animate-pulse" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <ScenarioCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
