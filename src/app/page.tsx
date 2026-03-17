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
import { StickyNote } from "@/components/ui/StickyNote";
import { NoteList } from "@/components/ui/NoteList";
import { Filters } from "@/components/ui/Filters";
import { NoteGroup } from "@/components/ui/NoteGroup";
// Styles
import styles from "./page.module.css";

function BoardPage() {
  const { notes, filters, selectedNoteId } = useBoardState();
  const { votes, userVotes, isVoting, castVote, toggleVoting } = useVotes();
  const filteredNotes = useFilteredNotes(notes, filters, votes);
  const groups = useGroupedNotes(filteredNotes);
  const dispatch = useBoardDispatch();
  const [isGrouped, setIsGrouped] = useState(false);
  const [highlightTopVoted, setHighlightTopVoted] = useState(false);

  const top5Ids = useMemo(() => {
    const sorted = [...filteredNotes].sort(
      (a, b) => (votes[b.id] || 0) - (votes[a.id] || 0),
    );
    return new Set(
      sorted.filter((n) => (votes[n.id] || 0) > 0).slice(0, 5).map((n) => n.id),
    );
  }, [filteredNotes, votes]);

  useEffect(() => {
    dispatch({ type: "SET_NOTES", payload: stickyNotes as StickyNoteType[] });
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
          />

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
