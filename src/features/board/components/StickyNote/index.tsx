import type { StickyNote as StickyNoteType } from "@/types";
import { NOTE_COLOR_MAP } from "@/lib/utils";
import styles from "./styles.module.css";

interface StickyNoteProps {
  id: string;
  text: string;
  author: string;
  color?: StickyNoteType["color"];
  createdAt: string;
  votes?: number;
  hasVoted?: boolean;
  showVoting?: boolean;
  topRank?: number | null;
  isDimmed?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onVote?: (id: string) => void;
}

const StickyNote = ({
  id,
  text,
  author,
  color = "yellow",
  votes = 0,
  hasVoted = false,
  showVoting = false,
  topRank = null,
  isDimmed = false,
  isSelected = false,
  onSelect,
  onVote,
}: StickyNoteProps) => {
  return (
    <article
      role="listitem"
      aria-label={`Note by ${author}: ${text}. ${votes} votes.`}
      aria-selected={isSelected}
      tabIndex={0}
      onClick={() => onSelect?.(id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.(id);
        }
      }}
      className={`${styles.note} ${NOTE_COLOR_MAP[color]} ${isSelected ? styles.selected : ""} ${isDimmed ? styles.dimmed : ""}`}
    >
      {topRank !== null && (
        <span className={styles.topBadge} aria-label={`Top ${topRank}`}>
          #{topRank}
        </span>
      )}

      {showVoting && (
        <button
          className={`${styles.voteButton} ${hasVoted ? styles.voteButtonVoted : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onVote?.(id);
          }}
          aria-label={hasVoted ? `Remove vote. ${votes} votes.` : `Vote for this note. ${votes} votes.`}
        >
          <span className={styles.voteIcon}>👍</span>
          <span className={styles.voteCount}>{votes}</span>
        </button>
      )}

      <p className={styles.text}>{text}</p>

      <span className={styles.author}>{author}</span>
    </article>
  );
};

export { StickyNote };
