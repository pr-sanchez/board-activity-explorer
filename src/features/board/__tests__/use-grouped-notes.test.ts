import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useGroupedNotes } from "../hooks/use-grouped-notes";
import type { StickyNote } from "@/types";

const makeNote = (id: string, text: string): StickyNote => ({
  id, text, x: 0, y: 0, author: "user_1", color: "yellow", createdAt: "2026-03-10T09:00:00Z",
});

describe("useGroupedNotes", () => {
  it("groups notes by matching topic keywords", () => {
    const notes = [
      makeNote("1", "Login flow is confusing"),
      makeNote("2", "Password reset broken"),
    ];
    const { result } = renderHook(() => useGroupedNotes(notes));
    const authGroup = result.current.find((g) => g.label === "Authentication & Security");
    expect(authGroup).toBeDefined();
    expect(authGroup!.noteIds).toContain("1");
    expect(authGroup!.noteIds).toContain("2");
  });

  it("each note appears in exactly one group", () => {
    const notes = [
      makeNote("1", "Login flow"),
      makeNote("2", "Dark mode"),
      makeNote("3", "Integrate with Slack"),
    ];
    const { result } = renderHook(() => useGroupedNotes(notes));
    const allIds = result.current.flatMap((g) => g.noteIds);
    expect(new Set(allIds).size).toBe(3);
  });
});
