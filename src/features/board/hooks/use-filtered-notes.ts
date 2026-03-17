import { useMemo } from "react";
import type { StickyNote, BoardFilters } from "@/types";

export function useFilteredNotes(
  notes: StickyNote[],
  filters: BoardFilters,
  votes: Record<string, number> = {},
): StickyNote[] {
  return useMemo(() => {
    let result = notes;

    // Filter by authors
    if (filters.authors.length > 0) {
      result = result.filter((note) => filters.authors.includes(note.author));
    }

    // Filter by search text
    if (filters.searchText.trim()) {
      const search = filters.searchText.toLowerCase();
      result = result.filter((note) =>
        note.text.toLowerCase().includes(search),
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      const dir = filters.sortDirection === "asc" ? 1 : -1;

      switch (filters.sortField) {
        case "createdAt":
          return (
            dir *
            (new Date(a.createdAt).getTime() -
              new Date(b.createdAt).getTime())
          );
        case "author":
          return dir * a.author.localeCompare(b.author);
        case "votes":
          return dir * ((votes[a.id] || 0) - (votes[b.id] || 0));
        default:
          return 0;
      }
    });

    return result;
  }, [notes, filters, votes]);
}
