import { useBoardState, useBoardDispatch } from "@/features/board";
import { NOTE_COLORS, NOTE_COLOR_MAP, getUniqueAuthors } from "@/lib/utils";
import type { SortField, SortDirection } from "@/types";
import styles from "./styles.module.css";

interface FiltersProps {
  isGrouped: boolean;
  onToggleGroup: () => void;
  isVoting: boolean;
  onToggleVoting: () => void;
  highlightTopVoted: boolean;
  onToggleHighlight: () => void;
  isBoardView: boolean;
  onToggleBoardView: () => void;
  showRecent: boolean;
  onToggleRecent: () => void;
}

const Filters = ({
  isGrouped,
  onToggleGroup,
  isVoting,
  onToggleVoting,
  highlightTopVoted,
  onToggleHighlight,
  isBoardView,
  onToggleBoardView,
  showRecent,
  onToggleRecent,
}: FiltersProps) => {
  const { notes, filters } = useBoardState();
  const dispatch = useBoardDispatch();
  const authors = getUniqueAuthors(notes);

  return (
    <aside className={styles.sidebar} aria-label="Filters">
      <fieldset className={styles.section}>
        <legend className={styles.sectionTitle}>Search</legend>
        <input
          type="text"
          placeholder="Search notes..."
          value={filters.searchText}
          onChange={(e) =>
            dispatch({ type: "SET_SEARCH_TEXT", payload: e.target.value })
          }
          className={styles.searchInput}
        />
      </fieldset>

      <fieldset className={styles.section}>
        <legend className={styles.sectionTitle}>Authors</legend>
        <ul className={styles.checkboxList}>
          {authors.map((author) => (
            <li key={author}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.authors.includes(author)}
                  onChange={() =>
                    dispatch({ type: "TOGGLE_AUTHOR_FILTER", payload: author })
                  }
                />
                {author}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset className={styles.section}>
        <legend className={styles.sectionTitle}>Colors</legend>
        <div className={styles.colorList}>
          {NOTE_COLORS.map((color) => (
            <button
              key={color}
              title={color}
              aria-label={`Filter by ${color}`}
              aria-pressed={filters.colors.includes(color)}
              onClick={() =>
                dispatch({ type: "TOGGLE_COLOR_FILTER", payload: color })
              }
              className={`${styles.colorSwatch} ${NOTE_COLOR_MAP[color]} ${
                filters.colors.includes(color) ? styles.colorSwatchActive : ""
              }`}
            />
          ))}
        </div>
      </fieldset>

      {!isBoardView && (
      <fieldset className={styles.section}>
        <legend className={styles.sectionTitle}>Sort</legend>
        <div className={styles.sortRow}>
          <select
            value={filters.sortField}
            onChange={(e) =>
              dispatch({
                type: "SET_SORT",
                payload: {
                  field: e.target.value as SortField,
                  direction: filters.sortDirection,
                },
              })
            }
            className={styles.select}
            aria-label="Sort field"
          >
            <option value="createdAt">Date</option>
            <option value="author">Author</option>
            <option value="votes">Most Voted</option>
          </select>
          <select
            value={filters.sortDirection}
            onChange={(e) =>
              dispatch({
                type: "SET_SORT",
                payload: {
                  field: filters.sortField,
                  direction: e.target.value as SortDirection,
                },
              })
            }
            className={styles.select}
            aria-label="Sort direction"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
      </fieldset>
      )}
      <button
        onClick={() => dispatch({ type: "RESET_FILTERS" })}
        className={styles.resetButton}
      >
        Reset filters
      </button>
      <button
        onClick={onToggleVoting}
        className={`${styles.groupButton} ${!isVoting ? styles.groupButtonInactive : ""}`}
        aria-pressed={isVoting}
      >
        {isVoting ? "End voting session" : "Start voting session"}
      </button>

      {isVoting && (
        <button
          onClick={onToggleHighlight}
          className={`${styles.groupButton} ${!highlightTopVoted ? styles.groupButtonInactive : ""}`}
          aria-pressed={highlightTopVoted}
        >
          {highlightTopVoted ? "Show all equally" : "Highlight top 5 voted"}
        </button>
      )}

      <button
        onClick={onToggleRecent}
        className={`${styles.groupButton} ${!showRecent ? styles.groupButtonInactive : ""}`}
        aria-pressed={showRecent}
      >
        {showRecent ? "Clear recent highlight" : "Highlight recently added"}
      </button>

      {!isBoardView && (
        <button
          onClick={onToggleGroup}
          className={`${styles.groupButton} ${!isGrouped ? styles.groupButtonInactive : ""}`}
          aria-pressed={isGrouped}
        >
          {isGrouped ? "Ungroup notes" : "Auto-group by topic"}
        </button>
      )}

      <button
        onClick={onToggleBoardView}
        className={`${styles.groupButton} ${!isBoardView ? styles.groupButtonInactive : ""}`}
        aria-pressed={isBoardView}
      >
        {isBoardView ? "Grid view" : "Board view"}
      </button>
    </aside>
  );
};

export { Filters };
