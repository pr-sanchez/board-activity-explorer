import { describe, it, expect } from "vitest";
import { boardReducer, initialState } from "../context";
import type { BoardState } from "../context";
import type { StickyNote } from "@/types";

const mockNote: StickyNote = {
  id: "note_001",
  text: "Test note",
  x: 100,
  y: 200,
  author: "user_1",
  color: "yellow",
  createdAt: "2026-03-10T09:00:00Z",
};

describe("boardReducer", () => {
  it("sets notes", () => {
    const result = boardReducer(initialState, {
      type: "SET_NOTES",
      payload: [mockNote],
    });
    expect(result.notes).toHaveLength(1);
    expect(result.notes[0].id).toBe("note_001");
  });

  it("toggles author filter on", () => {
    const result = boardReducer(initialState, {
      type: "TOGGLE_AUTHOR_FILTER",
      payload: "user_1",
    });
    expect(result.filters.authors).toEqual(["user_1"]);
  });

  it("toggles author filter off", () => {
    const stateWithAuthor: BoardState = {
      ...initialState,
      filters: { ...initialState.filters, authors: ["user_1"] },
    };
    const result = boardReducer(stateWithAuthor, {
      type: "TOGGLE_AUTHOR_FILTER",
      payload: "user_1",
    });
    expect(result.filters.authors).toEqual([]);
  });

  it("toggles color filter", () => {
    const result = boardReducer(initialState, {
      type: "TOGGLE_COLOR_FILTER",
      payload: "blue",
    });
    expect(result.filters.colors).toEqual(["blue"]);
  });

  it("sets search text", () => {
    const result = boardReducer(initialState, {
      type: "SET_SEARCH_TEXT",
      payload: "login",
    });
    expect(result.filters.searchText).toBe("login");
  });

  it("sets sort", () => {
    const result = boardReducer(initialState, {
      type: "SET_SORT",
      payload: { field: "author", direction: "asc" },
    });
    expect(result.filters.sortField).toBe("author");
    expect(result.filters.sortDirection).toBe("asc");
  });

  it("selects a note", () => {
    const result = boardReducer(initialState, {
      type: "SELECT_NOTE",
      payload: "note_001",
    });
    expect(result.selectedNoteId).toBe("note_001");
  });

  it("resets filters", () => {
    const dirtyState: BoardState = {
      ...initialState,
      filters: {
        authors: ["user_1"],
        colors: ["blue"],
        searchText: "test",
        sortField: "author",
        sortDirection: "asc",
      },
    };
    const result = boardReducer(dirtyState, { type: "RESET_FILTERS" });
    expect(result.filters.authors).toEqual([]);
    expect(result.filters.colors).toEqual([]);
    expect(result.filters.searchText).toBe("");
  });
});
