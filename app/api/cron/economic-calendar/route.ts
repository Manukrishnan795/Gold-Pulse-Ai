import { NextResponse } from "next/server";
import { runCalendarIngestion } from "@/lib/pipeline/calendar";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const result = await runCalendarIngestion();
  return NextResponse.json(result);
}
