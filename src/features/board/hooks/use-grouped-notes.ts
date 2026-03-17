import { useMemo } from "react";
import type { StickyNote } from "@/types";

export interface NoteGroup {
  label: string;
  noteIds: string[];
}

const TOPIC_KEYWORDS: Record<string, string[]> = {
  "Authentication & Security": [
    "login", "password", "auth", "authentication", "sso", "sign-on",
    "two-factor", "session", "permissions", "access", "security",
  ],
  "Collaboration": [
    "collaboration", "collaborative", "real-time", "live", "cursors",
    "presence", "sharing", "invitation", "conflict", "hot reload",
  ],
  "UI & Design": [
    "dark mode", "color", "palette", "contrast", "font", "shapes",
    "animations", "skeleton", "backgrounds", "emoji", "avatar",
    "custom", "theme",
  ],
  "Accessibility": [
    "accessibility", "accessible", "wcag", "color blind", "keyboard",
    "navigation", "touch", "gestures",
  ],
  "Performance": [
    "performance", "load time", "loading", "speed", "rate limiting",
    "cache", "optimize",
  ],
  "Integrations": [
    "slack", "jira", "webhook", "integrate", "integration", "api",
    "import", "export",
  ],
  "Board Features": [
    "board", "canvas", "zoom", "pan", "minimap", "grid", "snap",
    "layout", "sections", "frames", "mind map", "kanban", "duplication",
    "archiving", "nested",
  ],
  "Note Features": [
    "sticky note", "note", "drag", "drop", "resize", "linking",
    "grouping", "clustering", "tagging", "priority", "comments",
    "voting", "markdown", "rich text", "wrapping", "character",
    "assignment",
  ],
  "Data & Compliance": [
    "analytics", "statistics", "audit", "compliance", "gdpr",
    "data export", "report", "version history",
  ],
};

function matchTopic(text: string): string {
  const lower = text.toLowerCase();

  let bestMatch = "Other";
  let bestScore = 0;

  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        score += keyword.split(" ").length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = topic;
    }
  }

  return bestMatch;
}

export function useGroupedNotes(notes: StickyNote[]): NoteGroup[] {
  return useMemo(() => {
    const groupMap = new Map<string, string[]>();

    for (const note of notes) {
      const topic = matchTopic(note.text);
      const existing = groupMap.get(topic) || [];
      existing.push(note.id);
      groupMap.set(topic, existing);
    }

    return Array.from(groupMap.entries())
      .map(([label, noteIds]) => ({ label, noteIds }))
      .sort((a, b) => b.noteIds.length - a.noteIds.length);
  }, [notes]);
}
