# Database Setup Instructions

## Running Migrations

1. **Copy the SQL from `001_initial_schema.sql`**
2. **Go to your Supabase Dashboard** → SQL Editor
3. **Create a new query** and paste the SQL
4. **Execute** the query

## Verify Schema

After running migrations, verify tables exist:

```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

Expected tables:
- `users`
- `scenarios`
- `user_progress`
- `achievements`

## Seed Sample Data (Optional)

You can insert sample scenarios using:

```sql
INSERT INTO public.scenarios (title, description, problem_statement, difficulty, manifest_yaml, solution_steps, hints)
VALUES (
  'Pod CrashLoopBackOff Mystery',
  'Debug a crashing Kubernetes pod',
  'A critical application pod keeps restarting...',
  'beginner',
  'apiVersion: v1...',
  ARRAY['Check pod status', 'View logs', ...],
  ARRAY['Use kubectl get pods', 'Check pod logs', ...]
);
```

## Environment Variables

Ensure `.env.local` is set with Supabase credentials (see `.env.local.example`)
