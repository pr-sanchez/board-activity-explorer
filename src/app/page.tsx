"use client";

import { useEffect } from "react";
import {
  BoardProvider,
  useBoardState,
  useBoardDispatch,
  useFilteredNotes,
} from "@/features/board";
import stickyNotes from "@/data/sticky-notes.json";
import type { StickyNote as StickyNoteType } from "@/types";

// Components
import { StickyNote } from "@/components/ui/StickyNote";
import { NoteList } from "@/components/ui/NoteList";
import { Filters } from "@/components/ui/Filters";
// Styles
import styles from "./page.module.css";

function BoardPage() {
  const { notes, filters, selectedNoteId } = useBoardState();
  const filteredNotes = useFilteredNotes(notes, filters);
  const dispatch = useBoardDispatch();

  useEffect(() => {
    dispatch({ type: "SET_NOTES", payload: stickyNotes as StickyNoteType[] });
  }, [dispatch]);

  console.log({ notes });
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Board Activity Explorer</h1>
        <p className={styles.subtitle}>
          {notes.length} sticky notes on this board
        </p>
      </header>

      <main className={styles.content}>
        <div className={styles.layout}>
          <Filters />

          <NoteList>
            {filteredNotes.map((note) => (
              <StickyNote
                key={note.id}
                id={note.id}
                text={note.text}
                author={note.author}
                color={note.color}
                createdAt={note.createdAt}
                isSelected={selectedNoteId === note.id}
                onSelect={(id) =>
                  dispatch({ type: "SELECT_NOTE", payload: id })
                }
              />
            ))}
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
