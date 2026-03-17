import type { BoardState, BoardAction } from "./actions";
import { initialFilters } from "./constants";

export function boardReducer(
  state: BoardState,
  action: BoardAction,
): BoardState {
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

    case "VOTE_NOTE": {
      const noteId = action.payload;
      if (state.userVotes.includes(noteId)) return state;
      return {
        ...state,
        votes: { ...state.votes, [noteId]: (state.votes[noteId] || 0) + 1 },
        userVotes: [...state.userVotes, noteId],
      };
    }

    case "MOVE_NOTE": {
      const { id, x, y } = action.payload;
      return {
        ...state,
        notes: state.notes.map((n) =>
          n.id === id ? { ...n, x, y } : n,
        ),
      };
    }

    case "LOAD_VOTES":
      return {
        ...state,
        votes: action.payload.votes,
        userVotes: action.payload.userVotes,
      };

    case "RESET_FILTERS":
      return { ...state, filters: initialFilters };

    default:
      return state;
  }
}
