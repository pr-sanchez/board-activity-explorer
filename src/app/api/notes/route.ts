import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src/data/note-positions.json");

type Positions = Record<string, { x: number; y: number }>;

function readPositions(): Positions {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function writePositions(data: Positions) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  return NextResponse.json(readPositions());
}

export async function PATCH(request: NextRequest) {
  const { id, x, y } = await request.json();

  if (!id || typeof x !== "number" || typeof y !== "number") {
    return NextResponse.json(
      { error: "id, x, and y are required" },
      { status: 400 },
    );
  }

  const positions = readPositions();
  positions[id] = { x, y };
  writePositions(positions);

  return NextResponse.json({ ok: true });
}
