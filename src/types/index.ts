export interface StickyNote {
  id: string;
  text: string;
  x: number;
  y: number;
  author: string;
  color: NoteColor;
  createdAt: string;
}

export type NoteColor =
  | "yellow"
  | "blue"
  | "green"
  | "pink"
  | "orange"
  | "purple";

export type SortField = "createdAt" | "author";
export type SortDirection = "asc" | "desc";

export interface BoardFilters {
  authors: string[];
  searchText: string;
  sortField: SortField;
  sortDirection: SortDirection;
}
