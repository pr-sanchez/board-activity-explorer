"use client";

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from "react";
import type { StickyNote, BoardFilters, NoteColor, SortField, SortDirection } from "@/types";

// ─── State ───────────────────────────────────────────────────────────────────

interface BoardState {
  notes: StickyNote[];
  filters: BoardFilters;
  selectedNoteId: string | null;
}

const initialFilters: BoardFilters = {
  authors: [],
  colors: [],
  searchText: "",
  sortField: "createdAt",
  sortDirection: "desc",
};

const initialState: BoardState = {
  notes: [],
  filters: initialFilters,
  selectedNoteId: null,
};

// ─── Actions ─────────────────────────────────────────────────────────────────

type BoardAction =
  | { type: "SET_NOTES"; payload: StickyNote[] }
  | { type: "TOGGLE_AUTHOR_FILTER"; payload: string }
  | { type: "TOGGLE_COLOR_FILTER"; payload: NoteColor }
  | { type: "SET_SEARCH_TEXT"; payload: string }
  | { type: "SET_SORT"; payload: { field: SortField; direction: SortDirection } }
  | { type: "SELECT_NOTE"; payload: string | null }
  | { type: "RESET_FILTERS" };

// ─── Reducer ─────────────────────────────────────────────────────────────────

function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "SET_NOTES":
      return { ...state, notes: action.payload };

    case "TOGGLE_AUTHOR_FILTER": {
      const authors = state.filters.authors.includes(action.payload)
        ? state.filters.authors.filter((a) => a !== action.payload)
        : [...state.filters.authors, action.payload];
      return { ...state, filters: { ...state.filters, authors } };
    }

    case "TOGGLE_COLOR_FILTER": {
      const colors = state.filters.colors.includes(action.payload)
        ? state.filters.colors.filter((c) => c !== action.payload)
        : [...state.filters.colors, action.payload];
      return { ...state, filters: { ...state.filters, colors } };
    }

    case "SET_SEARCH_TEXT":
      return {
        ...state,
        filters: { ...state.filters, searchText: action.payload },
      };

    case "SET_SORT":
      return {
        ...state,
        filters: {
          ...state.filters,
          sortField: action.payload.field,
          sortDirection: action.payload.direction,
        },
      };

    case "SELECT_NOTE":
      return { ...state, selectedNoteId: action.payload };

    case "RESET_FILTERS":
      return { ...state, filters: initialFilters };

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

const BoardStateContext = createContext<BoardState | null>(null);
const BoardDispatchContext = createContext<Dispatch<BoardAction> | null>(null);

export function BoardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  return (
    <BoardStateContext.Provider value={state}>
      <BoardDispatchContext.Provider value={dispatch}>
        {children}
      </BoardDispatchContext.Provider>
    </BoardStateContext.Provider>
  );
}

export function useBoardState() {
  const context = useContext(BoardStateContext);
  if (!context) {
    throw new Error("useBoardState must be used within a BoardProvider");
  }
  return context;
}

export function useBoardDispatch() {
  const context = useContext(BoardDispatchContext);
  if (!context) {
    throw new Error("useBoardDispatch must be used within a BoardProvider");
  }
  return context;
}

export { boardReducer, initialState, initialFilters };
export type { BoardState, BoardAction };
