import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";

export async function GET() {
  const raw = await redis.get("voting-session");
  const isVoting = raw ? JSON.parse(raw).isVoting : false;
  return NextResponse.json({ isVoting });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { isVoting } = body;

  if (typeof isVoting !== "boolean") {
    return NextResponse.json(
      { error: "isVoting (boolean) is required" },
      { status: 400 },
    );
  }

  await redis.set("voting-session", JSON.stringify({ isVoting }));
  return NextResponse.json({ isVoting });
}
