import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const UpdateProgressSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  scenarioId: z.string().uuid("Invalid scenario ID"),
  status: z.enum(["not_started", "in_progress", "completed"]),
  hintsUsed: z.number().int().min(0),
  commandsExecuted: z.number().int().min(0),
  timeSpentSeconds: z.number().int().min(0),
});

type UpdateProgressRequest = z.infer<typeof UpdateProgressSchema>;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = UpdateProgressSchema.parse(body);

    // Upsert progress record
    const { data: progress, error } = await supabase
      .from("user_progress")
      .upsert(
        {
          user_id: data.userId,
          scenario_id: data.scenarioId,
          status: data.status,
          hints_used: data.hintsUsed,
          commands_executed: data.commandsExecuted,
          time_spent_seconds: data.timeSpentSeconds,
          completed_at: data.status === "completed" ? new Date().toISOString() : null,
        },
        {
          onConflict: "user_id,scenario_id",
        }
      )
      .select();

    if (error) {
      return NextResponse.json(
        { error: "Failed to save progress", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      progress: progress?.[0],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request format", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    const scenarioId = request.nextUrl.searchParams.get("scenarioId");

    if (!userId || !scenarioId) {
      return NextResponse.json(
        { error: "Missing userId or scenarioId" },
        { status: 400 }
      );
    }

    const { data: progress, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("scenario_id", scenarioId)
      .single();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json(
        { error: "Failed to fetch progress", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      progress: progress || null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
