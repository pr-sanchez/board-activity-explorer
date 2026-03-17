import type { StickyNote, BoardFilters, SortField, SortDirection } from "@/types";

export interface BoardState {
  notes: StickyNote[];
  votes: Record<string, number>;
  userVotes: string[];
  filters: BoardFilters;
  selectedNoteId: string | null;
}

export const BoardActionTypes = {
  SET_NOTES: "SET_NOTES",
  TOGGLE_AUTHOR_FILTER: "TOGGLE_AUTHOR_FILTER",
  SET_SEARCH_TEXT: "SET_SEARCH_TEXT",
  SET_SORT: "SET_SORT",
  SELECT_NOTE: "SELECT_NOTE",
  VOTE_NOTE: "VOTE_NOTE",
  RESET_FILTERS: "RESET_FILTERS",
} as const;

export type BoardAction =
  | { type: "SET_NOTES"; payload: StickyNote[] }
  | { type: "TOGGLE_AUTHOR_FILTER"; payload: string }
  | { type: "SET_SEARCH_TEXT"; payload: string }
  | { type: "SET_SORT"; payload: { field: SortField; direction: SortDirection } }
  | { type: "SELECT_NOTE"; payload: string | null }
  | { type: "VOTE_NOTE"; payload: string }
  | { type: "LOAD_VOTES"; payload: { votes: Record<string, number>; userVotes: string[] } }
  | { type: "RESET_FILTERS" };
