import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";

interface VotesData {
  votes: Record<string, number>;
  voters: Record<string, string[]>;
}

async function readVotes(): Promise<VotesData> {
  const raw = await redis.get("votes");
  if (!raw) return { votes: {}, voters: {} };
  return JSON.parse(raw);
}

async function writeVotes(data: VotesData) {
  await redis.set("votes", JSON.stringify(data));
}

export async function GET() {
  const data = await readVotes();
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

  const data = await readVotes();
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

  await writeVotes(data);

  return NextResponse.json({ votes: data.votes, toggled: !alreadyVoted });
}
