import type { NoteColor } from "@/types";

export const NOTE_COLOR_MAP: Record<NoteColor, string> = {
  yellow: "bg-yellow-200",
  blue: "bg-blue-200",
  green: "bg-green-200",
  pink: "bg-pink-200",
  orange: "bg-orange-200",
  purple: "bg-purple-200",
};

export const NOTE_COLORS: NoteColor[] = [
  "yellow",
  "blue",
  "green",
  "pink",
  "orange",
  "purple",
];

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getUniqueAuthors(
  notes: { author: string }[],
): string[] {
  return [...new Set(notes.map((n) => n.author))].sort();
}
