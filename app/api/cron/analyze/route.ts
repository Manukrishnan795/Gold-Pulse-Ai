import { NextResponse } from "next/server";
import { runAnalysis } from "@/lib/pipeline/analyze";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const result = await runAnalysis();
  return NextResponse.json(result);
}
