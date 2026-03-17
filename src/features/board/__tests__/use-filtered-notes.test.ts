import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useFilteredNotes } from "../hooks/use-filtered-notes";
import type { StickyNote, BoardFilters } from "@/types";

const notes: StickyNote[] = [
  { id: "1", text: "Alpha", x: 100, y: 200, author: "user_1", color: "yellow", createdAt: "2026-03-10T09:00:00Z" },
  { id: "2", text: "Beta", x: 300, y: 100, author: "user_2", color: "blue", createdAt: "2026-03-10T10:00:00Z" },
  { id: "3", text: "Gamma", x: 200, y: 300, author: "user_1", color: "green", createdAt: "2026-03-10T11:00:00Z" },
];

const defaultFilters: BoardFilters = {
  authors: [],
  colors: [],
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

  it("filters by color", () => {
    const filters = { ...defaultFilters, colors: ["blue" as const] };
    const { result } = renderHook(() => useFilteredNotes(notes, filters));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].color).toBe("blue");
  });

  it("filters by search text", () => {
    const filters = { ...defaultFilters, searchText: "alpha" };
    const { result } = renderHook(() => useFilteredNotes(notes, filters));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].text).toBe("Alpha");
  });

  it("sorts by createdAt ascending", () => {
    const filters = { ...defaultFilters, sortDirection: "asc" as const };
    const { result } = renderHook(() => useFilteredNotes(notes, filters));
    expect(result.current[0].id).toBe("1");
    expect(result.current[2].id).toBe("3");
  });

  it("sorts by position", () => {
    const filters = { ...defaultFilters, sortField: "position" as const, sortDirection: "asc" as const };
    const { result } = renderHook(() => useFilteredNotes(notes, filters));
    expect(result.current[0].id).toBe("2"); // y=100
    expect(result.current[2].id).toBe("3"); // y=300
  });
});
