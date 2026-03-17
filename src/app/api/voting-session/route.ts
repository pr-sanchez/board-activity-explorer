import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src/data/voting-session.json");

interface SessionData {
  isVoting: boolean;
}

function readSession(): SessionData {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { isVoting: false };
  }
}

function writeSession(data: SessionData) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  return NextResponse.json(readSession());
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

  const data = { isVoting };
  writeSession(data);
  return NextResponse.json(data);
}
