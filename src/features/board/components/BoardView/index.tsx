import { ReactNode, useMemo, useRef, useState, useCallback } from "react";
import styles from "./styles.module.css";

interface BoardViewNote {
  id: string;
  x: number;
  y: number;
  element: ReactNode;
}

interface BoardViewProps {
  notes: BoardViewNote[];
  onMoveNote?: (id: string, x: number, y: number) => void;
}

const PADDING = 250;
const MOVE_STEP = 20;

const BoardView = ({ notes, onMoveNote }: BoardViewProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragStart = useRef({ pointerX: 0, pointerY: 0, noteX: 0, noteY: 0 });

  const canvasSize = useMemo(() => {
    const maxX = Math.max(...notes.map((n) => n.x), 0);
    const maxY = Math.max(...notes.map((n) => n.y), 0);
    return { width: maxX + PADDING, height: maxY + PADDING };
  }, [notes]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, noteId: string, noteX: number, noteY: number) => {
      if ((e.target as HTMLElement).closest("button")) return;
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setDraggingId(noteId);
      dragStart.current = {
        pointerX: e.clientX,
        pointerY: e.clientY,
        noteX,
        noteY,
      };
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingId) return;
      const dx = e.clientX - dragStart.current.pointerX;
      const dy = e.clientY - dragStart.current.pointerY;
      const newX = Math.max(0, dragStart.current.noteX + dx);
      const newY = Math.max(0, dragStart.current.noteY + dy);
      onMoveNote?.(draggingId, newX, newY);
    },
    [draggingId, onMoveNote],
  );

  const handlePointerUp = useCallback(() => {
    if (draggingId) {
      const note = notes.find((n) => n.id === draggingId);
      if (note) {
        fetch("/api/notes", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: note.id, x: note.x, y: note.y }),
        }).catch(() => {});
      }
    }
    setDraggingId(null);
  }, [draggingId, notes]);

  return (
    <section
      ref={containerRef}
      className={styles.container}
      aria-label="Board canvas"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div
        className={styles.canvas}
        style={{ width: canvasSize.width, height: canvasSize.height }}
      >
        {notes.map((note) => (
          <div
            key={note.id}
            tabIndex={0}
            role="button"
            aria-label={`Move note. Use arrow keys to reposition.`}
            className={`${styles.noteWrapper} ${draggingId === note.id ? styles.dragging : ""}`}
            style={{ left: note.x, top: note.y }}
            onPointerDown={(e) => handlePointerDown(e, note.id, note.x, note.y)}
            onKeyDown={(e) => {
              let newX = note.x;
              let newY = note.y;
              switch (e.key) {
                case "ArrowLeft":  newX = Math.max(0, note.x - MOVE_STEP); break;
                case "ArrowRight": newX = note.x + MOVE_STEP; break;
                case "ArrowUp":    newY = Math.max(0, note.y - MOVE_STEP); break;
                case "ArrowDown":  newY = note.y + MOVE_STEP; break;
                default: return;
              }
              e.preventDefault();
              onMoveNote?.(note.id, newX, newY);
              fetch("/api/notes", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: note.id, x: newX, y: newY }),
              }).catch(() => {});
            }}
          >
            {note.element}
          </div>
        ))}
      </div>
    </section>
  );
};

export { BoardView };
