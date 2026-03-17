"use client";

import { useEffect, useState } from "react";
import {
  BoardProvider,
  useBoardState,
  useBoardDispatch,
  useFilteredNotes,
  useGroupedNotes,
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

function renderNote(
  note: StickyNoteType,
  selectedNoteId: string | null,
  dispatch: ReturnType<typeof useBoardDispatch>,
) {
  return (
    <StickyNote
      key={note.id}
      id={note.id}
      text={note.text}
      author={note.author}
      color={note.color}
      createdAt={note.createdAt}
      isSelected={selectedNoteId === note.id}
      onSelect={(id) => dispatch({ type: "SELECT_NOTE", payload: id })}
    />
  );
}

function BoardPage() {
  const { notes, filters, selectedNoteId } = useBoardState();
  const filteredNotes = useFilteredNotes(notes, filters);
  const groups = useGroupedNotes(filteredNotes);
  const dispatch = useBoardDispatch();
  const [isGrouped, setIsGrouped] = useState(false);

  useEffect(() => {
    dispatch({ type: "SET_NOTES", payload: stickyNotes as StickyNoteType[] });
  }, [dispatch]);

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
          />

          <NoteList>
            {isGrouped
              ? groups.map((group) => (
                  <NoteGroup key={group.label} label={group.label} count={group.noteIds.length}>
                    {group.noteIds.map((id) => {
                      const note = filteredNotes.find((n) => n.id === id);
                      return note ? renderNote(note, selectedNoteId, dispatch) : null;
                    })}
                  </NoteGroup>
                ))
              : filteredNotes.map((note) =>
                  renderNote(note, selectedNoteId, dispatch),
                )}
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
