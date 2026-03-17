import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src/data/votes.json");

interface VotesData {
  votes: Record<string, number>;
  voters: Record<string, string[]>; // noteId -> list of userIds who voted
}

function readVotes(): VotesData {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { votes: {}, voters: {} };
  }
}

function writeVotes(data: VotesData) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  const data = readVotes();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { noteId, userId } = body;

  if (!noteId || !userId) {
    return NextResponse.json(
      { error: "noteId and userId are required" },
      { status: 400 },
    );
  }

  const data = readVotes();

  const noteVoters = data.voters[noteId] || [];
  const alreadyVoted = noteVoters.includes(userId);

  if (alreadyVoted) {
    data.votes[noteId] = Math.max((data.votes[noteId] || 0) - 1, 0);
    data.voters[noteId] = noteVoters.filter((id: string) => id !== userId);
    if (data.votes[noteId] === 0) delete data.votes[noteId];
    if (data.voters[noteId].length === 0) delete data.voters[noteId];
  } else {
    data.votes[noteId] = (data.votes[noteId] || 0) + 1;
    data.voters[noteId] = [...noteVoters, userId];
  }

  writeVotes(data);

  return NextResponse.json({
    votes: data.votes,
    toggled: !alreadyVoted,
  });
}
