import { describe, it, expect } from "vitest";
import { boardReducer } from "../reducer";
import { initialState } from "../constants";
import type { BoardState } from "../actions";
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
  });

  it("toggles author filter on and off", () => {
    const on = boardReducer(initialState, {
      type: "TOGGLE_AUTHOR_FILTER",
      payload: "user_1",
    });
    expect(on.filters.authors).toEqual(["user_1"]);

    const off = boardReducer(on, {
      type: "TOGGLE_AUTHOR_FILTER",
      payload: "user_1",
    });
    expect(off.filters.authors).toEqual([]);
  });

  it("votes a note and prevents double voting", () => {
    const voted = boardReducer(initialState, {
      type: "VOTE_NOTE",
      payload: "note_001",
    });
    expect(voted.votes["note_001"]).toBe(1);

    const again = boardReducer(voted, {
      type: "VOTE_NOTE",
      payload: "note_001",
    });
    expect(again.votes["note_001"]).toBe(1);
  });

  it("resets filters without clearing votes", () => {
    const state: BoardState = {
      ...initialState,
      votes: { note_001: 5 },
      userVotes: ["note_001"],
      filters: { authors: ["user_1"], searchText: "test", sortField: "author", sortDirection: "asc" },
    };
    const result = boardReducer(state, { type: "RESET_FILTERS" });
    expect(result.filters.authors).toEqual([]);
    expect(result.votes["note_001"]).toBe(5);
  });

  it("loads votes from server", () => {
    const result = boardReducer(initialState, {
      type: "LOAD_VOTES",
      payload: { votes: { note_001: 5 }, userVotes: ["note_001"] },
    });
    expect(result.votes).toEqual({ note_001: 5 });
    expect(result.userVotes).toEqual(["note_001"]);
  });
});
