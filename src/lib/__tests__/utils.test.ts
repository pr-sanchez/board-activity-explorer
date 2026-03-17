import { describe, it, expect } from "vitest";
import { formatDate, getUniqueAuthors, NOTE_COLORS, NOTE_COLOR_MAP } from "../utils";

describe("utils", () => {
  it("formats an ISO date string", () => {
    const result = formatDate("2026-03-10T09:00:00Z");
    expect(result).toContain("Mar");
    expect(result).toContain("10");
  });

  it("returns unique sorted authors", () => {
    const notes = [{ author: "user_3" }, { author: "user_1" }, { author: "user_1" }];
    expect(getUniqueAuthors(notes)).toEqual(["user_1", "user_3"]);
  });

  it("has a Tailwind class for each color", () => {
    for (const color of NOTE_COLORS) {
      expect(NOTE_COLOR_MAP[color]).toMatch(/^bg-/);
    }
  });
});
