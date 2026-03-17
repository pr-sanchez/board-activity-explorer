import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useFilteredNotes } from "../hooks/use-filtered-notes";
import type { StickyNote, BoardFilters } from "@/types";

const notes: StickyNote[] = [
  { id: "1", text: "Login flow is confusing", x: 100, y: 200, author: "user_1", color: "yellow", createdAt: "2026-03-10T09:00:00Z" },
  { id: "2", text: "Add dark mode support", x: 300, y: 100, author: "user_2", color: "blue", createdAt: "2026-03-10T10:00:00Z" },
  { id: "3", text: "Improve onboarding", x: 200, y: 300, author: "user_1", color: "green", createdAt: "2026-03-10T11:00:00Z" },
];

const defaultFilters: BoardFilters = {
  authors: [],
  searchText: "",
  sortField: "createdAt",
  sortDirection: "desc",
};

describe("useFilteredNotes", () => {
  it("returns all notes when no filters applied", () => {
    const { result } = renderHook(() => useFilteredNotes(notes, defaultFilters));
    expect(result.current).toHaveLength(3);
  });

  it("filters by author", () => {
    const filters = { ...defaultFilters, authors: ["user_1"] };
    const { result } = renderHook(() => useFilteredNotes(notes, filters));
    expect(result.current).toHaveLength(2);
    expect(result.current.every((n) => n.author === "user_1")).toBe(true);
  });

  it("filters by search text case-insensitively", () => {
    const filters = { ...defaultFilters, searchText: "LOGIN" };
    const { result } = renderHook(() => useFilteredNotes(notes, filters));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe("1");
  });

  it("sorts by votes descending", () => {
    const filters = { ...defaultFilters, sortField: "votes" as const, sortDirection: "desc" as const };
    const votes = { "1": 2, "3": 5 };
    const { result } = renderHook(() => useFilteredNotes(notes, filters, votes));
    expect(result.current[0].id).toBe("3");
    expect(result.current[1].id).toBe("1");
  });

  it("applies author and search together", () => {
    const filters = { ...defaultFilters, authors: ["user_1"], searchText: "login" };
    const { result } = renderHook(() => useFilteredNotes(notes, filters));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe("1");
  });
});
