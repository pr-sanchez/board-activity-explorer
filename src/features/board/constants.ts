import type { BoardFilters } from "@/types";
import type { BoardState } from "./actions";

export const initialFilters: BoardFilters = {
  authors: [],
  searchText: "",
  sortField: "createdAt",
  sortDirection: "desc",
};

export const initialState: BoardState = {
  notes: [],
  filters: initialFilters,
  selectedNoteId: null,
};
