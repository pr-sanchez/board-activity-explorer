"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BoardProvider,
  useBoardState,
  useBoardDispatch,
  useFilteredNotes,
  useGroupedNotes,
  useVotes,
} from "@/features/board";
import stickyNotes from "@/data/sticky-notes.json";
import type { StickyNote as StickyNoteType } from "@/types";

// Components
import { StickyNote } from "@/features/board/components/StickyNote";
import { NoteList } from "@/features/board/components/NoteList";
import { Filters } from "@/features/board/components/Filters";
import { NoteGroup } from "@/features/board/components/NoteGroup";
import { BoardView } from "@/features/board/components/BoardView";
// Styles
import styles from "./page.module.css";

// Notes created in the last 24 hours of the dataset are "recent"
const RECENT_CUTOFF_MS = 24 * 60 * 60 * 1000;

function isRecentNote(note: StickyNoteType, latestTime: number): boolean {
  return latestTime - new Date(note.createdAt).getTime() < RECENT_CUTOFF_MS;
}

function BoardPage() {
  const { notes, filters, selectedNoteId } = useBoardState();
  const { votes, userVotes, isVoting, castVote, toggleVoting } = useVotes();
  const filteredNotes = useFilteredNotes(notes, filters, votes);
  const groups = useGroupedNotes(filteredNotes);
  const dispatch = useBoardDispatch();
  const [isGrouped, setIsGrouped] = useState(false);
  const [highlightTopVoted, setHighlightTopVoted] = useState(false);
  const [isBoardView, setIsBoardView] = useState(false);
  const [showRecent, setShowRecent] = useState(false);

  const latestTime = useMemo(
    () => Math.max(...notes.map((n) => new Date(n.createdAt).getTime()), 0),
    [notes],
  );

  const top5Ids = useMemo(() => {
    const sorted = [...filteredNotes].sort(
      (a, b) => (votes[b.id] || 0) - (votes[a.id] || 0),
    );
    return new Set(
      sorted.filter((n) => (votes[n.id] || 0) > 0).slice(0, 5).map((n) => n.id),
    );
  }, [filteredNotes, votes]);

  useEffect(() => {
    async function loadNotes() {
      const notes = stickyNotes as StickyNoteType[];
      try {
        const res = await fetch("/api/notes");
        const positions = await res.json();
        const merged = notes.map((note) =>
          positions[note.id]
            ? { ...note, x: positions[note.id].x, y: positions[note.id].y }
            : note,
        );
        dispatch({ type: "SET_NOTES", payload: merged });
      } catch {
        dispatch({ type: "SET_NOTES", payload: notes });
      }
    }
    loadNotes();
  }, [dispatch]);

  function getTopRank(noteId: string): number | null {
    if (!highlightTopVoted || !top5Ids.has(noteId)) return null;
    const sorted = [...top5Ids].sort(
      (a, b) => (votes[b] || 0) - (votes[a] || 0),
    );
    return sorted.indexOf(noteId) + 1;
  }

  function renderNote(note: StickyNoteType) {
    return (
      <StickyNote
        key={note.id}
        id={note.id}
        text={note.text}
        author={note.author}
        color={note.color}
        createdAt={note.createdAt}
        votes={votes[note.id] || 0}
        hasVoted={userVotes.includes(note.id)}
        showVoting={isVoting}
        topRank={getTopRank(note.id)}
        isRecent={showRecent && isRecentNote(note, latestTime)}
        isDimmed={highlightTopVoted && !top5Ids.has(note.id)}
        isSelected={selectedNoteId === note.id}
        onSelect={(id) => dispatch({ type: "SELECT_NOTE", payload: id })}
        onVote={(id) => castVote(id)}
      />
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Board Activity Explorer</h1>
        <p className={styles.subtitle}>
          {filteredNotes.length} of {notes.length} sticky notes
        </p>
      </header>

      <main className={styles.content}>
        <div className={styles.layout}>
          <Filters
            isGrouped={isGrouped}
            onToggleGroup={() => setIsGrouped((prev) => !prev)}
            isVoting={isVoting}
            onToggleVoting={toggleVoting}
            highlightTopVoted={highlightTopVoted}
            onToggleHighlight={() => setHighlightTopVoted((prev) => !prev)}
            isBoardView={isBoardView}
            onToggleBoardView={() => setIsBoardView((prev) => !prev)}
            showRecent={showRecent}
            onToggleRecent={() => setShowRecent((prev) => !prev)}
          />

          {isBoardView ? (
            <BoardView
              notes={filteredNotes.map((note) => ({
                id: note.id,
                x: note.x,
                y: note.y,
                element: renderNote(note),
              }))}
              onMoveNote={(id, x, y) =>
                dispatch({ type: "MOVE_NOTE", payload: { id, x, y } })
              }
            />
          ) : (
            <NoteList>
              {isGrouped
                ? groups.map((group) => (
                    <NoteGroup key={group.label} label={group.label} count={group.noteIds.length}>
                      {group.noteIds.map((id) => {
                        const note = filteredNotes.find((n) => n.id === id);
                        return note ? renderNote(note) : null;
                      })}
                    </NoteGroup>
                  ))
                : filteredNotes.map((note) => renderNote(note))}
            </NoteList>
          )}
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <BoardProvider>
      <BoardPage />
    </BoardProvider>
  );
}
