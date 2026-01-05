export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
          email_verified_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
          email_verified_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
          email_verified_at?: string | null;
        };
      };
      scenarios: {
        Row: {
          id: string;
          title: string;
          description: string;
          problem_statement: string;
          difficulty: "beginner" | "intermediate" | "advanced";
          tags: string[];
          manifest_yaml: string;
          solution_steps: string[];
          hints: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          problem_statement: string;
          difficulty: "beginner" | "intermediate" | "advanced";
          tags?: string[];
          manifest_yaml: string;
          solution_steps: string[];
          hints: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          problem_statement?: string;
          difficulty?: "beginner" | "intermediate" | "advanced";
          tags?: string[];
          manifest_yaml?: string;
          solution_steps?: string[];
          hints?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          scenario_id: string;
          status: "not_started" | "in_progress" | "completed";
          hints_used: number;
          commands_executed: number;
          time_spent_seconds: number;
          started_at: string;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          scenario_id: string;
          status?: "not_started" | "in_progress" | "completed";
          hints_used?: number;
          commands_executed?: number;
          time_spent_seconds?: number;
          started_at?: string;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          scenario_id?: string;
          status?: "not_started" | "in_progress" | "completed";
          hints_used?: number;
          commands_executed?: number;
          time_spent_seconds?: number;
          started_at?: string;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          badge_icon: string;
          rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
          earned_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          badge_icon: string;
          rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";
          earned_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          badge_icon?: string;
          rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";
          earned_at?: string;
          created_at?: string;
        };
      };
    };
  };
};
