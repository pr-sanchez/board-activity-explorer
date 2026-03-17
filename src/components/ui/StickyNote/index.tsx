import type { StickyNote as StickyNoteType } from "@/types";
import { NOTE_COLOR_MAP } from "@/lib/utils";
import styles from "./styles.module.css";

interface StickyNoteProps {
  id: string;
  text: string;
  author: string;
  color?: StickyNoteType["color"];
  createdAt: string;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

const StickyNote = ({
  id,
  text,
  author,
  color = "yellow",
  isSelected = false,
  onSelect,
}: StickyNoteProps) => {
  return (
    <article
      role="listitem"
      aria-label={`Note by ${author}: ${text}`}
      aria-selected={isSelected}
      tabIndex={0}
      onClick={() => onSelect?.(id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.(id);
        }
      }}
      className={`${styles.note} ${NOTE_COLOR_MAP[color]} ${isSelected ? styles.selected : ""}`}
    >
      <p className={styles.text}>{text}</p>

      <span className={styles.author}>{author}</span>
    </article>
  );
};

export { StickyNote };
