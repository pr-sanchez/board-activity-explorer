import { useState, useEffect, useCallback, useRef } from "react";
import { useBoardState, useBoardDispatch } from "../context";

const USER_ID_KEY = "board-user-id";

function getUserId(): string {
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

export function useVotes() {
  const { votes, userVotes } = useBoardState();
  const dispatch = useBoardDispatch();
  const [isVoting, setIsVoting] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const [votesRes, sessionRes] = await Promise.all([
        fetch("/api/votes"),
        fetch("/api/voting-session"),
      ]);
      const votesData = await votesRes.json();
      const sessionData = await sessionRes.json();

      const userId = getUserId();
      const votedByUser = Object.entries(votesData.voters || {})
        .filter(([, voters]) => (voters as string[]).includes(userId))
        .map(([noteId]) => noteId);

      dispatch({
        type: "LOAD_VOTES",
        payload: { votes: votesData.votes, userVotes: votedByUser },
      });
      setIsVoting(sessionData.isVoting);
    } catch {
      // network error, skip
    }
  }, [dispatch]);

  const castVote = useCallback(
    async (noteId: string) => {
      const userId = getUserId();
      try {
        const res = await fetch("/api/votes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ noteId, userId }),
        });
        if (res.ok) {
          await fetchAll();
        }
      } catch {
        // network error, skip
      }
    },
    [fetchAll],
  );

  const toggleVoting = useCallback(async () => {
    try {
      const res = await fetch("/api/voting-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVoting: !isVoting }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsVoting(data.isVoting);
      }
    } catch {
      // network error, skip
    }
  }, [isVoting]);

  useEffect(() => {
    fetchAll();
    pollingRef.current = setInterval(fetchAll, 3000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchAll]);

  return { votes, userVotes, isVoting, castVote, toggleVoting };
}
