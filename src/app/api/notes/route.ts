import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";

type Positions = Record<string, { x: number; y: number }>;

async function readPositions(): Promise<Positions> {
  const raw = await redis.get("note-positions");
  if (!raw) return {};
  return JSON.parse(raw);
}

async function writePositions(data: Positions) {
  await redis.set("note-positions", JSON.stringify(data));
}

export async function GET() {
  return NextResponse.json(await readPositions());
}

export async function PATCH(request: NextRequest) {
  const { id, x, y } = await request.json();

  if (!id || typeof x !== "number" || typeof y !== "number") {
    return NextResponse.json(
      { error: "id, x, and y are required" },
      { status: 400 },
    );
  }

  const positions = await readPositions();
  positions[id] = { x, y };
  await writePositions(positions);

  return NextResponse.json({ ok: true });
}
