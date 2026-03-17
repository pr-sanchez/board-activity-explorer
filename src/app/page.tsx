"use client";

import { useEffect } from "react";
import {
  BoardProvider,
  useBoardState,
  useBoardDispatch,
} from "@/features/board";
import stickyNotes from "@/data/sticky-notes.json";
import type { StickyNote } from "@/types";

function BoardPage() {
  const { notes } = useBoardState();
  const dispatch = useBoardDispatch();

  useEffect(() => {
    dispatch({ type: "SET_NOTES", payload: stickyNotes as StickyNote[] });
  }, [dispatch]);

  console.log({ notes });
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Board Activity Explorer
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {notes.length} sticky notes on this board
        </p>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Sidebar filters + board content will go here */}
        <div className="flex gap-6">
          <aside className="w-64 shrink-0" aria-label="Filters">
            {/* Filter components placeholder */}
            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm text-zinc-500">Filters will go here</p>
            </div>
          </aside>

          <section className="flex-1" aria-label="Board notes">
            {/* Notes grid/canvas placeholder */}
            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm text-zinc-500">
                Notes display will go here ({notes.length} notes loaded)
              </p>
            </div>
          </section>
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
