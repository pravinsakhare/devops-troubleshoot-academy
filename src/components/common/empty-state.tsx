import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-display font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-md mx-auto">{description}</p>
      {action && (
        <Button
          variant="outline"
          onClick={action.onClick}
          className="border-cyan-500/30 hover:bg-cyan-500/10"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
